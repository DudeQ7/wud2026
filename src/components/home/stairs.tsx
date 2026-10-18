import Link from "next/link"

import { Container, SectionHeading } from "@/components/fs/layout"
import { buttonVariants } from "@/components/ui/button"
import { ticketStatus } from "@/content/availability"
import { STAIRS_EVENT_COUNT, stairsAccess, stairsOutfit } from "@/content/stairs"
import { type Locale, getDictionary, kindLabel, localizedPath, venueLabel } from "@/i18n"
import { eventLead } from "@/i18n/events/descriptions"
import {
  addDays,
  eventHref,
  formatDateBadge,
  formatDuration,
  formatTime,
  ticketHref,
  upcomingConcerts,
} from "@/lib/events"
import { cn } from "@/lib/utils"

import { type StairsItem, StairsClient } from "./stairs-client"

/**
 * 3. Najbliższe wydarzenia jako schody (docs/schody/schody_design.md): 9 najbliższych koncertów
 * na trzech piętrach spirali, od najbliższego (u góry). Hint z dostępnością i strojem wisi pod plakatem w focusie.
 */
export function StairsSection({ today, lang }: { today: string; lang: Locale }) {
  const t = getDictionary(lang)
  const text = t.home.stairs

  // Funkcji ze słownika nie można przekazać do komponentu klienckiego – tylko teksty
  const { selectEvent, ...clientText } = text

  // upcomingConcerts liczy od dnia po podanym, więc cofamy o dzień, żeby wliczyć dzisiejsze koncerty
  const items: StairsItem[] = upcomingConcerts(addDays(today, -1), STAIRS_EVENT_COUNT, [], lang).map(
    ({ event, date }) => {
      const status = ticketStatus(event.id)
      return {
        id: event.id,
        title: event.headline,
        subtitle: event.subtitle,
        kind: kindLabel(t, event.kind),
        badge: formatDateBadge(date, t),
        label: selectEvent(event.headline, formatDateBadge(date, t)),
        time: formatTime(date),
        venue: venueLabel(t, event.venue),
        duration: formatDuration(event.durationMin),
        // Zdanie „dlaczego warto”: po polsku z danych, w EN/DE/UK tylko przetłumaczone (jak w EventCard)
        lead: eventLead(event, lang),
        image: event.image?.card,
        href: localizedPath(lang, eventHref(event)),
        buyHref: localizedPath(lang, ticketHref(event)),
        status,
        statusLabel: t.event.status[status],
      }
    }
  )

  return (
    // Nagłówek i przycisk w kolumnie treści, a schody od krawędzi do krawędzi ekranu na każdej szerokości
    <section aria-labelledby="najblizsze" className="bg-background pt-8 pb-16 lg:pt-12 lg:pb-24">
      <Container>
        <SectionHeading id="najblizsze" title={text.title} lead={text.cue} />
      </Container>
      <StairsClient items={items} access={stairsAccess} outfit={stairsOutfit} text={clientText} />
      <Container>
        <Link
          href={localizedPath(lang, "/repertuar")}
          className={cn(buttonVariants({ variant: "secondary", block: true }), "mt-6 sm:w-fit")}
        >
          {text.all}
        </Link>
      </Container>
    </section>
  )
}
