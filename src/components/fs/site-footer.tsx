import { ArrowRight } from "lucide-react"
import Link from "next/link"

import visit from "@/data/visit.json"
import { iconProps } from "@/components/fs/icons"
import { FundersBar } from "@/components/fs/funders-bar"
import { Container, Eyebrow } from "@/components/fs/layout"
import { PrivacySettingsButton } from "@/components/fs/privacy-settings-button"
import { Logo } from "@/components/fs/wordmark"
import { address, footerLinks } from "@/content/home"
import { type Locale, getDictionary, localizedPath } from "@/i18n"

/**
 * Stopka (§6.18): czerń, logo białe. Kontakt z kasą zawsze w tym samym miejscu (WCAG 3.2.6).
 * Dolny margines robi miejsce na przyklejoną dolną nawigację.
 */
export function SiteFooter({ lang }: { lang: Locale }) {
  const t = getDictionary(lang)
  return (
    <footer className="on-dark bg-ink pt-10 pb-[calc(var(--bottom-nav-h)+6rem)] lg:pb-28">
      <Container className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <Logo lang={lang} tone="light" className="-ml-2 h-28" />
          <p className="type-meta text-on-dark-muted">{address}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Eyebrow tone="dark">{t.footer.boxOffice}</Eyebrow>
          <p className="type-meta whitespace-pre-line text-on-dark-muted">{t.footerPages.contact.hours}</p>
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

        <FundersBar lang={lang} tone="dark" className="border-t border-line-on-dark pt-6 lg:col-span-3" />

        <div className="flex flex-col gap-1 lg:col-span-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="type-meta text-on-dark-muted">{t.footer.copyright}</p>
          <PrivacySettingsButton lang={lang} />
        </div>
      </Container>
    </footer>
  )
}
