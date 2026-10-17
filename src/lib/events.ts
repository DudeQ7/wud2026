import koncerty from "@/data/koncerty.json"

// Dane wydarzeń z koncerty.json. Daty są zapisane jako czas lokalny Szczecina („2026-10-19T19:00”),
// więc porównujemy je jako tekst (YYYY-MM-DD), bez konwersji stref – działa niezależnie od strefy serwera.

type RawEvent = (typeof koncerty.events)[number]

export type FsEvent = {
  id: number
  title: string
  /** Część tytułu przed „ | ” – np. nazwa artysty */
  headline: string
  /** Część tytułu po „ | ” – np. nazwa projektu */
  subtitle?: string
  type: string
  kind: string
  /** Wiek z opisu rodzaju, np. „5+” */
  age?: string
  series?: string
  venue: string
  dates: string[]
  durationMin?: number
  artists: string[]
  prices: string[]
  ticketsUrl: string
  url: string
  image?: { card: string; large: string }
  lead?: string
}

const TIME_ZONE = "Europe/Warsaw"

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
    age: raw.kind_label?.match(/wiek dziecka (\d+\+)/)?.[1],
    series: raw.series ?? undefined,
    venue: raw.venue
      .split(", ")
      .map((v) => VENUE_NAMES[v] ?? v)
      .join(", "),
    dates: raw.dates,
    durationMin: raw.duration_min ?? undefined,
    artists: raw.artists ?? [],
    prices: raw.prices_pln ?? [],
    ticketsUrl: raw.tickets_url,
    url: raw.url,
    image: card ? { card, large } : undefined,
    lead: leadFrom(raw.description),
  }
}

export const events: FsEvent[] = koncerty.events.map(toEvent)

export const venueInfo = koncerty.meta.venue_info

/** Galerie: „bilet 10 zł w wybrane soboty i niedziele 12:00–16:00” (venue_info.discounts) */
export const galleryInfo = { closes: "16:00", price: "bilet 10\u00a0zł" }

export function getEvent(id: number) {
  const event = events.find((e) => e.id === id)
  if (!event) throw new Error(`Brak wydarzenia ${id} w koncerty.json`)
  return event
}

// ——— Daty ———

/** Dzisiejsza data w Szczecinie jako YYYY-MM-DD */
export function todayKey(now: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now)
}

/** Aktualny czas w Szczecinie jako YYYY-MM-DDTHH:mm – porównywalny z datami w danych */
export function nowKey(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`
}

export function addDays(dayKey: string, days: number) {
  const date = new Date(`${dayKey}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function weekday(dayKey: string) {
  return new Date(`${dayKey}T12:00:00Z`).getUTCDay()
}

/** Dni najbliższego weekendu (w sobotę: sob + nd, w niedzielę: tylko nd) */
export function weekendKeys(dayKey: string) {
  const day = weekday(dayKey)
  if (day === 0) return [dayKey]
  const saturday = addDays(dayKey, 6 - day)
  return [saturday, addDays(saturday, 1)]
}

const dateFmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pl-PL", { ...options, timeZone: "UTC" })

const asUtc = (key: string) => new Date(`${key.slice(0, 10)}T12:00:00Z`)

// Skróty dni jak w kalendarzu FS: „pon 19.10”, „nd 22.11”
const WEEKDAYS_SHORT = ["nd", "pon", "wt", "śr", "czw", "pt", "sob"]

/** „PON 19.10” – znacznik daty na zdjęciu */
export function formatDateBadge(dateTime: string) {
  return formatShortDate(dateTime).toUpperCase()
}

/** „19.10” */
export function formatDayMonth(dateTime: string) {
  return dateFmt({ day: "2-digit", month: "2-digit" }).format(asUtc(dateTime))
}

/** „pon 19.10” */
export function formatShortDate(dateTime: string) {
  return `${WEEKDAYS_SHORT[asUtc(dateTime).getUTCDay()]} ${formatDayMonth(dateTime)}`
}

/** „Sobota, 17 października” */
export function formatLongDate(dayKey: string) {
  const text = dateFmt({ weekday: "long", day: "numeric", month: "long" }).format(asUtc(dayKey))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** „19:00” */
export function formatTime(dateTime: string) {
  return dateTime.slice(11, 16)
}

/** „1 h 40 min”, „50 min” */
export function formatDuration(minutes?: number) {
  if (!minutes) return undefined
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

/** „KONCERTY JAZZOWE 2026/2027” → „Koncerty jazzowe” */
export function formatSeries(series?: string) {
  if (!series) return undefined
  const name = series.replace(/\s*\d{4}\/\d{4}\s*$/, "").trim()
  return name === name.toUpperCase() ? name.charAt(0) + name.slice(1).toLowerCase() : name
}

// ——— Selekcja ———

export function datesOn(event: FsEvent, dayKey: string) {
  return event.dates.filter((d) => d.startsWith(dayKey))
}

export function nextDate(event: FsEvent, fromKey: string) {
  return event.dates.find((d) => d >= fromKey)
}

const GALLERY_TYPES = new Set(["wystawa"])

/** Wiersze dnia: wydarzenie z jego godzinami w danym dniu, posortowane po pierwszej godzinie */
export function eventsOnDay(dayKey: string) {
  return events
    .map((event) => ({ event, times: datesOn(event, dayKey) }))
    .filter(({ times }) => times.length > 0)
    .sort((a, b) => a.times[0].localeCompare(b.times[0]))
}

/** Ostatni termin wystawy – „Otwarta do 22.11” */
export function lastDate(event: FsEvent) {
  return event.dates.at(-1)
}

export function isExhibition(event: FsEvent) {
  return GALLERY_TYPES.has(event.type)
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

/** Etykieta składu: „Paulina Przybysz i 5 muzyków” */
export function formatLineup(event: FsEvent) {
  const [first, ...others] = event.artists.map((a) => a.split(" - ")[0].trim())
  if (!first) return undefined
  if (!others.length) return first
  return others.length === 1 ? `${first} i ${others[0]}` : `${first} i ${others.length} muzyków`
}
