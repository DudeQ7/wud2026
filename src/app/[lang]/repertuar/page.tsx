import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { Calendar } from "@/components/calendar/calendar"
import { BottomNav } from "@/components/fs/bottom-nav"
import { Container } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { calendarEditorial } from "@/content/calendar"
import { type Locale, getDictionary, hasLocale, locales, localizedPath, seriesLabel } from "@/i18n"
import { fold, toCalendarEvent } from "@/lib/calendar"
import { events, localizeEvent } from "@/lib/events"

export async function generateMetadata({ params }: PageProps<"/[lang]/repertuar">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const { title, description } = getDictionary(lang).meta.repertoire
  return {
    title,
    description,
    alternates: {
      canonical: localizedPath(lang, "/repertuar"),
      languages: Object.fromEntries(locales.map((code) => [code, localizedPath(code, "/repertuar")])),
    },
  }
}

// Do przeglądarki wysyłamy tylko to, czego potrzebuje lista – cechy do filtrów liczymy tu, na serwerze.
// Cechy (rodzaj, miejsce, klucz cyklu) liczymy z polskich danych, żeby linki z filtrami działały w każdym języku.
// Tytuł jest w języku strony, a wyszukiwanie znajduje wydarzenie także po tytule polskim.
function calendarFor(lang: Locale) {
  const t = getDictionary(lang)
  const calendarEvents = events.map((event) => {
    const base = toCalendarEvent(event, calendarEditorial)
    const local = localizeEvent(base, lang)
    return {
      ...local,
      facets: { ...base.facets, search: lang === "pl" ? base.facets.search : `${base.facets.search} ${fold(local.title)}` },
      artists: [],
      program: [],
      lead: undefined,
      image: undefined,
    }
  })
  const series = [
    ...new Map(
      calendarEvents
        .filter((e) => e.facets.seriesKey)
        .map((e) => [e.facets.seriesKey!, { key: e.facets.seriesKey!, label: seriesLabel(t, e.series)! }])
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label, t.intl))
  return { calendarEvents, series }
}

const calendars = Object.fromEntries(locales.map((lang) => [lang, calendarFor(lang)])) as Record<
  Locale,
  ReturnType<typeof calendarFor>
>

/** Kalendarz wydarzeń (design.md §7.2): H1, wyszukiwanie, szybkie filtry, licznik, lista dni */
export default async function RepertuarPage({ params }: PageProps<"/[lang]/repertuar">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = getDictionary(lang)
  const { calendarEvents, series } = calendars[lang]

  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container>
          <h1 className="type-h1 text-gold">{t.calendar.title}</h1>
          <p className="mt-2 mb-6 type-body max-w-[68ch] text-text">{t.calendar.intro}</p>
          {/* Filtry czytają adres URL w przeglądarce, więc lista renderuje się po stronie klienta */}
          <Suspense fallback={<CalendarSkeleton label={t.calendar.loading} />}>
            <Calendar events={calendarEvents} series={series} lang={lang} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} current="/repertuar" />
    </>
  )
}

function CalendarSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-label={label}>
      <div className="h-[5.25rem] bg-surface-muted" />
      <div className="mt-4 flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-11 w-24 shrink-0 bg-surface-muted" />
        ))}
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mt-6 h-28 bg-surface-muted" />
      ))}
    </div>
  )
}
