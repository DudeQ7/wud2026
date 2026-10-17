"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/app/actions/panel";
import { type Locale, getDictionary } from "@/i18n";

interface FavoriteItemProps {
  lang: Locale;
  /** Teksty już w języku strony */
  event: {
    id: number;
    title: string;
    kind?: string;
    dates: string[];
    venue?: string;
    url: string;
    ticketsUrl?: string;
    series?: string;
  };
}

export function FavoriteItem({ lang, event }: FavoriteItemProps) {
  const { intl, panel } = getDictionary(lang);
  const t = panel.favorites;
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await toggleFavorite(event.id, lang);
    });
  };

  const nextDate = event.dates?.[0]
    ? new Date(event.dates[0]).toLocaleString(intl, {
        dateStyle: "full",
        timeStyle: "short",
      })
    : panel.noDate;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            {event.kind && (
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {event.kind}
              </span>
            )}
            {event.series && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({event.series})
              </span>
            )}
          </div>
          <button
            onClick={handleRemove}
            disabled={isPending}
            title={t.remove}
            aria-label={t.remove}
            className="rounded-lg p-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            {isPending ? "..." : t.removeButton}
          </button>
        </div>

        <h2 className="mt-2 text-lg font-bold leading-tight">{event.title}</h2>

        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>
            <span aria-hidden>📅 </span>
            {nextDate}
          </p>
          {event.venue && (
            <p>
              <span aria-hidden>📍 </span>
              {event.venue}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm font-medium">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border px-4 py-2 transition-colors hover:bg-muted"
        >
          {t.details}
        </a>
        {event.ticketsUrl && (
          <a
            href={event.ticketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
          >
            {t.buyTicket}
          </a>
        )}
      </div>
    </article>
  );
}
