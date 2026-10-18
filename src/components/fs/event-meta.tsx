import { Accessibility } from "lucide-react"
import * as React from "react"

import { iconProps } from "@/components/fs/icons"
import { Badge } from "@/components/ui/badge"
import { ticketStatus } from "@/content/availability"
import type { Dictionary } from "@/i18n"
import { type FsEvent, formatDayMonth, isExhibition, lastDate } from "@/lib/event-format"
import { cn } from "@/lib/utils"

/** Metadane w jednej linii: „Sala Symfoniczna · bilet 10 zł · 1 h 40 min” (§3.2 meta) */
export function MetaLine({ items, className }: { items: (string | undefined)[]; className?: string }) {
  const parts = items.filter(Boolean)
  if (!parts.length) return null
  return <p className={cn("type-meta text-text-muted", className)}>{parts.join(" · ")}</p>
}

/**
 * Znacznik informacyjny przy wydarzeniu – zawsze słowem, bez koloru (§6.8).
 * Wystawy: „Otwarta do 22.11”, wydarzenia dla dzieci: „Wiek 5+”.
 */
export function EventInfoBadge({ event, t }: { event: FsEvent; t: Dictionary }) {
  if (isExhibition(event)) {
    const end = lastDate(event)
    return end ? <Badge>{t.event.openUntil(formatDayMonth(end, t))}</Badge> : null
  }
  if (event.age) return <Badge>{t.event.age(event.age)}</Badge>
  return null
}

/**
 * Status biletów (§6.8) – mock iksoris: dostępne, ostatnie miejsca, wyprzedane.
 * Na listach i kartach (`hideAvailable`) „Dostępne” pomijamy: to stan domyślny prawie każdego wydarzenia,
 * więc znacznik przy każdym wierszu nie niósłby informacji i zagłuszał „Ostatnie miejsca” (jak w Berlinie:
 * pokazujemy wyjątki). Na karcie wydarzenia status jest zawsze.
 */
export function TicketStatusBadge({
  event,
  t,
  className,
  hideAvailable,
}: {
  event: FsEvent
  t: Dictionary
  className?: string
  hideAvailable?: boolean
}) {
  const status = ticketStatus(event.id)
  if (hideAvailable && status === "available") return null
  return (
    <Badge
      variant={status === "last" ? "solid" : status === "soldout" ? "muted" : "outline"}
      className={className}
    >
      {t.event.status[status]}
    </Badge>
  )
}

/** Cena do metadanych: z danych, a dla wystaw – cena biletu do galerii */
export function eventPrice(event: FsEvent, t: Dictionary) {
  if (event.prices.length) return event.prices.join(", ")
  if (isExhibition(event)) return t.event.galleryPrice
  return undefined
}

/**
 * Znacznik dostępności (§6.9). Wszystkie sale FS mają wejście bez barier i windy (visit.json),
 * więc „Dostęp dla wózków · winda” dotyczy każdego wydarzenia w budynku.
 */
export function AccessibilityNote({ t, className }: { t: Dictionary; className?: string }) {
  return (
    <p className={cn("flex items-center gap-1.5 type-meta text-text", className)}>
      <Accessibility {...iconProps} className="size-5 shrink-0" />
      {t.event.wheelchair}
    </p>
  )
}

type Fact = { label: string; value: React.ReactNode }

/** Lista faktów (<dl>) z liniami nad i pod – karta wydarzenia i otwarcie (§6.5, §6.11) */
export function FactList({ facts, className }: { facts: Fact[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-[4.5rem_1fr] gap-x-4 border-y border-line py-3", className)}>
      {facts.map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="flex min-h-11 items-center text-sm font-semibold text-text-muted">{label}</dt>
          <dd className="flex min-h-11 items-center text-[0.9375rem] text-text">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
