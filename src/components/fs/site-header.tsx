"use client"

import { Menu } from "lucide-react"
import { useEffect, useState } from "react"

import { iconProps } from "@/components/fs/icons"
import { LanguageSwitcher } from "@/components/fs/language-switcher"
import { Container } from "@/components/fs/layout"
import { Logo } from "@/components/fs/wordmark"
import { type Locale, getDictionary } from "@/i18n"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  lang: Locale
  /** Nagłówek leży na zdjęciu otwarcia: przezroczysty, po przewinięciu biały z linią (§6.5) */
  overlay?: boolean
}

/** Górny pasek mobile (§6.4): logo, PL | EN | DE, Menu. Przyklejony, 56 px. */
export function SiteHeader({ lang, overlay = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [overlay])

  const solid = !overlay || scrolled

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[var(--header-h)] transition-colors",
        overlay && "-mb-[var(--header-h)]",
        solid ? "border-b border-line bg-background" : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-full items-center justify-between gap-4">
        <Logo lang={lang} className="h-14" priority />
        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={lang} />
          <button
            type="button"
            aria-label={getDictionary(lang).common.menu}
            className="flex size-11 cursor-pointer items-center justify-center text-ink hover:bg-bg-subtle"
          >
            <Menu {...iconProps} className="size-7" />
          </button>
        </div>
      </Container>
    </header>
  )
}
