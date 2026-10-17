import type { Metadata } from "next"
import Link from "next/link"
import { getDictionary, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { SimplePage } from "@/components/fs/simple-page"
import { address } from "@/content/home"
import visit from "@/data/visit.json"

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLang()).footerPages.contact
  return { title: t.title, description: t.lead }
}

export default async function ContactPage() {
  const lang = await getLang()
  const t = getDictionary(lang).footerPages.contact
  const link = "flex min-h-11 w-fit cursor-pointer items-center font-semibold underline underline-offset-4 hover:bg-bg-subtle"
  return (
    <SimplePage eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
      <section className="mt-8 border-t border-line py-6">
        <h2 className="type-h2 text-gold">{t.boxOffice}</h2>
        <a href={`tel:${visit.boxOffice.phone.replaceAll(" ", "")}`} className={link}>{visit.boxOffice.phone}</a>
        <a href={`mailto:${visit.boxOffice.email}`} className={link}>{visit.boxOffice.email}</a>
        <p className="mt-3 type-body">{t.hours}</p>
      </section>
      <section className="border-t border-line py-6">
        <h2 className="type-h2 text-gold">{t.location}</h2>
        <p className="mt-3 type-body">{t.institution}<br />{address}</p>
        <Link href={localizedPath(lang, "/planuj-wizyte")}  className={link}>{t.directions}</Link>
      </section>
      <a href="https://filharmonia.szczecin.pl/kontakt" className={link}>{t.otherContacts}</a>
    </SimplePage>
  )
}
