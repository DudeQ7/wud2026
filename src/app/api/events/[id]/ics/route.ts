import type { NextRequest } from "next/server"

import { events, nowKey } from "@/lib/events"
import { eventIcs } from "@/lib/ics"

// „Dodaj do kalendarza”: /api/events/2550/ics?date=2026-10-23T19:00 – bez `date` najbliższy przyszły termin.
export async function GET(request: NextRequest, ctx: RouteContext<"/api/events/[id]/ics">) {
  const { id } = await ctx.params
  const event = events.find((e) => String(e.id) === id)
  if (!event) return new Response("Nie ma takiego wydarzenia", { status: 404 })

  const requested = request.nextUrl.searchParams.get("date")
  const date = requested ?? event.dates.find((d) => d >= nowKey(new Date()))
  if (!date || !event.dates.includes(date)) return new Response("Nie ma takiego terminu", { status: 404 })

  return new Response(eventIcs(event, date), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="filharmonia-${event.id}-${date.slice(0, 10)}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
