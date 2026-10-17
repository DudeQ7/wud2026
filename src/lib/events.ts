import koncerty from "@/data/koncerty.json"
import { type Locale, locales } from "@/i18n/config"
import titlesDe from "@/i18n/events/de.json"
import titlesEn from "@/i18n/events/en.json"
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

/** „Artysta | Projekt” → nagłówek (artysta) i podtytuł (projekt) */
function splitTitle(raw: string) {
  const title = cleanTitle(raw)
  const [headline, ...rest] = title.split(" | ")
  return { title, headline, subtitle: rest.length ? rest.join(" | ") : undefined }
}

function toEvent(raw: RawEvent): FsEvent {
  const images = raw.images ?? []
  const card = images.find((src) => src.includes("_midi")) ?? images[0]
  const large = images.find((src) => src.includes("_maxi")) ?? card

  return {
    id: raw.id,
    ...splitTitle(raw.title),
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

/** Wydarzenia z polskimi tytułami – źródło dla filtrów, wyszukiwania, API i .ics */
export const events: FsEvent[] = koncerty.events.map(toEvent)

// Tłumaczenia tytułów (src/i18n/events/*.json, klucz = id). Wydarzenie bez tłumaczenia zostaje z tytułem z danych,
// więc nowe wydarzenia po odświeżeniu koncerty.json pokazują się po polsku, dopóki ktoś nie doda tłumaczenia.
const TITLES: Record<Exclude<Locale, "pl">, Record<string, string>> = { en: titlesEn, de: titlesDe }

/** Wydarzenie z tytułem w danym języku */
export function localizeEvent<T extends FsEvent>(event: T, lang: Locale): T {
  const title = lang === "pl" ? undefined : TITLES[lang][String(event.id)]
  return title ? { ...event, ...splitTitle(title) } : event
}

const eventsByLang = Object.fromEntries(
  locales.map((lang) => [lang, events.map((event) => localizeEvent(event, lang))])
) as Record<Locale, FsEvent[]>

export const venueInfo = koncerty.meta.venue_info

/** Wydarzenie po id albo undefined, gdy zniknęło z danych (np. zapisane w ulubionych, a już po terminie) */
export function findEvent(id: number, lang: Locale = "pl") {
  return eventsByLang[lang].find((e) => e.id === id)
}

export function getEvent(id: number, lang: Locale = "pl") {
  const event = eventsByLang[lang].find((e) => e.id === id)
  if (!event) throw new Error(`Brak wydarzenia ${id} w koncerty.json`)
  return event
}

// ——— Selekcja ———

/** Wiersze dnia: wydarzenie z jego godzinami w danym dniu, posortowane po pierwszej godzinie */
export function eventsOnDay(dayKey: string, lang: Locale = "pl") {
  return eventsByLang[lang]
    .map((event) => ({ event, times: datesOn(event, dayKey) }))
    .filter(({ times }) => times.length > 0)
    .sort((a, b) => a.times[0].localeCompare(b.times[0]))
}

const CONCERT_TYPES = new Set(["koncert", "edukacja/rodzinne"])

/** Najbliższy koncert od teraz – otwarcie strony głównej */
export function nextConcert(fromKey: string, lang: Locale = "pl") {
  return eventsByLang[lang]
    .filter((e) => e.type === "koncert")
    .map((event) => ({ event, date: nextDate(event, fromKey) }))
    .filter((x): x is { event: FsEvent; date: string } => Boolean(x.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0]
}

/** Najbliższe koncerty po podanym dniu (bez wystaw i zwiedzania), z pominięciem wskazanych id */
export function upcomingConcerts(afterDayKey: string, limit: number, excludeIds: number[] = [], lang: Locale = "pl") {
  return eventsByLang[lang]
    .filter((e) => CONCERT_TYPES.has(e.type) && !excludeIds.includes(e.id))
    .map((event) => ({ event, date: nextDate(event, `${addDays(afterDayKey, 1)}T00:00`) }))
    .filter((x): x is { event: FsEvent; date: string } => Boolean(x.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit)
}
