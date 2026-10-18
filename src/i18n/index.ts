import { formatSeries } from "@/lib/event-format"

import type { Locale } from "./config"
import { de } from "./dictionaries/de"
import { en } from "./dictionaries/en"
import { type Dictionary, pl } from "./dictionaries/pl"
import { uk } from "./dictionaries/uk"

export * from "./config"
export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { pl, en, de, uk }

/**
 * Słownik interfejsu dla danego języka. Synchroniczny, żeby działał tak samo w komponentach
 * serwerowych i klienckich (te dostają `lang` jako prop – słowniki są małe, ładujemy wszystkie).
 */
export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang]
}

/** Rodzaj wydarzenia z koncerty.json w języku interfejsu (gdy brak tłumaczenia – tekst z danych) */
export function kindLabel(t: Dictionary, kind: string) {
  return t.event.kinds[kind] ?? kind
}

/** Nazwa cyklu bez sezonu, w języku interfejsu: „KONCERTY JAZZOWE 2026/2027” → „Jazz concerts” */
export function seriesLabel(t: Dictionary, series?: string) {
  const name = formatSeries(series)
  return name && (t.event.series[name] ?? name)
}

/** „Sala Kameralna, Galeria Poziom 4.” → „Chamber Hall, Poziom 4 Gallery” */
export function venueLabel(t: Dictionary, venue: string) {
  return venue
    .split(", ")
    .map((v) => t.event.venues[v] ?? v)
    .join(", ")
}
