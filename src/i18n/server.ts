import { lang as rootLang } from "next/root-params"

import { type Locale, defaultLocale, hasLocale } from "./config"

/**
 * Język bieżącej strony z segmentu app/[lang] – w dowolnym komponencie serwerowym, bez przekazywania `params`.
 * Root params są znane już przy prerenderze, więc nie wymagają granicy Suspense (next/root-params).
 */
export async function getLang(): Promise<Locale> {
  const value = await rootLang()
  return hasLocale(value) ? value : defaultLocale
}
