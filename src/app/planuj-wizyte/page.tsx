import { ChevronDown, MapPin, Phone } from "lucide-react"
import type { Metadata } from "next"
import * as React from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { buildingAccess, firstVisit } from "@/content/event"
import { address, boxOffice } from "@/content/home"
import { venueInfo } from "@/lib/events"
import visit from "@/data/visit.json"

export const metadata: Metadata = {
  title: "Planuj wizytę – Filharmonia w Szczecinie",
  description: "Bilety, dojazd, parking, kasa, kiedy przyjść, sale i dostępność. Krótkie odpowiedzi w jednym miejscu.",
}

const phone = boxOffice.phone.replaceAll(" ", "")
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Filharmonia Szczecin, ${address}`)}`

const link = "inline-flex min-h-11 items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]"

/** Odpowiedź w akordeonie (§7.3): <details>, cel dotyku 56 px, bez JS */
function Answer({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-2 font-heading text-lg font-semibold text-text [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown {...iconProps} className="size-6 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="flex max-w-[68ch] flex-col gap-3 pb-5 type-body text-text">{children}</div>
    </details>
  )
}

/** Planuj wizytę (design.md §7.3): odpowiedzi w akordeonach w stałej kolejności */
export default function PlanVisitPage() {
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Przejdź do treści
      </a>
      <SiteHeader />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container className="max-w-3xl">
          <Eyebrow>Zanim przyjdziesz</Eyebrow>
          <h1 className="mt-1 type-h1 text-gold">Planuj wizytę</h1>
          <p className="mt-2 type-body text-text">
            Wszystko, co warto wiedzieć przed pierwszym koncertem. Nie musisz znać muzyki klasycznej.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={mapsUrl} className={buttonVariants({ variant: "primary" })}>
              <MapPin {...iconProps} />
              Nawiguj
            </a>
            <a href={`tel:${phone}`} className={buttonVariants({ variant: "secondary" })}>
              <Phone {...iconProps} />
              Zadzwoń do kasy
            </a>
          </div>
          <p className="mt-3 type-meta text-text-muted">{address}</p>

          <div className="mt-8 border-t border-line">
            <Answer title="Jak kupić bilet" open>
              <p>
                Bilety kupisz online lub w kasie. Przy każdym wydarzeniu znajdziesz przycisk „Kup bilet”.
              </p>
              <p>{venueInfo.discounts}</p>
              <a href="https://filharmonia.szczecin.pl/bilety" className={link}>
                Zasady sprzedaży biletów
              </a>
            </Answer>

            <Answer title="Jak dojechać">
              <p>{visit.publicTransport.bus}</p>
              <p>{visit.publicTransport.tram}</p>
              <a href="https://zditm.szczecin.pl/" className={link}>
                Rozkłady jazdy ZDiTM
              </a>
              <a href={mapsUrl} className={link}>
                Nawiguj do Filharmonii ({address})
              </a>
            </Answer>

            <Answer title="Parking">
              <p>{visit.parking}</p>
            </Answer>

            <Answer title="Kasa">
              <p className="whitespace-pre-line">{boxOffice.summary}</p>
              <div className="flex flex-col">
                <a href={`tel:${phone}`} className={link}>
                  Telefon: {boxOffice.phone}
                </a>
                <a href={`mailto:${boxOffice.email}`} className={link}>
                  E-mail: {boxOffice.email}
                </a>
              </div>
              <p>Infolinia: {visit.infoline}</p>
            </Answer>

            <Answer title="Kiedy przyjść">
              <p>{firstVisit.find((c) => c.title === "Kiedy przyjść?")?.text}</p>
              <p>Godziny otwarcia budynku: {venueInfo.building_hours}.</p>
              <p>{firstVisit.find((c) => c.title === "Co na siebie włożyć?")?.text}</p>
            </Answer>

            <Answer title="Wejście i dostępność">
              <ul className="flex flex-col gap-2">
                {buildingAccess.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{visit.accessibility}</p>
              <p>{visit.accessibilityTickets}</p>
              <a href={`tel:${phone}`} className={link}>
                Zadzwoń do kasy: {boxOffice.phone}
              </a>
            </Answer>

            <Answer title="Sale i przestrzenie">
              <ul className="flex flex-col gap-1">
                {venueInfo.halls.map((hall) => (
                  <li key={hall}>{hall}</li>
                ))}
              </ul>
              <p>{visit.cafes}</p>
            </Answer>

            <Answer title="Zwiedzanie budynku">
              <p>{visit.tours}</p>
            </Answer>
          </div>

          <p className="mt-8 type-meta text-text-muted">
            Źródło:{" "}
            <a href={visit.source} className="underline underline-offset-[3px]">
              strona Filharmonii „Zaplanuj swoją wizytę”
            </a>
          </p>
        </Container>
      </main>
      <SiteFooter />
      <BottomNav current="/planuj-wizyte" />
    </>
  )
}
