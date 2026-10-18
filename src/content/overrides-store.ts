// Nadpisania z mini-CMS (Supabase `event_overrides`) – czysty magazyn bez zależności serwerowych,
// żeby availability.ts i prices.ts nadal działały też w przeglądarce (tam magazyn jest pusty = wartości domyślne).
// Wypełnia go `loadOverrides()` z src/lib/overrides.ts na początku renderu strony po stronie serwera.

export type OverrideStatus = "available" | "last" | "soldout"

export type EventOverride = {
  ticketStatus?: OverrideStatus
  priceFree?: boolean
  priceMin?: number
  priceMax?: number
  programPdf?: string
}

let store = new Map<number, EventOverride>()

export function setOverrides(next: Map<number, EventOverride>) {
  store = next
}

export function getOverride(eventId: number): EventOverride | undefined {
  return store.get(eventId)
}

/** Wpisy do przekazania komponentom klienckim (patrz OverridesHydrator) */
export function allOverrides(): [number, EventOverride][] {
  return [...store.entries()]
}
