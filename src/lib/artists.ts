import artysci from "@/data/artysci.json"
import { fold } from "@/lib/calendar"
import { events, nextDate, nowKey } from "@/lib/events"

// Profile artystów z ludzie__*.md (ScrappedData/scraper/build-artysci.mjs), tylko osoby i zespoły
// występujące w nadchodzących wydarzeniach. Serwer: importuje cały plik z biogramami.

export type Artist = { slug: string; name: string; bio: string[]; photo?: string; caption?: string }

export const artists: Artist[] = Object.entries(artysci as Record<string, Omit<Artist, "slug">>)
  .map(([slug, a]) => ({ slug, ...a }))
  .sort((a, b) => a.name.localeCompare(b.name, "pl"))

const bySlug = new Map(artists.map((a) => [a.slug, a]))
const byName = new Map(artists.map((a) => [fold(a.name), a]))

export const getArtist = (slug: string) => bySlug.get(slug)

/** Nazwa z pola artists („Imię Nazwisko – rola” albo „Imię Nazwisko - rola”) → profil, jeśli istnieje */
export const artistByName = (name: string) => byName.get(fold(name.split(/ [-–] /)[0]))

/** Nadchodzące wydarzenia artysty, od najbliższego */
export function eventsOfArtist(artist: Artist, now = nowKey(new Date())) {
  const key = fold(artist.name)
  return events
    .filter((e) => e.artists.some((a) => fold(a.split(/ [-–] /)[0]) === key))
    .map((event) => ({ event, date: nextDate(event, now) }))
    .filter((x): x is { event: (typeof events)[number]; date: string } => Boolean(x.date))
    .sort((a, b) => a.date.localeCompare(b.date))
}
