import { ArrowLeft, ArrowUpRight, Phone } from "lucide-react"
import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { FactList, TicketStatusBadge, eventPrice } from "@/components/fs/event-meta"
import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { Photo } from "@/components/fs/photo"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { ticketStatus } from "@/content/availability"
import { checkoutCopy } from "@/content/checkout"
import { boxOffice } from "@/content/home"
import { getDictionary, hasLocale, localizedPath, venueLabel } from "@/i18n"
import { getLang } from "@/i18n/server"
import {
  eventHref,
  eventIdFromSlug,
  events,
  formatShortDate,
  formatTimeRange,
  localizeEvent,
  nowKey,
} from "@/lib/events"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
  return events.map((event) => ({ slug: String(event.id) }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/kup-bilet/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params
  const found = events.find((e) => e.id === eventIdFromSlug(slug))
  if (!found || !hasLocale(lang)) return {}
  // Ekran przejściowy prototypu – bez indeksowania (kanoniczna jest karta wydarzenia)
  return { title: checkoutCopy[lang].meta(localizeEvent(found, lang).headline), robots: { index: false } }
}

/**
 * „Kup bilet” w prototypie: podsumowanie (co, kiedy, gdzie, za ile), trzy kroki docelowego zakupu w serwisie
 * i przejście do obecnej kasy online FS. Wcześniej każdy „Kup bilet” wyrzucał na stronę główną kasy,
 * gdzie trzeba było szukać wydarzenia od nowa.
 */
export default async function CheckoutPage({ params }: PageProps<"/[lang]/kup-bilet/[slug]">) {
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
      <main id="tresc" className="pt-6 pb-16 lg:pt-10 lg:pb-24">
        <Suspense fallback={<Container className="max-w-3xl" aria-busy="true"><div className="h-96 bg-surface-muted" /></Container>}>
          <CheckoutContent params={params} />
        </Suspense>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}

async function CheckoutContent({ params }: Pick<PageProps<"/[lang]/kup-bilet/[slug]">, "params">) {
  const { slug } = await params
  const id = eventIdFromSlug(slug)
  if (!events.some((e) => e.id === id)) notFound()
  return <CheckoutView id={id!} />
}

// Najbliższy termin zależy od daty – jak na karcie wydarzenia: cache z odświeżaniem co godzinę
async function CheckoutView({ id }: { id: number }) {
  "use cache"
  cacheLife("hours")

  const lang = await getLang()
  const t = getDictionary(lang)
  const copy = checkoutCopy[lang]
  const event = localizeEvent(events.find((e) => e.id === id)!, lang)
  const today = nowKey(new Date()).slice(0, 10)
  const date = event.dates.find((d) => d >= today) ?? event.dates.at(-1)!
  const price = eventPrice(event, t)
  const soldout = ticketStatus(event.id) === "soldout"
  const back = localizedPath(lang, eventHref(event))

  return (
    <Container className="max-w-3xl">
      <Link href={back} className="inline-flex min-h-11 items-center gap-2 font-semibold text-text hover:underline">
        <ArrowLeft {...iconProps} className="size-5" />
        {copy.back}
      </Link>

      {/* Podsumowanie: to samo „co, kiedy, gdzie, za ile” co na karcie, żeby kupujący wiedział, że to właściwy koncert */}
      <section aria-labelledby="zakup-tytul" className="mt-4 grid gap-5 sm:grid-cols-[12rem_1fr] sm:items-start">
        {event.image && (
          <Photo src={event.image.card} alt="" sizes="(min-width: 600px) 192px, 100vw" className="hidden sm:block" />
        )}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <TicketStatusBadge event={event} t={t} hideAvailable />
          </div>
          <h1 id="zakup-tytul" className="mt-1 type-h1 text-gold">
            {event.headline}
          </h1>
          {event.subtitle && <p className="mt-1 font-heading text-xl font-semibold text-text">{event.subtitle}</p>}
          <FactList
            className="mt-4"
            facts={[
              { label: t.event.facts.when, value: `${formatShortDate(date, t)} · ${formatTimeRange(date, event.durationMin)}` },
              { label: t.event.facts.where, value: venueLabel(t, event.venue) },
              ...(price ? [{ label: t.event.details.price, value: price }] : []),
            ]}
          />
        </div>
      </section>

      {/* Docelowy zakup w serwisie – trzy kroki. Wyraźnie podpisany jako prototyp, bez udawania płatności */}
      <section aria-labelledby="zakup-kroki" className="mt-10 border-[1.5px] border-line-strong p-5 sm:p-8">
        <Eyebrow>{copy.prototype}</Eyebrow>
        <h2 id="zakup-kroki" className="mt-1 type-h2 text-gold">
          {copy.title}
        </h2>
        <p className="mt-3 max-w-[68ch] type-body text-text">{copy.lead}</p>

        <ol aria-label={copy.stepsLabel} className="mt-6 grid gap-px bg-line sm:grid-cols-3">
          {copy.steps.map(([title, text], index) => (
            <li key={title} className="flex flex-col gap-1 bg-background py-4 sm:px-4 sm:first:pl-0 sm:last:pr-0">
              <span aria-hidden="true" className="font-heading text-[2rem] leading-none font-semibold text-gold tabular-nums">
                {index + 1}
              </span>
              <h3 className="mt-2 type-h4 text-text">{title}</h3>
              <p className="type-meta text-text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Dziś: obecna kasa online FS albo telefon */}
      <div className="mt-8 flex flex-col gap-3">
        {soldout ? (
          <span aria-disabled="true" className={buttonVariants({ variant: "primary", block: true, className: "sm:w-fit" })}>
            {t.event.status.soldout}
          </span>
        ) : (
          <a href={event.ticketsUrl} className={cn(buttonVariants({ variant: "primary", block: true }), "gap-2 sm:w-fit")}>
            {copy.buy}
            <ArrowUpRight {...iconProps} className="size-5" />
          </a>
        )}
        <p className="max-w-[68ch] type-meta text-text-muted">{copy.buyHint}</p>
        <a
          href={`tel:${boxOffice.phone.replaceAll(" ", "")}`}
          className="inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]"
        >
          <Phone {...iconProps} className="size-5" />
          <span>
            {copy.phone} <span className="whitespace-nowrap">{boxOffice.phone}</span>
          </span>
        </a>
      </div>

      <p className="mt-10 max-w-[68ch] border-t border-line pt-4 type-meta text-text-muted">{copy.integration}</p>
    </Container>
  )
}
