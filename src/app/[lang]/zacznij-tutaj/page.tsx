import type { Metadata } from "next"
import Link from "next/link"
import { connection } from "next/server"
import { Suspense } from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { EventCard } from "@/components/fs/event-card"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { firstVisit } from "@/content/event"
import { todayKey, upcomingConcerts } from "@/lib/events"
import { getDictionary, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"

export const metadata: Metadata = {
  title: "Zacznij tutaj – Filharmonia w Szczecinie",
  description: "Pierwszy raz w Filharmonii? Wybierz koncert w 5 pytań, sprawdź, jak dojechać i co na siebie włożyć.",
}

/** „Zacznij tutaj” (ścieżka A, brief): wybór koncertu → odpowiedzi na obawy debiutanta → planowanie wizyty */
export default async function StartHerePage() {
  const lang = await getLang()
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
          <Eyebrow>Pierwszy raz w Filharmonii</Eyebrow>
          <h1 className="mt-1 type-h1 text-gold">Zacznij tutaj</h1>
          <p className="mt-2 type-body-lg max-w-[68ch] text-text">
            Nie musisz znać muzyki klasycznej. Wystarczy, że masz ochotę posłuchać. Pomożemy wybrać pierwszy koncert i
            odpowiemy na pytania, które zwykle zadaje się przed wejściem.
          </p>

          <ol className="mt-10 flex flex-col gap-10">
            <li>
              <h2 className="type-h3 text-gold">1. Wybierz koncert</h2>
              <p className="mt-2 type-body text-text">Pięć krótkich pytań, każde możesz pominąć.</p>
              <Link href={localizedPath(lang, "/pomoz-mi-wybrac")} className={`${buttonVariants({ variant: "primary", block: true })} mt-4 sm:w-fit`}>
                Pomóż mi wybrać
              </Link>
              <Link href={localizedPath(lang, "/repertuar")} className="mt-2 inline-flex min-h-11 items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]">
                Albo przejrzyj repertuar →
              </Link>
            </li>

            <li>
              <h2 className="type-h3 text-gold">2. Najbliższe koncerty</h2>
              <Suspense fallback={<div className="mt-4 h-48 bg-surface-muted" role="status" aria-busy="true" aria-label="Wczytywanie" />}>
                <Upcoming />
              </Suspense>
            </li>

            <li>
              <h2 className="type-h3 text-gold">3. Zanim przyjdziesz</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {firstVisit.map((card) => (
                  <li key={card.title} className="border-[1.5px] border-line-strong p-4">
                    <h3 className="type-h4 text-text">{card.title}</h3>
                    <p className="mt-1 type-body text-text">{card.text}</p>
                  </li>
                ))}
              </ul>
              <Link href={localizedPath(lang, "/planuj-wizyte")} className={`${buttonVariants({ variant: "secondary", block: true })} mt-4 sm:w-fit`}>
                Planuj wizytę
              </Link>
            </li>
          </ol>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}

async function Upcoming() {
  const lang = await getLang()
  await connection()
  const concerts = upcomingConcerts(todayKey(new Date()), 3, [], lang)
  return (
    <div className="mt-4 grid gap-10 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
      {concerts.map(({ event, date }) => (
        <EventCard lang={lang} key={event.id} event={event} date={date} variant="compact" />
      ))}
    </div>
  )
}
