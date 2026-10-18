import { minPrice } from "@/content/prices"
import type { Dictionary } from "@/i18n"
import { pl } from "@/i18n/dictionaries/pl"
// Polska odmiana – dla tekstów, które są tylko po polsku (wyszukiwarka, cykle)
export { plural } from "@/i18n/plural"
import {
  type FsEvent,
  addDays,
  formatDayMonth,
  formatLongDate,
  formatSeries,
  isExhibition,
  weekendKeys,
} from "@/lib/event-format"

// Kalendarz wydarzeń (brief §6.2, design.md §6.6–6.7). Filtry działają wyłącznie na tym,
// co da się wyprowadzić z koncerty.json – bez zgadywania cen, statusów biletów i nastrojów.
// Moduł jest czysty (bez danych), więc liczy wyniki zarówno na serwerze, jak i w przeglądarce.

// ——— Wartości filtrów ———
// Klucze = wartości w adresie URL (po polsku we wszystkich językach, żeby linki działały wszędzie).
// Etykiety są w słowniku: t.calendar.when, t.calendar.types itd.

const {
  when: WHEN,
  types: TYPES,
  audiences: AUDIENCES,
  places: PLACES,
  durations: DURATIONS,
  moods: MOODS,
  prices: PRICES,
} = pl.calendar

export type When = keyof typeof WHEN
export type EventType = keyof typeof TYPES
export type Audience = keyof typeof AUDIENCES
export type Place = keyof typeof PLACES
export type Duration = keyof typeof DURATIONS
export type Mood = keyof typeof MOODS
export type Price = keyof typeof PRICES

export type Filters = {
  kiedy?: When
  /** Zakres dat YYYY-MM-DD – zastępuje „kiedy” */
  od?: string
  do?: string
  rodzaj: EventType[]
  dlaKogo: Audience[]
  /** Wiek dziecka w latach */
  wiek?: number
  miejsce: Place[]
  czas?: Duration
  nastroj: Mood[]
  /** Próg najniższej ceny biletu */
  cena?: Price
  /** Klucz cyklu (slug nazwy) */
  cykl?: string
  /** Wykonawca, kompozytor, tytuł, cykl */
  q?: string
}

export const emptyFilters: Filters = { rodzaj: [], dlaKogo: [], miejsce: [], nastroj: [] }

/** sessionStorage: ostatnie filtry kalendarza („?rodzaj=jazz”) – dla „← Repertuar” na karcie wydarzenia */
export const LAST_CALENDAR_QUERY_KEY = "fs-repertuar-filtry"

// ——— Cechy wydarzenia (liczone raz, na serwerze) ———

export type Facets = {
  types: EventType[]
  audiences: Audience[]
  /** Zakres wieku dziecka z opisu rodzaju, np. „sugerowany wiek dziecka 5+” → 5–∞ */
  ageMin?: number
  ageMax?: number
  places: Place[]
  moods: Mood[]
  /** Czas trwania do filtra; wystawy są otwarte w godzinach galerii, więc pasują do każdego limitu */
  duration?: number | "dowolny"
  seriesKey?: string
  /** Najniższa cena w zł (0 = wstęp wolny) – ta sama, którą pokazuje wiersz („od 40 zł”); do czasu iksoris z mocka */
  price?: number
  /** Tekst do wyszukiwania: bez polskich znaków, małymi literami */
  search: string
}

export type CalendarEvent = FsEvent & { facets: Facets }

/**
 * Rodzaj „główny” do symbolu przy dacie: wydarzenie może mieć kilka rodzajów (koncert kameralny dla dzieci to
 * kameralny + edukacja), a symbol ma być jeden. Kolejność = co najbardziej odróżnia wydarzenie od zwykłego koncertu.
 */
export const PRIMARY_ORDER: EventType[] = [
  "edukacja",
  "jazz",
  "muzyka-swiata",
  "kameralny",
  "symfoniczny",
  "spotkania",
  "wystawa",
  "zwiedzanie",
]

export function primaryType(types: EventType[]): EventType | undefined {
  return PRIMARY_ORDER.find((type) => types.includes(type))
}

/** „Karłowicz” → „karlowicz” – wyszukiwanie bez polskich znaków (brief §6.6) */
export function fold(text: string) {
  return text
    .toLowerCase()
    .replaceAll("ł", "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}

export function seriesKey(series?: string) {
  const name = formatSeries(series)
  return name ? fold(name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : undefined
}

function ageRange(kindLabel: string): [number, number | undefined] | undefined {
  const plus = kindLabel.match(/wiek dziecka (\d+)\+/)
  if (plus) return [Number(plus[1]), undefined]
  const years = kindLabel.match(/od (\d+)\. do (\d+)\. roku/)
  if (years) return [Number(years[1]), Number(years[2])]
  if (/przedszkoln\w* i wczesnoszkoln/.test(kindLabel)) return [3, 9]
  if (/klas I–III i IV–VI/.test(kindLabel)) return [7, 12]
  if (/szkół podstawowych/.test(kindLabel)) return [7, 15]
  return undefined
}

type Editorial = {
  /** Wydarzenia z muzyką filmową – wybór redakcji (docelowo tag w CMS) */
  filmMusicIds: number[]
  /** „Klasyczne przeboje” – wybór redakcji (docelowo tag w CMS) */
  superHitIds: number[]
  /** Cykle polecane na pierwszą wizytę (nazwa cyklu małymi literami) */
  firstTimeSeries: RegExp
}

export function toCalendarEvent(event: FsEvent, editorial: Editorial): CalendarEvent {
  const kind = (event.kindLabel ?? event.kind).toLowerCase()
  const type = event.type.toLowerCase()
  const series = (event.series ?? "").toLowerCase()
  const venue = event.venue.toLowerCase()

  const audiences: Audience[] = []
  if (/dzieci|przedszkol|roku życia|uczniów|szkoln/.test(kind)) audiences.push("dzieci")
  if (/z opiekunami|rodzinn/.test(kind)) audiences.push("rodziny")
  if (/szkoln|uczniów|klas/.test(kind)) audiences.push("szkoly")
  if (/senior/.test(kind)) audiences.push("seniorzy")

  const types: EventType[] = []
  if (/symfoniczn/.test(kind)) types.push("symfoniczny")
  if (/kameraln|recital|muzyki dawnej/.test(kind)) types.push("kameralny")
  if (/jazz/.test(kind) || /jazz/.test(series)) types.push("jazz")
  if (/muzyki świata/.test(kind)) types.push("muzyka-swiata")
  if (
    type === "edukacja/rodzinne" ||
    type.startsWith("spektakl") ||
    audiences.includes("dzieci") ||
    /akademia młodego|eduwerwa|szkolne/.test(series)
  )
    types.push("edukacja")
  if (type === "wystawa" || type === "wernisaż") types.push("wystawa")
  if (type === "zwiedzanie") types.push("zwiedzanie")
  if (/fest\b/.test(series)) types.push("festiwal")
  if (["projekcja filmu", "debata", "dyskusja", "wydarzenie"].includes(type) || /wykład/.test(kind))
    types.push("spotkania")

  const places: Place[] = []
  if (venue.includes("symfoniczn")) places.push("symfoniczna")
  if (venue.includes("kameraln")) places.push("kameralna")
  if (venue.includes("galeria") || venue.includes("art.room")) places.push("galerie")
  if (venue.includes("hol") || venue.includes("foyer")) places.push("hol")

  // Nastroje jak w serwisach streamingowych (brief §6.2); te same reguły ma „Jaki klimat?” w kreatorze
  const moods: Mood[] = []
  if (editorial.superHitIds.includes(event.id)) moods.push("hity")
  if (types.includes("symfoniczny")) moods.push("emocje")
  const film = editorial.filmMusicIds.includes(event.id)
  if (film || types.includes("jazz") || types.includes("muzyka-swiata")) moods.push("energia")
  if (types.includes("kameralny")) moods.push("relaks")
  if (film) moods.push("filmowa")
  if (types.includes("spotkania") || types.includes("muzyka-swiata") || /muzyki dawnej/.test(kind))
    moods.push("niezwykle")

  // Dorośli = wszystko, co nie powstało dla dzieci i szkół (ta sama zasada co „Dla mnie” w kreatorze)
  if (!audiences.includes("dzieci") && !audiences.includes("szkoly")) {
    audiences.push("dorosli")
    if (moods.includes("hity") || film || editorial.firstTimeSeries.test(series)) audiences.push("debiutanci")
  }

  const range = event.kindLabel ? ageRange(event.kindLabel) : undefined

  return {
    ...event,
    facets: {
      types,
      audiences,
      ageMin: range?.[0],
      ageMax: range?.[1],
      places,
      moods,
      duration: isExhibition(event) ? "dowolny" : event.durationMin,
      seriesKey: seriesKey(event.series),
      price: minPrice(event),
      search: fold(
        [event.title, event.kindLabel, event.series, event.venue, ...event.artists, ...event.program].join(" ")
      ),
    },
  }
}

// ——— URL ⇄ filtry ———

const isKey = <T extends object>(options: T) => (value: string): value is Extract<keyof T, string> =>
  Object.hasOwn(options, value)

const list = <T extends object>(params: URLSearchParams, key: string, options: T) =>
  [...new Set((params.get(key) ?? "").split(",").filter(isKey(options)))]

const dayKey = (value: string | null) => (value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined)

export function parseFilters(params: URLSearchParams): Filters {
  const kiedy = params.get("kiedy") ?? ""
  const czas = params.get("czas") ?? ""
  const cena = params.get("cena") ?? ""
  const wiek = Number(params.get("wiek"))
  const od = dayKey(params.get("od"))
  const to = dayKey(params.get("do"))
  return {
    kiedy: !od && !to && isKey(WHEN)(kiedy) ? kiedy : undefined,
    od,
    do: to,
    rodzaj: list(params, "rodzaj", TYPES),
    dlaKogo: list(params, "dla-kogo", AUDIENCES),
    wiek: Number.isInteger(wiek) && wiek > 0 && wiek < 19 ? wiek : undefined,
    miejsce: list(params, "miejsce", PLACES),
    czas: isKey(DURATIONS)(czas) ? czas : undefined,
    nastroj: list(params, "nastroj", MOODS),
    cena: isKey(PRICES)(cena) ? cena : undefined,
    cykl: params.get("cykl") || undefined,
    q: params.get("q")?.trim() || undefined,
  }
}

/** Filtry → query string (bez „?”); kolejność kluczy stała, żeby linki były powtarzalne */
export function toQuery(filters: Filters) {
  const params = new URLSearchParams()
  const set = (key: string, value?: string | number) => value !== undefined && value !== "" && params.set(key, String(value))
  set("q", filters.q)
  set("kiedy", filters.kiedy)
  set("od", filters.od)
  set("do", filters.do)
  set("rodzaj", filters.rodzaj.join(","))
  set("dla-kogo", filters.dlaKogo.join(","))
  set("wiek", filters.wiek)
  set("miejsce", filters.miejsce.join(","))
  set("czas", filters.czas)
  set("nastroj", filters.nastroj.join(","))
  set("cena", filters.cena)
  set("cykl", filters.cykl)
  // Przecinki zostawiamy czytelne: ?rodzaj=jazz,kameralny
  return params.toString().replaceAll("%2C", ",")
}

/** Widok miesiąca w adresie (?widok=miesiac) – lista jest domyślna (§6.16), a „wstecz” wraca do wybranego widoku */
export const VIEW_PARAM = "widok"
export const MONTH_VIEW = "miesiac"

export type DisplayMode = "list" | "month"

export function withView(query: string, mode: DisplayMode) {
  if (mode !== "month") return query
  const view = `${VIEW_PARAM}=${MONTH_VIEW}`
  return query ? `${query}&${view}` : view
}

// ——— Dopasowanie ———

function dateWindow(filters: Filters, today: string): [string, string | undefined] {
  if (filters.od || filters.do) {
    const from = filters.od && filters.od > today ? filters.od : today
    return [from, filters.do]
  }
  switch (filters.kiedy) {
    case "dzis":
      return [today, today]
    case "jutro":
      return [addDays(today, 1), addDays(today, 1)]
    case "weekend": {
      const days = weekendKeys(today)
      return [days[0], days.at(-1)]
    }
    case "tydzien":
      return [today, addDays(today, 6)]
    case "miesiac":
      return [today, addDays(today, 30)]
    default:
      return [today, undefined]
  }
}

const some = <T>(selected: T[], values: T[]) => selected.length === 0 || selected.some((v) => values.includes(v))

function matchesDuration(duration: Facets["duration"], limit?: Duration) {
  if (!limit) return true
  if (duration === undefined) return false
  if (duration === "dowolny") return limit !== "dluzej"
  if (limit === "do-45-min") return duration <= 45
  if (limit === "do-90-min") return duration <= 90
  return duration > 90
}

function matchesAge({ ageMin, ageMax }: Facets, age?: number) {
  if (!age) return true
  if (ageMin === undefined) return false
  return age >= ageMin && (ageMax === undefined || age <= ageMax)
}

// Progi według danych: najniższe ceny to 0–60 zł, więc „do 50 / do 100 zł” z design.md nic by nie zawężały
const PRICE_LIMIT: Record<Price, number> = { bezplatne: 0, "do-20": 20, "do-40": 40 }

/** Wydarzenie bez znanej ceny nie pasuje do filtra ceny – nie obiecujemy progu, którego nie znamy */
function matchesPrice(price: number | undefined, limit?: Price) {
  if (!limit) return true
  return price !== undefined && price <= PRICE_LIMIT[limit]
}

export function matchesEvent(event: CalendarEvent, filters: Filters) {
  const f = event.facets
  if (!some(filters.rodzaj, f.types)) return false
  if (!some(filters.dlaKogo, f.audiences)) return false
  if (!matchesAge(f, filters.wiek)) return false
  if (!some(filters.miejsce, f.places)) return false
  if (!matchesDuration(f.duration, filters.czas)) return false
  if (!some(filters.nastroj, f.moods)) return false
  if (!matchesPrice(f.price, filters.cena)) return false
  if (filters.cykl && f.seriesKey !== filters.cykl) return false
  if (filters.q) {
    const words = fold(filters.q).split(/\s+/).filter(Boolean)
    if (!words.every((w) => f.search.includes(w))) return false
  }
  return true
}

export type CalendarRow = { event: CalendarEvent; times: string[] }
export type CalendarDay = { day: string; label: string; rows: CalendarRow[] }

/** Wiersze kalendarza pogrupowane po dniach (§6.7): jedno wydarzenie = jeden wiersz w danym dniu */
export function calendarDays(
  events: CalendarEvent[],
  filters: Filters,
  today: string,
  t: Dictionary = pl
): CalendarDay[] {
  const [from, to] = dateWindow(filters, today)
  const byDay = new Map<string, CalendarRow[]>()

  for (const event of events) {
    if (!matchesEvent(event, filters)) continue
    for (const date of event.dates) {
      const day = date.slice(0, 10)
      if (day < from || (to && day > to)) continue
      const rows = byDay.get(day) ?? []
      const row = rows.find((r) => r.event.id === event.id)
      if (row) row.times.push(date)
      else rows.push({ event, times: [date] })
      byDay.set(day, rows)
    }
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, rows]) => ({
      day,
      label: formatLongDate(day, t),
      rows: rows.sort((a, b) => a.times[0].localeCompare(b.times[0])),
    }))
}

/** Liczba terminów: wydarzenie w danym dniu (wystawa otwarta 30 dni to 30 terminów) */
export function countRows(days: CalendarDay[]) {
  return days.reduce((sum, d) => sum + d.rows.length, 0)
}

/** Liczba różnych wydarzeń – to pokazuje licznik wyników */
export function countEvents(days: CalendarDay[]) {
  return new Set(days.flatMap((d) => d.rows.map((r) => r.event.id))).size
}

// ——— Aktywne filtry (do usuwania pojedynczo i stanu „brak wyników”) ———

export type ActiveFilter = { id: string; label: string; remove: (f: Filters) => Filters }

export function activeFilters(filters: Filters, seriesLabels: Record<string, string>, t: Dictionary): ActiveFilter[] {
  const labels = t.calendar
  const result: ActiveFilter[] = []
  const without = <K extends keyof Filters>(key: K, value?: Filters[K]) => (f: Filters) => ({ ...f, [key]: value })

  if (filters.q) result.push({ id: "q", label: labels.quote(filters.q), remove: without("q") })
  if (filters.kiedy) result.push({ id: "kiedy", label: labels.when[filters.kiedy], remove: without("kiedy") })
  if (filters.od || filters.do) {
    const label = [filters.od && labels.rangeFrom(formatDayMonth(filters.od, t)), filters.do && labels.rangeTo(formatDayMonth(filters.do, t))]
      .filter(Boolean)
      .join(" ")
    result.push({ id: "zakres", label: label.charAt(0).toUpperCase() + label.slice(1), remove: (f) => ({ ...f, od: undefined, do: undefined }) })
  }
  const multi = <K extends "rodzaj" | "dlaKogo" | "miejsce" | "nastroj">(key: K, names: Record<Filters[K][number], string>) => {
    for (const value of filters[key] as Filters[K][number][]) {
      result.push({
        id: `${key}-${value}`,
        label: names[value],
        remove: (f) => ({ ...f, [key]: (f[key] as string[]).filter((v) => v !== value) }),
      })
    }
  }
  multi("rodzaj", labels.types)
  multi("dlaKogo", labels.audiences)
  if (filters.wiek) result.push({ id: "wiek", label: labels.age(filters.wiek), remove: without("wiek") })
  multi("miejsce", labels.places)
  if (filters.czas) result.push({ id: "czas", label: labels.durations[filters.czas], remove: without("czas") })
  multi("nastroj", labels.moods)
  if (filters.cena) result.push({ id: "cena", label: labels.prices[filters.cena], remove: without("cena") })
  if (filters.cykl) result.push({ id: "cykl", label: seriesLabels[filters.cykl] ?? filters.cykl, remove: without("cykl") })
  return result
}

/** Do 3 propozycji „bez tego filtra będzie X wyników” – najpierw te, które dają najwięcej */
export function alternatives(
  events: CalendarEvent[],
  filters: Filters,
  today: string,
  seriesLabels: Record<string, string>,
  t: Dictionary
) {
  return activeFilters(filters, seriesLabels, t)
    .map((filter) => {
      const relaxed = filter.remove(filters)
      return { filter, relaxed, count: countEvents(calendarDays(events, relaxed, today, t)) }
    })
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}
