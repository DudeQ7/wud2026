import { events } from "@/lib/events"
import { loadOverrides } from "@/lib/overrides"
import { availability } from "@/lib/ticketing"

// Jedno wydarzenie ze wszystkimi terminami (także minionymi, jeśli są w danych)
export async function GET(_request: Request, ctx: RouteContext<"/api/events/[id]">) {
  const { id } = await ctx.params
  const event = events.find((e) => String(e.id) === id)
  if (!event) return Response.json({ error: "Nie ma takiego wydarzenia" }, { status: 404 })

  await loadOverrides()
  return Response.json(
    {
      ...event,
      availability: availability(event),
      links: {
        ics: `/api/events/${event.id}/ics`,
        availability: `/api/events/${event.id}/availability`,
        tickets: event.ticketsUrl,
        source: event.url,
      },
    },
    { headers: { "Cache-Control": "public, max-age=60" } }
  )
}
