import { CalendarDays, MapPin, Search, User } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { AssistantDialog } from "@/components/fs/assistant-dialog"
import { iconProps } from "@/components/fs/icons"
import { type Dictionary, type Locale, getDictionary, localizedPath } from "@/i18n"
import { eventCards, venue } from "@/lib/assistant"
import { cn } from "@/lib/utils"

type NavItem = {
  key: keyof Omit<Dictionary["nav"], "label">
  href?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const items: NavItem[] = [
  { key: "calendar", href: "/repertuar", icon: CalendarDays },
  { key: "search", href: "/szukaj", icon: Search },
  // Bez adresu: asystent otwiera się jako nakładka nad bieżącą stroną (§6.14)
  { key: "assistant" },
  { key: "plan", href: "/planuj-wizyte", icon: MapPin },
  { key: "account", href: "/konto", icon: User },
]

/** Heksagon – wyłącznie dla asystenta AI (§5.3): czarny, ze złotym „AI” (5,91:1) */
function AiHexagon({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-12 w-14 items-center justify-center", className)}>
      <svg viewBox="0 0 56 48" className="absolute inset-0 size-full" aria-hidden>
        <path d="M14 0h28l14 24-14 24H14L0 24Z" className="fill-ink" />
      </svg>
      <span className="relative font-heading text-lg font-bold text-gold-on-dark">AI</span>
    </span>
  )
}

/**
 * Dolna nawigacja (§6.4): 5 pozycji z zawsze widocznym podpisem.
 * Aktywna pozycja: linia 2 px u góry, pogrubiony podpis i aria-current – nigdy sam kolor.
 * `current` to adres bez prefiksu języka, np. „/repertuar”.
 * Na desktopie (≥ 1024 px) pasek znika – te same pozycje są w nagłówku, a asystent to heksagon w prawym dolnym rogu.
 */
export function BottomNav({ lang, current }: { lang: Locale; current?: string }) {
  const t = getDictionary(lang)
  return (
    <>
      <nav
        aria-label={t.nav.label}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid h-16 max-w-xl grid-cols-5">
          {items.map(({ key, href, icon: Icon }) => {
            const label = t.nav[key]
            if (!href) {
              return (
                <li key={key}>
                  <AssistantDialog
                    lang={lang}
                    events={eventCards}
                    venue={venue}
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-end gap-1 pb-2 text-xs font-semibold text-text"
                  >
                    <AiHexagon className="-mt-4" />
                    {label}
                  </AssistantDialog>
                </li>
              )
            }
            const active = current === href
            return (
              <li key={href}>
                <Link
                  href={localizedPath(lang, href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-end gap-1 pb-2 text-xs text-text",
                    active ? "border-t-2 border-ink font-bold" : "font-semibold"
                  )}
                >
                  {Icon && <Icon {...iconProps} className="size-6" />}
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {/* Desktop: asystent zawsze w tym samym miejscu, w prawym dolnym rogu (WCAG 3.2.6) */}
      <AssistantDialog
        lang={lang}
        events={eventCards}
        venue={venue}
        label={t.nav.assistantAi}
        className="fixed right-6 bottom-6 z-40 hidden cursor-pointer lg:flex"
      >
        <AiHexagon className="h-14 w-16" />
      </AssistantDialog>
    </>
  )
}
