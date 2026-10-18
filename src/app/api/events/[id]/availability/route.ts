import { events } from "@/lib/events"
import { loadOverrides } from "@/lib/overrides"
import { availability } from "@/lib/ticketing"

// Status biletów i cena jednego wydarzenia – kontrakt pod iksoris (src/lib/ticketing.ts).
// Krótki cache: status zmienia się w dniu startu sprzedaży szybciej niż reszta danych.
export async function GET(_request: Request, ctx: RouteContext<"/api/events/[id]/availability">) {
  const { id } = await ctx.params
  const event = events.find((e) => String(e.id) === id)
  if (!event) return Response.json({ error: "Nie ma takiego wydarzenia" }, { status: 404 })

  await loadOverrides()
  return Response.json(availability(event), { headers: { "Cache-Control": "public, max-age=15" } })
}
