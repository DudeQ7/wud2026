import { calendarEditorial } from "@/content/calendar"
import { getDictionary, hasLocale } from "@/i18n"
import { calendarDays, countRows, parseFilters, toCalendarEvent } from "@/lib/calendar"
import { events, todayKey } from "@/lib/events"
import { loadOverrides } from "@/lib/overrides"

// Repertuar po filtrach – te same parametry co w adresie /repertuar (kiedy, od, do, rodzaj, dla-kogo, wiek,
// miejsce, czas, nastroj, cena, cykl, q) i ta sama logika (src/lib/calendar.ts), więc wyniki zgadzają się z UI.
// ?lang=en|de – język etykiet dni (domyślnie polski).
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const filters = parseFilters(params)
  const lang = params.get("lang") ?? ""
  // Cena z mini-CMS ma pierwszeństwo przed mockiem – jak na stronie /repertuar
  await loadOverrides()
  const days = calendarDays(
    events.map((event) => toCalendarEvent(event, calendarEditorial)),
    filters,
    todayKey(new Date()),
    getDictionary(hasLocale(lang) ? lang : "pl")
  )

  return Response.json({ count: countRows(days), filters, days }, { headers: { "Cache-Control": "public, max-age=60" } })
}
