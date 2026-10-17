import { CalendarDays, MapPin, Search, User } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { iconProps } from "@/components/fs/icons"
import { cn } from "@/lib/utils"

type NavItem = { label: string; href: string; icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }

const items: NavItem[] = [
  { label: "Kalendarz", href: "/repertuar", icon: CalendarDays },
  { label: "Szukaj", href: "/szukaj", icon: Search },
  { label: "Asystent", href: "/asystent" },
  { label: "Planuj", href: "/planuj-wizyte", icon: MapPin },
  { label: "Konto", href: "/konto", icon: User },
]

/** Heksagon – wyłącznie dla asystenta AI (§5.3): czarny, ze złotym „AI” (5,91:1) */
function AiHexagon() {
  return (
    <span className="relative -mt-4 flex h-12 w-14 items-center justify-center">
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
 */
export function BottomNav({ current }: { current?: string }) {
  return (
    <nav
      aria-label="Dolna"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-5">
        {items.map(({ label, href, icon: Icon }) => {
          const active = current === href
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-end gap-1 pb-2 text-xs text-text",
                  active ? "border-t-2 border-ink font-bold" : "font-semibold"
                )}
              >
                {Icon ? <Icon {...iconProps} className="size-6" /> : <AiHexagon />}
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
