import type { Metadata } from "next"
import Link from "next/link"

import { BottomNav } from "@/components/fs/bottom-nav"
import { Container, Eyebrow } from "@/components/fs/layout"
import { Photo } from "@/components/fs/photo"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { artists } from "@/lib/artists"
import { getDictionary, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"

export const metadata: Metadata = {
  title: "Artyści – Filharmonia w Szczecinie",
  description: "Dyrygenci, soliści i zespoły występujący w tym sezonie.",
}

/** Artyści (brief, priorytet wysoki): profile powiązane z wydarzeniami */
export default async function ArtistsPage() {
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
        <Container>
          <Eyebrow>Odkryj Filharmonię</Eyebrow>
          <h1 className="mt-1 type-h1 text-gold">Artyści</h1>
          <p className="mt-2 type-body-lg max-w-[68ch] text-text">
            Dyrygenci, soliści i zespoły występujący w tym sezonie. Przy każdym profilu znajdziesz ich najbliższe koncerty.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {artists.map((a) => (
              <li key={a.slug} className="group relative flex flex-col gap-2">
                <Photo src={a.photo} alt="" ratio="1/1" sizes="(min-width: 1024px) 25vw, 50vw" placeholder="Brak zdjęcia" />
                <h2 className="font-heading text-lg leading-tight font-semibold text-text">
                  <Link
                    href={localizedPath(lang, `/artysci/${a.slug}`)}
                    className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
                  >
                    {a.name}
                  </Link>
                </h2>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}
