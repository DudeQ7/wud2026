"use client"

import { ArrowRight, ChevronDown, Menu, Search, User, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"

import { iconProps } from "@/components/fs/icons"
import { LanguageSwitcher } from "@/components/fs/language-switcher"
import { Container } from "@/components/fs/layout"
import { Logo } from "@/components/fs/wordmark"
import { buttonVariants } from "@/components/ui/button"
import { type Locale, getDictionary, localizedPath, stripLocale } from "@/i18n"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  lang: Locale
  /** Nagłówek leży na zdjęciu otwarcia: przezroczysty, po przewinięciu biały z linią (§6.5) */
  overlay?: boolean
}

/**
 * Górny pasek. Mobile (§6.4): logo, PL | EN | DE, Menu.
 * Desktop (§6.3, ≥ 1024 px): do tego pozycje dolnej nawigacji – Repertuar, Planuj wizytę, Szukaj, Konto;
 * dolny pasek wtedy znika, a asystent jest w prawym dolnym rogu.
 */
export function SiteHeader({ lang, overlay = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)
  const menuId = useId()
  const barRef = useRef<HTMLDivElement>(null)
  // Dodatkowe pozycje (Dla Ciebie, EDUfilharmonia) tylko gdy naprawdę się mieszczą – szerokość tekstu
  // zależy od przeglądarki i jej ustawień czcionek, więc sam breakpoint nie wystarcza
  const [roomy, setRoomy] = useState(true)

  function closeMenu() {
    menuRef.current?.close()
  }

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const [left, right] = Array.from(bar.children) as HTMLElement[]
    let wideWidth = 0
    const check = () => {
      const wide = Array.from(bar.querySelectorAll<HTMLElement>("[data-wide]"))
      const shown = wide.some((el) => el.offsetWidth > 0)
      if (shown) {
        const gap = parseFloat(getComputedStyle(wide[0].parentElement!).columnGap) || 0
        wideWidth = wide.reduce((sum, el) => sum + el.offsetWidth + gap, 0)
      }
      const style = getComputedStyle(bar)
      const free =
        bar.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight) -
        (parseFloat(style.columnGap) || 0) -
        left.offsetWidth -
        right.offsetWidth
      setRoomy(shown ? free >= 0 : free >= wideWidth)
    }
    const observer = new ResizeObserver(check)
    for (const el of [bar, left, right]) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [overlay])

  const t = getDictionary(lang)
  const solid = !overlay || scrolled
  // Różowe tło tylko w lokalnym devie. Preview na Vercelu (link dla jury) ma biały nagłówek, znacznikiem testu jest favicon.
  const devTint = process.env.NODE_ENV === "development"
  // Adres bez prefiksu języka – do oznaczenia aktywnej pozycji menu
  const page = stripLocale(usePathname())
  const isActive = (href: string) => page === href || page.startsWith(`${href}/`)
  const mainLinks = [
    { label: t.calendar.title, href: "/repertuar" },
    // Od 1280 px więcej pozycji (§6.3); przy 1024 px zostają dwie, a reszta jest w menu – nic się nie ściska
    { label: t.home.forYou.title, href: "/zacznij-tutaj", wide: true },
    { label: t.home.discover.tiles.edu.title, href: "/edu", wide: true },
    { label: t.nav.planVisit, href: "/planuj-wizyte" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[var(--header-h)] transition-colors",
        overlay && "-mb-[var(--header-h)]",
        solid
          ? cn("border-b border-line", devTint ? "bg-[#fbe3e3]" : "bg-background")
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container ref={barRef} className="flex h-full items-center justify-between gap-2 2xl:gap-4">
        <div className="flex items-center gap-2 2xl:gap-6">
          <Logo lang={lang} className="h-14" priority />
          <nav aria-label={t.nav.mainLabel} className="hidden lg:block">
            <ul className="flex items-center gap-0.5 2xl:gap-1">
              {mainLinks.map(({ label, href, wide }) => (
                <li key={href} data-wide={wide || undefined} className={wide ? cn("hidden xl:block", !roomy && "xl:hidden") : undefined}>
                  <HeaderLink href={localizedPath(lang, href)} active={isActive(href)}>
                    {label}
                  </HeaderLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-1 2xl:gap-2">
          <HeaderLink href={localizedPath(lang, "/szukaj")} active={isActive("/szukaj")} className="hidden lg:flex">
            <Search {...iconProps} className="size-5" />
            {t.nav.search}
          </HeaderLink>
          <HeaderLink href={localizedPath(lang, "/konto")} active={isActive("/konto")} className="hidden lg:flex">
            <User {...iconProps} className="size-5" />
            {t.nav.account}
          </HeaderLink>
          <LanguageSwitcher lang={lang} />
          {/* „Kup bilet” zawsze widoczny na desktopie (brief §5, design §6.3) – prowadzi do repertuaru.
              Na telefonie zakup jest w otwarciu strony i w pasku zakupu na karcie wydarzenia. */}
          <Link
            href={localizedPath(lang, "/repertuar")}
            className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mx-1 hidden whitespace-nowrap lg:inline-flex")}
          >
            {t.event.buyTicket}
          </Link>
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
            className="flex size-11 cursor-pointer items-center justify-center text-ink"
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
          <button type="button" autoFocus onClick={closeMenu} aria-label={{ pl: "Zamknij menu", en: "Close menu", de: "Menü schließen", uk: "Закрити меню" }[lang]} className="flex size-11 cursor-pointer items-center justify-center">
            <X {...iconProps} className="size-6" />
          </button>
        </div>
        <nav aria-label={t.common.menu} className="px-4 pt-4 pb-8 sm:px-6">
          {/* Telefon: cztery główne skróty + zwijane grupy – całe menu mieści się na jednym ekranie, bez długiej listy */}
          <div className="sm:hidden">
            <ul className="grid grid-cols-2 gap-2">
              {getMenuShortcuts(lang).map(([label, href]) => (
                <li key={href}>
                  <Link href={localizedPath(lang, href)} onClick={closeMenu} className="flex min-h-14 items-center justify-between gap-2 border-[1.5px] border-line-strong px-3 py-2 font-semibold">
                    <span>{label}</span><ArrowRight {...iconProps} className="size-5 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-line-strong">
              {getMenuGroups(lang).map((group) =>
                group.links.length === 1 ? (
                  <Link key={group.title} href={localizedPath(lang, group.links[0][1])} onClick={closeMenu} className="flex min-h-12 items-center justify-between gap-3 border-b border-line py-2 type-h4 text-gold">
                    <span>{group.links[0][0]}</span><ArrowRight {...iconProps} className="size-5 shrink-0 text-text" />
                  </Link>
                ) : (
                  <details key={group.title} name="menu-group" className="group border-b border-line">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-2 type-h4 text-gold [&::-webkit-details-marker]:hidden">
                      <span>{group.title}</span>
                      <ChevronDown {...iconProps} className="size-5 shrink-0 text-text transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                    </summary>
                    <ul className="pb-2">
                      {group.links.map(([label, href]) => (
                        <li key={href}>
                          <Link href={localizedPath(lang, href)} onClick={closeMenu} className="flex min-h-11 items-center justify-between gap-3 py-2 pl-3 font-semibold">
                            <span>{label}</span><ArrowRight {...iconProps} className="size-5 shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )
              )}
            </div>
          </div>
          {/* Tablet i desktop: wszystkie grupy w dwóch kolumnach */}
          <div className="hidden gap-x-8 sm:grid sm:grid-cols-2">
            {getMenuGroups(lang).map((group) => (
              <section key={group.title} className="mb-6">
                {!(group.links.length === 1 && group.links[0][0] === group.title) && (
                  <h3 className="mb-1 type-eyebrow text-gold">{group.title}</h3>
                )}
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={href} className="border-b border-line">
                      <Link href={localizedPath(lang, href)} onClick={closeMenu} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 py-2 font-semibold">
                        <span className="hover-line">{label}</span><ArrowRight {...iconProps} className="size-5 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>
      </dialog>
    </header>
  )
}

/** Pozycja menu w nagłówku: najechanie wysuwa podkreślenie (hover-line); bieżąca strona ma aria-current */
function HeaderLink({
  href,
  active,
  className,
  children,
}: {
  href: string
  active: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn("flex h-11 items-center px-2 2xl:px-3 font-semibold whitespace-nowrap text-ink", className)}
    >
      <span className="hover-line flex items-center gap-2">{children}</span>
    </Link>
  )
}

/** Cztery najczęstsze cele (mobile): repertuar, kreator, asystent, planowanie wizyty */
function getMenuShortcuts(lang: Locale): [string, string][] {
  const t = getDictionary(lang)
  return [
    [t.home.upcoming.all.replace(" →", ""), "/repertuar"],
    [t.home.forYou.cta.title, "/pomoz-mi-wybrac"],
    [t.nav.assistant, "/asystent"],
    [t.nav.plan, "/planuj-wizyte"],
  ]
}

function getMenuGroups(lang: Locale) {
  const t = getDictionary(lang)
  const artists = { pl: "Artyści", en: "Artists", de: "Künstler", uk: "Артисти" }[lang]
  const d = t.home.discover.tiles
  return [
    { title: t.nav.calendar, links: [[t.home.upcoming.all.replace(" →", ""), "/repertuar"], [t.nav.search, "/szukaj"]] },
    { title: t.home.forYou.title, links: [[t.home.forYou.tiles.start.title, "/zacznij-tutaj"], [t.home.forYou.cta.title, "/pomoz-mi-wybrac"], [t.nav.assistant, "/asystent"]] },
    { title: d.edu.title, links: [[d.edu.title, "/edu"], [t.home.forYou.tiles.families.title, "/repertuar?dla-kogo=rodziny"]] },
    { title: t.home.discover.title, links: [[d.orchestra.title, "/orkiestra"], [artists, "/artysci"], [d.building.title, "/budynek"], [d.history.title, "/historia"], [d.exhibitions.title, "/wystawy"], [d.tours.title, "/zwiedzanie"]] },
    { title: t.nav.plan, links: [[t.nav.plan, "/planuj-wizyte"], [t.footer.links.faq, "/faq"], [t.footer.links.contact, "/kontakt"], [t.event.buyTicket, "/repertuar"]] },
    { title: t.nav.account, links: [[t.nav.account, "/konto"]] },
  ]
}
