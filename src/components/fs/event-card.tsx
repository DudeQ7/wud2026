import * as React from "react"

import { AccessibilityNote, MetaLine } from "@/components/fs/event-meta"
import { Eyebrow } from "@/components/fs/layout"
import { Photo, PhotoDateBadge } from "@/components/fs/photo"
import { type FsEvent, datesOn, formatDateBadge, formatDuration, formatTime } from "@/lib/event-format"
import { cn } from "@/lib/utils"

type EventCardProps = {
  event: FsEvent
  /** Termin pokazywany na karcie (YYYY-MM-DDTHH:mm) */
  date: string
  /**
   * default – karta listy (zdjęcie 3:2 + opis),
   * featured – kafel wyróżniony ze ściętym narożnikiem i większym tytułem,
   * compact – mniejszy kafel do siatki 2 kolumn (bez zdania „dlaczego warto”)
   */
  variant?: "default" | "featured" | "compact"
  /** Jedno zdanie „dlaczego warto” – domyślnie z opisu wydarzenia */
  lead?: string
  /** Pokaż znacznik dostępności */
  showAccess?: boolean
  photoPosition?: string
  priority?: boolean
  className?: string
}

/**
 * Karta wydarzenia (§6.10). Cała karta jest klikalna – link ma tytuł jako tekst,
 * a `::after` rozciąga pole kliknięcia na kartę.
 */
export function EventCard({
  event,
  date,
  variant = "default",
  lead,
  showAccess,
  photoPosition,
  priority,
  className,
}: EventCardProps) {
  const compact = variant === "compact"
  const times = datesOn(event, date.slice(0, 10)).map(formatTime)
  const sentence = compact ? undefined : (lead ?? event.lead)

  return (
    <article className={cn("group relative flex flex-col", compact ? "gap-3" : "gap-4", className)}>
      <Photo
        src={event.image?.card}
        alt={event.headline}
        chamfer={variant === "featured"}
        position={photoPosition}
        priority={priority}
        sizes={compact ? "(min-width: 1024px) 25vw, 50vw" : undefined}
      >
        <PhotoDateBadge>{formatDateBadge(date)}</PhotoDateBadge>
      </Photo>

      <div className="flex flex-col gap-1.5">
        <Eyebrow>{event.kind}</Eyebrow>
        <h3 className={cn(variant === "featured" ? "type-h3" : "type-title-card", "text-text")}>
          <a
            href={event.url}
            className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {event.headline}
            {event.subtitle && <span className="block">{event.subtitle}</span>}
          </a>
        </h3>
        <MetaLine
          items={[
            times.join(" i "),
            compact ? undefined : event.venue,
            compact ? undefined : formatDuration(event.durationMin),
          ]}
        />
        {sentence && <p className="mt-1 type-body text-text">{sentence}</p>}
        {showAccess && <AccessibilityNote className="mt-1" />}
      </div>
    </article>
  )
}
