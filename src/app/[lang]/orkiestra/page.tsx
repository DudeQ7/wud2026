import type { Metadata } from "next"
import Link from "next/link"

import { SimplePage } from "@/components/fs/simple-page"
import { hasLocale, localizedPath } from "@/i18n"
import { editorialCopy } from "@/i18n/editorial-routes"
import { getLang } from "@/i18n/server"
import { orchestra } from "@/content/about"

export async function generateMetadata({ params }: PageProps<"/[lang]/orkiestra">): Promise<Metadata> {
  const { lang } = await params
  return editorialCopy(hasLocale(lang) ? lang : "pl").orchestra.meta
}

/** Orkiestra (brief, priorytet wysoki) – treść z podstrony orkiestry FS */
export default async function OrchestraPage() {
  const lang = await getLang()
  const copy = editorialCopy(lang)
  const o = copy.orchestra
  return (
    <SimplePage eyebrow={copy.ui.discoverEyebrow} title={o.title} lead={o.paragraphs[0]} source={orchestra.source}>
      <dl className="mt-8 grid grid-cols-3 border-y border-line py-4">
        {o.facts.map((f) => (
          <div key={f.label} className="pr-2">
            <dd className="font-heading text-[1.75rem] leading-tight font-semibold text-text tabular-nums">{f.value}</dd>
            <dt className="type-meta text-text-muted">{f.label}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex max-w-[68ch] flex-col gap-4 type-body text-text">
        {o.paragraphs.slice(1).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <h2 className="mt-10 type-h3 text-gold">{o.directorRole}</h2>
      <p className="mt-1 type-body text-text">{orchestra.director.name}</p>
      <Link href={localizedPath(lang, "/artysci")} className="mt-6 inline-flex min-h-11 items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]">
        {o.artistsLink}
      </Link>
    </SimplePage>
  )
}
