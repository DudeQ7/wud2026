import type { Metadata } from "next"
import Link from "next/link"
import { localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { ArrowRight } from "lucide-react"
import { SimplePage } from "@/components/fs/simple-page"
import { iconProps } from "@/components/fs/icons"

export const metadata: Metadata = { title: "O instytucji – Filharmonia w Szczecinie" }

export default async function Page() {
  const lang = await getLang()
  return (
    <SimplePage eyebrow="Filharmonia w Szczecinie" title="O instytucji" lead="Poznaj Filharmonię im. Mieczysława Karłowicza w Szczecinie: jej orkiestrę, historię i budynek.">
      <ul className="mt-8 border-t border-line">
          <li><Link href={localizedPath(lang, "/orkiestra")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Orkiestra<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/historia")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Historia<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/budynek")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Budynek<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href="https://filharmonia.szczecin.pl/grupy/57-Dyrekcja" className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">Dyrekcja — oficjalny serwis FS<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
      </ul>
    </SimplePage>
  )
}
