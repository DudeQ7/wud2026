// Status biletów – MOCK na czas prototypu. Docelowo pochodzi z API iksoris (brief §8).
// Nie zapisujemy go w koncerty.json, bo ten plik jest generowany przez scraper i zostałby nadpisany.
// Brak wpisu = „Dostępne”.

import { getOverride } from "@/content/overrides-store";

export type TicketStatus = "available" | "last" | "soldout";

const mock: Record<number, TicketStatus> = {
  // Otwarcie strony głównej i początek ścieżki A
  2608: "last",
  // Najbliższe wydarzenia i wyniki kreatora
  2550: "available",
  2551: "available",
  2555: "last",
  2558: "available",
  2597: "available",
  // Przykład wyprzedanego wydarzenia na liście i w kalendarzu
  2601: "soldout",
  2609: "available",
  2610: "available",
  2655: "available",
  // Zwiedzanie
  2656: "available",
};

export function ticketStatus(eventId: number): TicketStatus {
  return getOverride(eventId)?.ticketStatus ?? mock[eventId] ?? "available";
}
