import {
  type CalendarEvent,
  type EventType,
  type Filters,
  type Mood,
  calendarDays,
  emptyFilters,
  toQuery,
} from "@/lib/calendar"
import { minPrice } from "@/content/prices"
import type { FsEvent } from "@/lib/event-format"

// „Pomóż mi wybrać” (design.md §6.13): 5 pytań, każde można pominąć, wynik to 3–5 wydarzeń.
// Odpowiedzi żyją w adresie URL (?dla=rodzina&kiedy=weekend&krok=3), więc kreator działa jak zwykłe
// linki: bez JS, z działającym „wstecz” i z możliwością udostępnienia wyniku. Dopasowanie liczy
// wyłącznie na tym, co wynika z koncerty.json (daty, rodzaj, odbiorcy, ceny, jeśli są podane).

export type Option = { value: string; label: string; hint?: string }
export type Question = { key: AnswerKey; title: string; options: Option[] }

export const ANSWER_KEYS = ["dla", "kiedy", "rodzaj", "klimat", "budzet"] as const
export type AnswerKey = (typeof ANSWER_KEYS)[number]
export type Answers = Partial<Record<AnswerKey, string>>

export const QUESTIONS: Question[] = [
  {
    key: "dla",
    title: "Dla kogo?",
    options: [
      { value: "ja", label: "Dla mnie" },
      { value: "para", label: "Z bliską osobą", hint: "partner, przyjaciel, znajomy" },
      { value: "rodzina", label: "Z rodziną", hint: "dzieci i dorośli razem" },
      { value: "dziecko", label: "Dla dziecka" },
    ],
  },
  {
    key: "kiedy",
    title: "Kiedy?",
    options: [
      { value: "dzis", label: "Dziś" },
      { value: "weekend", label: "W ten weekend" },
      { value: "tydzien", label: "W najbliższych 7 dniach" },
      { value: "miesiac", label: "W najbliższym miesiącu" },
    ],
  },
  {
    key: "rodzaj",
    title: "Jaki rodzaj muzyki?",
    options: [
      { value: "symfoniczna", label: "Orkiestra symfoniczna" },
      { value: "kameralna", label: "Kameralnie", hint: "mały skład, blisko artystów" },
      { value: "jazz", label: "Jazz" },
      { value: "swiat", label: "Muzyka świata" },
      { value: "film", label: "Muzyka filmowa" },
    ],
  },
  {
    key: "klimat",
    title: "Jaki klimat?",
    options: [
      { value: "energia", label: "Coś energetycznego" },
      { value: "cisza", label: "Na wyciszenie" },
      { value: "emocje", label: "Wielkie emocje" },
      { value: "niezwykle", label: "Coś niezwykłego" },
    ],
  },
  {
    key: "budzet",
    title: "Jaki budżet?",
    options: [
      { value: "50", label: "Do 50 zł" },
      { value: "100", label: "Do 100 zł" },
      { value: "bez-limitu", label: "Bez limitu" },
    ],
  },
]

const questionOf = (key: AnswerKey) => QUESTIONS.find((q) => q.key === key)!

export const optionLabel = (key: AnswerKey, value: string) =>
  questionOf(key).options.find((o) => o.value === value)?.label

// ——— URL ⇄ odpowiedzi ———

const BASE = "/pomoz-mi-wybrac"

type RawParams = Record<string, string | string[] | undefined>

export function parseAnswers(params: RawParams): Answers {
  const answers: Answers = {}
  for (const { key, options } of QUESTIONS) {
    const raw = params[key]
    const value = Array.isArray(raw) ? raw[0] : raw
    if (value && options.some((o) => o.value === value)) answers[key] = value
  }
  return answers
}

/** Numer kroku 1–5 albo „wynik”; nieznana wartość zaczyna kreator od początku */
export function parseStep(params: RawParams): number | "wynik" {
  const raw = Array.isArray(params.krok) ? params.krok[0] : params.krok
  if (raw === "wynik") return "wynik"
  const step = Number(raw)
  return Number.isInteger(step) && step >= 1 && step <= QUESTIONS.length ? step : 1
}

export function wizardHref(answers: Answers, step: number | "wynik") {
  const params = new URLSearchParams()
  for (const key of ANSWER_KEYS) if (answers[key]) params.set(key, answers[key])
  if (step !== 1) params.set("krok", String(step))
  const qs = params.toString()
  return qs ? `${BASE}?${qs}` : BASE
}

export const nextStep = (step: number): number | "wynik" => (step >= QUESTIONS.length ? "wynik" : step + 1)

// ——— Dopasowanie ———

export type Match = { event: CalendarEvent; date: string; reasons: string[] }

// Wizard nie proponuje wystaw ani zwiedzania – to inna ścieżka niż „na jaki koncert pójść”
const CONCERT_TYPES: EventType[] = ["symfoniczny", "kameralny", "jazz", "muzyka-swiata", "edukacja", "festiwal", "spotkania"]

const RODZAJ: Record<string, { types: EventType[]; moods: Mood[] }> = {
  symfoniczna: { types: ["symfoniczny"], moods: [] },
  kameralna: { types: ["kameralny"], moods: [] },
  jazz: { types: ["jazz"], moods: [] },
  swiat: { types: ["muzyka-swiata"], moods: [] },
  film: { types: [], moods: ["filmowa"] },
}

// Klimat to wybór redakcji (docelowo tag w CMS): który rodzaj wydarzenia najczęściej go daje
const KLIMAT: Record<string, { types: EventType[]; moods: Mood[]; phrase: string }> = {
  energia: { types: ["jazz", "muzyka-swiata"], moods: ["filmowa"], phrase: "energetycznie" },
  cisza: { types: ["kameralny"], moods: [], phrase: "na wyciszenie" },
  emocje: { types: ["symfoniczny"], moods: [], phrase: "wielkie emocje" },
  niezwykle: { types: [], moods: ["niezwykle"], phrase: "coś niezwykłego" },
}

const KIEDY_PHRASE: Record<string, string> = {
  dzis: "dziś",
  weekend: "weekend",
  tydzien: "najbliższe 7 dni",
  miesiac: "najbliższy miesiąc",
}

/** Najniższa cena z pola prices_pln („30/20 zł” → 20); null, gdy dane nie podają ceny */
/** Najniższa cena w zł (0 = wstęp wolny); z danych albo z cennika (mock iksoris) */
export function lowestPrice(event: Pick<FsEvent, "prices" | "type" | "kind" | "kindLabel">) {
  return minPrice(event) ?? null
}

function toFilters(answers: Answers): Filters {
  const rodzaj = answers.rodzaj ? RODZAJ[answers.rodzaj] : undefined
  return {
    ...emptyFilters,
    kiedy: answers.kiedy as Filters["kiedy"],
    rodzaj: rodzaj?.types.length ? rodzaj.types : rodzaj ? [] : CONCERT_TYPES,
    dlaKogo: answers.dla === "rodzina" || answers.dla === "dziecko" ? ["rodziny", "dzieci"] : [],
    nastroj: rodzaj?.moods ?? [],
  }
}

/** Odpowiedzi → filtry kalendarza, żeby „Pokaż wszystkie w kalendarzu” prowadziło do tych samych wyników */
export function calendarHref(answers: Answers) {
  const filters = toFilters(answers)
  // Domyślna lista rodzajów to ukryte ograniczenie kreatora, a nie wybór osoby
  if (!answers.rodzaj) filters.rodzaj = []
  const qs = toQuery(filters)
  return qs ? `/repertuar?${qs}` : "/repertuar"
}

/** Wydarzenia pasujące do odpowiedzi: jeden wpis na wydarzenie, z najbliższym terminem w oknie czasu */
export function match(events: CalendarEvent[], answers: Answers, today: string): Match[] {
  const grownUps = answers.dla === "ja" || answers.dla === "para"
  const limit = answers.budzet && answers.budzet !== "bez-limitu" ? Number(answers.budzet) : undefined
  const klimat = answers.klimat ? KLIMAT[answers.klimat] : undefined
  const seen = new Set<number>()
  const result: Match[] = []

  for (const day of calendarDays(events, toFilters(answers), today)) {
    for (const { event } of day.rows) {
      if (seen.has(event.id)) continue
      const f = event.facets
      // Dla dorosłych pomijamy wydarzenia stworzone dla dzieci i szkół
      if (grownUps && (f.audiences.includes("dzieci") || f.audiences.includes("szkoly"))) continue
      // Cena znana i za wysoka odpada; brak ceny w danych nie wyklucza (nie zgadujemy)
      const price = lowestPrice(event)
      if (limit !== undefined && price !== null && price > limit) continue
      seen.add(event.id)
      const fits = klimat && (f.types.some((t) => klimat.types.includes(t)) || f.moods.some((m) => klimat.moods.includes(m)))
      result.push({ event, date: day.rows.find((r) => r.event.id === event.id)!.times[0], reasons: fits ? [klimat.phrase] : [] })
    }
  }
  return result
}

export type Suggestions = {
  matches: Match[]
  /** Gdy dokładnych wyników jest mniej niż 3: najbliższe propozycje po zluzowaniu jednego warunku */
  near?: { dropped: AnswerKey; matches: Match[] }
}

const MIN = 3
const MAX = 5

/** Wynik kreatora (§6.13): 3–5 propozycji; przy braku dopasowań – alternatywy i warunek, który je wykluczał */
export function suggest(events: CalendarEvent[], answers: Answers, today: string): Suggestions {
  const strict = rank(match(events, answers, today))
  if (strict.length >= MIN) return { matches: strict.slice(0, MAX) }

  const chosen = ANSWER_KEYS.filter((k) => answers[k])
  const best = chosen
    .map((dropped) => {
      const { [dropped]: _omit, ...relaxed } = answers
      const known = new Set(strict.map((m) => m.event.id))
      const extra = rank(match(events, relaxed, today)).filter((m) => !known.has(m.event.id))
      return { dropped, matches: extra }
    })
    .sort((a, b) => b.matches.length - a.matches.length)[0]

  return {
    matches: strict,
    near: best?.matches.length ? { dropped: best.dropped, matches: best.matches.slice(0, MAX - strict.length) } : undefined,
  }
}

/** Wyżej te, które pasują do klimatu, potem najbliższy termin */
function rank(matches: Match[]) {
  return [...matches].sort(
    (a, b) => Number(b.reasons.length > 0) - Number(a.reasons.length > 0) || a.date.localeCompare(b.date)
  )
}

/** „Pasuje do wyboru: weekend · jazz · energetycznie” – tylko to, co rzeczywiście wybrano */
export function reasonLine(answers: Answers, match: Match) {
  const parts = [
    answers.kiedy && KIEDY_PHRASE[answers.kiedy],
    answers.dla && optionLabel("dla", answers.dla)?.toLowerCase(),
    answers.rodzaj && optionLabel("rodzaj", answers.rodzaj)?.toLowerCase(),
    ...match.reasons,
    answers.budzet && answers.budzet !== "bez-limitu" && lowestPrice(match.event) !== null
      ? `do ${answers.budzet} zł`
      : undefined,
  ].filter(Boolean)
  return parts.length ? `Pasuje do wyboru: ${parts.join(" · ")}` : undefined
}

export const DROPPED_LABEL: Record<AnswerKey, string> = {
  dla: "Dla kogo",
  kiedy: "Kiedy",
  rodzaj: "Rodzaj muzyki",
  klimat: "Klimat",
  budzet: "Budżet",
}
