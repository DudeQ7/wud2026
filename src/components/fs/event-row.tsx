import Link from "next/link"
import { AccessibilityNote, EventInfoBadge, MetaLine, eventPrice } from "@/components/fs/event-meta"
import { type FsEvent, eventHref, formatDuration, formatTime, galleryInfo, isExhibition } from "@/lib/event-format"
import { cn } from "@/lib/utils"

type EventRowProps = {
  event: FsEvent
  /** Godziny wydarzenia w danym dniu (YYYY-MM-DDTHH:mm) */
  times: string[]
  className?: string
}

/**
 * Wiersz kalendarza (§6.7): kolumna godziny 56 px + tytuł, meta, rodzaj, znacznik, dostępność.
 * Cały wiersz jest linkiem (rozciągnięty link na tytule). Bez kolorowych pasków i kropek (D5).
 */
export function EventRow({ event, times, className }: EventRowProps) {
  const start = times[0]
  const exhibition = isExhibition(event)
  const until = exhibition ? `–${galleryInfo.closes}` : times.slice(1).map(formatTime).join(", ")

  return (
    <article className={cn("group relative flex gap-3 border-b border-line py-4 lg:py-5", className)}>
      <div className="w-14 shrink-0">
        <p className="font-heading text-lg leading-tight font-semibold text-text tabular-nums">{formatTime(start)}</p>
        {until && <p className="type-meta text-text-muted tabular-nums">{until}</p>}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="type-title-card text-text">
          <Link
            href={eventHref(event)}
            className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {event.title}
          </Link>
        </h3>
        <MetaLine items={[event.venue, eventPrice(event), formatDuration(event.durationMin)]} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="type-label text-text-muted">{exhibition ? "Wystawa" : event.kind}</span>
          <EventInfoBadge event={event} />
        </div>
        <AccessibilityNote className="mt-0.5" />
      </div>
    </article>
  )
}
