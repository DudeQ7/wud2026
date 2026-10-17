"use client"

import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"

import { iconProps } from "@/components/fs/icons"
import { LanguageSwitcher } from "@/components/fs/language-switcher"
import { Container } from "@/components/fs/layout"
import { Logo } from "@/components/fs/wordmark"
import { type Locale, getDictionary, localizedPath } from "@/i18n"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  lang: Locale
  /** Nagłówek leży na zdjęciu otwarcia: przezroczysty, po przewinięciu biały z linią (§6.5) */
  overlay?: boolean
}

/** Górny pasek mobile (§6.4): logo, PL | EN | DE, Menu. Przyklejony, 56 px. */
export function SiteHeader({ lang, overlay = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)
  const menuId = useId()

  function closeMenu() {
    menuRef.current?.close()
  }

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [overlay])

  const t = getDictionary(lang)
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
            aria-label={t.common.menu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => {
              menuRef.current?.showModal()
              setMenuOpen(true)
            }}
            className="flex size-11 cursor-pointer items-center justify-center text-ink hover:bg-bg-subtle"
          >
            <Menu {...iconProps} className="size-7" />
          </button>
        </div>
      </Container>
      <dialog
        ref={menuRef}
        id={menuId}
        aria-labelledby={`${menuId}-title`}
        onClose={() => setMenuOpen(false)}
        onClick={(event) => event.target === event.currentTarget && closeMenu()}
        className="site-menu m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-background p-0 text-text lg:ml-auto lg:max-w-3xl lg:border-l lg:border-line"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
          <h2 id={`${menuId}-title`} className="type-h2 text-gold">{t.common.menu}</h2>
          <button type="button" autoFocus onClick={closeMenu} aria-label={lang === "pl" ? "Zamknij menu" : lang === "en" ? "Close menu" : "Menü schließen"} className="flex size-11 cursor-pointer items-center justify-center hover:bg-bg-subtle">
            <X {...iconProps} className="size-6" />
          </button>
        </div>
        <nav aria-label={t.common.menu} className="grid gap-x-8 px-4 py-6 sm:grid-cols-2 sm:px-6">
          {getMenuGroups(lang).map((group) => (
            <section key={group.title} className="mb-6">
              <h3 className="mb-2 type-h3 text-gold">{group.title}</h3>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={href} className="border-b border-line">
                    <Link href={localizedPath(lang, href)} onClick={closeMenu} className="flex min-h-12 cursor-pointer items-center justify-between gap-3 py-3 font-semibold hover:bg-bg-subtle hover:underline hover:underline-offset-4">
                      {label}<ArrowRight {...iconProps} className="size-5 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </dialog>
    </header>
  )
}

function getMenuGroups(lang: Locale) {
  const t = getDictionary(lang)
  const artists = { pl: "Artyści", en: "Artists", de: "Künstler" }[lang]
  const d = t.home.discover.tiles
  return [
    { title: t.nav.calendar, links: [[t.home.upcoming.all.replace(" →", ""), "/repertuar"], [t.nav.search, "/szukaj"]] },
    { title: t.home.forYou.title, links: [[t.home.forYou.tiles.start.title, "/zacznij-tutaj"], [t.home.forYou.cta.title, "/pomoz-mi-wybrac"], [t.nav.assistant, "/asystent"]] },
    { title: d.edu.title, links: [[d.edu.title, "/edu"], [t.home.forYou.tiles.families.title, "/repertuar?dla-kogo=rodziny"]] },
    { title: t.home.discover.title, links: [[d.orchestra.title, "/orkiestra"], [artists, "/artysci"], [d.building.title, "/budynek"], [d.history.title, "/historia"], [d.exhibitions.title, "/wystawy"], [d.tours.title, "/zwiedzanie"]] },
    { title: t.nav.plan, links: [[t.nav.plan, "/planuj-wizyte"], [t.footer.links.contact, "/kontakt"], [t.event.buyTicket, "/repertuar"]] },
    { title: t.nav.account, links: [[t.nav.account, "/konto"]] },
  ]
}
