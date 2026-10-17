"use client"

import { CalendarPlus, Navigation, Phone, Share2 } from "lucide-react"
import { useState } from "react"

import { iconProps } from "@/components/fs/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EventActionsProps = {
  title: string
  /** YYYY-MM-DDTHH:mm, czas lokalny Szczecina */
  date: string
  durationMin?: number
  venue: string
  address: string
  phone: string
}

const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  "Filharmonia im. Mieczysława Karłowicza, Małopolska 48, Szczecin"
)}`

/**
 * Akcje natywne (§6.11 pkt 8): dodaj do kalendarza (.ics), udostępnij (Web Share API),
 * nawiguj (natywna aplikacja map), zadzwoń do kasy (tel:).
 */
export function EventActions({ title, date, durationMin, venue, address, phone }: EventActionsProps) {
  const [status, setStatus] = useState("")

  function addToCalendar() {
    const file = icsFile({ title, date, durationMin, location: `${venue}, ${address}`, url: window.location.href })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(new Blob([file], { type: "text/calendar;charset=utf-8" }))
    link.download = "filharmonia-szczecin.ics"
    link.click()
    URL.revokeObjectURL(link.href)
    setStatus("Plik wydarzenia jest gotowy – otwórz go, żeby dodać termin do kalendarza.")
  }

  async function share() {
    const data = { title, url: window.location.href }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        // Użytkownik zamknął okno udostępniania – nic nie robimy
      }
      return
    }
    await navigator.clipboard.writeText(data.url)
    setStatus("Skopiowano link do wydarzenia.")
  }

  const item = cn(buttonVariants({ variant: "secondary", block: true }), "justify-start px-4")

  return (
    <div>
      <ul className="grid gap-2 sm:grid-cols-2">
        <li>
          <Button variant="secondary" block className="justify-start px-4" onClick={addToCalendar}>
            <CalendarPlus {...iconProps} />
            Dodaj do kalendarza
          </Button>
        </li>
        <li>
          <Button variant="secondary" block className="justify-start px-4" onClick={share}>
            <Share2 {...iconProps} />
            Udostępnij
          </Button>
        </li>
        <li>
          <a href={MAPS_URL} className={item}>
            <Navigation {...iconProps} />
            Nawiguj do Filharmonii
          </a>
        </li>
        <li>
          <a href={`tel:${phone.replaceAll(" ", "")}`} className={item}>
            <Phone {...iconProps} />
            Zadzwoń do kasy
          </a>
        </li>
      </ul>
      {/* Komunikat nie znika sam (§6.18) */}
      <p role="status" className="mt-3 type-meta text-text empty:hidden">
        {status}
      </p>
    </div>
  )
}

function icsFile({
  title,
  date,
  durationMin,
  location,
  url,
}: {
  title: string
  date: string
  durationMin?: number
  location: string
  url: string
}) {
  const stamp = (key: string) => key.replace(/[-:]/g, "") + "00"
  const start = new Date(`${date}:00Z`)
  // Bez czasu trwania w danych przyjmujemy 2 godziny – typowy koncert z przerwą
  const end = new Date(start.getTime() + (durationMin ?? 120) * 60_000).toISOString().slice(0, 16)
  const escape = (text: string) => text.replace(/[\\;,]/g, (c) => `\\${c}`)

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Filharmonia Szczecin//Repertuar//PL",
    "BEGIN:VEVENT",
    `UID:${stamp(date)}-${encodeURIComponent(title).slice(0, 40)}@filharmonia.szczecin.pl`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    // Daty w danych są czasem lokalnym Szczecina
    `DTSTART;TZID=Europe/Warsaw:${stamp(date)}`,
    `DTEND;TZID=Europe/Warsaw:${stamp(end)}`,
    `SUMMARY:${escape(title)}`,
    `LOCATION:${escape(location)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}
