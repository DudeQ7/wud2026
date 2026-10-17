import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"

import { siteUrl } from "@/app/site-url"
import { fontVariables } from "@/app/fonts"
import { getDictionary, hasLocale, locales } from "@/i18n"

import "../globals.css"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const { title, description } = getDictionary(lang).meta.home
  return { metadataBase: new URL(siteUrl), title, description }
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
}

/** Główny layout stron publicznych: `lang` z adresu trafia do <html lang> (WCAG 3.1.1) */
export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  // Tylko PL / EN / DE – inny prefiks to 404
  if (!hasLocale(lang)) notFound()

  return (
    <html lang={lang} className={fontVariables}>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
