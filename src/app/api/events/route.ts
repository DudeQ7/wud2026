import { calendarEditorial } from "@/content/calendar"
import { calendarDays, countRows, parseFilters, toCalendarEvent } from "@/lib/calendar"
import { events, todayKey } from "@/lib/events"

// Repertuar po filtrach – te same parametry co w adresie /repertuar (kiedy, od, do, rodzaj, dla-kogo, wiek,
// miejsce, czas, nastroj, cykl, q) i ta sama logika (src/lib/calendar.ts), więc wyniki zgadzają się z UI.
export async function GET(request: Request) {
  const filters = parseFilters(new URL(request.url).searchParams)
  const days = calendarDays(
    events.map((event) => toCalendarEvent(event, calendarEditorial)),
    filters,
    todayKey(new Date())
  )

  return Response.json({ count: countRows(days), filters, days }, { headers: { "Cache-Control": "public, max-age=60" } })
}
