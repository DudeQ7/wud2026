import type { Metadata } from "next"
import { Mail, Phone } from "lucide-react"

import { FactList } from "@/components/fs/event-meta"
import { iconProps } from "@/components/fs/icons"
import { ListingPage } from "@/components/fs/listing-page"
import { buttonVariants } from "@/components/ui/button"
import { boxOffice } from "@/content/home"
import { hasLocale } from "@/i18n"
import { listingCopy } from "@/i18n/listing-routes"
import { getLang } from "@/i18n/server"
import { events } from "@/lib/events"

export async function generateMetadata({ params }: PageProps<"/[lang]/zwiedzanie">): Promise<Metadata> {
  const { lang } = await params
  return listingCopy(hasLocale(lang) ? lang : "pl").tours.meta
}

/**
 * Zwiedzanie (brief, priorytet średni; scenariusz D – turysta z Niemiec): kiedy, w jakim języku, ile trwa,
 * ile kosztuje i jak przyjść z grupą – zanim użytkownik zobaczy listę terminów.
 */
export default async function ToursPage() {
  const lang = await getLang()
  const t = listingCopy(lang).tours
  const { when, languages, duration, price } = t.facts
  const mailto = `mailto:${boxOffice.email}?subject=${encodeURIComponent(t.groupsMailSubject)}`

  return (
    <ListingPage
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      intro={
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-6">
          <section aria-label={t.factsLabel} className="lg:col-span-7">
            <FactList
              className="grid-cols-[6.5rem_1fr]"
              facts={[when, languages, duration, price].map(([label, value]) => ({ label, value }))}
            />
          </section>
          <section aria-labelledby="tours-groups" className="flex flex-col gap-3 bg-bg-subtle p-5 lg:col-span-5 lg:p-6">
            <h2 id="tours-groups" className="type-h4 text-text">
              {t.groupsTitle}
            </h2>
            <p className="type-body text-text">{t.groupsText}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href={mailto} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                <Mail {...iconProps} />
                {t.groupsMail}
              </a>
              <a href={`tel:${boxOffice.phone.replaceAll(" ", "")}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                <Phone {...iconProps} />
                {t.groupsCall}
              </a>
            </div>
          </section>
        </div>
      }
      listTitle={t.upcoming}
      events={events}
      select={(all) => all.filter((e) => e.type === "zwiedzanie")}
      empty={t.empty}
    />
  )
}
