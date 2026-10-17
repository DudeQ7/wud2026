import type { Metadata } from "next"
import Link from "next/link"
import { getDictionary, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { ArrowRight } from "lucide-react"
import { SimplePage } from "@/components/fs/simple-page"
import { iconProps } from "@/components/fs/icons"

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLang()).footerPages.accessibility
  return { title: t.title, description: t.lead }
}

export default async function Page() {
  const lang = await getLang()
  const t = getDictionary(lang).footerPages.accessibility
  return (
    <SimplePage eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
      <ul className="mt-8 border-t border-line">
          <li><Link href="https://filharmonia.szczecin.pl/deklaracja_dostepnosci" className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">{t.links[0]}<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/planuj-wizyte")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">{t.links[1]}<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
          <li><Link href={localizedPath(lang, "/kontakt")}  className="flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-line py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">{t.links[2]}<ArrowRight {...iconProps} className="size-5 shrink-0" /></Link></li>
      </ul>
    </SimplePage>
  )
}
