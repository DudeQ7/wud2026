import { siteUrl } from "@/app/site-url"
import { ticketStatus } from "@/content/availability"
import { boxOffice } from "@/content/home"
import { type Locale, locales, localizedPath } from "@/i18n/config"
import { type FsEvent, eventHref, isExhibition } from "@/lib/event-format"

const ORGANIZATION = {
  "@type": "Organization",
  name: "Filharmonia im. Mieczysława Karłowicza w Szczecinie",
  url: "https://filharmonia.szczecin.pl",
}

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "ul. Małopolska 48",
  postalCode: "70-515",
  addressLocality: "Szczecin",
  addressCountry: "PL",
}

/** Organizacja i witryna – jeden blok na stronie głównej (SEO i widoczność dla LLM). */
export function siteJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...ORGANIZATION,
        logo: `${siteUrl}/icons/icon.png`,
        address: ADDRESS,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: boxOffice.phone,
          email: boxOffice.email,
          contactType: "customer service",
          availableLanguage: ["pl", "en", "de", "uk"],
        },
      },
      {
        "@type": "WebSite",
        name: "Filharmonia im. Mieczysława Karłowicza w Szczecinie",
        url: siteUrl,
        inLanguage: locales,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}${localizedPath(lang, "/szukaj")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }
}

function addMinutes(date: string, minutes: number) {
  const value = new Date(`${date}:00Z`)
  value.setUTCMinutes(value.getUTCMinutes() + minutes)
  return value.toISOString().slice(0, 16)
}

function lowestPrice(prices: string[]) {
  const values = prices
    .flatMap((price) => (price.match(/\d+/g) ?? []).map(Number))
    .filter((value) => Number.isFinite(value) && value > 0)
  return values.length ? Math.min(...values) : undefined
}

/**
 * Dane strukturalne karty wydarzenia (schema.org/Event) – dla wyszukiwarek i asystentów LLM
 * (transkrypt: użytkownicy pytają czaty, a nie tylko Google). Opis tylko po polsku, bo taki jest w danych FS.
 */
export function eventJsonLd({
  event,
  date,
  lang,
  venue,
}: {
  event: FsEvent
  date: string
  lang: Locale
  venue: string
}) {
  const status = ticketStatus(event.id)
  const price = lowestPrice(event.prices)
  const exhibition = isExhibition(event)
  const last = event.dates.at(-1)
  const url = `${siteUrl}${localizedPath(lang, eventHref(event))}`

  return {
    "@context": "https://schema.org",
    "@type": exhibition ? "ExhibitionEvent" : "Event",
    name: event.title,
    ...(lang === "pl" && event.lead ? { description: event.lead } : {}),
    startDate: date,
    endDate: exhibition && last ? `${last.slice(0, 10)}T16:00` : event.durationMin ? addMinutes(date, event.durationMin) : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: lang,
    url,
    ...(event.image?.large ? { image: event.image.large } : {}),
    ...(event.url ? { sameAs: event.url } : {}),
    location: {
      "@type": "MusicVenue",
      name: venue,
      address: ADDRESS,
    },
    organizer: ORGANIZATION,
    ...(event.artists.length
      ? {
          performer: event.artists.map((artist) => ({
            "@type": "Person",
            name: artist.split(/ [-–] /)[0],
          })),
        }
      : {}),
    ...(event.ticketsUrl
      ? {
          offers: {
            "@type": "Offer",
            url: event.ticketsUrl,
            priceCurrency: "PLN",
            ...(price ? { price } : {}),
            availability:
              status === "soldout"
                ? "https://schema.org/SoldOut"
                : status === "last"
                  ? "https://schema.org/LimitedAvailability"
                  : "https://schema.org/InStock",
          },
        }
      : {}),
  }
}
