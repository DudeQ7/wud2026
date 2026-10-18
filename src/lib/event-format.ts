// Typ wydarzenia i czyste funkcje dat i formatowania – bez importu koncerty.json,
// więc mogą trafić do komponentów klienckich bez dociągania całych danych do paczki JS.
// Daty są zapisane jako czas lokalny Szczecina („2026-10-19T19:00”), więc porównujemy je
// jako tekst (YYYY-MM-DD), bez konwersji stref – działa niezależnie od strefy serwera.
// Funkcje z tekstem dla użytkownika biorą słownik języka (`t`) – formaty dat i łączniki z niego.

import type { Dictionary } from "@/i18n"

export type FsEvent = {
  id: number
  title: string
  /** Część tytułu przed „ | ” – np. nazwa artysty */
  headline: string
  /** Część tytułu po „ | ” – np. nazwa projektu */
  subtitle?: string
  type: string
  kind: string
  /** Pełny opis rodzaju z danych, np. „Koncert dla dzieci z opiekunami (sugerowany wiek dziecka 5+)” */
  kindLabel?: string
  /** Wiek z opisu rodzaju, np. „5+” */
  age?: string
  series?: string
  venue: string
  dates: string[]
  durationMin?: number
  artists: string[]
  program: string[]
  prices: string[]
  ticketsUrl: string
  url: string
  /** Program koncertu do pobrania (PDF z danych FS); brak = tylko wersja online na stronie */
  programPdf?: string
  image?: { card: string; large: string }
  lead?: string
}

const TIME_ZONE = "Europe/Warsaw"

/** Galerie: „bilet 10 zł w wybrane soboty i niedziele 12:00–16:00” (venue_info.discounts) */
export const galleryInfo = { closes: "16:00", price: "bilet 10 zł" }

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

export function weekday(dayKey: string) {
  return new Date(`${dayKey}T12:00:00Z`).getUTCDay()
}

/** Dni najbliższego weekendu (w sobotę: sob + nd, w niedzielę: tylko nd) */
export function weekendKeys(dayKey: string) {
  const day = weekday(dayKey)
  if (day === 0) return [dayKey]
  const saturday = addDays(dayKey, 6 - day)
  return [saturday, addDays(saturday, 1)]
}

const dateFmt = (t: Dictionary, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(t.intl, { ...options, timeZone: "UTC" })

const asUtc = (key: string) => new Date(`${key.slice(0, 10)}T12:00:00Z`)

/** „PON 19.10” – znacznik daty na zdjęciu */
export function formatDateBadge(dateTime: string, t: Dictionary) {
  return formatShortDate(dateTime, t).toUpperCase()
}

/** „19.10” (EN: „19/10”) */
export function formatDayMonth(dateTime: string, t: Dictionary) {
  return dateFmt(t, { day: "2-digit", month: "2-digit" }).format(asUtc(dateTime))
}

/** „pon 19.10” – skróty dni jak w kalendarzu FS */
export function formatShortDate(dateTime: string, t: Dictionary) {
  return `${t.weekdaysShort[asUtc(dateTime).getUTCDay()]} ${formatDayMonth(dateTime, t)}`
}

/** „Sobota, 17 października” */
export function formatLongDate(dayKey: string, t: Dictionary) {
  const text = dateFmt(t, { weekday: "long", day: "numeric", month: "long" }).format(asUtc(dayKey))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** „dziś” / „jutro” dla terminu przypadającego dziś lub jutro, inaczej undefined (wtedy pokazujemy datę) */
export function relativeDay(dateTime: string, today: string, t: Dictionary) {
  const day = dateTime.slice(0, 10)
  if (day === today) return t.home.today.tabs.today.when
  if (day === addDays(today, 1)) return t.home.today.tabs.tomorrow.when
  return undefined
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
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

/** „KONCERTY JAZZOWE 2026/2027” → „Koncerty jazzowe” */
export function formatSeries(series?: string) {
  if (!series) return undefined
  const name = series.replace(/\s*\d{4}\/\d{4}\s*$/, "").trim()
  return name === name.toUpperCase() ? name.charAt(0) + name.slice(1).toLowerCase() : name
}

// ——— Adres karty wydarzenia ———

/** „Mitch&Mitch | Amore assoluto per Ennio” → „2601-mitch-mitch-amore-assoluto-per-ennio” */
export function eventSlug(event: Pick<FsEvent, "id" | "title">) {
  const words = event.title
    .toLowerCase()
    .replaceAll("ł", "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/, "")
  return `${event.id}-${words}`
}

/** Karta wydarzenia w serwisie (§6.11) */
export function eventHref(event: Pick<FsEvent, "id" | "title">) {
  return `/wydarzenia/${eventSlug(event)}`
}

/**
 * „Kup bilet” w serwisie: ekran zakupu (w prototypie makieta przed obecną kasą online FS, docelowo API iksoris).
 * Wystarczy samo id („/kup-bilet/2608”) – tekst po id jest tylko dla ludzi, jak w adresie wydarzenia.
 */
export function ticketHref(event: Pick<FsEvent, "id"> & Partial<Pick<FsEvent, "title">>) {
  return `/kup-bilet/${event.title ? eventSlug({ id: event.id, title: event.title }) : event.id}`
}

/** Id z adresu – tekst po id jest tylko dla ludzi i SEO */
export function eventIdFromSlug(slug: string) {
  const id = Number(slug.match(/^\d+/)?.[0])
  return Number.isInteger(id) ? id : undefined
}

/** „19:00–20:50” – godzina zakończenia z czasu trwania */
export function formatTimeRange(dateTime: string, minutes?: number) {
  const start = formatTime(dateTime)
  if (!minutes) return start
  const [h, m] = start.split(":").map(Number)
  const end = h * 60 + m + minutes
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${start}–${pad(Math.floor(end / 60) % 24)}:${pad(end % 60)}`
}

// ——— Pojedyncze wydarzenie ———

export function datesOn(event: FsEvent, dayKey: string) {
  return event.dates.filter((d) => d.startsWith(dayKey))
}

export function nextDate(event: FsEvent, fromKey: string) {
  return event.dates.find((d) => d >= fromKey)
}

/** Ostatni termin wystawy – „Otwarta do 22.11” */
export function lastDate(event: FsEvent) {
  return event.dates.at(-1)
}

const GALLERY_TYPES = new Set(["wystawa"])

export function isExhibition(event: FsEvent) {
  return GALLERY_TYPES.has(event.type)
}

/** Etykieta składu: „Paulina Przybysz i 5 muzyków” */
export function formatLineup(event: FsEvent, t: Dictionary) {
  const [first, ...others] = event.artists.map((a) => a.split(" - ")[0].trim())
  if (!first) return undefined
  if (!others.length) return first
  return others.length === 1 ? t.event.lineupPair(first, others[0]) : t.event.lineupMany(first, others.length)
}
