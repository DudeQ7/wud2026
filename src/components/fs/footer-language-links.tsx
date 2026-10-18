"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { type Locale, languageNames, locales, localizedPath, stripLocale } from "@/i18n"

export function FooterLanguageLinks({ lang, label }: { lang: Locale; label: string }) {
  const pathname = stripLocale(usePathname())
  return (
    <nav aria-label={label} className="flex gap-3 lg:col-span-3">
      {locales.map((code) => (
        <Link
          key={code}
          href={localizedPath(code, pathname)}
          onClick={(event) => (event.currentTarget.search = window.location.search)}
          lang={code}
          hrefLang={code}
          aria-label={languageNames[code]}
          aria-current={code === lang ? "true" : undefined}
          className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center font-semibold hover:underline hover:underline-offset-4 focus-visible:underline"
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </nav>
  )
}
