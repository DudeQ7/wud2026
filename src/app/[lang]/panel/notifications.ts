import { mockTickets } from "@/content/tickets"
import { ticketStatus } from "@/content/availability"
import type { Dictionary, Locale } from "@/i18n"
import { findEvent } from "@/lib/events"
import { eventHref, nextDate, todayKey } from "@/lib/event-format"
import { localizedPath } from "@/i18n"

export type PanelNotification = {
  id: string
  text: string
  /** Przyciski pod komunikatem: etykieta + adres (ostatni = główny, jeśli `primary`) */
  actions: { label: string; href: string; primary?: boolean; external?: boolean }[]
}

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to.slice(0, 10)}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000)

/**
 * Powiadomienia z tego, co już mamy: ulubione, które kończą się lub wyprzedały, oraz przypomnienia o biletach.
 * Docelowo zasila je iksoris i zadanie w tle (tabela `event_notifications`).
 */
export function buildNotifications(favoriteIds: number[], lang: Locale, t: Dictionary): PanelNotification[] {
  const n = t.panel.notifications
  const today = todayKey(new Date())
  const result: PanelNotification[] = []

  for (const ticket of mockTickets) {
    const event = findEvent(ticket.eventId, lang)
    const date = event && nextDate(event, today)
    if (!event || !date) continue
    const days = daysBetween(today, date)
    if (days < 0 || days > 7) continue
    const when = days === 0 ? n.today : days === 1 ? n.tomorrow : n.inDays(days)
    result.push({
      id: `reminder-${ticket.id}`,
      text: n.reminder(event.title, when),
      actions: [{ label: n.planVisit, href: localizedPath(lang, "/planuj-wizyte"), primary: true }],
    })
  }

  for (const id of favoriteIds) {
    const event = findEvent(id, lang)
    if (!event || !nextDate(event, today)) continue
    const status = ticketStatus(id)
    if (status === "available") continue
    const href = localizedPath(lang, eventHref(event))
    result.push({
      id: `${status}-${id}`,
      text: status === "last" ? n.almostSold(event.title) : n.soldOut(event.title),
      actions:
        status === "last" && event.ticketsUrl
          ? [
              { label: n.details, href },
              { label: n.buy, href: event.ticketsUrl, primary: true, external: true },
            ]
          : [{ label: n.details, href }],
    })
  }

  return result
}
