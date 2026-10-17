// Wersje językowe (brief: PL / EN / DE). Polski jest domyślny i nie ma prefiksu w adresie,
// EN i DE mają: /en/repertuar, /de/repertuar. Moduł jest czysty – działa na serwerze, w proxy i w przeglądarce.

export const locales = ["pl", "en", "de"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "pl"

/** Nazwy języków w ich własnym języku – w przełączniku i dla czytników ekranu */
export const languageNames: Record<Locale, string> = { pl: "Polski", en: "English", de: "Deutsch" }

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value)

/** „/repertuar” → „/en/repertuar”; dla polskiego adres bez zmian */
export function localizedPath(lang: Locale, path: string) {
  if (lang === defaultLocale) return path
  return path === "/" ? `/${lang}` : `/${lang}${path}`
}

/** „/en/repertuar” → „/repertuar” – ten sam adres bez prefiksu języka */
export function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split("/")
  if (!hasLocale(first)) return pathname
  return `/${rest.join("/")}`
}
