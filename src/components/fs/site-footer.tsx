import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { iconProps } from "@/components/fs/icons"
import { Container, Eyebrow } from "@/components/fs/layout"
import { Logo } from "@/components/fs/wordmark"
import { address, boxOffice, footerLinks } from "@/content/home"

/**
 * Stopka (§6.18): czerń, logo białe. Kontakt z kasą zawsze w tym samym miejscu (WCAG 3.2.6).
 * Dolny margines robi miejsce na przyklejoną dolną nawigację.
 */
export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink pt-10 pb-[calc(var(--bottom-nav-h)+2.5rem)]">
      <Container className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <Logo tone="light" className="-ml-2 h-28" />
          <p className="type-meta text-on-dark-muted">{address}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Eyebrow tone="dark">Kasa biletowa</Eyebrow>
          <p className="type-meta whitespace-pre-line text-on-dark-muted">{boxOffice.summary}</p>
          <a
            href={`tel:${boxOffice.phone.replaceAll(" ", "")}`}
            className="flex min-h-11 w-fit items-center font-semibold underline underline-offset-4"
          >
            {boxOffice.phone}
          </a>
          <a
            href={`mailto:${boxOffice.email}`}
            className="flex min-h-11 w-fit items-center font-semibold underline underline-offset-4"
          >
            {boxOffice.email}
          </a>
        </div>

        <nav aria-label="Stopka">
          <ul>
            {footerLinks.map(({ label, href }) => (
              <li key={href} className="border-t border-line-on-dark">
                <Link
                  href={href}
                  className="flex min-h-12 items-center justify-between font-semibold hover:underline hover:underline-offset-4"
                >
                  {label}
                  <ArrowRight {...iconProps} className="size-5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 lg:col-span-3">
          <nav aria-label="Wersja językowa" className="flex items-center gap-3 font-semibold">
            <Link href="/" lang="pl" hrefLang="pl" aria-current="true" className="flex min-h-11 items-center font-bold underline underline-offset-4">
              PL
            </Link>
            <span aria-hidden>|</span>
            <a href="/en" lang="en" hrefLang="en" className="flex min-h-11 items-center">
              EN
            </a>
            <span aria-hidden>|</span>
            <a href="/de" lang="de" hrefLang="de" className="flex min-h-11 items-center">
              DE
            </a>
          </nav>
          <p className="type-meta text-on-dark-muted">© 2026 Filharmonia im. Mieczysława Karłowicza w Szczecinie</p>
        </div>
      </Container>
    </footer>
  )
}
