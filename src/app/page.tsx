import { cacheLife } from "next/cache"

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
  TodaySection,
  UpcomingSection,
} from "@/components/home/sections"
import { recommended } from "@/content/home"
import { nextConcert, nowKey, todayKey } from "@/lib/events"

// Strona główna (design.md §7.1). „Dziś” zależy od daty, więc wynik jest cache'owany
// i odświeżany co godzinę zamiast liczony przy każdym żądaniu (Cache Components).
export default async function Home() {
  "use cache"
  cacheLife("hours")

  const now = new Date()
  const today = todayKey(now)
  const hero = nextConcert(nowKey(now))

  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Przejdź do treści
      </a>
      <SiteHeader overlay={Boolean(hero)} />
      <main id="tresc">
        {hero && <Hero event={hero.event} date={hero.date} />}
        <TodaySection today={today} />
        <UpcomingSection today={today} excludeIds={[...(hero ? [hero.event.id] : []), recommended.featuredId, ...recommended.otherIds]} />
        <RecommendedSection today={today} />
        <ForYouSection />
        <DiscoverSection />
        <NewsletterSection />
        <PartnersSection />
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  )
}
