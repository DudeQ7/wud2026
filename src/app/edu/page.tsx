import type { Metadata } from "next"
import Link from "next/link"

import { ListingPage } from "@/components/fs/listing-page"
import { calendarEditorial } from "@/content/calendar"
import { toCalendarEvent } from "@/lib/calendar"
import { events } from "@/lib/events"

export const metadata: Metadata = {
  title: "EDUfilharmonia – Filharmonia w Szczecinie",
  description: "Koncerty i spektakle dla dzieci, rodzin i szkół. Wiek, czas trwania i cena przy każdym wydarzeniu.",
}

// Wejścia według grup (design.md §7.4) – tylko te, które da się odróżnić w danych FS
const groups = [
  { title: "Dzieci", description: "Koncerty z opiekunami", href: "/repertuar?dla-kogo=dzieci" },
  { title: "Rodziny", description: "Dzieci i dorośli razem", href: "/repertuar?dla-kogo=rodziny" },
  { title: "Szkoły", description: "Koncerty i spektakle dla uczniów", href: "/repertuar?dla-kogo=szkoly" },
  { title: "Wszystko dla dzieci", description: "Filtr w kalendarzu", href: "/repertuar?rodzaj=edukacja" },
]

/** EDUfilharmonia (brief, priorytet wysoki): wejścia według grup + oferta z wiekiem, czasem i ceną */
export default function EduPage() {
  return (
    <ListingPage
      eyebrow="Dla dzieci, szkół i rodzin"
      title="EDUfilharmonia"
      lead="Pierwsze koncerty, spektakle i spotkania z muzyką. Przy każdym wydarzeniu widać wiek, czas trwania i cenę."
      intro={
        <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {groups.map((g) => (
            <li key={g.title} className="flex">
              <Link
                href={g.href}
                className="flex min-h-24 flex-1 flex-col gap-1 border-[1.5px] border-line-strong p-4 hover:bg-bg-subtle"
              >
                <span className="font-heading text-lg leading-tight font-semibold text-text">{g.title}</span>
                <span className="type-meta text-text-muted">{g.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      }
      events={events}
      select={(all) => all.filter((e) => toCalendarEvent(e, calendarEditorial).facets.types.includes("edukacja"))}
      empty="Najbliższe wydarzenia EDU pojawią się wkrótce."
    />
  )
}
