"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/analityka", label: "Analityka" },
  { href: "/admin", label: "Mini-CMS" },
] as const

/**
 * Wspólny pasek narzędzi zespołu (analityka ↔ mini-CMS ↔ powrót na stronę), poza wersjami językowymi.
 * Czarny pasek z dużymi przyciskami: aktywna zakładka biała, nieaktywna z białym konturem (design.md §6.1, bez kolorów).
 */
export function ToolsNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Narzędzia zespołu" className="sticky top-0 z-40 bg-ink">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 min-w-32 flex-1 items-center justify-center border-2 border-on-dark px-5 type-ui sm:flex-none ${
                active ? "bg-on-dark text-ink" : "bg-transparent text-on-dark hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          )
        })}
        <Link href="/" className="flex min-h-12 items-center px-2 type-ui text-on-dark underline underline-offset-4 sm:ml-auto">
          Wróć na stronę →
        </Link>
      </div>
    </nav>
  )
}
