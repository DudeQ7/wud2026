import Link from "next/link"

import { EventCard } from "@/components/fs/event-card"
import { FundersBar } from "@/components/fs/funders-bar"
import { Section, SectionHeading } from "@/components/fs/layout"
import { NewsletterForm } from "@/components/fs/newsletter-form"
import { CtaTile, DiscoverTile, LinkTile } from "@/components/fs/tiles"
import { StairsArt } from "@/components/home/stairs-art"
import { buttonVariants } from "@/components/ui/button"
import { calendarEditorial } from "@/content/calendar"
import { boxOffice, buildingHours, discoverTiles, moodTiles, recommended } from "@/content/home"
import { type Dictionary, type Locale, getDictionary, localizedPath } from "@/i18n"
import {
  type FsEvent,
  addDays,
  events,
  eventsOnDay,
  formatLongDate,
  getEvent,
  nextDate,
  upcomingConcerts,
  weekendKeys,
} from "@/lib/events"
import { calendarDays, countRows, parseFilters, toCalendarEvent } from "@/lib/calendar"
import { cn } from "@/lib/utils"

const calendarEvents = events.map((event) => toCalendarEvent(event, calendarEditorial))

import { FirstVisitRoute } from "./first-visit-route"
import { type DayGroup, type DayTab, DayFilter } from "./day-filter"

const weekdayOf = (dayKey: string) => new Date(`${dayKey}T12:00:00Z`).getUTCDay()

function dayGroup(day: string, t: Dictionary): DayGroup {
  return { day, label: formatLongDate(day, t), rows: eventsOnDay(day, t.lang) }
}

function buildingLine(day: string, t: Dictionary) {
  const hours = buildingHours.hoursByWeekday[weekdayOf(day)]
  return hours ? t.home.today.buildingOpen(hours) : t.home.today.buildingBeforeEvent
}

function boxOfficeLine(day: string, when: string, t: Dictionary) {
  const hours = boxOffice.hoursByWeekday[weekdayOf(day)]
  const open = hours ? t.home.today.boxOfficeOpen(when, hours) : t.home.today.boxOfficeBeforeEvent(when)
  return `${open} · ${t.home.today.phone(boxOffice.phone)}`
}

/** 2. Dziś w Filharmonii (§7.1) */
export function TodaySection({ today, lang }: { today: string; lang: Locale }) {
  const t = getDictionary(lang)
  const { tabs: labels } = t.home.today
  const tomorrow = addDays(today, 1)
  const weekend = weekendKeys(today)

  const tabs: DayTab[] = [
    {
      key: "today",
      label: labels.today.label,
      heading: labels.today.heading,
      meta: `${formatLongDate(today, t)}\n${buildingLine(today, t)}`,
      boxOffice: boxOfficeLine(today, labels.today.when, t),
      groups: [dayGroup(today, t)],
    },
    {
      key: "tomorrow",
      label: labels.tomorrow.label,
      heading: labels.tomorrow.heading,
      meta: `${formatLongDate(tomorrow, t)}\n${buildingLine(tomorrow, t)}`,
      boxOffice: boxOfficeLine(tomorrow, labels.tomorrow.when, t),
      groups: [dayGroup(tomorrow, t)],
    },
    {
      key: "weekend",
      label: labels.weekend.label,
      heading: labels.weekend.heading,
      meta: weekend.map((day) => formatLongDate(day, t)).join(" – "),
      // Kasa w weekend działa tylko w sobotę (getUTCDay() = 6)
      boxOffice: `${t.home.today.boxOfficeOpen(labels.weekend.when, boxOffice.hoursByWeekday[6])} · ${t.home.today.phone(boxOffice.phone)}`,
      groups: weekend.map((day) => dayGroup(day, t)),
    },
  ]

  // Gdy dziś nic się nie dzieje, sekcja zaczyna od jutra (§7.1)
  if (tabs[0].groups[0].rows.length === 0) tabs.push(tabs.shift()!)

  return (
    <Section aria-labelledby="dzis">
      <DayFilter tabs={tabs} headingId="dzis" lang={lang} />
      <Link href={localizedPath(lang, "/repertuar")} className={cn(buttonVariants({ variant: "link" }), "mt-2")}>
        {t.home.today.fullDay}
      </Link>
    </Section>
  )
}

/** 3. Najbliższe wydarzenia (§7.1): 3–6 kart + „Pełny repertuar” */
export function UpcomingSection({ today, excludeIds, lang }: { today: string; excludeIds: number[]; lang: Locale }) {
  const t = getDictionary(lang).home.upcoming
  const items = upcomingConcerts(addDays(today, 1), 4, excludeIds, lang)

  return (
    <Section aria-labelledby="najblizsze">
      <SectionHeading id="najblizsze" title={t.title} />
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
        {items.map(({ event, date }) => (
          <EventCard key={event.id} event={event} date={date} lang={lang} />
        ))}
      </div>
      <Link
        href={localizedPath(lang, "/repertuar")}
        className={cn(buttonVariants({ variant: "secondary", block: true }), "mt-10 sm:w-fit")}
      >
        {t.all}
      </Link>
    </Section>
  )
}

function withDate(event: FsEvent, today: string) {
  return { event, date: nextDate(event, `${today}T00:00`) ?? event.dates.at(-1)! }
}

/** 4. Polecamy (§7.1): 1 kafel wyróżniony (ścięty narożnik) + 2 mniejsze */
export function RecommendedSection({ today, lang }: { today: string; lang: Locale }) {
  const t = getDictionary(lang).home.recommended
  const featured = withDate(getEvent(recommended.featuredId, lang), today)
  const others = recommended.otherIds.map((id) => withDate(getEvent(id, lang), today))

  return (
    <Section aria-labelledby="polecamy">
      <SectionHeading id="polecamy" title={t.title} />
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-6">
        <EventCard event={featured.event} date={featured.date} lang={lang} variant="featured" lead={t.featuredLead} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6">
          {others.map(({ event, date }) => (
            <EventCard key={event.id} event={event} date={date} lang={lang} variant="compact" />
          ))}
        </div>
      </div>
    </Section>
  )
}

/** 5. Dla Ciebie (§6.18): „Pomóż mi wybrać” + kafle nastrojów */
export function ForYouSection({ lang, today }: { lang: Locale; today: string }) {
  const dict = getDictionary(lang)
  const t = dict.home.forYou
  // Ile wydarzeń czeka za kaflem – te same filtry co w kalendarzu (link kafla = adres z filtrami)
  const countFor = (href: string) => {
    const [path, query] = href.split("?")
    if (path !== "/repertuar") return undefined
    return dict.calendar.count(countRows(calendarDays(calendarEvents, parseFilters(new URLSearchParams(query)), today, dict)))
  }
  return (
    <Section tone="dark" aria-labelledby="dla-ciebie">
      {/* Jedyna czarna sekcja przed stopką: łamie rytm długiej białej strony i wyznacza „moment decyzji” */}
      <div className="mb-6 flex flex-col gap-2 lg:mb-8">
        <h2 id="dla-ciebie" className="type-h2 text-gold-on-dark">
          {t.title}
        </h2>
        <p className="type-body max-w-[68ch] text-on-dark">{t.lead}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <CtaTile
          eyebrow={t.cta.eyebrow}
          title={t.cta.title}
          description={t.cta.description}
          action={{ label: t.cta.action, href: localizedPath(lang, "/pomoz-mi-wybrac") }}
          inverse
        />
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {moodTiles.map(({ key, href }) => (
            <li key={key} className="flex">
              <LinkTile {...t.tiles[key]} href={localizedPath(lang, href)} meta={countFor(href)} dark className="flex-1" />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

/** Fragment ilustracji schodów (jedno piętro) – zastępuje brakujące zdjęcie budynku */
function BuildingVisual() {
  return (
    // Ilustracja ma proporcje 300 × 1010; kadr 3:2 pokazuje spód pierwszego piętra i balustradę drugiego (y ≈ 230–430)
    <div aria-hidden="true" className="absolute inset-x-0 top-[-115%] h-[505%]">
      <StairsArt shadowId="stairs-shadow-tile" />
    </div>
  )
}

/** 6. Odkryj Filharmonię (§6.18): 6 kafli, 2 × 3 na mobile, 3 × 2 na desktopie */
export function DiscoverSection({ lang }: { lang: Locale }) {
  const t = getDictionary(lang)
  return (
    <Section aria-labelledby="odkryj">
      <SectionHeading id="odkryj" title={t.home.discover.title} lead={t.home.discover.lead} />
      <FirstVisitRoute lang={lang} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-6">
        {discoverTiles.map(({ key, href, imageFromEventId }) => (
          <li key={key}>
            <DiscoverTile
              {...t.home.discover.tiles[key]}
              href={localizedPath(lang, href)}
              image={imageFromEventId ? getEvent(imageFromEventId).image?.card : undefined}
              placeholder={t.event.photoPlaceholder}
              visual={key === "building" ? <BuildingVisual /> : undefined}
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** 7a. Newsletter (§7.1): 1 pole + zgoda RODO */
export function NewsletterSection({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).home.newsletter
  return (
    <Section aria-labelledby="newsletter" className="pb-12">
      <SectionHeading id="newsletter" title={t.title} lead={t.lead} />
      <NewsletterForm lang={lang} />
    </Section>
  )
}

/**
 * 7b. Partnerzy (§7.1): logotypy w szarości z linkiem do narracji partnerstwa.
 * Plików logo partnerów nie ma w repo – pola zastępcze z przerywaną ramką.
 */
export function PartnersSection({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).home.partners
  // Bez zastępczych logotypów: do czasu materiałów od FS sekcja mówi, po co jest partnerstwo (brief §6.11–6.14)
  return (
    <Section aria-labelledby="partnerzy" className="border-t border-line pb-12">
      <SectionHeading id="partnerzy" title={t.title} lead={t.lead} as="h3" />
      <Link href={localizedPath(lang, "/partnerzy")} className={cn(buttonVariants({ variant: "secondary", block: true }), "sm:w-fit")}>
        {t.link}
      </Link>
      <FundersBar lang={lang} tone="light" className="mt-10" />
    </Section>
  )
}
