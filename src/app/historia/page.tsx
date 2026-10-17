import type { Metadata } from "next"

import { SimplePage } from "@/components/fs/simple-page"
import { timeline } from "@/content/about"

export const metadata: Metadata = {
  title: "Historia – Filharmonia w Szczecinie",
  description: "Od orkiestry w kamienicznych mieszkaniach w 1948 roku do ikony Szczecina: oś czasu Filharmonii.",
}

/** Historia (brief, priorytet średni): oś czasu od 1948 roku; pionowa na mobile (design.md §6.18) */
export default function HistoryPage() {
  return (
    <SimplePage
      eyebrow="Odkryj Filharmonię"
      title="Historia"
      lead="Orkiestra powstawała dzięki marzeniom entuzjastów, którzy wśród powojennych zgliszczy organizowali pierwsze koncerty. Dziś Filharmonia jest dumą Szczecina."
      source="https://filharmonia.szczecin.pl/aktualnosci/2346-Filharmonia_w_Szczecinie__Poznaj_nasza_historie"
    >
      <ol className="mt-8 border-t border-line">
        {timeline.map((item) => (
          <li key={item.year + item.text.slice(0, 12)} className="grid grid-cols-[4rem_1fr] gap-x-4 border-b border-line py-4">
            <h2 className="type-h3 text-gold tabular-nums">{item.year}</h2>
            <p className="type-body text-text">{item.text}</p>
          </li>
        ))}
      </ol>
    </SimplePage>
  )
}
