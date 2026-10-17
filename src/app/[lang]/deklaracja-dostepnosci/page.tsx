import type { Metadata } from "next"
import Link from "next/link"
import { localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { ArrowRight } from "lucide-react"
import { SimplePage } from "@/components/fs/simple-page"
import { iconProps } from "@/components/fs/icons"

export const metadata: Metadata = { title: "Deklaracja dostępności – Filharmonia w Szczecinie" }

export default async function Page() {
  const lang = await getLang()
  return (
    <SimplePage eyebrow="Dostępność serwisu i wizyty" title="Deklaracja dostępności" lead="To prototyp przygotowany na hackathon WUD 2026. Jego zgodność z WCAG 2.2 AA nie została jeszcze potwierdzona pełnym audytem. Oficjalna deklaracja Filharmonii dotyczy jej własnego serwisu.">
      <ul className="mt-8 border-t border-line">
          <li><Link href="https://filharmonia.szczecin.pl/deklaracja_dostepnosci" className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Oficjalna deklaracja dostępności FS<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/planuj-wizyte")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Dostępność podczas wizyty<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/kontakt")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Kontakt i pomoc<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
      </ul>
    </SimplePage>
  )
}
