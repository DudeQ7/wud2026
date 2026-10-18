import { type CalendarEvent, type Filters, calendarDays, emptyFilters, fold } from "@/lib/calendar"
import { type EventDetails } from "@/lib/events"

// Wyszukiwarka (design.md §6.15): wydarzenia, artyści, utwory, teksty. Działa na danych z koncerty.json,
// bez polskich znaków i z tolerancją literówek. Proste intencje („jazz w październiku”) zamienia na
// filtry kalendarza – to namiastka wyszukiwania semantycznego z briefu, docelowo silnik z embeddingami.

export type SearchDoc = {
  event: CalendarEvent
  details: Pick<EventDetails, "paragraphs" | "artists" | "program">
}

export type Hit<T> = { item: T; event: CalendarEvent }
export type Results = {
  events: { event: CalendarEvent; date: string }[]
  artists: { name: string; role?: string; events: CalendarEvent[] }[]
  works: { composer?: string; work: string; event: CalendarEvent }[]
  texts: { snippet: string; event: CalendarEvent }[]
  /** Rozpoznane intencje do pokazania nad wynikami, np. „Jazz”, „październik” */
  understood: string[]
}

// ——— Tolerancja literówek ———

function distance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 3
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = row
  }
  return prev[b.length]
}

const words = (text: string) => fold(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean)

/** Słowo zapytania pasuje, gdy jest początkiem/częścią słowa albo różni się o 1–2 znaki */
function tokenMatches(token: string, haystack: string[]) {
  const tolerance = token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0
  return haystack.some(
    (w) =>
      w.startsWith(token) ||
      (token.length >= 4 && w.includes(token)) ||
      (tolerance > 0 && (distance(token, w) <= tolerance || distance(token, w.slice(0, token.length)) <= tolerance))
  )
}

const matchesAll = (tokens: string[], text: string) => {
  const hay = words(text)
  return tokens.every((t) => tokenMatches(t, hay))
}

// ——— Intencje ———

const MONTHS = ["styczn", "luty", "marz", "kwiet", "maj", "czerw", "lip", "sierp", "wrzes", "pazdziernik", "listopad", "grud"]
const MONTH_NAMES = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"]

const KEYWORDS: Record<string, { label: string; apply: (f: Filters) => Filters }> = {
  jazz: { label: "Jazz", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "jazz"] }) },
  jazzowy: { label: "Jazz", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "jazz"] }) },
  джаз: { label: "Джаз", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "jazz"] }) },
  wystawa: { label: "Wystawy", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  wystawy: { label: "Wystawy", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  exhibition: { label: "Exhibitions", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  exhibitions: { label: "Exhibitions", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  ausstellung: { label: "Ausstellungen", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  ausstellungen: { label: "Ausstellungen", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  виставка: { label: "Виставки", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  виставки: { label: "Виставки", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "wystawa"] }) },
  dzieci: { label: "Dla dzieci", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "dzieci"] }) },
  dziecko: { label: "Dla dzieci", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "dzieci"] }) },
  children: { label: "For children", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "dzieci"] }) },
  kids: { label: "For children", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "dzieci"] }) },
  kinder: { label: "Für Kinder", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "dzieci"] }) },
  діти: { label: "Для дітей", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "dzieci"] }) },
  дітей: { label: "Для дітей", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "dzieci"] }) },
  rodzinny: { label: "Dla rodzin", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "rodziny"] }) },
  family: { label: "For families", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "rodziny"] }) },
  families: { label: "For families", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "rodziny"] }) },
  familie: { label: "Für Familien", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "rodziny"] }) },
  familien: { label: "Für Familien", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "rodziny"] }) },
  родина: { label: "Для родин", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "rodziny"] }) },
  родини: { label: "Для родин", apply: (f) => ({ ...f, dlaKogo: [...f.dlaKogo, "rodziny"] }) },
  kameralny: { label: "Kameralny", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "kameralny"] }) },
  chamber: { label: "Chamber", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "kameralny"] }) },
  kammermusik: { label: "Kammermusik", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "kameralny"] }) },
  камерний: { label: "Камерний", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "kameralny"] }) },
  symfoniczny: { label: "Symfoniczny", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "symfoniczny"] }) },
  symphonic: { label: "Symphonic", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "symfoniczny"] }) },
  sinfonisch: { label: "Sinfonisch", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "symfoniczny"] }) },
  симфонічний: { label: "Симфонічний", apply: (f) => ({ ...f, rodzaj: [...f.rodzaj, "symfoniczny"] }) },
  weekend: { label: "Ten weekend", apply: (f) => ({ ...f, kiedy: "weekend" }) },
  wochenende: { label: "Dieses Wochenende", apply: (f) => ({ ...f, kiedy: "weekend" }) },
  вихідні: { label: "Ці вихідні", apply: (f) => ({ ...f, kiedy: "weekend" }) },
  dzis: { label: "Dziś", apply: (f) => ({ ...f, kiedy: "dzis" }) },
  today: { label: "Today", apply: (f) => ({ ...f, kiedy: "dzis" }) },
  heute: { label: "Heute", apply: (f) => ({ ...f, kiedy: "dzis" }) },
  сьогодні: { label: "Сьогодні", apply: (f) => ({ ...f, kiedy: "dzis" }) },
  jutro: { label: "Jutro", apply: (f) => ({ ...f, kiedy: "jutro" }) },
  tomorrow: { label: "Tomorrow", apply: (f) => ({ ...f, kiedy: "jutro" }) },
  morgen: { label: "Morgen", apply: (f) => ({ ...f, kiedy: "jutro" }) },
  завтра: { label: "Завтра", apply: (f) => ({ ...f, kiedy: "jutro" }) },
}

const STOP_WORDS = new Set(["w", "na", "i", "z", "dla", "o", "in", "for", "and", "fur", "am", "im", "для", "у", "в", "на", "і", "та"])

function parseIntent(tokens: string[], today: string) {
  let filters: Filters = { ...emptyFilters }
  const understood: string[] = []
  const rest: string[] = []
  const year = Number(today.slice(0, 4))
  const month = Number(today.slice(5, 7)) - 1

  for (const token of tokens) {
    const monthIndex = token.length >= 4 ? MONTHS.findIndex((m) => token.startsWith(m)) : -1
    if (monthIndex >= 0) {
      const y = monthIndex < month ? year + 1 : year
      const m = String(monthIndex + 1).padStart(2, "0")
      const last = new Date(Date.UTC(y, monthIndex + 1, 0)).getUTCDate()
      filters = { ...filters, od: `${y}-${m}-01`, do: `${y}-${m}-${last}` }
      understood.push(MONTH_NAMES[monthIndex])
    } else if (KEYWORDS[token]) {
      filters = KEYWORDS[token].apply(filters)
      if (!understood.includes(KEYWORDS[token].label)) understood.push(KEYWORDS[token].label)
    } else if (!STOP_WORDS.has(token)) rest.push(token)
  }
  return { filters, understood, rest }
}

// ——— Wyszukiwanie ———

const LIMITS = { events: 12, artists: 8, works: 8, texts: 6 }

function snippet(paragraph: string, tokens: string[]) {
  const hay = fold(paragraph)
  const at = tokens.map((t) => hay.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0
  const start = Math.max(0, paragraph.lastIndexOf(" ", Math.max(0, at - 50)))
  const text = paragraph.slice(start, start + 180).trim()
  return `${start > 0 ? "… " : ""}${text}${start + 180 < paragraph.length ? " …" : ""}`
}

export function search(docs: SearchDoc[], query: string, today: string): Results {
  const tokens = words(query)
  const { filters, understood, rest } = parseIntent(tokens, today)
  const hasIntent = understood.length > 0

  // Wydarzenia: intencje przez filtry kalendarza, reszta słów przez tytuł, wykonawców i program
  const dated = new Map<number, string>()
  for (const day of calendarDays(
    docs.map((d) => d.event),
    filters,
    today
  )) {
    for (const row of day.rows) if (!dated.has(row.event.id)) dated.set(row.event.id, row.times[0])
  }
  const events = docs
    .filter(({ event }) => dated.has(event.id) && (!rest.length || matchesAll(rest, event.facets.search)))
    .map(({ event }) => ({ event, date: dated.get(event.id)! }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Artyści, utwory i teksty szukają tylko po słowach, które nie są intencją
  const textTokens = rest
  const artists = new Map<string, { name: string; role?: string; events: CalendarEvent[] }>()
  const works: Results["works"] = []
  const texts: Results["texts"] = []

  if (textTokens.length) {
    for (const { event, details } of docs) {
      for (const a of details.artists) {
        if (!matchesAll(textTokens, a.name)) continue
        const entry = artists.get(fold(a.name)) ?? { name: a.name, role: a.role, events: [] }
        entry.events.push(event)
        artists.set(fold(a.name), entry)
      }
      for (const p of details.program) {
        if (matchesAll(textTokens, `${p.composer ?? ""} ${p.work}`)) works.push({ ...p, event })
      }
      const paragraph = details.paragraphs.find((p) => textTokens.every((t) => fold(p).includes(t)))
      if (paragraph) texts.push({ snippet: snippet(paragraph, textTokens), event })
    }
  }

  return {
    events: events.slice(0, LIMITS.events * 10),
    artists: [...artists.values()].slice(0, LIMITS.artists * 10),
    works: works.slice(0, LIMITS.works * 10),
    texts: texts.slice(0, LIMITS.texts * 10),
    understood: hasIntent ? understood : [],
  }
}

export const total = (r: Results) => r.events.length + r.artists.length + r.works.length + r.texts.length

export const GROUP_LIMITS = LIMITS
