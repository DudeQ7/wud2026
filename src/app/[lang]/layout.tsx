import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"

import { siteUrl } from "@/app/site-url"
import { fontVariables } from "@/app/fonts"
import { ConsentAnalytics } from "@/components/fs/consent-analytics"
import { ConsentBanner } from "@/components/fs/consent-banner"
import { getDictionary, hasLocale, locales } from "@/i18n"

import "../globals.css"

/** Wersja testowa (preview / dev) dostaje czerwony favicon; produkcja – oryginalny */
const isTestEnv = Boolean(process.env.NEXT_PUBLIC_IS_TEST_ENV)
const iconSuffix = isTestEnv ? "-test" : ""

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const { title, description } = getDictionary(lang).meta.home
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    icons: {
      icon: [{ url: `/icons/icon${iconSuffix}.png`, type: "image/png", sizes: "512x512" }],
      apple: [{ url: `/icons/apple-icon${iconSuffix}.png`, sizes: "180x180" }],
    },
  }
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
      <body className="min-h-dvh">
        {children}
        <ConsentBanner lang={lang} />
        <ConsentAnalytics />
      </body>
    </html>
  )
}
