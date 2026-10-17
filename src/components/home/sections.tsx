import Link from "next/link"

import { EventCard } from "@/components/fs/event-card"
import { Section, SectionHeading } from "@/components/fs/layout"
import { NewsletterForm } from "@/components/fs/newsletter-form"
import { CtaTile, DiscoverTile, LinkTile } from "@/components/fs/tiles"
import { buttonVariants } from "@/components/ui/button"
import { boxOffice, buildingHours, discoverTiles, moodTiles, recommended } from "@/content/home"
import {
  type FsEvent,
  addDays,
  eventsOnDay,
  formatLongDate,
  getEvent,
  nextDate,
  upcomingConcerts,
  weekendKeys,
} from "@/lib/events"
import { cn } from "@/lib/utils"

import { type DayGroup, type DayTab, DayFilter } from "./day-filter"

const weekdayOf = (dayKey: string) => new Date(`${dayKey}T12:00:00Z`).getUTCDay()

function dayGroup(day: string): DayGroup {
  return { day, label: formatLongDate(day), rows: eventsOnDay(day) }
}

function buildingLine(day: string) {
  const hours = buildingHours.hoursByWeekday[weekdayOf(day)]
  return hours ? `Budynek otwarty ${hours}` : "Budynek otwarty godzinę przed wydarzeniem"
}

function boxOfficeLine(day: string, when: string) {
  const hours = boxOffice.hoursByWeekday[weekdayOf(day)]
  const open = hours ? `Kasa ${when} ${hours}` : `Kasa ${when}: godzinę przed biletowanym wydarzeniem`
  return `${open} · tel. ${boxOffice.phone}`
}

/** 2. Dziś w Filharmonii (§7.1) */
export function TodaySection({ today }: { today: string }) {
  const tomorrow = addDays(today, 1)
  const weekend = weekendKeys(today)

  const tabs: DayTab[] = [
    {
      key: "today",
      label: "Dziś",
      heading: "Dziś w Filharmonii",
      meta: `${formatLongDate(today)}\n${buildingLine(today)}`,
      boxOffice: boxOfficeLine(today, "dziś"),
      groups: [dayGroup(today)],
    },
    {
      key: "tomorrow",
      label: "Jutro",
      heading: "Jutro w Filharmonii",
      meta: `${formatLongDate(tomorrow)}\n${buildingLine(tomorrow)}`,
      boxOffice: boxOfficeLine(tomorrow, "jutro"),
      groups: [dayGroup(tomorrow)],
    },
    {
      key: "weekend",
      label: "Ten weekend",
      heading: "Weekend w Filharmonii",
      meta: weekend.map(formatLongDate).join(" – "),
      boxOffice: `Kasa w sobotę 12:00–16:00 · tel. ${boxOffice.phone}`,
      groups: weekend.map(dayGroup),
    },
  ]

  // Gdy dziś nic się nie dzieje, sekcja zaczyna od jutra (§7.1)
  if (tabs[0].groups[0].rows.length === 0) tabs.push(tabs.shift()!)

  return (
    <Section aria-labelledby="dzis">
      <DayFilter tabs={tabs} headingId="dzis" />
      <Link href="/repertuar" className={cn(buttonVariants({ variant: "link" }), "mt-2")}>
        Cały dzień w kalendarzu →
      </Link>
    </Section>
  )
}

/** 3. Najbliższe wydarzenia (§7.1): 3–6 kart + „Pełny repertuar” */
export function UpcomingSection({ today, excludeIds }: { today: string; excludeIds: number[] }) {
  const items = upcomingConcerts(addDays(today, 1), 4, excludeIds)

  return (
    <Section aria-labelledby="najblizsze">
      <SectionHeading id="najblizsze" title="Najbliższe wydarzenia" />
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
        {items.map(({ event, date }) => (
          <EventCard key={event.id} event={event} date={date} />
        ))}
      </div>
      <Link href="/repertuar" className={cn(buttonVariants({ variant: "secondary", block: true }), "mt-10 sm:w-fit")}>
        Pełny repertuar →
      </Link>
    </Section>
  )
}

function withDate(event: FsEvent, today: string) {
  return { event, date: nextDate(event, `${today}T00:00`) ?? event.dates.at(-1)! }
}

/** 4. Polecamy (§7.1): 1 kafel wyróżniony (ścięty narożnik) + 2 mniejsze */
export function RecommendedSection({ today }: { today: string }) {
  const featured = withDate(getEvent(recommended.featuredId), today)
  const others = recommended.otherIds.map((id) => withDate(getEvent(id), today))

  return (
    <Section aria-labelledby="polecamy">
      <SectionHeading id="polecamy" title="Polecamy" />
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-6">
        <EventCard event={featured.event} date={featured.date} variant="featured" lead={recommended.featuredLead} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6">
          {others.map(({ event, date }) => (
            <EventCard key={event.id} event={event} date={date} variant="compact" />
          ))}
        </div>
      </div>
    </Section>
  )
}

/** 5. Dla Ciebie (§6.18): „Pomóż mi wybrać” + kafle nastrojów */
export function ForYouSection() {
  return (
    <Section aria-labelledby="dla-ciebie">
      <SectionHeading
        id="dla-ciebie"
        title="Dla Ciebie"
        lead="Nie musisz znać muzyki klasycznej. Wybierz, na co masz ochotę."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <CtaTile
          eyebrow="5 pytań · 3–5 propozycji"
          title="Pomóż mi wybrać"
          description="Powiedz, z kim, kiedy i w jakim nastroju chcesz przyjść. Podpowiemy konkretne wydarzenia."
          action={{ label: "Zaczynamy", href: "/pomoz-mi-wybrac" }}
        />
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {moodTiles.map((tile) => (
            <li key={tile.title} className="flex">
              <LinkTile {...tile} className="flex-1" />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

/** 6. Odkryj Filharmonię (§6.18): 6 kafli, 2 × 3 na mobile, 3 × 2 na desktopie */
export function DiscoverSection() {
  return (
    <Section aria-labelledby="odkryj">
      <SectionHeading
        id="odkryj"
        title="Odkryj Filharmonię"
        lead="Wejdź nie tylko na koncert: orkiestra, budynek, wystawy i 78 lat historii."
      />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-6">
        {discoverTiles.map(({ imageFromEventId, ...tile }) => (
          <li key={tile.title}>
            <DiscoverTile {...tile} image={imageFromEventId ? getEvent(imageFromEventId).image?.card : undefined} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** 7a. Newsletter (§7.1): 1 pole + zgoda RODO */
export function NewsletterSection() {
  return (
    <Section aria-labelledby="newsletter" className="pb-12">
      <SectionHeading
        id="newsletter"
        title="Bądź na bieżąco"
        lead="Nowe koncerty i start sprzedaży biletów prosto na Twój e-mail."
      />
      <NewsletterForm />
    </Section>
  )
}

/**
 * 7b. Partnerzy (§7.1): logotypy w szarości z linkiem do narracji partnerstwa.
 * Plików logo partnerów nie ma w repo – pola zastępcze z przerywaną ramką.
 */
export function PartnersSection() {
  return (
    <Section aria-labelledby="partnerzy" className="border-t border-line pb-12">
      <SectionHeading id="partnerzy" title="Partnerzy" as="h3" />
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <li
            key={i}
            className="flex h-16 items-center justify-center border border-dashed border-line type-meta text-text-muted"
          >
            logo partnera
          </li>
        ))}
      </ul>
      <Link href="/partnerzy" className={cn(buttonVariants({ variant: "link" }), "mt-4")}>
        Partnerzy i biznes →
      </Link>
    </Section>
  )
}
