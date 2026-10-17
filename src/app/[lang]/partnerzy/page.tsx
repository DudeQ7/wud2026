import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SimplePage } from "@/components/fs/simple-page"
import { iconProps } from "@/components/fs/icons"

export const metadata: Metadata = { title: "Partnerzy i biznes – Filharmonia w Szczecinie" }

export default function Page() {
  return (
    <SimplePage eyebrow="Współpraca z Filharmonią" title="Partnerzy i biznes" lead="Filharmonia zaprasza do długoterminowej współpracy oraz wspólnego tworzenia pojedynczych wydarzeń.">
      <ul className="mt-8 border-t border-line">
          <li><Link href="https://filharmonia.szczecin.pl/partnerstwo_kultury_i_biznesu" className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Oferta partnerstwa<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href="https://filharmonia.szczecin.pl/kontakt" className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Kontakt w sprawie współpracy<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
      </ul>
    </SimplePage>
  )
}
