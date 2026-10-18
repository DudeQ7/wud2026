import { connection } from "next/server"

import { events } from "@/lib/events"

import { AdminClient, type AdminEvent } from "./AdminClient"

// Strona czyta stan z bazy przy każdym żądaniu (jak app/analityka)
export const instant = false

// Mini-CMS (demo hackathonowe): edycja statusu biletów, ceny i programu PDF. Odczyt bez cache, żeby formularz pokazywał stan z bazy.
export default async function AdminPage() {
  await connection()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  let rows: Record<string, unknown>[] = []
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/event_overrides?select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      })
      if (res.ok) rows = await res.json()
    } catch {}
  }
  const byId = new Map(rows.map((r) => [r.event_id as number, r]))

  const list: AdminEvent[] = events.map((e) => {
    const o = byId.get(e.id)
    return {
      id: e.id,
      title: e.title,
      kind: e.kind,
      firstDate: e.dates[0],
      override: {
        ticketStatus: (o?.ticket_status as AdminEvent["override"]["ticketStatus"]) ?? null,
        priceFree: (o?.price_free as boolean | null) ?? null,
        priceMin: (o?.price_min as number | null) ?? null,
        priceMax: (o?.price_max as number | null) ?? null,
        programPdf: (o?.program_pdf as string | null) ?? null,
      },
    }
  })

  return <AdminClient events={list} />
}
