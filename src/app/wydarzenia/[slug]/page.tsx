import { Check } from "lucide-react"
import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import * as React from "react"
import { Suspense } from "react"

import { BackLink } from "@/components/event/back-link"
import { FragmentPlayer } from "@/components/event/fragment-player"
import { EventActions } from "@/components/event/event-actions"
import { EventCard } from "@/components/fs/event-card"
import { FactList, eventPrice } from "@/components/fs/event-meta"
import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { Photo } from "@/components/fs/photo"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { fragments } from "@/content/audio"
import { calendarEditorial } from "@/content/calendar"
import { accessAssistance, accessTickets, buildingAccess, firstVisit } from "@/content/event"
import { address, boxOffice, recommended } from "@/content/home"
import { artistByName } from "@/lib/artists"
import { seriesKey, toCalendarEvent } from "@/lib/calendar"
import {
  type FsEvent,
  eventDetails,
  eventHref,
  eventIdFromSlug,
  eventSlug,
  events,
  formatDuration,
  formatSeries,
  formatShortDate,
  formatTime,
  formatTimeRange,
  isExhibition,
  nowKey,
  similarEvents,
} from "@/lib/events"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
  return events.map((event) => ({ slug: eventSlug(event) }))
}

function findEvent(slug: string) {
  const id = eventIdFromSlug(slug)
  return events.find((e) => e.id === id)
}

export async function generateMetadata({ params }: PageProps<"/wydarzenia/[slug]">): Promise<Metadata> {
  const event = findEvent((await params).slug)
  if (!event) return {}
  return {
    title: `${event.title} – Filharmonia w Szczecinie`,
    description: event.lead ?? `${event.kind} · ${event.venue}`,
    openGraph: event.image ? { images: [event.image.large] } : undefined,
  }
}

/** Karta wydarzenia (design.md §6.11) */
export default function EventPage({ params }: PageProps<"/wydarzenia/[slug]">) {
  return (
    // Pasek zakupu (76 px) zastępuje tu dolną nawigację – stopka i scroll-padding biorą jego wysokość
    <div style={{ "--bottom-nav-h": "calc(76px + env(safe-area-inset-bottom))" } as React.CSSProperties}>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Przejdź do treści
      </a>
      <SiteHeader />
      <main id="tresc" className="pb-16">
        <Container className="max-w-3xl py-2">
          <BackLink />
        </Container>
        {/* Adres (params) czytamy w granicy Suspense – wspólna powłoka strony nie zależy od wydarzenia */}
        <Suspense fallback={<EventSkeleton />}>
          <EventContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}

async function EventContent({ params }: Pick<PageProps<"/wydarzenia/[slug]">, "params">) {
  const { slug } = await params
  const event = findEvent(slug)
  if (!event) notFound()
  // Stary lub skrócony adres („/wydarzenia/2558”) → kanoniczny z tytułem
  if (slug !== eventSlug(event)) permanentRedirect(eventHref(event))

  return <EventView id={event.id} />
}

function EventSkeleton() {
  return (
    <Container className="max-w-3xl" role="status" aria-busy="true" aria-label="Wczytywanie wydarzenia">
      <div className="-mx-4 aspect-[3/2] bg-surface-muted sm:mx-0" />
      <div className="mt-5 h-4 w-40 bg-surface-muted" />
      <div className="mt-3 h-10 w-3/4 bg-surface-muted" />
      <div className="mt-6 h-40 bg-surface-muted" />
    </Container>
  )
}

// Najbliższy termin zależy od daty, więc widok jest cache'owany i odświeżany co godzinę (jak strona główna)
async function EventView({ id }: { id: number }) {
  "use cache"
  cacheLife("hours")

  const event = events.find((e) => e.id === id)!
  const now = nowKey(new Date())
  const upcoming = event.dates.filter((d) => d >= now.slice(0, 10))
  const date = upcoming[0] ?? event.dates.at(-1)!
  const past = upcoming.length === 0
  const details = eventDetails(id)
  const similar = similarEvents(event, now, [recommended.featuredId, ...recommended.otherIds])
  const exhibition = isExhibition(event)
  const price = eventPrice(event)
  const series = formatSeries(event.series)
  const ageMin = toCalendarEvent(event, calendarEditorial).facets.ageMin
  const why = event.lead ?? details.paragraphs[0]
  const moreText = details.paragraphs.filter((p) => !why || !why.startsWith(p.slice(0, 40)))

  const when = exhibition
    ? `${formatShortDate(date)} · ${formatTime(date)}–16:00`
    : `${formatShortDate(date)} · ${formatTimeRange(date, event.durationMin)}`

  return (
    <>
      <Container className="max-w-3xl">
        {/* Pierwszy ekran: CO? KIEDY? GDZIE? ZA ILE? DLA KOGO? KUP BILET (pasek na dole) */}
        <Photo
          src={event.image?.large}
          alt={event.headline}
          chamfer
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="-mx-4 sm:mx-0"
        />

        <div className="mt-5 flex flex-col gap-2">
          <Eyebrow>{event.kind}</Eyebrow>
          <h1 className="type-h1 text-gold">{event.headline}</h1>
          {event.subtitle && <p className="font-heading text-xl font-semibold text-text">{event.subtitle}</p>}
        </div>

        <FactList
          className="mt-5"
          facts={[
            { label: "Kiedy", value: past ? `${when} · wydarzenie się odbyło` : when },
            { label: "Gdzie", value: event.venue },
            {
              label: "Za ile",
              value: price ?? (
                <a href={event.ticketsUrl} className="inline-flex min-h-11 items-center underline underline-offset-4">
                  Ceny w kasie online
                </a>
              ),
            },
            ...(event.kindLabel && / dla /.test(event.kindLabel)
              ? [{ label: "Dla kogo", value: forWhom(event.kindLabel, ageMin) }]
              : []),
          ]}
        />

        {series && (
          <Link
            href={`/cykl/${seriesKey(event.series)}`}
            className={cn(buttonVariants({ variant: "link" }), "mt-2 whitespace-normal")}
          >
            Cykl: {series} →
          </Link>
        )}

        <OtherDates dates={upcoming.slice(1)} />

        {why && (
          <Block id="dlaczego" title={exhibition ? "Dlaczego warto zajrzeć" : "Dlaczego warto przyjść"}>
            <p className="type-body-lg max-w-[68ch] text-text">{why}</p>
            {moreText.length > 0 && (
              <details className="group mt-4">
                <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">Przeczytaj cały opis</span>
                  <span className="hidden group-open:inline">Zwiń opis</span>
                </summary>
                <div className="mt-3 flex max-w-[68ch] flex-col gap-4 type-body text-text">
                  {moreText.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
            )}
          </Block>
        )}

        {details.artists.length > 0 && (
          <Block id="wykonawcy" title="Kto występuje">
            <ul className="border-t border-line">
              {details.artists.map((a) => (
                <li key={a.name} className="flex flex-col border-b border-line py-3">
                  {artistByName(a.name) ? (
                    <Link
                      href={`/artysci/${artistByName(a.name)!.slug}`}
                      className="inline-flex min-h-11 w-fit items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]"
                    >
                      {a.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-text">{a.name}</span>
                  )}
                  {a.role && <span className="type-meta text-text-muted">{a.role}</span>}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {details.program.length > 0 && (
          <Block id="program" title="Co zagramy">
            <ol className="border-t border-line">
              {details.program.map((p, i) => (
                <li key={i} className="flex flex-col border-b border-line py-3">
                  {p.composer && <span className="font-semibold text-text">{p.composer}</span>}
                  <span className="text-text">{p.work}</span>
                  {fragments[id]?.[i] && (
                    <FragmentPlayer fragment={fragments[id][i]} label={[p.composer, p.work].filter(Boolean).join(", ")} />
                  )}
                </li>
              ))}
            </ol>
          </Block>
        )}

        {!exhibition && (event.durationMin || details.intermission) && (
          <Block id="czas" title="Ile to potrwa">
            <p className="type-body text-text">
              {[
                event.durationMin && `Ok. ${formatDuration(event.durationMin)}`,
                event.durationMin && `koniec ok. ${formatTimeRange(date, event.durationMin).split("–")[1]}`,
                details.intermission,
              ]
                .filter(Boolean)
                .join(", ")}
              .
            </p>
          </Block>
        )}

        <Block id="dostepnosc" title="Dostępność i informacje sensoryczne">
          <ul className="flex flex-col gap-3">
            {buildingAccess.map((item) => (
              <li key={item} className="flex gap-3 type-body text-text">
                <Check {...iconProps} className="mt-1 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[68ch] type-body text-text">
            {accessAssistance} {accessTickets}
          </p>
          <a
            href={`tel:${boxOffice.phone.replaceAll(" ", "")}`}
            className={cn(buttonVariants({ variant: "link" }), "mt-1")}
          >
            Kasa: {boxOffice.phone}
          </a>
        </Block>

        {!exhibition && (
          <Block id="pierwszy-raz" title="Pierwszy raz w Filharmonii?">
            <ul className="grid gap-3 sm:grid-cols-2">
              {firstVisit.map((card) => (
                <li key={card.title} className="border-[1.5px] border-line-strong p-4">
                  <h3 className="type-h4 text-text">{card.title}</h3>
                  <p className="mt-1 type-body text-text">{card.text}</p>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {!past && (
          <Block id="zaplanuj" title="Zaplanuj">
            <EventActions
              title={event.title}
              date={date}
              durationMin={event.durationMin}
              venue={event.venue}
              address={address}
              phone={boxOffice.phone}
            />
          </Block>
        )}
      </Container>

      {similar.length > 0 && (
        <Container>
          <Block id="podobne" title="Podobne wydarzenia">
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
              {similar.map((s) => (
                <EventCard key={s.event.id} event={s.event} date={s.date} />
              ))}
            </div>
          </Block>
        </Container>
      )}

      {!past && <BuyBar event={event} date={date} price={price} />}
    </>
  )
}

/** Sekcja karty: złoty nagłówek h2 w rozmiarze h3 (karta ma wiele sekcji) */
function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="mb-4 type-h3 text-gold">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** „Dla kogo” z opisu rodzaju: „Koncert dla dzieci z opiekunami (…)” → „dzieci z opiekunami, od 5 lat” */
function forWhom(kindLabel: string, ageMin?: number) {
  const audience = kindLabel.match(/ dla (.+?)(?: \(|$)/)![1]
  // Dopełniacz z opisu → mianownik: „dla seniorów” → „Seniorzy”
  const nominative = audience.replace(/^(seniorów|uczniów|klas)\b/, (w) => NOMINATIVE[w])
  const text = nominative.charAt(0).toUpperCase() + nominative.slice(1)
  return ageMin && /wiek dziecka/.test(kindLabel) ? `${text}, od ${ageMin} lat` : text
}

const NOMINATIVE: Record<string, string> = { seniorów: "seniorzy", uczniów: "uczniowie", klas: "klasy" }

/** Kolejne terminy (np. koncerty dla szkół, wystawy): do 5 dni, reszta jako licznik */
function OtherDates({ dates }: { dates: string[] }) {
  if (dates.length === 0) return null
  const byDay = new Map<string, string[]>()
  for (const d of dates) byDay.set(d.slice(0, 10), [...(byDay.get(d.slice(0, 10)) ?? []), formatTime(d)])
  const days = [...byDay.entries()]
  const shown = days.slice(0, 5)
  const rest = days.length - shown.length

  return (
    <div className="mt-6">
      <h2 className="type-h4 text-gold">Kolejne terminy</h2>
      <ul className="mt-2 flex flex-col">
        {shown.map(([day, times]) => (
          <li key={day} className="type-meta text-text tabular-nums">
            {formatShortDate(day)} · {times.join(" i ")}
          </li>
        ))}
      </ul>
      {rest > 0 && (
        <p className="mt-1 type-meta text-text-muted">
          i {rest} {rest === 1 ? "kolejny dzień" : rest < 5 ? "kolejne dni" : "kolejnych dni"}, ostatni{" "}
          {formatShortDate(days.at(-1)![0])}
        </p>
      )}
    </div>
  )
}

/**
 * Przyklejony pasek zakupu (§6.11): czerń, 76 px + safe area. Na karcie wydarzenia zastępuje dolną
 * nawigację (§6.4) – nawigacja wraca po przejściu do innej strony.
 */
function BuyBar({ event, date, price }: { event: FsEvent; date: string; price?: string }) {
  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-40 bg-ink pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(26,26,26,.08)]">
      <Container className="flex h-[76px] max-w-3xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-heading text-[1.375rem] leading-tight font-semibold text-on-dark tabular-nums">
            {price ?? `${formatShortDate(date)} · ${formatTime(date)}`}
          </p>
          <p className="truncate type-meta text-on-dark-muted">{price ? `${formatShortDate(date)} · ${formatTime(date)}` : event.venue}</p>
        </div>
        <a href={event.ticketsUrl} className={cn(buttonVariants({ variant: "inverted" }), "shrink-0")}>
          Kup bilet
        </a>
      </Container>
    </div>
  )
}
