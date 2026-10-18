"use client";

import { CalendarDays, MapPin, X } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import { useTransition } from "react";

import { toggleFavorite } from "@/app/actions/panel";
import { iconProps } from "@/components/fs/icons";
import { buttonVariants } from "@/components/ui/button";
import { type Locale, getDictionary } from "@/i18n";
import { cn } from "@/lib/utils";

interface FavoriteItemProps {
  lang: Locale;
  /** Teksty już w języku strony */
  event: {
    id: number;
    title: string;
    kind?: string;
    dates: string[];
    venue?: string;
    href: string;
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
      const result = await toggleFavorite(event.id, lang);
      if ("isFavorite" in result && result.isFavorite === false) {
        posthog.capture("favorite_removed", { event_id: event.id });
      }
    });
  };

  const nextDate = event.dates?.[0]
    ? new Date(event.dates[0]).toLocaleString(intl, {
        dateStyle: "full",
        timeStyle: "short",
      })
    : panel.noDate;

  return (
    <article className="flex flex-col justify-between border-[1.5px] border-line-strong p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {event.kind && <p className="type-eyebrow text-gold">{event.kind}</p>}
            {event.series && <p className="mt-1 type-meta text-text-muted">{event.series}</p>}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            aria-label={t.remove}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "shrink-0 gap-1.5 disabled:opacity-50")}
          >
            <X {...iconProps} className="size-4" />
            {isPending ? "…" : t.removeButton}
          </button>
        </div>

        <h2 className="mt-2 type-title-card text-text">{event.title}</h2>

        <div className="mt-3 space-y-1">
          <p className="flex items-center gap-1.5 type-meta text-text-muted">
            <CalendarDays {...iconProps} className="size-4 shrink-0" />
            {nextDate}
          </p>
          {event.venue && (
            <p className="flex items-center gap-1.5 type-meta text-text-muted">
              <MapPin {...iconProps} className="size-4 shrink-0" />
              {event.venue}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Link href={event.href} className={buttonVariants({ variant: "secondary", size: "sm" })}>
          {t.details}
        </Link>
        {event.ticketsUrl && (
          <a
            href={event.ticketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            {t.buyTicket}
          </a>
        )}
      </div>
    </article>
  );
}
