import type { Metadata, Viewport } from "next"
import { Open_Sans, Titillium_Web } from "next/font/google"

import "./globals.css"

// Kroje z materiałów FS (design.md D1): Titillium Web – nagłówki, Open Sans – treść i UI.
const titillium = Titillium_Web({
  variable: "--font-titillium",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
})

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Filharmonia im. Mieczysława Karłowicza w Szczecinie",
  description: "Koncerty, wystawy i zwiedzanie Filharmonii w Szczecinie. Sprawdź, co gramy dziś i wkrótce.",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${titillium.variable} ${openSans.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
