import koncerty from "@/data/koncerty.json"
import { calendarEditorial } from "@/content/calendar"
import { toCalendarEvent } from "@/lib/calendar"
import { type FsEvent, addDays, datesOn, nextDate } from "@/lib/event-format"

// Dane wydarzeń z koncerty.json. Ten moduł importuje cały plik danych, więc używamy go tylko
// po stronie serwera; komponenty klienckie biorą typ i formatowanie z @/lib/event-format.
export * from "@/lib/event-format"

type RawEvent = (typeof koncerty.events)[number]

const VENUE_NAMES: Record<string, string> = {
  "Sala symfoniczna": "Sala Symfoniczna",
  "Sala kameralna": "Sala Kameralna",
  "Galeria Poziom 4": "Galeria Poziom 4.",
  "Foyer sali symfonicznej": "Foyer Sali Symfonicznej",
}

// Krótka etykieta rodzaju do eyebrow: „Koncert dla dzieci z opiekunami (…)” → „Koncert dla dzieci”
function kindLabel(raw: RawEvent) {
  const label = raw.kind_label ?? raw.type
  const short = label.split(/ z opiekunami| \(| w wieku| od \d/)[0].trim()
  return short.charAt(0).toUpperCase() + short.slice(1)
}

function cleanTitle(title: string) {
  return title.replaceAll("\\*", "*").trim()
}

// Pierwszy pełny akapit opisu (min. 40 znaków) jako „dlaczego warto” – bez wymyślania treści.
function leadFrom(description?: string | null) {
  const paragraph = description
    ?.split(/\n+/)
    .map((p) => p.trim())
    .find((p) => p.length >= 40 && /[.!?]$/.test(p) && !p.startsWith("Orientacyjny") && !p.startsWith("W programie"))
  // Tylko pierwsze zdanie – „dlaczego warto” to maks. 3 linie (§6.5)
  const sentence = paragraph?.match(/^.{40,}?[.!?](?=\s|$)/)?.[0]
  return sentence && sentence.length <= 180 ? sentence : undefined
}

// Czas trwania z opisu, gdy brak go w polu duration_min: „Orientacyjny czas trwania koncertu: 50 minut”
function durationFrom(description?: string | null) {
  const minutes = description?.match(/czas trwania[^:\n]{0,20}:\s*(\d+)\s*minut/i)?.[1]
  return minutes ? Number(minutes) : undefined
}

function toEvent(raw: RawEvent): FsEvent {
  const title = cleanTitle(raw.title)
  const [headline, ...rest] = title.split(" | ")
  const images = raw.images ?? []
  const card = images.find((src) => src.includes("_midi")) ?? images[0]
  const large = images.find((src) => src.includes("_maxi")) ?? card

  return {
    id: raw.id,
    title,
    headline,
    subtitle: rest.length ? rest.join(" | ") : undefined,
    type: raw.type,
    kind: kindLabel(raw),
    kindLabel: raw.kind_label ?? undefined,
    age: raw.kind_label?.match(/wiek dziecka (\d+\+)/)?.[1],
    series: raw.series ?? undefined,
    venue: raw.venue
      .split(", ")
      .map((v) => VENUE_NAMES[v] ?? v)
      .join(", "),
    dates: raw.dates,
    durationMin: raw.duration_min ?? durationFrom(raw.description),
    artists: raw.artists ?? [],
    program: raw.program ?? [],
    prices: raw.prices_pln ?? [],
    ticketsUrl: raw.tickets_url,
    url: raw.url,
    image: card ? { card, large } : undefined,
    lead: leadFrom(raw.description),
  }
}

export const events: FsEvent[] = koncerty.events.map(toEvent)

export const venueInfo = koncerty.meta.venue_info

export function getEvent(id: number) {
  const event = events.find((e) => e.id === id)
  if (!event) throw new Error(`Brak wydarzenia ${id} w koncerty.json`)
  return event
}

// ——— Karta wydarzenia ———

export type EventDetails = {
  /** Opis podzielony na akapity, bez linii o czasie trwania (pokazujemy go osobno) */
  paragraphs: string[]
  /** Tylko gdy opis mówi to wprost */
  intermission?: "bez przerwy" | "z przerwą"
  /** „Kompozytor – utwór” z pola program */
  program: { composer?: string; work: string }[]
  /** „Imię Nazwisko – rola” z pola artists */
  artists: { name: string; role?: string }[]
}

export function eventDetails(id: number): EventDetails {
  const raw = koncerty.events.find((e) => e.id === id)
  const description = raw?.description ?? ""
  const paragraphs = description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !/^orientacyjny czas trwania/i.test(p))

  return {
    paragraphs,
    intermission: /bez przerwy/i.test(description) ? "bez przerwy" : /z przerwą/i.test(description) ? "z przerwą" : undefined,
    program: (raw?.program ?? [])
      .map((line) => line.replace(/^\\?-\s*/, "").trim())
      .filter(Boolean)
      .map((line) => {
        const [composer, ...work] = line.split(" - ")
        return work.length ? { composer, work: work.join(" - ") } : { work: line }
      }),
    artists: (raw?.artists ?? []).map((line) => {
      const [name, ...role] = line.split(" - ")
      return { name: name.trim(), role: role.join(" - ").trim() || undefined }
    }),
  }
}

/**
 * Podobne wydarzenia (§6.11 pkt 9): wspólny rodzaj, cykl i odbiorcy; pierwszeństwo dla polecanych przez FS.
 * Liczymy tylko nadchodzące terminy.
 */
export function similarEvents(event: FsEvent, fromKey: string, promotedIds: number[], limit = 3) {
  const base = toCalendarEvent(event, calendarEditorial).facets
  return events
    .filter((e) => e.id !== event.id)
    .map((e) => {
      const f = toCalendarEvent(e, calendarEditorial).facets
      const score =
        f.types.filter((t) => base.types.includes(t)).length * 2 +
        (f.seriesKey && f.seriesKey === base.seriesKey ? 3 : 0) +
        f.audiences.filter((a) => base.audiences.includes(a)).length * 2 +
        (promotedIds.includes(e.id) ? 2 : 0)
      return { event: e, date: nextDate(e, fromKey), score }
    })
    .filter((x): x is { event: FsEvent; date: string; score: number } => Boolean(x.date) && x.score > 0)
    .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date))
    .slice(0, limit)
}

// ——— Selekcja ———

/** Wiersze dnia: wydarzenie z jego godzinami w danym dniu, posortowane po pierwszej godzinie */
export function eventsOnDay(dayKey: string) {
  return events
    .map((event) => ({ event, times: datesOn(event, dayKey) }))
    .filter(({ times }) => times.length > 0)
    .sort((a, b) => a.times[0].localeCompare(b.times[0]))
}

const CONCERT_TYPES = new Set(["koncert", "edukacja/rodzinne"])

/** Najbliższy koncert od teraz – otwarcie strony głównej */
export function nextConcert(fromKey: string) {
  return events
    .filter((e) => e.type === "koncert")
    .map((event) => ({ event, date: nextDate(event, fromKey) }))
    .filter((x): x is { event: FsEvent; date: string } => Boolean(x.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0]
}

/** Najbliższe koncerty po podanym dniu (bez wystaw i zwiedzania), z pominięciem wskazanych id */
export function upcomingConcerts(afterDayKey: string, limit: number, excludeIds: number[] = []) {
  return events
    .filter((e) => CONCERT_TYPES.has(e.type) && !excludeIds.includes(e.id))
    .map((event) => ({ event, date: nextDate(event, `${addDays(afterDayKey, 1)}T00:00`) }))
    .filter((x): x is { event: FsEvent; date: string } => Boolean(x.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit)
}
