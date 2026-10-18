import Image from "next/image"

import { FactList, TicketStatusBadge } from "@/components/fs/event-meta"
import { Container, Eyebrow } from "@/components/fs/layout"
import { HeroListen } from "@/components/home/hero-listen"
import { buttonVariants } from "@/components/ui/button"
import { heroFragment } from "@/content/audio"
import { type Locale, getDictionary, kindLabel, localizedPath, seriesLabel, venueLabel } from "@/i18n"
import { eventLead } from "@/i18n/events/descriptions"
import { type FsEvent, eventHref, formatLineup, formatShortDate, formatTime, relativeDay } from "@/lib/event-format"
import { cn } from "@/lib/utils"

type HeroProps = {
  event: FsEvent
  date: string
  /** Dzisiejsza data (YYYY-MM-DD) – do etykiety „dziś” / „jutro” */
  today: string
  lang: Locale
  /** Kadrowanie zdjęcia na twarz (object-position) – bez edycji pliku */
  photoPosition?: string
}

/**
 * Otwarcie strony głównej (§6.5): jedno zdjęcie w oryginale + najbliższe wydarzenie.
 * Tekst nie leży na zdjęciu – stoi na białym panelu ze ściętym narożnikiem.
 * Zdanie „dlaczego warto”: po polsku z opisu, w EN/DE/UK tylko gdy jest tłumaczenie (i18n/events/descriptions).
 */
export function Hero({ event, date, today, lang, photoPosition = "50% 30%" }: HeroProps) {
  const t = getDictionary(lang)
  const when = `${formatShortDate(date, t)} · ${formatTime(date)}`
  // Eyebrow: „dziś · 19:00” / „jutro · 19:00”, dalej data; lista faktów zostaje z pełną datą
  const soon = relativeDay(date, today, t)
  const eyebrowWhen = soon ? `${soon} · ${formatTime(date)}` : when
  const fragment = heroFragment(event.id)
  const lineup = formatLineup(event, t)
  const series = seriesLabel(t, event.series)
  const lead = eventLead(event, lang)

  return (
    <section aria-labelledby="hero-title">
      <div className="relative h-[calc(100svh-var(--bottom-nav-h))] max-h-[56rem] min-h-[34rem] overflow-hidden bg-surface-muted landscape-short:min-h-[calc(100svh-var(--bottom-nav-h))]">
        {/* Poziomo: zdjęcie po lewej, treść po prawej – inaczej tytuł i przyciski lądują poza ekranem */}
        <div className="absolute inset-0 landscape-short:right-1/2">
          {event.image && (
            <Image
              src={event.image.large}
              alt={t.event.photoAlt(event.headline)}
              fill
              priority
              sizes="100vw"
              className="object-cover enter-fade"
              style={{ objectPosition: photoPosition }}
            />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 landscape-short:inset-y-0 landscape-short:left-1/2 landscape-short:flex landscape-short:items-center landscape-short:bg-background">
          <Container className="px-0 sm:px-6 lg:px-8 landscape-short:px-0">
            <div className="chamfer-tr enter flex flex-col gap-1 bg-background px-4 pt-5 pb-8 sm:max-w-xl sm:px-6 lg:px-8 lg:pt-8 landscape-short:max-w-none landscape-short:px-6 landscape-short:pt-14 landscape-short:pb-4 landscape-short:[clip-path:none]">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow>
                  {kindLabel(t, event.kind)} · {eyebrowWhen}
                </Eyebrow>
                <TicketStatusBadge event={event} t={t} />
              </div>
              <h1 id="hero-title" className="type-h1 text-gold">
                {event.headline}
              </h1>
              {event.subtitle && <p className="font-heading text-xl font-semibold text-text">{event.subtitle}</p>}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={event.ticketsUrl} className={cn(buttonVariants({ variant: "primary" }))}>
                  {t.event.buyTicket}
                </a>
                <a href={localizedPath(lang, eventHref(event))} className={cn(buttonVariants({ variant: "secondary" }))}>
                  {t.event.see}
                </a>
              </div>
              {fragment && (
                <HeroListen
                  fragment={fragment}
                  label={event.headline}
                  text={{ listen: t.event.listen, pause: t.event.listenPause, demo: t.event.listenDemo }}
                />
              )}
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <div className="flex max-w-xl flex-col gap-6 pt-2 pb-16">
          {lead && <p className="type-body text-text">{lead}</p>}
          <FactList
            facts={[
              { label: t.event.facts.when, value: when },
              { label: t.event.facts.where, value: venueLabel(t, event.venue) },
              ...(lineup ? [{ label: t.event.facts.lineup, value: lineup }] : []),
              // Podstron cykli jeszcze nie ma – nazwa cyklu bez linku
              ...(series ? [{ label: t.event.facts.series, value: series }] : []),
            ]}
          />
        </div>
      </Container>
    </section>
  )
}
