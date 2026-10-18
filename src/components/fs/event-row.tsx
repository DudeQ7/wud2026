import Link from "next/link"
import { TypeGlyph } from "@/components/calendar/type-glyph"
import { AccessibilityNote, EventInfoBadge, MetaLine, TicketStatusBadge, eventPrice } from "@/components/fs/event-meta"
import { type Locale, getDictionary, kindLabel, localizedPath, venueLabel } from "@/i18n"
import { type EventType, primaryType } from "@/lib/calendar"
import { type FsEvent, eventHref, formatDuration, formatTime, galleryInfo, isExhibition } from "@/lib/event-format"
import { cn } from "@/lib/utils"

type EventRowProps = {
  /** Wiersz kalendarza ma też cechy (facets) – z nich bierzemy rodzaj do symbolu */
  event: FsEvent & { facets?: { types: EventType[] } }
  /** Godziny wydarzenia w danym dniu (YYYY-MM-DDTHH:mm) */
  times: string[]
  lang: Locale
  className?: string
}

/**
 * Wiersz kalendarza (§6.7): kolumna godziny 56 px + tytuł, meta, rodzaj, znacznik, dostępność.
 * Cały wiersz jest linkiem (rozciągnięty link na tytule). Bez kolorowych pasków i kropek (D5).
 */
export function EventRow({ event, times, lang, className }: EventRowProps) {
  const t = getDictionary(lang)
  const start = times[0]
  const exhibition = isExhibition(event)
  // Ten sam symbol co pod datą w kalendarzu miesiąca: legenda łączy siatkę z listą
  const kind = event.facets ? primaryType(event.facets.types) : undefined
  const until = exhibition ? `–${galleryInfo.closes}` : times.slice(1).map(formatTime).join(", ")

  return (
    <article className={cn("group press enter-fade relative flex gap-3 border-b border-line py-4 lg:py-5", className)}>
      <div className="w-14 shrink-0">
        <p className="font-heading text-lg leading-tight font-semibold text-text tabular-nums">{formatTime(start)}</p>
        {until && <p className="type-meta text-text-muted tabular-nums">{until}</p>}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="type-title-card text-text">
          <Link
            href={localizedPath(lang, eventHref(event))}
            className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {event.title}
          </Link>
        </h3>
        <MetaLine items={[venueLabel(t, event.venue), eventPrice(event, t), formatDuration(event.durationMin)]} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 type-label text-text-muted">
            {kind && <TypeGlyph type={kind} />}
            {exhibition ? t.event.exhibition : kindLabel(t, event.kind)}
          </span>
          <EventInfoBadge event={event} t={t} />
          <TicketStatusBadge event={event} t={t} hideAvailable />
        </div>
        <AccessibilityNote t={t} className="mt-0.5" />
      </div>
    </article>
  )
}
