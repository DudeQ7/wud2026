import Link from "next/link"

import { BottomNav } from "@/components/fs/bottom-nav"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { buttonVariants } from "@/components/ui/button"
import { getDictionary, localizedPath } from "@/i18n"
import { getLang } from "@/i18n/server"

/** 404 w obrębie wersji językowej – nie gubimy nagłówka, stopki i nawigacji. */
export default async function NotFound() {
  const lang = await getLang()
  const t = getDictionary(lang)

  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pt-12 pb-16 lg:pt-20 lg:pb-24">
        <Container className="max-w-3xl">
          <Eyebrow>{t.notFound.eyebrow}</Eyebrow>
          <h1 className="mt-1 type-h1 text-gold">{t.notFound.title}</h1>
          <p className="mt-3 max-w-[60ch] type-body text-text">{t.notFound.text}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href={localizedPath(lang, "/")} className={buttonVariants({ variant: "primary" })}>
              {t.notFound.home}
            </Link>
            <Link href={localizedPath(lang, "/repertuar")} className={buttonVariants({ variant: "secondary" })}>
              {t.notFound.repertoire}
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}
