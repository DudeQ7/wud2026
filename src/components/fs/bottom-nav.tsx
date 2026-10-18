import { CalendarDays, MapPin, Search, User } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { AssistantFab } from "@/components/fs/assistant-fab"
import { iconProps } from "@/components/fs/icons"
import { type Locale, getDictionary, localizedPath } from "@/i18n"
import { eventCards, venue } from "@/lib/assistant"
import { cn } from "@/lib/utils"

type NavItem = {
  key: "calendar" | "search" | "plan" | "account"
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const items: NavItem[] = [
  { key: "calendar", href: "/repertuar", icon: CalendarDays },
  { key: "search", href: "/szukaj", icon: Search },
  { key: "plan", href: "/planuj-wizyte", icon: MapPin },
  { key: "account", href: "/konto", icon: User },
]

/**
 * Dolna nawigacja (§6.4): 4 pozycje z zawsze widocznym podpisem, asystent to pływający heksagon nad paskiem.
 * Aktywna pozycja: linia 2 px u góry, pogrubiony podpis i aria-current – nigdy sam kolor.
 * `current` to adres bez prefiksu języka, np. „/repertuar”.
 * Na desktopie (≥ 1024 px) pasek znika – te same pozycje są w nagłówku, a heksagon zostaje w prawym dolnym rogu.
 * `assistant={false}` na stronie samego asystenta (/asystent), gdzie heksagon otwierałby ten sam czat.
 */
export function BottomNav({ lang, current, assistant = true }: { lang: Locale; current?: string; assistant?: boolean }) {
  const t = getDictionary(lang)
  return (
    <>
      <nav
        aria-label={t.nav.label}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="enter-fade mx-auto grid h-16 max-w-xl grid-cols-4">
          {items.map(({ key, href, icon: Icon }) => {
            const active = current === href
            return (
              <li key={href}>
                <Link
                  href={localizedPath(lang, href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "press flex h-full flex-col items-center justify-end gap-1 pb-2 text-xs text-text",
                    active ? "border-t-2 border-ink font-bold" : "font-semibold"
                  )}
                >
                  <Icon {...iconProps} className="size-6" />
                  {t.nav[key]}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {assistant && (
        <AssistantFab lang={lang} events={eventCards} venue={venue} label={t.nav.assistantAi} hint={t.nav.assistantHint} />
      )}
    </>
  )
}
