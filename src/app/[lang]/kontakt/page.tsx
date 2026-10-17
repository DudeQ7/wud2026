import type { Metadata } from "next"
import Link from "next/link"
import { localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { SimplePage } from "@/components/fs/simple-page"
import { address } from "@/content/home"
import visit from "@/data/visit.json"

export const metadata: Metadata = { title: "Kontakt – Filharmonia w Szczecinie" }

export default async function ContactPage() {
  const lang = await getLang()
  const link = "flex min-h-11 w-fit cursor-pointer items-center font-semibold underline underline-offset-4 hover:bg-bg-subtle"
  return (
    <SimplePage eyebrow="Jesteśmy do Twojej dyspozycji" title="Kontakt" lead="Pytania o bilety, miejsca lub wizytę? Skontaktuj się z kasą Filharmonii.">
      <section className="mt-8 border-t border-line py-6">
        <h2 className="type-h2 text-gold">Kasa biletowa</h2>
        <a href={`tel:${visit.boxOffice.phone.replaceAll(" ", "")}`} className={link}>{visit.boxOffice.phone}</a>
        <a href={`mailto:${visit.boxOffice.email}`} className={link}>{visit.boxOffice.email}</a>
        <p className="mt-3 type-body">{visit.boxOffice.hours}</p>
      </section>
      <section className="border-t border-line py-6">
        <h2 className="type-h2 text-gold">Gdzie nas znajdziesz</h2>
        <p className="mt-3 type-body">Filharmonia im. Mieczysława Karłowicza w Szczecinie<br />{address}</p>
        <Link href={localizedPath(lang, "/planuj-wizyte")}  className={link}>Dojazd, parking i dostępność</Link>
      </section>
      <a href="https://filharmonia.szczecin.pl/kontakt" className={link}>Pozostałe kontakty — oficjalny serwis FS</a>
    </SimplePage>
  )
}
