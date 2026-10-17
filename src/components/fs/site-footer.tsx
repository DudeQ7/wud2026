import { ArrowRight } from "lucide-react"
import Link from "next/link"

import visit from "@/data/visit.json"
import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { Logo } from "@/components/fs/wordmark"
import { address, footerLinks } from "@/content/home"
import { type Locale, getDictionary, localizedPath, locales, languageNames } from "@/i18n"

/**
 * Stopka (§6.18): czerń, logo białe. Kontakt z kasą zawsze w tym samym miejscu (WCAG 3.2.6).
 * Dolny margines robi miejsce na przyklejoną dolną nawigację.
 */
export function SiteFooter({ lang }: { lang: Locale }) {
  const t = getDictionary(lang)
  return (
    <footer className="on-dark bg-ink pt-10 pb-[calc(var(--bottom-nav-h)+2.5rem)]">
      <Container className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <Logo lang={lang} tone="light" className="-ml-2 h-28" />
          <p className="type-meta text-on-dark-muted">{address}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Eyebrow tone="dark">{t.footer.boxOffice}</Eyebrow>
          <p className="type-meta whitespace-pre-line text-on-dark-muted">{lang === "pl" ? visit.boxOffice.hours : t.footer.boxOfficeHours}</p>
          <a
            href={`tel:${visit.boxOffice.phone.replaceAll(" ", "")}`}
            className="flex min-h-11 w-fit items-center font-semibold underline underline-offset-4"
          >
            {visit.boxOffice.phone}
          </a>
          <a
            href={`mailto:${visit.boxOffice.email}`}
            className="flex min-h-11 w-fit items-center font-semibold underline underline-offset-4"
          >
            {visit.boxOffice.email}
          </a>
        </div>

        <nav aria-label={t.footer.navLabel}>
          <ul>
            {footerLinks.map(({ key, href }) => (
              <li key={href} className="border-t border-line-on-dark">
                <Link
                  href={localizedPath(lang, href)}
                  className="flex min-h-12 items-center justify-between font-semibold hover:underline hover:underline-offset-4"
                >
                  {t.footer.links[key]}
                  <ArrowRight {...iconProps} className="size-5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.common.language} className="flex gap-3 lg:col-span-3">
          {locales.map((code) => (
            <Link key={code} href={localizedPath(code, "/")} lang={code} hrefLang={code} aria-label={languageNames[code]} aria-current={code === lang ? "true" : undefined} className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center font-semibold hover:underline hover:underline-offset-4 focus-visible:underline">
              {code.toUpperCase()}
            </Link>
          ))}
        </nav>
        <p className="type-meta text-on-dark-muted lg:col-span-3">
          {t.footer.copyright}
        </p>
      </Container>
    </footer>
  )
}
