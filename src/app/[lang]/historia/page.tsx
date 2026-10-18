import type { Metadata } from "next"

import { SimplePage } from "@/components/fs/simple-page"
import { hasLocale } from "@/i18n"
import { editorialCopy } from "@/i18n/editorial-routes"
import { getLang } from "@/i18n/server"

export async function generateMetadata({ params }: PageProps<"/[lang]/historia">): Promise<Metadata> {
  const { lang } = await params
  return editorialCopy(hasLocale(lang) ? lang : "pl").history.meta
}

/** Historia (brief, priorytet średni): oś czasu od 1948 roku; pionowa na mobile (design.md §6.18) */
export default async function HistoryPage() {
  const lang = await getLang()
  const copy = editorialCopy(lang)
  const h = copy.history
  return (
    <SimplePage
      eyebrow={copy.ui.discoverEyebrow}
      title={h.title}
      lead={h.lead}
      source="https://filharmonia.szczecin.pl/aktualnosci/2346-Filharmonia_w_Szczecinie__Poznaj_nasza_historie"
    >
      <ol className="mt-8 border-t border-line">
        {h.timeline.map((item) => (
          <li key={item.year + item.text.slice(0, 12)} className="grid grid-cols-[4rem_1fr] gap-x-4 border-b border-line py-4">
            <h2 className="type-h3 text-gold tabular-nums">{item.year}</h2>
            <p className="type-body text-text">{item.text}</p>
          </li>
        ))}
      </ol>
    </SimplePage>
  )
}
