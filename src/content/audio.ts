// Odsłuchy fragmentów (design.md §6.12). Docelowo pola w CMS: plik audio ~1 min przy utworze
// i link do pełnego nagrania. Odtwarzacz zna tylko adres pliku, więc źródło (pliki FS albo platforma
// streamingowa) można zmienić bez dotykania komponentu. Dane FS nie zawierają jeszcze nagrań,
// dlatego jedyny wpis to próbka demonstracyjna – oznaczona w interfejsie, nie podawana za nagranie.

export type Fragment = {
  src: string
  durationSec: number
  /** Link do pełnego nagrania (platforma streamingowa lub FS) */
  fullUrl?: string
  /** Próbka na potrzeby pokazu – nie jest nagraniem utworu */
  demo?: boolean
}

/** Odsłuch przypisany do wydarzenia jako całości (hero), gdy w danych brak programu z utworami */
export const eventFragments: Record<number, Fragment> = {
  2608: { src: "/audio/demo-fragment.mp3", durationSec: 60, demo: true },
}

/** Fragment do hero: odsłuch całego wydarzenia, a w jego braku pierwszy utwór programu */
export function heroFragment(eventId: number): Fragment | undefined {
  return eventFragments[eventId] ?? fragments[eventId]?.[0]
}

/** id wydarzenia → indeks utworu w programie → fragment */
export const fragments: Record<number, Record<number, Fragment>> = {
  2551: { 0: { src: "/audio/demo-fragment.mp3", durationSec: 60, demo: true } },
}
