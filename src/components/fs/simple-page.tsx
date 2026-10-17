import * as React from "react"

import { BottomNav } from "@/components/fs/bottom-nav"
import { Container, Eyebrow } from "@/components/fs/layout"
import { SiteFooter } from "@/components/fs/site-footer"
import { SiteHeader } from "@/components/fs/site-header"
import { getDictionary } from "@/i18n"
import { getLang } from "@/i18n/server"

type Props = { eyebrow: string; title: string; lead?: string; source?: string; children: React.ReactNode }

/** Podstrona z treścią redakcyjną: nagłówek, lead, treść, źródło */
export async function SimplePage({ eyebrow, title, lead, source, children }: Props) {
  const lang = await getLang()
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {getDictionary(lang).common.skipLink}
      </a>
      <SiteHeader lang={lang} />
      <main id="tresc" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-1 type-h1 text-gold">{title}</h1>
          {lead && <p className="mt-2 type-body-lg max-w-[68ch] text-text">{lead}</p>}
          {children}
          {source && (
            <p className="mt-10 type-meta text-text-muted">
              Źródło:{" "}
              <a href={source} className="underline underline-offset-[3px]">
                strona Filharmonii
              </a>
            </p>
          )}
        </Container>
      </main>
      <SiteFooter lang={lang} />
      <BottomNav lang={lang} />
    </>
  )
}
