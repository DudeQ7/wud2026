import type { Metadata } from "next"

import { ListingPage } from "@/components/fs/listing-page"
import { hasLocale } from "@/i18n"
import { listingCopy } from "@/i18n/listing-routes"
import { getLang } from "@/i18n/server"
import { events, isExhibition } from "@/lib/events"

export async function generateMetadata({ params }: PageProps<"/[lang]/wystawy">): Promise<Metadata> {
  const { lang } = await params
  return listingCopy(hasLocale(lang) ? lang : "pl").exhibitions.meta
}

/** Wystawy (brief, priorytet średni): aktualne i nadchodzące wystawy oraz wernisaże */
export default async function ExhibitionsPage() {
  const lang = await getLang()
  const t = listingCopy(lang).exhibitions
  return (
    <ListingPage
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      events={events}
      select={(all) => all.filter((e) => isExhibition(e) || e.type === "wernisaż")}
      empty={t.empty}
    />
  )
}
