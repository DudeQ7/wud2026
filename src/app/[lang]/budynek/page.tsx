import type { Metadata } from "next"
import Link from "next/link"

import { Photo } from "@/components/fs/photo"
import { SimplePage } from "@/components/fs/simple-page"
import { hasLocale, localizedPath } from "@/i18n"
import { editorialCopy } from "@/i18n/editorial-routes"
import { getLang } from "@/i18n/server"
import { building } from "@/content/about"
import { buttonVariants } from "@/components/ui/button"

export async function generateMetadata({ params }: PageProps<"/[lang]/budynek">): Promise<Metadata> {
  const { lang } = await params
  return editorialCopy(hasLocale(lang) ? lang : "pl").building.meta
}

/** Budynek (brief, priorytet średni): architektura, sale, nagrody */
export default async function BuildingPage() {
  const lang = await getLang()
  const copy = editorialCopy(lang)
  const b = copy.building
  return (
    <SimplePage eyebrow={copy.ui.discoverEyebrow} title={b.title} lead={b.lead} source={building.source}>
      <Photo src={building.photo} alt={b.photoAlt} ratio="3/2" chamfer className="mt-6 -mx-4 sm:mx-0" />

      <div className="mt-8 flex max-w-[68ch] flex-col gap-4 type-body text-text">
        {b.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <h2 className="mt-10 type-h3 text-gold">{b.hallsHeading}</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {b.halls.map((h) => (
          <li key={h.name} className="border-[1.5px] border-line-strong p-4">
            <h3 className="type-h4 text-text">{h.name}</h3>
            <p className="mt-1 type-body text-text">{h.text}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 type-h3 text-gold">{b.awardsHeading}</h2>
      <ul className="mt-3 border-t border-line">
        {b.awards.map((a) => (
          <li key={a.text} className="flex gap-4 border-b border-line py-3">
            <span className="w-12 shrink-0 font-heading font-semibold text-text tabular-nums">{a.year}</span>
            <span className="type-body text-text">{a.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href={localizedPath(lang, "/zwiedzanie")} className={buttonVariants({ variant: "primary" })}>
          {b.toursCta}
        </Link>
        <Link href={localizedPath(lang, "/planuj-wizyte")} className={buttonVariants({ variant: "secondary" })}>
          {b.visitCta}
        </Link>
      </div>
    </SimplePage>
  )
}
