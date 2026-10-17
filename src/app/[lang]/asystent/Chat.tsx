"use client";

import { parse } from "partial-json";
import { useEffect, useRef, useState, useTransition } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import locales from "@/data/locales.json";
import type { ChatMessage, EventCard, Lang, Reply, Venue } from "@/lib/assistant";
import { toggleFavorite, getFavoriteEventIds } from "@/app/actions/panel";
import { localizedPath } from "@/i18n/config";
import { createClient } from "@/lib/supabase/client";
import { iconProps } from "@/components/fs/icons";
import { cn } from "@/lib/utils";

type Entry = ChatMessage & Partial<Reply>;

// Język ustawia front (props) – czat nie ma własnego przełącznika.
type Props = {
  lang: Lang;
  events: EventCard[];
  venue: Venue;
  /** Id nagłówka – nakładka wskazuje go w aria-labelledby */
  titleId?: string;
  /** W nakładce: przycisk zamknięcia w nagłówku */
  onClose?: () => void;
  className?: string;
};

const nextDate = (dates: string[]) => dates.find((date) => new Date(date) >= new Date()) ?? dates.at(-1)!;

export default function Chat({ lang, events, venue, titleId, onClose, className }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const aiSessionId = useRef<string>(null);
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
    posthog.capture("assistant_message_sent", {
      language: lang,
      message_number: history.filter((message) => message.role === "user").length,
    });
    setInput("");
    setBusy(true);

    try {
      aiSessionId.current ??= crypto.randomUUID();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang, sessionId: aiSessionId.current }),
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
      router.push(localizedPath(lang, "/auth/login"));
      return;
    }

    const isCurrentlyFav = favIds.includes(eventId);
    setFavIds((prev) =>
      isCurrentlyFav ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );

    startTransition(async () => {
      const result = await toggleFavorite(eventId, lang);
      if ("isFavorite" in result && result.isFavorite === true) {
        posthog.capture("assistant_favorite_added", { event_id: eventId });
      } else if ("isFavorite" in result && result.isFavorite === false) {
        posthog.capture("assistant_favorite_removed", { event_id: eventId });
      }
    });
  }

  const last = entries.at(-1);
  const suggestions = !last ? t.suggestions : busy ? [] : (last.suggestions ?? []);

  return (
    <div lang={lang} className={cn("mx-auto flex w-full max-w-2xl flex-col px-4", className)}>
      <header className="flex items-center justify-between gap-2 py-4">
        <h2 id={titleId} className="text-lg font-semibold">{t.title}</h2>
        <div className="flex items-center gap-1">
          {userEmail && (
            <Link
              href={localizedPath(lang, "/panel")}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted transition-colors"
            >
              <span aria-hidden>👤</span>
              <span>{t.panel}</span>
            </Link>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex size-11 cursor-pointer items-center justify-center text-ink hover:bg-bg-subtle"
            >
              <X {...iconProps} className="size-6" />
            </button>
          )}
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
                      title={isFav ? t.favRemove : t.favAdd}
                      aria-label={isFav ? t.favRemove : t.favAdd}
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
    </div>
  );
}
