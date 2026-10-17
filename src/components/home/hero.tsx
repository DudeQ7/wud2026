import Image from "next/image"

import { FactList } from "@/components/fs/event-meta"
import { Container, Eyebrow } from "@/components/fs/layout"
import { buttonVariants } from "@/components/ui/button"
import { type FsEvent, formatLineup, formatSeries, formatShortDate, formatTime } from "@/lib/event-format"
import { cn } from "@/lib/utils"

type HeroProps = {
  event: FsEvent
  date: string
  /** Kadrowanie zdjęcia na twarz (object-position) – bez edycji pliku */
  photoPosition?: string
}

/**
 * Otwarcie strony głównej (§6.5): jedno zdjęcie w oryginale + najbliższe wydarzenie.
 * Tekst nie leży na zdjęciu – stoi na białym panelu ze ściętym narożnikiem.
 */
export function Hero({ event, date, photoPosition = "50% 30%" }: HeroProps) {
  const when = `${formatShortDate(date)} · ${formatTime(date)}`
  const lineup = formatLineup(event)
  const series = formatSeries(event.series)

  return (
    <section aria-labelledby="hero-title">
      <div className="relative h-[calc(100svh-var(--bottom-nav-h))] max-h-[56rem] min-h-[34rem] overflow-hidden bg-surface-muted">
        {event.image && (
          <Image
            src={event.image.large}
            alt={`${event.headline} – zdjęcie artysty`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: photoPosition }}
          />
        )}

        <div className="absolute inset-x-0 bottom-0">
          <Container className="px-0 sm:px-6 lg:px-8">
            <div className="chamfer-tr flex flex-col gap-1 bg-background px-4 pt-5 pb-8 sm:max-w-xl sm:px-6 lg:px-8 lg:pt-8">
              <Eyebrow>
                {event.kind} · {when}
              </Eyebrow>
              <h1 id="hero-title" className="type-h1 text-gold">
                {event.headline}
              </h1>
              {event.subtitle && <p className="font-heading text-xl font-semibold text-text">{event.subtitle}</p>}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={event.ticketsUrl} className={cn(buttonVariants({ variant: "primary" }))}>
                  Kup bilet
                </a>
                <a href={event.url} className={cn(buttonVariants({ variant: "secondary" }))}>
                  Zobacz
                </a>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <div className="flex max-w-xl flex-col gap-6 pt-2 pb-16">
          {event.lead && <p className="type-body text-text">{event.lead}</p>}
          <FactList
            facts={[
              { label: "Kiedy", value: when },
              { label: "Gdzie", value: event.venue },
              ...(lineup ? [{ label: "Skład", value: lineup }] : []),
              // Podstron cykli jeszcze nie ma – nazwa cyklu bez linku
              ...(series ? [{ label: "Cykl", value: series }] : []),
            ]}
          />
        </div>
      </Container>
    </section>
  )
}
