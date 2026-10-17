import type { Metadata } from "next"
import { Suspense } from "react"

import { Calendar } from "@/components/calendar/calendar"
import { BottomNav } from "@/components/fs/bottom-nav"
import { Container } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { calendarEditorial } from "@/content/calendar"
import { toCalendarEvent } from "@/lib/calendar"
import { events, formatSeries } from "@/lib/events"

export const metadata: Metadata = {
  title: "Repertuar – Filharmonia w Szczecinie",
  description: "Koncerty, wystawy, zwiedzanie i wydarzenia dla dzieci. Filtruj po dniu, rodzaju, wieku dziecka i miejscu.",
}

// Do przeglądarki wysyłamy tylko to, czego potrzebuje lista – cechy do filtrów liczymy tu, na serwerze.
const calendarEvents = events.map((event) => ({
  ...toCalendarEvent(event, calendarEditorial),
  artists: [],
  program: [],
  lead: undefined,
  image: undefined,
}))

const series = [
  ...new Map(
    calendarEvents
      .filter((e) => e.facets.seriesKey)
      .map((e) => [e.facets.seriesKey!, { key: e.facets.seriesKey!, label: formatSeries(e.series)! }])
  ).values(),
].sort((a, b) => a.label.localeCompare(b.label, "pl"))

/** Kalendarz wydarzeń (design.md §7.2): H1, wyszukiwanie, szybkie filtry, licznik, lista dni */
export default function RepertuarPage() {
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Przejdź do treści
      </a>
      <SiteHeader />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container>
          <h1 className="type-h1 text-gold">Repertuar</h1>
          <p className="mt-2 mb-6 type-body max-w-[68ch] text-text">
            Koncerty, wystawy, zwiedzanie i wydarzenia dla dzieci. Wybierz filtr albo wpisz, czego szukasz.
          </p>
          {/* Filtry czytają adres URL w przeglądarce, więc lista renderuje się po stronie klienta */}
          <Suspense fallback={<CalendarSkeleton />}>
            <Calendar events={calendarEvents} series={series} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter />
      <BottomNav current="/repertuar" />
    </>
  )
}

function CalendarSkeleton() {
  return (
    <div aria-busy="true" aria-label="Wczytywanie repertuaru">
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
