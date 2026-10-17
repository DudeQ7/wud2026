"use client";

import { parse } from "partial-json";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage, FilharmoniaEvent, Lang, Locale, Reply } from "@/lib/assistant";

type Entry = ChatMessage & Partial<Reply>;

type Props = { lang: Lang; t: Locale; events: FilharmoniaEvent[] };

export default function Chat({ lang, t, events }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

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
    setEntries((prev) => [...prev, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
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
      updateLast({ content: t.error, eventIds: [], suggestions: [] });
    } finally {
      setBusy(false);
    }
  }

  const last = entries.at(-1);
  const suggestions = !last ? t.suggestions : busy ? [] : (last.suggestions ?? []);

  return (
    <main lang={lang} className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4">
      <h1 className="py-4 text-lg font-semibold">{t.title}</h1>

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

            {entry.eventIds
              ?.map((id) => events.find((event) => event.id === id))
              .filter((event) => event !== undefined)
              .map((event) => (
                <article key={event.id} className="rounded-xl border border-border p-4">
                  <h2 className="font-semibold">{event.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleString(lang, { dateStyle: "full", timeStyle: "short" })} ·{" "}
                    {event.hall} · {event.price}
                  </p>
                  {event.ticketUrl && (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-medium underline underline-offset-4"
                    >
                      {t.tickets}
                    </a>
                  )}
                </article>
              ))}
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
