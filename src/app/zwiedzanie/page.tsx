import type { Metadata } from "next"

import { ListingPage } from "@/components/fs/listing-page"
import visit from "@/data/visit.json"
import { events } from "@/lib/events"

export const metadata: Metadata = {
  title: "Zwiedzanie – Filharmonia w Szczecinie",
  description: "Zwiedzanie budynku z przewodnikiem po polsku, angielsku i niemiecku. Terminy i ceny.",
}

/** Zwiedzanie (brief, priorytet średni): terminy, języki, cena; rezerwacja przez kasę online */
export default function ToursPage() {
  return (
    <ListingPage
      eyebrow="Piątki · PL, EN, DE · ok. 40 minut"
      title="Zwiedzanie"
      lead={visit.tours}
      events={events}
      select={(all) => all.filter((e) => e.type === "zwiedzanie")}
      empty="Aktualnych terminów zwiedzania nie ma w repertuarze. Sprawdź ponownie wkrótce."
    />
  )
}
