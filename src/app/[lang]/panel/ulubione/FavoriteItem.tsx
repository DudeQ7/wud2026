"use client";

import { useTransition } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import posthog from "posthog-js";
import { toggleFavorite } from "@/app/actions/panel";
import { iconProps } from "@/components/fs/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { type Locale, getDictionary } from "@/i18n";
import type { PanelEvent } from "../panel-event";

interface FavoriteItemProps {
  lang: Locale;
  event: PanelEvent;
  /** Przycisk „Usuń z ulubionych” (lista ulubionych); na pulpicie sam podgląd */
  removable?: boolean;
}

/** Wiersz wydarzenia w panelu – jak wiersz kalendarza (§6.7): data, tytuł, meta, status, CTA */
export function FavoriteItem({ lang, event, removable = false }: FavoriteItemProps) {
  const { panel } = getDictionary(lang);
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

  return (
    <article className="flex flex-col gap-3 border-b border-line py-4 lg:py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          {event.kind && <p className="type-label text-text-muted">{event.kind}</p>}
          <h3 className="type-title-card text-text">
            <Link href={event.href} className="underline-offset-4 hover:underline">
              {event.title}
            </Link>
          </h3>
          <p className="type-meta text-text-muted tabular-nums">
            {[event.when ?? panel.noDate, event.venue].filter(Boolean).join(" · ")}
          </p>
          <Badge
            variant={event.status === "last" ? "solid" : event.status === "soldout" ? "muted" : "outline"}
            className="mt-1"
          >
            {event.statusLabel}
          </Badge>
        </div>
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            aria-busy={isPending || undefined}
            aria-label={`${t.remove}: ${event.title}`}
            title={t.remove}
            className={buttonVariants({ variant: "icon", className: "-mt-2 -mr-2 disabled:opacity-50" })}
          >
            <X {...iconProps} className="size-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={event.href} className={buttonVariants({ variant: "secondary", size: "sm" })}>
          {t.details}
        </Link>
        {event.ticketsUrl && event.status !== "soldout" && (
          <Link href={event.ticketsUrl} className={buttonVariants({ variant: "primary", size: "sm" })}>
            {t.buyTicket}
          </Link>
        )}
      </div>
    </article>
  );
}
