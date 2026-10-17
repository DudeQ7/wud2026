import type { Metadata } from "next"
import Link from "next/link"

import { Photo } from "@/components/fs/photo"
import { SimplePage } from "@/components/fs/simple-page"
import { awards, building } from "@/content/about"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Budynek – Filharmonia w Szczecinie",
  description: "Lodowa bryła projektu Barozzi/Veiga: architektura, sale i nagrody.",
}

/** Budynek (brief, priorytet średni): architektura, sale, nagrody */
export default function BuildingPage() {
  return (
    <SimplePage
      eyebrow="Odkryj Filharmonię"
      title="Budynek"
      lead="Lodowa bryła projektu Barozzi/Veiga z Barcelony, ikona Szczecina od sezonu 2014/2015."
      source={building.source}
    >
      <Photo src={building.photo} alt="Filharmonia w Szczecinie" ratio="3/2" chamfer className="mt-6 -mx-4 sm:mx-0" />

      <div className="mt-8 flex max-w-[68ch] flex-col gap-4 type-body text-text">
        {building.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <h2 className="mt-10 type-h3 text-gold">Sale</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {building.halls.map((h) => (
          <li key={h.name} className="border-[1.5px] border-line-strong p-4">
            <h3 className="type-h4 text-text">{h.name}</h3>
            <p className="mt-1 type-body text-text">{h.text}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 type-h3 text-gold">Nagrody</h2>
      <ul className="mt-3 border-t border-line">
        {awards.map((a) => (
          <li key={a.text} className="flex gap-4 border-b border-line py-3">
            <span className="w-12 shrink-0 font-heading font-semibold text-text tabular-nums">{a.year}</span>
            <span className="type-body text-text">{a.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/zwiedzanie" className={buttonVariants({ variant: "primary" })}>
          Zwiedzanie z przewodnikiem
        </Link>
        <Link href="/planuj-wizyte" className={buttonVariants({ variant: "secondary" })}>
          Planuj wizytę
        </Link>
      </div>
    </SimplePage>
  )
}
