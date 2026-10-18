import type { Metadata } from "next"
import Link from "next/link"

import { ListingPage } from "@/components/fs/listing-page"
import { hasLocale, localizedPath } from "@/i18n"
import { listingCopy } from "@/i18n/listing-routes"
import { getLang } from "@/i18n/server"
import { calendarEditorial } from "@/content/calendar"
import { toCalendarEvent } from "@/lib/calendar"
import { events } from "@/lib/events"

export async function generateMetadata({ params }: PageProps<"/[lang]/edu">): Promise<Metadata> {
  const { lang } = await params
  return listingCopy(hasLocale(lang) ? lang : "pl").edu.meta
}

/** EDUfilharmonia (brief, priorytet wysoki): wejścia według grup + oferta z wiekiem, czasem i ceną */
export default async function EduPage() {
  const lang = await getLang()
  const t = listingCopy(lang).edu
  return (
    <ListingPage
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      intro={
        // Wejścia według grup (design.md §7.4) – tylko te, które da się odróżnić w danych FS
        <nav aria-label={t.groupsLabel}>
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {t.groups.map((g) => (
              <li key={g.href} className="flex">
                <Link
                  href={localizedPath(lang, g.href)}
                  className="flex min-h-24 flex-1 flex-col gap-1 border-[1.5px] border-line-strong p-4 hover:bg-bg-subtle"
                >
                  <span className="font-heading text-lg leading-tight font-semibold text-text">{g.title}</span>
                  <span className="type-meta text-text-muted">{g.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
      events={events}
      select={(all) => all.filter((e) => toCalendarEvent(e, calendarEditorial).facets.types.includes("edukacja"))}
      empty={t.empty}
    />
  )
}
