import { type TicketStatus, ticketStatus } from "@/content/availability"
import { getOverride } from "@/content/overrides-store"
import { priceInfo } from "@/content/prices"
import type { FsEvent } from "@/lib/event-format"

// Punkt integracji z systemem biletowym (brief §8: „użyć mocka API; pokazać punkt integracji i obsługę statusów”).
// Dziś odpowiedź składa się z mini-CMS (/admin) i mocka (content/availability.ts, content/prices.ts);
// po podłączeniu iksoris wystarczy podmienić tę funkcję – kształt odpowiedzi API zostaje ten sam.

export type Availability = {
  eventId: number
  /** available = Dostępne, last = Ostatnie miejsca, soldout = Wyprzedane (design.md §6.8) */
  status: TicketStatus
  /** null = cena nieznana (nie zgadujemy) */
  price: { free: true } | { free: false; from: number; to: number; currency: "PLN" } | null
  buyUrl: string
  /** Skąd pochodzi status: wpis w mini-CMS albo mock do czasu iksoris */
  source: "cms" | "mock"
}

export function availability(event: Pick<FsEvent, "id" | "prices" | "type" | "kind" | "kindLabel" | "ticketsUrl">): Availability {
  const price = priceInfo(event)
  return {
    eventId: event.id,
    status: ticketStatus(event.id),
    price: !price ? null : price.free ? { free: true } : { free: false, from: price.min, to: price.max, currency: "PLN" },
    buyUrl: event.ticketsUrl,
    source: getOverride(event.id)?.ticketStatus ? "cms" : "mock",
  }
}
