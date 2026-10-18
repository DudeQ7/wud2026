"use server"

import { updateTag } from "next/cache"

import { OVERRIDES_TAG } from "@/lib/overrides"

export type OverrideInput = {
  eventId: number
  ticketStatus: "available" | "last" | "soldout" | null
  priceFree: boolean | null
  priceMin: number | null
  priceMax: number | null
  programPdf: string | null
}

// Demo: zapis bez logowania (mock CMS + iksoris). Walidujemy kształt, a polityki RLS w Supabase są celowo otwarte.
export async function saveOverride(input: OverrideInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return { ok: false, error: "Brak konfiguracji Supabase" }
  if (!Number.isInteger(input.eventId)) return { ok: false, error: "Nieprawidłowe id wydarzenia" }
  const money = (v: number | null) => (v === null || (Number.isInteger(v) && v >= 0 && v <= 10000) ? v : undefined)
  if (money(input.priceMin) === undefined || money(input.priceMax) === undefined) return { ok: false, error: "Cena: liczba całkowita 0–10000" }
  if (input.programPdf && !/^https:\/\//.test(input.programPdf)) return { ok: false, error: "Adres PDF musi zaczynać się od https://" }

  const res = await fetch(`${url}/rest/v1/event_overrides?on_conflict=event_id`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      event_id: input.eventId,
      ticket_status: input.ticketStatus,
      price_free: input.priceFree,
      price_min: input.priceMin,
      price_max: input.priceMax,
      program_pdf: input.programPdf,
      updated_at: new Date().toISOString(),
    }),
  })
  if (!res.ok) return { ok: false, error: `Błąd zapisu (${res.status})` }

  // Strony czytają nadpisania przez cache z tym tagiem – po zapisie widać zmianę od razu
  updateTag(OVERRIDES_TAG)
  return { ok: true }
}
