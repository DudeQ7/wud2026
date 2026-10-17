"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/app/actions/panel";

interface FavoriteItemProps {
  event: {
    id: number;
    title: string;
    kind_label?: string | null;
    dates: string[];
    venue?: string | null;
    url: string;
    tickets_url?: string | null;
    series?: string | null;
  };
}

export function FavoriteItem({ event }: FavoriteItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await toggleFavorite(event.id);
    });
  };

  const nextDate = event.dates?.[0]
    ? new Date(event.dates[0]).toLocaleString("pl-PL", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Brak ustalonej daty";

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            {event.kind_label && (
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {event.kind_label}
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
            title="Usuń z ulubionych"
            className="rounded-lg p-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            {isPending ? "..." : "✕ Usuń"}
          </button>
        </div>

        <h2 className="mt-2 text-lg font-bold leading-tight">{event.title}</h2>

        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>📅 {nextDate}</p>
          {event.venue && <p>📍 {event.venue}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm font-medium">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border px-4 py-2 transition-colors hover:bg-muted"
        >
          Szczegóły wydarzenia
        </a>
        {event.tickets_url && (
          <a
            href={event.tickets_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
          >
            Kup bilet online
          </a>
        )}
      </div>
    </article>
  );
}
