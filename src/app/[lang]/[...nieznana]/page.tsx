import { notFound } from "next/navigation"

/**
 * Nieznany adres pod /[lang]/… trafia tu i dostaje stronę 404 w ramie serwisu ([lang]/not-found.tsx:
 * nagłówek, język, drogi wyjścia) zamiast surowego komunikatu Next.js bez marki.
 */
export default function UnknownPage() {
  notFound()
}
