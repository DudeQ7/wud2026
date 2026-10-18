"use client"

import { type EventOverride, setOverrides } from "@/content/overrides-store"

/**
 * Komponenty kliencie (kalendarz, filtr „Dziś”) liczą status i cenę w przeglądarce, więc dostają tu te same
 * nadpisania z mini-CMS co serwer. Wstawiać przed komponentami, które z nich korzystają.
 */
export function OverridesHydrator({ entries }: { entries: [number, EventOverride][] }) {
  setOverrides(new Map(entries))
  return null
}
