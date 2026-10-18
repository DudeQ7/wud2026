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

const demoFragment: Fragment = { src: "/audio/demo-fragment.mp3", durationSec: 60, demo: true }

/** Odsłuch przypisany do wydarzenia jako całości (hero i wydarzenia demo bez listy utworów w danych) */
export const eventFragments: Record<number, Fragment> = {
  2601: demoFragment,
  2608: demoFragment,
  2612: demoFragment,
  2623: demoFragment,
}

/** Fragment do hero: odsłuch całego wydarzenia, a w jego braku pierwszy utwór programu */
export function heroFragment(eventId: number): Fragment | undefined {
  return eventFragments[eventId] ?? fragments[eventId]?.[0]
}

/** id wydarzenia → indeks utworu w programie → fragment (wydarzenia ze scenariuszy demo) */
export const fragments: Record<number, Record<number, Fragment>> = {
  2550: { 0: demoFragment },
  2551: { 0: demoFragment },
  2597: { 0: demoFragment },
}
