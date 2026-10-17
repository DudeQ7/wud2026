import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { EventCard } from "@/components/fs/event-card"
import { Container, Eyebrow } from "@/components/fs/layout"
import { Photo } from "@/components/fs/photo"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { artists, eventsOfArtist, getArtist } from "@/lib/artists"
import { localizeEvent } from "@/lib/events"
import { getDictionary, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/artysci/[slug]">): Promise<Metadata> {
  const artist = getArtist((await params).slug)
  return artist ? { title: `${artist.name} – Filharmonia w Szczecinie`, description: artist.bio[0].slice(0, 160) } : {}
}

/** Profil artysty: zdjęcie 3:4, biogram i nadchodzące wydarzenia (design.md §5.6) */
export default async function ArtistPage({ params }: PageProps<"/[lang]/artysci/[slug]">) {
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
      <main id="tresc" className="pt-4 pb-16 lg:pb-24">
        <Container>
          <Suspense fallback={<div className="h-96 bg-surface-muted" role="status" aria-busy="true" aria-label="Wczytywanie" />}>
            <ArtistContent params={params} />
          </Suspense>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}

async function ArtistContent({ params }: Pick<PageProps<"/[lang]/artysci/[slug]">, "params">) {
  const { slug } = await params
  if (!getArtist(slug)) notFound()
  return <ArtistView slug={slug} />
}

// Najbliższe terminy zależą od daty – cache na godzinę, jak karta wydarzenia
async function ArtistView({ slug }: { slug: string }) {
  "use cache"
  cacheLife("hours")

  const lang = await getLang()
  const artist = getArtist(slug)!
  const upcoming = eventsOfArtist(artist).map((x) => ({ ...x, event: localizeEvent(x.event, lang) }))

  return (
    <div className="max-w-3xl">
      <Link
        href={localizedPath(lang, "/artysci")}
        className="-ml-1 inline-flex min-h-11 items-center px-1 text-[0.9375rem] font-semibold text-text underline-offset-4 hover:underline"
      >
        ← Artyści
      </Link>
      <Eyebrow className="mt-4">Artysta</Eyebrow>
      <h1 className="mt-1 type-h1 text-gold">{artist.name}</h1>

      {artist.photo && (
        <div className="mt-6 max-w-sm">
          <Photo src={artist.photo} alt={artist.name} ratio="4/5" sizes="(min-width: 640px) 384px, 100vw" />
          {artist.caption && <p className="mt-2 type-meta text-text-muted">{artist.caption}</p>}
        </div>
      )}

      <div className="mt-6 flex max-w-[68ch] flex-col gap-4 type-body text-text">
        {artist.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h2 className="mt-12 type-h3 text-gold">Najbliższe wydarzenia</h2>
      {upcoming.length === 0 ? (
        <p className="mt-3 type-body text-text">Nie ma teraz zapowiedzianych wydarzeń z udziałem tego artysty.</p>
      ) : (
        <ul className="mt-4 grid gap-10 sm:grid-cols-2 sm:gap-x-4">
          {upcoming.map(({ event, date }) => (
            <li key={event.id}>
              <EventCard lang={lang} event={event} date={date} variant="compact" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
