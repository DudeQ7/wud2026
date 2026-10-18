"use client";

import { Heart, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parse } from "partial-json";
import posthog from "posthog-js";
import { useEffect, useRef, useState, useTransition } from "react";

import { toggleFavorite, getFavoriteEventIds } from "@/app/actions/panel";
import { iconProps } from "@/components/fs/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import locales from "@/data/locales.json";
import { localizedPath } from "@/i18n/config";
import type { ChatMessage, EventCard, Lang, Reply, Venue } from "@/lib/assistant";
import { readConsent } from "@/lib/consent";
import { createClient } from "@/lib/supabase/client";
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
        body: JSON.stringify({
          messages: history,
          lang,
          sessionId: aiSessionId.current,
          analyticsConsent: readConsent() === "analytics",
        }),
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
    <div lang={lang} className={cn("mx-auto flex w-full max-w-2xl flex-col bg-background px-4", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-line py-3">
        {/* Na stronie /asystent (bez titleId) to h1; w nakładce zostaje h2 */}
        {titleId ? (
          <h2 id={titleId} className="type-h3 text-gold">
            {t.title}
          </h2>
        ) : (
          <h1 className="type-h3 text-gold">{t.title}</h1>
        )}
        <div className="flex items-center gap-2">
          {userEmail && (
            <Link
              href={localizedPath(lang, "/panel")}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-2")}
            >
              <User {...iconProps} className="size-4" />
              {t.panel}
            </Link>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex size-11 cursor-pointer items-center justify-center text-text hover:bg-bg-subtle"
            >
              <X {...iconProps} className="size-6" />
            </button>
          )}
        </div>
      </header>

      <div role="log" aria-live="polite" aria-busy={busy} className="flex-1 space-y-5 overflow-y-auto py-4">
        <div className="space-y-2 border-b border-line pb-4">
          <p className="type-body text-text">{t.greeting}</p>
          <p className="type-meta text-text-muted">
            {t.privacyNote}{" "}
            <a
              href="https://filharmonia.szczecin.pl/polityka_prywatnosci"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:no-underline"
            >
              {t.privacy}
            </a>
          </p>
        </div>

        {entries.map((entry, i) => (
          <div key={i} className={entry.role === "user" ? "flex justify-end" : ""}>
            {entry.role === "user" ? (
              <p className="max-w-[85%] whitespace-pre-wrap bg-ink px-4 py-3 type-body text-on-dark">
                {entry.content}
              </p>
            ) : (
              <div className="space-y-3 border-l border-line-strong pl-4">
                <p className="whitespace-pre-wrap type-body text-text">
                  {entry.content || (busy && i === entries.length - 1 ? "…" : "")}
                </p>

                {entry.events?.map(({ id, title, kind, place }) => {
                  const event = events.find((card) => card.id === id);
                  if (!event) return null;
                  const isFav = favIds.includes(id);

                  return (
                    <article key={id} className="border-[1.5px] border-line-strong p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {kind && <p className="type-eyebrow text-gold">{kind}</p>}
                          <h3 className="mt-1 type-title-card text-text">{title}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(id)}
                          aria-pressed={isFav}
                          title={isFav ? t.favRemove : t.favAdd}
                          aria-label={isFav ? t.favRemove : t.favAdd}
                          className="flex size-11 shrink-0 cursor-pointer items-center justify-center text-text hover:bg-bg-subtle"
                        >
                          <Heart {...iconProps} className="size-5" fill={isFav ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <p className="mt-2 type-meta text-text-muted">
                        {new Date(nextDate(event.dates)).toLocaleString(lang, { dateStyle: "full", timeStyle: "short" })}
                        {place && ` · ${place}`}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Link
                          href={localizedPath(lang, `/wydarzenia/${id}`)}
                          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full")}
                        >
                          {t.details}
                        </Link>
                        <a
                          href={event.ticketsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: "primary", size: "sm" }), "w-full")}
                        >
                          {t.tickets}
                        </a>
                      </div>
                    </article>
                  );
                })}

                {entry.showMap && (
                  <article className="border-[1.5px] border-line-strong p-4">
                    <h3 className="type-h4 text-text">{venue.name}</h3>
                    <p className="mt-1 type-meta text-text-muted">{venue.address}</p>
                    <a
                      href={venue.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "link" }), "mt-2")}
                    >
                      {t.directions}
                    </a>
                  </article>
                )}

                {Boolean(entry.sources?.length || entry.unknown) && (
                  <div className="space-y-2">
                    {entry.sources?.length ? (
                      <p className="type-meta text-text-muted">
                        {t.source}{" "}
                        {entry.sources.map((source, index) => {
                          const eventId = entry.events?.[0]?.id;
                          const [href, label] =
                            source === "event"
                              ? [
                                  localizedPath(lang, eventId ? `/wydarzenia/${eventId}` : "/repertuar"),
                                  t.sourceEvent,
                                ]
                              : source === "visit"
                                ? [localizedPath(lang, "/planuj-wizyte"), t.sourceVisit]
                                : [localizedPath(lang, "/planuj-wizyte"), t.sourceVenue];
                          return (
                            <span key={source}>
                              {index > 0 && " · "}
                              <Link href={href} className="underline underline-offset-2 hover:no-underline">
                                {label}
                              </Link>
                            </span>
                          );
                        })}
                      </p>
                    ) : null}

                    {entry.unknown && (
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`tel:${venue.phone.replaceAll(" ", "")}`}
                          className={buttonVariants({ variant: "secondary", size: "sm" })}
                        >
                          {t.callBox}
                        </a>
                        <Link
                          href={localizedPath(lang, "/kontakt")}
                          className={buttonVariants({ variant: "secondary", size: "sm" })}
                        >
                          {t.writeUs}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {suggestions.length > 0 && (
        <ul className="flex flex-col gap-2 pb-3 sm:flex-row sm:flex-wrap">
          {suggestions.map((suggestion) => (
            <li key={suggestion} className="sm:w-auto">
              <button
                type="button"
                onClick={() => send(suggestion)}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "w-full justify-start whitespace-normal text-left sm:w-auto"
                )}
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
        className="flex gap-2 border-t border-line pt-3 pb-4"
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
          className="h-13 min-w-0 flex-1 border-[1.5px] border-line-strong bg-background px-3 text-base text-text placeholder:text-text-muted"
        />
        <Button type="submit" disabled={busy || !input.trim()}>
          {t.send}
        </Button>
      </form>
    </div>
  );
}
