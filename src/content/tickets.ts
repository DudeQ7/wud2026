// Bilety klienta – MOCK na czas prototypu. Docelowo pochodzą z API iksoris (brief §8, panel klienta).
// Ten sam zestaw widzi każdy zalogowany użytkownik; terminy bierzemy z koncerty.json, więc zawsze są aktualne.

export type MockTicket = {
  id: string
  eventId: number
  /** Numer zamówienia z systemu biletowego */
  order: string
  row: number
  seatFrom: number
  seatTo: number
}

export const mockTickets: MockTicket[] = [
  // Otwarcie strony głównej – termin tuż-tuż, żeby pokazać przypomnienie
  { id: "t1", eventId: 2608, order: "FS-2026-04127", row: 8, seatFrom: 12, seatTo: 13 },
  { id: "t2", eventId: 2550, order: "FS-2026-03981", row: 5, seatFrom: 3, seatTo: 4 },
]
