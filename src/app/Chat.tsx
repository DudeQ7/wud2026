"use client";

import { parse } from "partial-json";
import { useEffect, useRef, useState } from "react";
import locales from "@/data/locales.json";
import type { ChatMessage, EventCard, Lang, Reply } from "@/lib/assistant";

// `lang` zapamiętuje, w jakim języku padła odpowiedź – po zmianie języka jej propozycje są nieaktualne.
type Entry = ChatMessage & Partial<Reply> & { lang?: Lang };

type Props = { initialLang: Lang; events: EventCard[] };

const langs = Object.keys(locales) as Lang[];

const nextDate = (dates: string[]) => dates.find((date) => new Date(date) >= new Date()) ?? dates.at(-1)!;

export default function Chat({ initialLang, events }: Props) {
  const [lang, setLang] = useState(initialLang);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const t = locales[lang];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  const updateLast = (patch: Partial<Entry>) =>
    setEntries((prev) => [...prev.slice(0, -1), { ...prev[prev.length - 1], ...patch }]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    const history: ChatMessage[] = [
      ...entries.map(({ role, content }) => ({ role, content })),
      { role: "user", content: question },
    ];
    setEntries((prev) => [...prev, { role: "user", content: question }, { role: "assistant", content: "", lang }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang }),
      });
      if (!res.ok || !res.body) throw new Error(res.statusText);

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let raw = "";
      for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
        raw += chunk.value;
        const reply: Partial<Reply> = parse(raw);
        updateLast({ ...reply, content: reply.answer ?? "" });
      }
    } catch {
      updateLast({ content: t.error, events: [], suggestions: [] });
    } finally {
      setBusy(false);
    }
  }

  const last = entries.at(-1);
  const suggestions = busy ? [] : last?.lang === lang ? (last.suggestions ?? []) : t.suggestions;

  return (
    <main lang={lang} className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4">
      <header className="flex items-center justify-between gap-4 py-4">
        <h1 className="text-lg font-semibold">{t.title}</h1>
        <div role="group" aria-label="Język / Language" className="flex gap-1 text-sm">
          {langs.map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              aria-pressed={code === lang}
              onClick={() => setLang(code)}
              className="rounded-full px-2.5 py-1 aria-pressed:bg-foreground aria-pressed:text-background hover:bg-muted aria-pressed:hover:bg-foreground"
            >
              {locales[code].label}
            </button>
          ))}
        </div>
      </header>

      <div role="log" aria-live="polite" aria-busy={busy} className="flex-1 space-y-4 overflow-y-auto pb-4">
        <p className="text-muted-foreground">{t.greeting}</p>

        {entries.map((entry, i) => (
          <div key={i} className={entry.role === "user" ? "flex justify-end" : "space-y-3"}>
            <p
              className={`whitespace-pre-wrap ${
                entry.role === "user" ? "max-w-[85%] rounded-2xl bg-foreground px-4 py-2 text-background" : ""
              }`}
            >
              {entry.content || (busy && i === entries.length - 1 ? "…" : "")}
            </p>

            {entry.events?.map(({ id, title, kind, place }) => {
              const event = events.find((card) => card.id === id);
              if (!event) return null;
              return (
                <article key={id} className="rounded-xl border border-border p-4">
                  {kind && <p className="text-xs text-muted-foreground">{kind}</p>}
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(nextDate(event.dates)).toLocaleString(lang, { dateStyle: "full", timeStyle: "short" })}
                    {place && ` · ${place}`}
                  </p>
                  <div className="mt-2 flex gap-4 text-sm font-medium">
                    {[
                      [event.url, t.details],
                      [event.ticketsUrl, t.tickets],
                    ].map(([href, label]) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {suggestions.length > 0 && (
        <ul className="flex flex-wrap gap-2 pb-3">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => send(suggestion)}
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 pb-4"
      >
        <label htmlFor="question" className="sr-only">
          {t.placeholder}
        </label>
        <input
          id="question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          maxLength={2000}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-3"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full bg-foreground px-5 py-3 font-medium text-background disabled:opacity-40"
        >
          {t.send}
        </button>
      </form>
    </main>
  );
}
