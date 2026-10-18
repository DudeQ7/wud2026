// Cenniki – MOCK systemu biletowego na czas prototypu (jak statusy w content/availability.ts).
// Docelowo cena „od–do” przychodzi z API iksoris (brief §8, model treści: „cena od–do”).
// W koncerty.json ceny ma tylko zwiedzanie („30/20 zł”), dlatego dla pozostałych wydarzeń
// przyjmujemy przykładowe progi według rodzaju. Moduł jest czysty (bez danych), więc działa też w przeglądarce.
// Dane strukturalne schema.org (lib/structured-data.ts) celowo NIE korzystają z mocka – tylko z prawdziwych cen.

import { getOverride } from "@/content/overrides-store"
import type { FsEvent } from "@/lib/event-format"

export type PriceInfo = { free: true } | { free: false; min: number; max: number }

type Rule = { test: (kind: string, type: string) => boolean; price: PriceInfo }

const range = (min: number, max = min): PriceInfo => ({ free: false, min, max })

// Kolejność ma znaczenie: pierwsza pasująca reguła wygrywa
const RULES: Rule[] = [
  { test: (_, type) => ["wernisaż", "debata", "dyskusja", "projekcja filmu", "wydarzenie"].includes(type), price: { free: true } },
  { test: (kind) => /wykład/.test(kind), price: { free: true } },
  { test: (_, type) => type === "wystawa", price: range(10) },
  { test: (kind) => /szkoln|uczniów|klas/.test(kind), price: range(15) },
  { test: (kind) => /roku życia/.test(kind), price: range(30) },
  { test: (kind, type) => type === "edukacja/rodzinne" || /dla dzieci|z opiekunami/.test(kind), price: range(25, 35) },
  { test: (kind) => /senior/.test(kind), price: range(20) },
  { test: (kind) => /jazz|muzyki świata/.test(kind), price: range(60, 120) },
  { test: (kind) => /kameraln|recital|muzyki dawnej/.test(kind), price: range(35, 60) },
  { test: (kind) => /symfoniczn/.test(kind), price: range(40, 90) },
  { test: (_, type) => type === "koncert", price: range(50, 110) },
]

function parse(prices: string[]): PriceInfo | undefined {
  const numbers = prices.flatMap((p) => p.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(",", ".")))
  if (!numbers.length) return undefined
  return range(Math.min(...numbers), Math.max(...numbers))
}

/** Cena wydarzenia: prawdziwa z danych, a gdy jej brak – z mocka cennika */
export function priceInfo(event: Pick<FsEvent, "id" | "prices" | "type" | "kind" | "kindLabel">): PriceInfo | undefined {
  // Nadpisanie z mini-CMS (Supabase) ma pierwszeństwo przed danymi i mockiem cennika
  const o = getOverride(event.id)
  if (o?.priceFree) return { free: true }
  if (o?.priceMin != null) return range(o.priceMin, o.priceMax ?? o.priceMin)
  const real = parse(event.prices)
  if (real) return real
  const kind = (event.kindLabel ?? event.kind).toLowerCase()
  const type = event.type.toLowerCase()
  return RULES.find((rule) => rule.test(kind, type))?.price
}

/** Najniższa cena w zł (0 = wstęp wolny) albo undefined, gdy nie wiadomo */
export function minPrice(event: Pick<FsEvent, "id" | "prices" | "type" | "kind" | "kindLabel">) {
  const info = priceInfo(event)
  return info ? (info.free ? 0 : info.min) : undefined
}
