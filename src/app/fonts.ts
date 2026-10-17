import { Open_Sans, Titillium_Web } from "next/font/google"

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

export const fontVariables = `${titillium.variable} ${openSans.variable}`
