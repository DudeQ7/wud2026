import type { Metadata } from "next"

import { ListingPage } from "@/components/fs/listing-page"
import { events, isExhibition } from "@/lib/events"

export const metadata: Metadata = {
  title: "Wystawy – Filharmonia w Szczecinie",
  description: "Aktualne i nadchodzące wystawy oraz wernisaże w Galerii Poziom 4. i Art.Room.",
}

/** Wystawy (brief, priorytet średni): aktualne i nadchodzące wystawy oraz wernisaże */
export default function ExhibitionsPage() {
  return (
    <ListingPage
      eyebrow="Galeria Poziom 4. i Art.Room"
      title="Wystawy"
      lead="Sztuka wizualna w budynku Filharmonii: aktualne wystawy i nadchodzące wernisaże."
      events={events}
      select={(all) => all.filter((e) => isExhibition(e) || e.type === "wernisaż")}
      empty="Wkrótce pojawią się nowe wystawy."
    />
  )
}
