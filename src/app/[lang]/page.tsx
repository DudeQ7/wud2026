import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import { notFound } from "next/navigation"

import { BottomNav } from "@/components/fs/bottom-nav"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { Hero } from "@/components/home/hero"
import {
  DiscoverSection,
  ForYouSection,
  NewsletterSection,
  PartnersSection,
  RecommendedSection,
} from "@/components/home/sections"
import { StairsSection } from "@/components/home/stairs"
import { type Locale, getDictionary, hasLocale, locales, localizedPath } from "@/i18n"
import { nextConcert, nowKey, todayKey } from "@/lib/events"
import { siteJsonLd } from "@/lib/structured-data"

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return {
    alternates: {
      canonical: localizedPath(lang, "/"),
      languages: Object.fromEntries(locales.map((code) => [code, localizedPath(code, "/")])),
    },
  }
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <HomeContent lang={lang} />
}

// Strona główna (design.md §7.1). „Dziś” zależy od daty, więc wynik jest cache'owany
// i odświeżany co godzinę zamiast liczony przy każdym żądaniu (Cache Components). Klucz cache: język.
async function HomeContent({ lang }: { lang: Locale }) {
  "use cache"
  cacheLife("hours")

  const t = getDictionary(lang)
  const now = new Date()
  const today = todayKey(now)
  const hero = nextConcert(nowKey(now), lang)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(lang)).replace(/</g, "\\u003c") }}
      />
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.common.skipLink}
      </a>
      <SiteHeader lang={lang} overlay={Boolean(hero)} />
      <main id="tresc">
        {hero && <Hero event={hero.event} date={hero.date} today={today} lang={lang} />}
        <StairsSection today={today} lang={lang} />
        <RecommendedSection today={today} lang={lang} />
        <ForYouSection lang={lang} />
        <DiscoverSection lang={lang} />
        <NewsletterSection lang={lang} />
        <PartnersSection lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}
