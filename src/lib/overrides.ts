import { cacheLife, cacheTag } from "next/cache"

import { type EventOverride, type OverrideStatus, setOverrides } from "@/content/overrides-store"

type Row = {
  event_id: number
  ticket_status: OverrideStatus | null
  price_free: boolean | null
  price_min: number | null
  price_max: number | null
  program_pdf: string | null
}

export const OVERRIDES_TAG = "event-overrides"

// Odczyt z Supabase (REST, klucz publishable). Cache'owany i unieważniany przez updateTag(OVERRIDES_TAG)
// po zapisie w /admin, więc zmiana jest widoczna od razu. Błąd bazy = brak nadpisań (strona działa na danych z JSON-a).
async function fetchRows(): Promise<Row[]> {
  "use cache"
  cacheTag(OVERRIDES_TAG)
  cacheLife("hours")

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return []
  try {
    const res = await fetch(`${url}/rest/v1/event_overrides?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    return res.ok ? ((await res.json()) as Row[]) : []
  } catch {
    return []
  }
}

/** Wczytuje nadpisania do magazynu. Wołać na początku strony serwerowej, zanim komponenty zapytają o status lub cenę. */
export async function loadOverrides() {
  const rows = await fetchRows()
  const map = new Map<number, EventOverride>()
  for (const r of rows) {
    map.set(r.event_id, {
      ticketStatus: r.ticket_status ?? undefined,
      priceFree: r.price_free ?? undefined,
      priceMin: r.price_min ?? undefined,
      priceMax: r.price_max ?? undefined,
      programPdf: r.program_pdf ?? undefined,
    })
  }
  setOverrides(map)
  return map
}
