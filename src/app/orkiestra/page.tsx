import type { Metadata } from "next"

import { SimplePage } from "@/components/fs/simple-page"
import { orchestra } from "@/content/about"

export const metadata: Metadata = {
  title: "Orkiestra – Filharmonia w Szczecinie",
  description: "Orkiestra Symfoniczna Filharmonii w Szczecinie: ponad 90 muzyków i 75 lat historii.",
}

/** Orkiestra (brief, priorytet wysoki) – treść z podstrony orkiestry FS */
export default function OrchestraPage() {
  return (
    <SimplePage eyebrow="Odkryj Filharmonię" title="Orkiestra" lead={orchestra.paragraphs[0]} source={orchestra.source}>
      <dl className="mt-8 grid grid-cols-3 border-y border-line py-4">
        {orchestra.facts.map((f) => (
          <div key={f.label} className="pr-2">
            <dd className="font-heading text-[1.75rem] leading-tight font-semibold text-text tabular-nums">{f.value}</dd>
            <dt className="type-meta text-text-muted">{f.label}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex max-w-[68ch] flex-col gap-4 type-body text-text">
        {orchestra.paragraphs.slice(1).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <h2 className="mt-10 type-h3 text-gold">{orchestra.director.role}</h2>
      <p className="mt-1 type-body text-text">{orchestra.director.name}</p>
    </SimplePage>
  )
}
