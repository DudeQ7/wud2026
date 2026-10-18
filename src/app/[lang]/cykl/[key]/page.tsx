import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { EventCard } from "@/components/fs/event-card"
import { EventInfoBadge, MetaLine, eventPrice } from "@/components/fs/event-meta"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import cykle from "@/data/cykle.json"
import { seriesKey } from "@/lib/calendar"
import {
  eventDetails,
  events,
  formatDuration,
  formatShortDate,
  lastDate,
  localizeEvent,
  nextDate,
  nowKey,
} from "@/lib/events"
import { getDictionary, hasLocale, localizedPath, seriesLabel } from "@/i18n"
import { editorialCopy } from "@/i18n/editorial-routes"
import { getLang } from "@/i18n/server"

// Cykle i festiwale (brief, moduł 8): program, artyści i bilety w serwisie. Bez koloru cyklu (D6).
const bySeries = Map.groupBy(
  events.filter((e) => e.series),
  (e) => seriesKey(e.series)!
)

export function generateStaticParams() {
  return [...bySeries.keys()].map((key) => ({ key }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/cykl/[key]">): Promise<Metadata> {
  const { key, lang: rawLang } = await params
  const lang = hasLocale(rawLang) ? rawLang : "pl"
  const group = bySeries.get(key)
  if (!group) return {}
  const t = getDictionary(lang)
  const fullCopy = editorialCopy(lang)
  const name = seriesLabel(t, group[0].series)!
  return { title: `${name} – ${fullCopy.ui.institution}`, description: fullCopy.series.metaDescription(name) }
}

export default async function SeriesPage({ params }: PageProps<"/[lang]/cykl/[key]">) {
  const lang = await getLang()
  const copy = editorialCopy(lang)
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
          <Suspense fallback={<div className="h-96 bg-surface-muted" role="status" aria-busy="true" aria-label={copy.ui.loading} />}>
            <SeriesContent params={params} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}

async function SeriesContent({ params }: Pick<PageProps<"/[lang]/cykl/[key]">, "params">) {
  const { key } = await params
  if (!bySeries.has(key)) notFound()
  return <SeriesView seriesKeyValue={key} />
}

// Najbliższe terminy zależą od daty – widok cache'owany na godzinę, jak karta wydarzenia
async function SeriesView({ seriesKeyValue }: { seriesKeyValue: string }) {
  "use cache"
  cacheLife("hours")

  const lang = await getLang()
  const t = getDictionary(lang)
  const fullCopy = editorialCopy(lang)
  const copy = fullCopy.series
  // Tytuły wydarzeń w języku strony; cechy i klucz cyklu liczymy z polskich danych
  const group = bySeries.get(seriesKeyValue)!.map((e) => localizeEvent(e, lang))
  const name = seriesLabel(t, group[0].series)!
  const season = group[0].series!.match(/\d{4}\/\d{4}/)?.[0]
  const now = nowKey(new Date())
  const items = group
    .map((event) => ({ event, date: nextDate(event, now) }))
    .filter((x): x is { event: (typeof group)[number]; date: string } => Boolean(x.date))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Artyści z programu cyklu: imię i nazwisko (bez roli), bez powtórzeń
  const artists = [...new Set(group.flatMap((e) => eventDetails(e.id).artists.map((a) => a.name)))].sort((a, b) =>
    a.localeCompare(b, "pl")
  )
  const about = (cykle as Record<string, { description: string[]; image?: string }>)[group[0].series!]
  const last = group.map((e) => lastDate(e)!).sort().at(-1)!

  return (
    <>
      <Eyebrow>{copy.eyebrow(season)}</Eyebrow>
      <h1 className="mt-1 type-h1 text-gold">{name}</h1>
      <p className="mt-2 type-body-lg max-w-[68ch] text-text">
        {copy.lead(group.length, items.length > 0 ? formatShortDate(items[0].date, t) : undefined, formatShortDate(last, t))}
      </p>
      {about?.image && (
        // Grafika cyklu ma napisy, więc pokazujemy ją w całości, bez kadrowania do 3:2 (§5.6)
        // eslint-disable-next-line @next/next/no-img-element
        <img src={about.image} alt={name} className="mt-6 -mx-4 h-auto w-[calc(100%+2rem)] max-w-none sm:mx-0 sm:w-full" />
      )}
      {about && about.description.length > 0 && (
        <>
          {lang !== "pl" && <p className="mt-6 type-meta text-text-muted">{fullCopy.ui.polishDetailsNote}</p>}
          <div className="mt-6 flex max-w-[68ch] flex-col gap-4 type-body text-text" lang="pl">
            {about.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </>
      )}
      <Link
        href={localizedPath(lang, `/repertuar?cykl=${seriesKeyValue}`)}
        className={`${buttonVariants({ variant: "secondary", block: true })} mt-4 sm:w-fit`}
      >
        {copy.seeInCalendar}
      </Link>

      <h2 className="mt-12 type-h2 text-gold">{copy.program}</h2>
      {items.length === 0 ? (
        <p className="mt-4 type-body text-text">{copy.emptyProgram}</p>
      ) : (
        <ul className="mt-6 grid gap-10 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
          {items.map(({ event, date }) => (
            <li key={event.id} className="flex flex-col gap-2">
              <EventCard lang={lang} event={event} date={date} />
              <div className="flex flex-wrap items-center gap-2">
                <EventInfoBadge event={event} t={t} />
                <MetaLine items={[eventPrice(event, t), formatDuration(event.durationMin)]} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {artists.length > 0 && (
        <>
          <h2 className="mt-12 type-h2 text-gold">{copy.artists}</h2>
          <ul className="mt-4 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {artists.map((a) => (
              <li key={a} className="break-inside-avoid border-b border-line py-2 type-body text-text">
                {a}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
