import type { Metadata } from "next"
import Link from "next/link"
import { localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { ArrowRight } from "lucide-react"
import { SimplePage } from "@/components/fs/simple-page"
import { iconProps } from "@/components/fs/icons"

export const metadata: Metadata = { title: "Strefa mediów – Filharmonia w Szczecinie" }

export default async function Page() {
  const lang = await getLang()
  return (
    <SimplePage eyebrow="Materiały i informacje" title="Strefa mediów" lead="Materiały do pobrania i kontakty do zespołu Filharmonii znajdziesz w oficjalnym serwisie.">
      <ul className="mt-8 border-t border-line">
          <li><Link href="https://filharmonia.szczecin.pl/do_pobrania" className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Materiały do pobrania<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href="https://filharmonia.szczecin.pl/kontakt" className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Kontakt z Filharmonią<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/artysci")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Artyści<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/orkiestra")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Orkiestra<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
      </ul>
    </SimplePage>
  )
}
