import { connection } from "next/server"
import * as React from "react"
import { Suspense } from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { EventCard } from "@/components/fs/event-card"
import { EventInfoBadge, MetaLine, eventPrice } from "@/components/fs/event-meta"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { type Locale, getDictionary } from "@/i18n"
import { listingCopy } from "@/i18n/listing-routes"
import { getLang } from "@/i18n/server"
import { type FsEvent, formatDuration, nextDate, nowKey, lastDate } from "@/lib/event-format"
import { localizeEvent } from "@/lib/events"

type ListingProps = {
  eyebrow: string
  title: string
  lead: string
  /** Wydarzenia tej podstrony (wybór po stronie serwera) */
  select: (events: FsEvent[]) => FsEvent[]
  events: FsEvent[]
  empty: string
  /** Treść nad listą, np. kafle grup lub informacje praktyczne */
  intro?: React.ReactNode
  /** Nagłówek listy (domyślnie ukryty „Nadchodzące wydarzenia”) */
  listTitle?: string
  footer?: React.ReactNode
}

/** Podstrona tematyczna: nagłówek + opis + lista kart z najbliższymi terminami (design.md §6.10) */
export async function ListingPage({ eyebrow, title, lead, intro, footer, ...rest }: ListingProps) {
  const lang = await getLang()
  const ui = listingCopy(lang).ui
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {getDictionary(lang).common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-1 type-h1 text-gold">{title}</h1>
          <p className="mt-2 type-body-lg max-w-[68ch] text-text">{lead}</p>
          {intro}
          <Suspense fallback={<div role="status" className="mt-8 h-64 bg-surface-muted" aria-busy="true" aria-label={ui.loading} />}>
            <List {...rest} lang={lang} />
          </Suspense>
          {footer}
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}

async function List({
  events,
  select,
  empty,
  listTitle,
  lang,
}: Pick<ListingProps, "events" | "select" | "empty" | "listTitle"> & { lang: Locale }) {
  await connection()
  const t = getDictionary(lang)
  const now = nowKey(new Date())
  const items = select(events)
    .map((event) => localizeEvent(event, lang))
    .map((event) => ({ event, date: nextDate(event, now) ?? lastDate(event)!, upcoming: Boolean(nextDate(event, now)) }))
    .filter((x) => x.upcoming)
    .sort((a, b) => a.date.localeCompare(b.date))

  if (!items.length) return <p className="mt-8 type-body text-text">{empty}</p>

  return (
    <>
      {listTitle ? (
        <h2 className="mt-12 type-h2 text-gold">{listTitle}</h2>
      ) : (
        <h2 className="sr-only">{listingCopy(lang).ui.upcoming}</h2>
      )}
      <ul className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
        {items.map(({ event, date }) => (
          <li key={event.id} className="flex flex-col gap-2">
            <EventCard event={event} date={date} lang={lang} />
            <div className="flex flex-wrap items-center gap-2">
              <EventInfoBadge event={event} t={t} />
              <MetaLine items={[eventPrice(event, t), formatDuration(event.durationMin)]} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
