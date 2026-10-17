import koncerty from "@/data/koncerty.json"
import visit from "@/data/visit.json"
import type { FsEvent } from "@/lib/event-format"

// Plik iCalendar (RFC 5545) dla jednego terminu – przycisk „Dodaj do kalendarza” (brief §4, akcje natywne).
// Daty w danych to czas lokalny Szczecina, a .ics wymaga UTC – przeliczamy z uwzględnieniem zmiany czasu.

const TIME_ZONE = "Europe/Warsaw"
const DEFAULT_DURATION_MIN = 120
const LOCATION = `${koncerty.meta.venue_info.name}, ${visit.address}`

const wallClock = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
})

// Przesunięcie Warszawy względem UTC w danej chwili (ms)
function offsetMs(at: Date) {
  const p = Object.fromEntries(wallClock.formatToParts(at).map(({ type, value }) => [type, Number(value)]))
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(at.getTime() / 1000) * 1000
}

/** „2026-10-23T19:00” (czas w Szczecinie) → Date */
function warsawToDate(dateTime: string) {
  const [y, m, d] = dateTime.slice(0, 10).split("-").map(Number)
  const [h, min] = dateTime.slice(11, 16).split(":").map(Number)
  const wall = Date.UTC(y, m - 1, d, h, min)
  let guess = wall
  for (let i = 0; i < 2; i++) guess = wall - offsetMs(new Date(guess)) // druga iteracja łapie zmianę czasu
  return new Date(guess)
}

// 20261023T170000Z
const icsUtc = (at: Date) => at.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

const escape = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n")

// Linie dłuższe niż 75 bajtów zawijamy (kontynuacja zaczyna się spacją), nie tnąc znaków UTF-8
function foldLine(line: string) {
  const encoder = new TextEncoder()
  const out: string[] = []
  let current = ""
  for (const char of line) {
    const limit = out.length ? 74 : 75
    if (encoder.encode(current + char).length > limit) {
      out.push(current)
      current = char
    } else current += char
  }
  out.push(current)
  return out.join("\r\n ")
}

export function eventIcs(event: FsEvent, dateTime: string) {
  const start = warsawToDate(dateTime)
  const end = new Date(start.getTime() + (event.durationMin ?? DEFAULT_DURATION_MIN) * 60_000)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Filharmonia w Szczecinie//Kalendarz//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}-${dateTime.replace(/\D/g, "")}@filharmonia.szczecin.pl`,
    `DTSTAMP:${icsUtc(new Date())}`,
    `DTSTART:${icsUtc(start)}`,
    `DTEND:${icsUtc(end)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(`${event.venue}, ${LOCATION}`)}`,
    `DESCRIPTION:${escape([event.lead, `Bilety: ${event.ticketsUrl}`, event.url].filter(Boolean).join("\n\n"))}`,
    `URL:${event.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.map(foldLine).join("\r\n") + "\r\n"
}
