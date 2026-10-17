"use client";

import { parse } from "partial-json";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import locales from "@/data/locales.json";
import type { ChatMessage, EventCard, Lang, Reply, Venue } from "@/lib/assistant";
import { toggleFavorite, getFavoriteEventIds } from "@/app/actions/panel";
import { createClient } from "@/lib/supabase/client";

type Entry = ChatMessage & Partial<Reply>;

// Język ustawia front (props) – czat nie ma własnego przełącznika.
type Props = {
  lang: Lang;
  events: EventCard[];
  venue: Venue;
};

const nextDate = (dates: string[]) => dates.find((date) => new Date(date) >= new Date()) ?? dates.at(-1)!;

export default function Chat({ lang, events, venue }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [favIds, setFavIds] = useState<number[]>([]);
  const [, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);
  const t = locales[lang];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setUserEmail(user.email);
          getFavoriteEventIds().then(setFavIds);
        }
      });
    } catch {
      // Ignoruj błąd jeśli brak skonfigurowanego klienta w danym środowisku
    }
  }, []);

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

  function handleToggleFavorite(eventId: number) {
    if (!userEmail) {
      window.location.href = "/auth/login";
      return;
    }

    const isCurrentlyFav = favIds.includes(eventId);
    setFavIds((prev) =>
      isCurrentlyFav ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );

    startTransition(async () => {
      await toggleFavorite(eventId);
    });
  }

  const last = entries.at(-1);
  const suggestions = !last ? t.suggestions : busy ? [] : (last.suggestions ?? []);

  return (
    <main lang={lang} className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-lg font-semibold">{t.title}</h1>
        {userEmail ? (
          <Link
            href="/panel"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <span>👤</span>
            <span>Mój Panel</span>
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <span>Zaloguj się</span>
          </Link>
        )}
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
              const isFav = favIds.includes(id);

              return (
                <article key={id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {kind && <p className="text-xs text-muted-foreground">{kind}</p>}
                      <h2 className="font-semibold">{title}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(id)}
                      className="shrink-0 p-1 text-base transition-transform hover:scale-110"
                      title={isFav ? "Usuń z ulubionych" : "Zapisz w ulubionych"}
                    >
                      {isFav ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
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

            {entry.showMap && (
              <article className="rounded-xl border border-border p-4">
                <h2 className="font-semibold">{venue.name}</h2>
                <p className="text-sm text-muted-foreground">{venue.address}</p>
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium underline underline-offset-4"
                >
                  {t.directions}
                </a>
              </article>
            )}
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
