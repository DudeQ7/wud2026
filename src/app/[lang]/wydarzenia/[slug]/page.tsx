import { Check } from "lucide-react"
import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import * as React from "react"
import { Suspense } from "react"

import { BackLink } from "@/components/event/back-link"
import { EventActions } from "@/components/event/event-actions"
import { FavoriteButton } from "@/components/event/favorite-button"
import { FragmentPlayer } from "@/components/event/fragment-player"
import { AiHexagon } from "@/components/fs/ai-hexagon"
import { AssistantDialog } from "@/components/fs/assistant-dialog"
import { AssistantFab } from "@/components/fs/assistant-fab"
import { Breadcrumbs } from "@/components/fs/breadcrumbs"
import { EventCard } from "@/components/fs/event-card"
import { FactList, TicketStatusBadge, eventPrice, eventPriceFrom } from "@/components/fs/event-meta"
import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { Photo } from "@/components/fs/photo"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { fragments, heroFragment } from "@/content/audio"
import { ticketStatus } from "@/content/availability"
import { getOverride } from "@/content/overrides-store"
import { loadOverrides } from "@/lib/overrides"
import { calendarEditorial } from "@/content/calendar"
import { accessAssistance, accessTickets, buildingAccess, firstVisit } from "@/content/event"
import { faqPage } from "@/content/faq"
import { address, boxOffice, recommended } from "@/content/home"
import { artistByName } from "@/lib/artists"
import { eventCards, venue } from "@/lib/assistant"
import { seriesKey, toCalendarEvent } from "@/lib/calendar"
import {
  type FsEvent,
  eventDetails,
  eventHref,
  eventIdFromSlug,
  eventSlug,
  events,
  formatDuration,
  formatShortDate,
  formatTime,
  formatTimeRange,
  isExhibition,
  localizeEvent,
  nowKey,
  similarEvents,
  ticketHref,
} from "@/lib/events"
import { eventJsonLd } from "@/lib/structured-data"
import { cn } from "@/lib/utils"
import { type Dictionary, type Locale, getDictionary, hasLocale, kindLabel, localizedPath, seriesLabel, venueLabel } from "@/i18n"
import { getLang } from "@/i18n/server"
import { eventDescription, eventLead } from "@/i18n/events/descriptions"
import { visitorRouteCopy } from "@/i18n/visitor-routes"

export function generateStaticParams() {
  return events.map((event) => ({ slug: eventSlug(event) }))
}

function findEvent(slug: string) {
  const id = eventIdFromSlug(slug)
  return events.find((e) => e.id === id)
}

export async function generateMetadata({ params }: PageProps<"/[lang]/wydarzenia/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params
  const found = findEvent(slug)
  if (!found || !hasLocale(lang)) return {}
  const t = getDictionary(lang)
  const event = localizeEvent(found, lang)
  return {
    title: t.event.details.eventTitle(event.title),
    // Opisy wydarzeń w danych FS są tylko po polsku – w innych językach podajemy przetłumaczony rodzaj i salę.
    description:
      eventLead(event, lang) ??
      (lang === "pl" ? `${event.kind} · ${event.venue}` : `${kindLabel(t, event.kind)} · ${venueLabel(t, event.venue)}`),
    openGraph: event.image ? { images: [event.image.large] } : undefined,
  }
}

/** Karta wydarzenia (design.md §6.11) */
export default async function EventPage({ params }: PageProps<"/[lang]/wydarzenia/[slug]">) {
  const lang = await getLang()
  return (
    // Pasek zakupu (76 px) zastępuje tu dolną nawigację – stopka i scroll-padding biorą jego wysokość
    <div style={{ "--bottom-nav-h": "calc(76px + env(safe-area-inset-bottom))" } as React.CSSProperties}>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {getDictionary(lang).common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pb-16">
        <Container className="max-w-3xl py-2 lg:hidden">
          <BackLink lang={lang} />
        </Container>
        {/* Adres (params) czytamy w granicy Suspense – wspólna powłoka strony nie zależy od wydarzenia */}
        <Suspense fallback={<EventSkeleton label={getDictionary(lang).event.details.loading} />}>
          <EventContent params={params} />
        </Suspense>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}

async function EventContent({ params }: Pick<PageProps<"/[lang]/wydarzenia/[slug]">, "params">) {
  const { slug } = await params
  const lang = await getLang()
  const found = findEvent(slug)
  if (!found) notFound()
  // Stary lub skrócony adres („/wydarzenia/2558”) → kanoniczny z tytułem w języku strony
  const event = localizeEvent(found, lang)
  if (slug !== eventSlug(event)) permanentRedirect(localizedPath(lang, eventHref(event)))

  return <EventView id={event.id} />
}

function EventSkeleton({ label }: { label: string }) {
  return (
    <Container className="max-w-3xl" role="status" aria-busy="true" aria-label={label}>
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
  await loadOverrides()

  const lang = await getLang()
  const t = getDictionary(lang)
  const event = localizeEvent(events.find((e) => e.id === id)!, lang)
  const programPdf = getOverride(event.id)?.programPdf ?? event.programPdf
  const now = nowKey(new Date())
  const upcoming = event.dates.filter((d) => d >= now.slice(0, 10))
  const date = upcoming[0] ?? event.dates.at(-1)!
  const past = upcoming.length === 0
  const details = eventDetails(id)
  const copy = t.event.details
  const visitor = visitorRouteCopy(lang)
  const accessItems = visitor?.visit.accessItems ?? buildingAccess
  const firstVisitCards = visitor?.start.cards ?? firstVisit.map((card) => [card.title, card.text] as const)
  const similar = similarEvents(event, now, [recommended.featuredId, ...recommended.otherIds]).map((s) => ({
    ...s,
    event: localizeEvent(s.event, lang),
  }))
  const exhibition = isExhibition(event)
  const price = eventPrice(event, t)
  const venueName = venueLabel(t, event.venue)
  const series = seriesLabel(t, event.series)
  const jsonLd = eventJsonLd({ event, date, lang, venue: venueName })
  const ageMin = toCalendarEvent(event, calendarEditorial).facets.ageMin
  const audience =
    event.kindLabel && / dla /.test(event.kindLabel)
      ? lang === "pl"
        ? forWhom(event.kindLabel, ageMin)
        : `${kindLabel(t, event.kind)}${ageMin ? `, ${copy.ageFrom(ageMin)}` : ""}`
      : undefined
  // Opis w języku strony, gdy jest tłumaczenie; inaczej polski opis z notą o języku i lang="pl"
  const translated = eventDescription(id, lang)
  const descriptionLang = lang === "pl" || translated ? undefined : "pl"
  const why = translated ? translated.lead : (event.lead ?? details.paragraphs[0])
  const moreText = translated
    ? translated.more
    : details.paragraphs.filter((p) => !why || !why.startsWith(p.slice(0, 40)))
  // Odsłuch wydarzenia pokazujemy na górze tylko wtedy, gdy nie ma odsłuchów przy utworach
  const eventAudio = fragments[id] ? undefined : heroFragment(id)

  const when = exhibition
    ? `${formatShortDate(date, t)} · ${formatTime(date)}–16:00`
    : `${formatShortDate(date, t)} · ${formatTimeRange(date, event.durationMin)}`

  const crumbs = [
    { label: t.calendar.title, href: localizedPath(lang, "/repertuar") },
    ...(series && event.series
      ? [{ label: series, href: localizedPath(lang, `/cykl/${seriesKey(event.series)}`) }]
      : []),
    { label: event.headline },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Telefon: jedna kolumna + pasek zakupu na dole. Desktop (§6.11): treść 7/12 po lewej, przyklejony panel biletowy 4/12 po prawej */}
      <Container className="max-w-3xl lg:max-w-[1120px]">
        <Breadcrumbs label={t.common.breadcrumbs} items={crumbs} className="hidden border-b border-line lg:flex" />
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className={cn("min-w-0", past ? "lg:col-span-12 lg:max-w-3xl" : "lg:col-span-7")}>
        {/* Pierwszy ekran: CO? KIEDY? GDZIE? ZA ILE? DLA KOGO? KUP BILET (pasek na dole) */}
        <Photo
          src={event.image?.large}
          alt={event.headline}
          chamfer
          priority
          sizes="(min-width: 1024px) 640px, (min-width: 768px) 768px, 100vw"
          className="-mx-4 sm:mx-0"
        />

        <div className="mt-5 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow>{kindLabel(t, event.kind)}</Eyebrow>
            <TicketStatusBadge event={event} t={t} />
          </div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="type-h1 text-gold">{event.headline}</h1>
            {!past && <FavoriteButton eventId={event.id} lang={lang} className="mt-1" />}
          </div>
          {event.subtitle && <div className="font-heading text-xl font-semibold text-text">{event.subtitle}</div>}
        </div>

        <FactList
          className="mt-5"
          facts={[
            { label: t.event.facts.when, value: past ? `${when} · ${copy.past}` : when },
            { label: t.event.facts.where, value: venueName },
            {
              label: copy.price,
              value: price ?? (
                <Link href={localizedPath(lang, ticketHref(event))} className="inline-flex min-h-11 items-center underline underline-offset-4">
                  {copy.pricesOnline}
                </Link>
              ),
            },
            ...(audience ? [{ label: copy.forWhom, value: audience }] : []),
          ]}
        />

        {eventAudio && (
          <div className="mt-4 border-y border-line py-3">
            <FragmentPlayer fragment={eventAudio} label={event.headline} lang={lang} />
          </div>
        )}

        {series && (
          <Link
            href={localizedPath(lang, `/cykl/${seriesKey(event.series)}`)}
            className={cn(buttonVariants({ variant: "link" }), "mt-2 whitespace-normal")}
          >
            {copy.series(series)} →
          </Link>
        )}

        <OtherDates dates={upcoming.slice(1)} t={t} />

        {why && (
          <Block id="dlaczego" title={exhibition ? copy.whyExhibition : copy.why}>
            {descriptionLang && <p className="mb-3 type-meta text-text-muted">{copy.descriptionNote}</p>}
            <p className="type-body-lg max-w-[68ch] text-text" lang={descriptionLang}>
              {why}
            </p>
            {moreText.length > 0 && (
              <details className="group mt-4">
                <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">{copy.readMore}</span>
                  <span className="hidden group-open:inline">{copy.collapse}</span>
                </summary>
                <div className="mt-3 flex max-w-[68ch] flex-col gap-4 type-body text-text" lang={descriptionLang}>
                  {moreText.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
            )}
          </Block>
        )}

        {details.artists.length > 0 && (
          <Block id="wykonawcy" title={copy.artists}>
            <ul className="border-t border-line">
              {details.artists.map((a) => (
                <li key={a.name} className="flex flex-col border-b border-line py-3">
                  {artistByName(a.name) ? (
                    <Link
                      href={localizedPath(lang, `/artysci/${artistByName(a.name)!.slug}`)}
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
          <Block id="program" title={copy.program}>
            <ol className="border-t border-line">
              {details.program.map((p, i) => (
                <li key={i} className="flex flex-col border-b border-line py-3">
                  {p.composer && <span className="font-semibold text-text">{p.composer}</span>}
                  <span className="text-text">{p.work}</span>
                  {fragments[id]?.[i] && (
                    <FragmentPlayer
                      fragment={fragments[id][i]}
                      label={[p.composer, p.work].filter(Boolean).join(", ")}
                      lang={lang}
                    />
                  )}
                </li>
              ))}
            </ol>
          </Block>
        )}

        {!exhibition && (details.program.length > 0 || programPdf) && (
          <Block id="program-koncertu" title={copy.programTitle}>
            {programPdf ? (
              <a
                href={programPdf}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "secondary" })}
              >
                {copy.programPdf}
              </a>
            ) : (
              <p className="max-w-[68ch] type-body text-text">{copy.programOnline}</p>
            )}
          </Block>
        )}

        {!exhibition && (event.durationMin || details.intermission) && (
          <Block id="czas" title={copy.durationTitle}>
            <p className="type-body text-text">
              {[
                event.durationMin && copy.durationApprox(formatDuration(event.durationMin)!),
                event.durationMin && copy.durationEnd(formatTimeRange(date, event.durationMin).split("–")[1]),
                details.intermission && copy.intermission[details.intermission],
              ]
                .filter(Boolean)
                .join(", ")}
              .
            </p>
          </Block>
        )}

        <Block id="dostepnosc" title={copy.accessibility}>
          <ul className="flex flex-col gap-3">
            {accessItems.map((item) => (
              <li key={item} className="flex gap-3 type-body text-text">
                <Check {...iconProps} className="mt-1 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[68ch] type-body text-text">
            {visitor ? visitor.visit.access : `${accessAssistance} ${accessTickets}`}
          </p>
          <a
            href={`tel:${boxOffice.phone.replaceAll(" ", "")}`}
            className={cn(buttonVariants({ variant: "link" }), "mt-1")}
          >
            {copy.boxOffice(boxOffice.phone)}
          </a>
        </Block>

        {!exhibition && (
          <Block id="pierwszy-raz" title={copy.firstTime}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {firstVisitCards.map(([title, text]) => (
                <li key={title} className="border-[1.5px] border-line-strong p-4">
                  <h3 className="type-h4 text-text">{title}</h3>
                  <p className="mt-1 type-body text-text">{text}</p>
                </li>
              ))}
            </ul>
            {/* Szatnia, spóźnienie, oklaski, dostępność – reszta odpowiedzi dla debiutanta */}
            <Link href={localizedPath(lang, "/faq")} className={cn(buttonVariants({ variant: "link" }), "mt-3")}>
              {faqPage[lang].more}
            </Link>
          </Block>
        )}

        {!past && (
          <Block id="zaplanuj" title={copy.plan} className="lg:hidden">
            <EventActions
              title={event.title}
              date={date}
              durationMin={event.durationMin}
              venue={event.venue}
              address={address}
              phone={boxOffice.phone}
              lang={lang}
            />
          </Block>
        )}
        </div>
        {!past && (
          <TicketPanel
            event={event}
            date={date}
            price={price}
            venueName={venueName}
            t={t}
            lang={lang}
          />
        )}
        </div>
      </Container>

      {similar.length > 0 && (
        <Container>
          <Block id="podobne" title={copy.similar}>
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
              {similar.map((s) => (
                <EventCard lang={lang} key={s.event.id} event={s.event} date={s.date} />
              ))}
            </div>
          </Block>
        </Container>
      )}

      {!past && <BuyBar event={event} date={date} price={eventPriceFrom(event, t)} t={t} lang={lang} />}
      {/* Desktop: heksagon asystenta w prawym dolnym rogu, jak na pozostałych stronach (na telefonie jest w pasku zakupu) */}
      <div className="hidden lg:block">
        <AssistantFab lang={lang} events={eventCards} venue={venue} label={t.nav.assistantAi} hint={t.nav.assistantHint} />
      </div>
    </>
  )
}

/** Sekcja karty: złoty nagłówek h2 w rozmiarze h3 (karta ma wiele sekcji) */
function Block({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section aria-labelledby={id} className={cn("mt-12", className)}>
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
function OtherDates({ dates, t }: { dates: string[]; t: Dictionary }) {
  if (dates.length === 0) return null
  const copy = t.event.details
  const byDay = new Map<string, string[]>()
  for (const d of dates) byDay.set(d.slice(0, 10), [...(byDay.get(d.slice(0, 10)) ?? []), formatTime(d)])
  const days = [...byDay.entries()]
  const shown = days.slice(0, 5)
  const rest = days.length - shown.length

  return (
    <div className="mt-6">
      <h2 className="type-h4 text-gold">{copy.otherDates}</h2>
      <ul className="mt-2 flex flex-col">
        {shown.map(([day, times]) => (
          <li key={day} className="type-meta text-text tabular-nums">
            {formatShortDate(day, t)} · {times.join(t.event.timesJoin)}
          </li>
        ))}
      </ul>
      {rest > 0 && (
        <p className="mt-1 type-meta text-text-muted">{copy.moreDays(rest, formatShortDate(days.at(-1)![0], t))}</p>
      )}
    </div>
  )
}

/**
 * Przyklejony pasek zakupu (§6.11): czerń, 76 px + safe area. Na karcie wydarzenia zastępuje dolną
 * nawigację (§6.4) – nawigacja wraca po przejściu do innej strony. Heksagon asystenta stoi w pasku
 * między terminem a „Kup bilet”, więc nie pływa nad treścią (wariant F4b).
 */
function BuyBar({
  event,
  date,
  price,
  t,
  lang,
}: {
  event: FsEvent
  date: string
  price?: string
  t: Dictionary
  lang: Locale
}) {
  const status = ticketStatus(event.id)
  const statusLabel = t.event.status[status]
  const soldout = status === "soldout"

  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-40 bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden shadow-[0_-4px_16px_rgba(26,26,26,.08)]">
      <Container className="flex h-[76px] max-w-3xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-heading text-[1.375rem] leading-tight font-semibold text-on-dark tabular-nums">
            {price ?? `${formatShortDate(date, t)} · ${formatTime(date)}`}
          </p>
          <p className="truncate type-meta text-on-dark-muted">
            {[statusLabel, price ? `${formatShortDate(date, t)} · ${formatTime(date)}` : venueLabel(t, event.venue)]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <AssistantDialog
            lang={lang}
            events={eventCards}
            venue={venue}
            label={t.nav.assistantAi}
            className="press group cursor-pointer focus-visible:outline-none"
          >
            <AiHexagon tone="on-dark" />
          </AssistantDialog>
          {soldout ? (
            <span aria-disabled="true" className={cn(buttonVariants({ variant: "inverted" }), "shrink-0 opacity-60")}>
              {statusLabel}
            </span>
          ) : (
            <Link href={localizedPath(lang, ticketHref(event))} className={cn(buttonVariants({ variant: "inverted" }), "shrink-0")}>
              {t.event.buyTicket}
            </Link>
          )}
        </div>
      </Container>
    </div>
  )
}

/**
 * Panel biletowy na desktopie (§6.11): przyklejony po prawej stronie treści. Data, godzina, sala, cena,
 * status i „Kup bilet” są stale w zasięgu wzroku – kupujący nie musi wracać na górę strony.
 * Na telefonie jego rolę pełni pasek zakupu na dole ekranu.
 */
function TicketPanel({
  event,
  date,
  price,
  venueName,
  t,
  lang,
}: {
  event: FsEvent
  date: string
  price?: string
  venueName: string
  t: Dictionary
  lang: Locale
}) {
  const status = ticketStatus(event.id)
  const soldout = status === "soldout"
  const copy = t.event.details
  return (
    <aside aria-label={t.event.buyTicket} className="hidden lg:col-span-4 lg:col-start-9 lg:block">
      <div className="sticky top-[calc(var(--header-h)+1.5rem)] mt-8 flex flex-col gap-5 border-[1.5px] border-line-strong bg-background p-6">
        <div>
          <p className="font-heading text-[1.75rem] leading-tight font-semibold text-text tabular-nums">
            {formatShortDate(date, t)}
          </p>
          <p className="font-heading text-[1.75rem] leading-tight font-semibold text-gold tabular-nums">
            {formatTimeRange(date, event.durationMin)}
          </p>
          <p className="mt-2 type-meta text-text-muted">{venueName}</p>
        </div>

        <div className="flex items-center justify-between gap-3 border-y border-line py-3">
          <p className="type-ui text-text">{price ?? copy.pricesOnline}</p>
          <TicketStatusBadge event={event} t={t} />
        </div>

        {soldout ? (
          <span aria-disabled="true" className={buttonVariants({ variant: "primary", block: true })}>
            {t.event.status.soldout}
          </span>
        ) : (
          <Link href={localizedPath(lang, ticketHref(event))} className={buttonVariants({ variant: "primary", block: true })}>
            {t.event.buyTicket}
          </Link>
        )}

        <EventActions
          title={event.title}
          date={date}
          durationMin={event.durationMin}
          venue={event.venue}
          address={address}
          phone={boxOffice.phone}
          lang={lang}
          stacked
        />
      </div>
    </aside>
  )
}
