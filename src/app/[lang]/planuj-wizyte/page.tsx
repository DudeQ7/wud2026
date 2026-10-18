import { MapPin, Phone } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { Answer } from "@/components/fs/answer"
import { BottomNav } from "@/components/fs/bottom-nav"
import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { guide } from "@/content/about"
import { buildingAccess, firstVisit } from "@/content/event"
import { faqPage } from "@/content/faq"
import { address, boxOffice } from "@/content/home"
import { venueInfo } from "@/lib/events"
import visit from "@/data/visit.json"
import { getDictionary, hasLocale, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"
import { visitorRouteCopy } from "@/i18n/visitor-routes"

export async function generateMetadata({ params }: PageProps<"/[lang]/planuj-wizyte">): Promise<Metadata> {
  const { lang } = await params
  return (
    (hasLocale(lang) ? visitorRouteCopy(lang)?.meta.visit : undefined) ?? {
      title: "Planuj wizytę – Filharmonia w Szczecinie",
      description: "Bilety, dojazd, parking, kasa, kiedy przyjść, sale i dostępność. Krótkie odpowiedzi w jednym miejscu.",
    }
  )
}

const phone = boxOffice.phone.replaceAll(" ", "")
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Filharmonia Szczecin, ${address}`)}`

const link = "inline-flex min-h-11 items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]"

/** Planuj wizytę (design.md §7.3): odpowiedzi w akordeonach w stałej kolejności */
export default async function PlanVisitPage() {
  const lang = await getLang()
  const copy = visitorRouteCopy(lang)?.visit
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {getDictionary(lang).common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container className="max-w-3xl">
          <Eyebrow>{copy?.eyebrow ?? "Zanim przyjdziesz"}</Eyebrow>
          <h1 className="mt-1 type-h1 text-gold">{copy?.title ?? "Planuj wizytę"}</h1>
          <p className="mt-2 type-body text-text">
            {copy?.lead ?? "Wszystko, co warto wiedzieć przed pierwszym koncertem. Nie musisz znać muzyki klasycznej."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={mapsUrl} className={buttonVariants({ variant: "primary" })}>
              <MapPin {...iconProps} />
              {copy?.navigate ?? "Nawiguj"}
            </a>
            <a href={`tel:${phone}`} className={buttonVariants({ variant: "secondary" })}>
              <Phone {...iconProps} />
              {copy?.call ?? "Zadzwoń do kasy"}
            </a>
          </div>
          <p className="mt-3 type-meta text-text-muted">{address}</p>
          <Link href={localizedPath(lang, "/faq")} className={`${link} mt-2`}>
            {faqPage[lang].more}
          </Link>

          <div className="mt-8 border-t border-line">
            <Answer title={copy?.ticketTitle ?? "Jak kupić bilet"} open>
              <p>
                {copy?.ticket ?? "Bilety kupisz online lub w kasie. Przy każdym wydarzeniu znajdziesz przycisk „Kup bilet”."}
              </p>
              <p>{copy?.discounts ?? venueInfo.discounts}</p>
              <a href="https://filharmonia.szczecin.pl/bilety" className={link}>
                {copy?.sales ?? "Zasady sprzedaży biletów"}
              </a>
            </Answer>

            <Answer title={copy?.transport ?? "Jak dojechać"}>
              <p>{copy?.bus ?? visit.publicTransport.bus}</p>
              <p>{copy?.tram ?? visit.publicTransport.tram}</p>
              <a href="https://zditm.szczecin.pl/" className={link}>
                {copy?.timetables ?? "Rozkłady jazdy ZDiTM"}
              </a>
              <a href={mapsUrl} className={link}>
                {copy?.navigate ?? "Nawiguj do Filharmonii"} ({address})
              </a>
            </Answer>

            <Answer title={copy?.parkingTitle ?? "Parking"}>
              <p>{copy?.parking ?? visit.parking}</p>
            </Answer>

            <Answer title={copy?.box ?? "Kasa"}>
              <p className="whitespace-pre-line">{getDictionary(lang).footer.boxOfficeHours}</p>
              <div className="flex flex-col">
                <a href={`tel:${phone}`} className={link}>
                  {copy?.phone ?? "Telefon:"} {boxOffice.phone}
                </a>
                <a href={`mailto:${boxOffice.email}`} className={link}>
                  {copy?.email ?? "E-mail:"} {boxOffice.email}
                </a>
              </div>
              <p>{copy?.infoline ?? "Infolinia:"} {copy?.infolineText ?? visit.infoline}</p>
            </Answer>

            <Answer title={copy?.arrival ?? "Kiedy przyjść"}>
              <p>{copy?.opens ?? firstVisit.find((c) => c.title === "Kiedy przyjść?")?.text}</p>
              <p>{copy?.buildingHours ?? "Godziny otwarcia budynku:"} {copy?.buildingHoursText ?? venueInfo.building_hours}.</p>
              <p>{copy?.outfit ?? firstVisit.find((c) => c.title === "Co na siebie włożyć?")?.text}</p>
            </Answer>

            <Answer title={copy?.accessTitle ?? "Wejście i dostępność"}>
              <ul className="flex flex-col gap-2">
                {buildingAccess.map((item, index) => (
                  <li key={item}>{copy?.accessItems[index] ?? item}</li>
                ))}
              </ul>
              <p>{copy?.access ?? visit.accessibility}</p>
              <p>{copy?.accessTickets ?? visit.accessibilityTickets}</p>
              <a href={`tel:${phone}`} className={link}>
                {copy?.callBox ?? "Zadzwoń do kasy:"} {boxOffice.phone}
              </a>
            </Answer>

            {guide.map((item, index) => {
              const translated = copy?.guide[index]
              return (
              <Answer key={item.q} title={translated?.[0] ?? item.q}>
                <p>{translated?.[1] ?? item.a}</p>
              </Answer>
              )
            })}

            <Answer title={copy?.hallsTitle ?? "Sale i przestrzenie"}>
              <ul className="flex flex-col gap-1">
                {venueInfo.halls.map((hall, index) => (
                  <li key={hall}>{copy?.hallNames[index] ?? hall}</li>
                ))}
              </ul>
              <p>{copy?.cafes ?? visit.cafes}</p>
            </Answer>

            <Answer title={copy?.toursTitle ?? "Zwiedzanie budynku"}>
              <p>{copy?.tours ?? visit.tours}</p>
            </Answer>
          </div>

          <p className="mt-8 type-meta text-text-muted">
            {copy?.source ?? "Źródło:"}{" "}
            <a href={visit.source} className="underline underline-offset-[3px]">
              {copy?.sourceLink ?? "strona Filharmonii „Zaplanuj swoją wizytę”"}
            </a>
          </p>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} current="/planuj-wizyte" />
    </>
  )
}
