"use client"

import { useEffect, useState } from "react"

import { AiHexagon } from "@/components/fs/ai-hexagon"
import { AssistantDialog } from "@/components/fs/assistant-dialog"
import type { EventCard, Lang, Venue } from "@/lib/assistant"

const HINT_KEY = "fs-assistant-hint-seen"

/**
 * Pływający heksagon asystenta (§6.4, wariant F): 16 px nad dolną nawigacją i od prawej krawędzi,
 * na desktopie 24 px od rogu ekranu – zawsze w tym samym miejscu (WCAG 3.2.6).
 * Widoczny stale, także podczas przewijania. Przy pierwszej wizycie ma podpis „Masz pytanie?”,
 * który znika po pierwszym przewinięciu.
 */
export function AssistantFab({
  lang,
  events,
  venue,
  label,
  hint,
}: {
  lang: Lang
  events: EventCard[]
  venue: Venue
  label: string
  hint: string
}) {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    let seen = true
    try {
      seen = localStorage.getItem(HINT_KEY) === "1"
    } catch {}
    // Odczyt localStorage dopiero po hydratacji – serwer zawsze renderuje sam heksagon
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!seen) setShowHint(true)

    if (seen) return
    const onScroll = () => {
      if (window.scrollY <= 80) return
      setShowHint(false)
      try {
        localStorage.setItem(HINT_KEY, "1")
      } catch {}
      window.removeEventListener("scroll", onScroll)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+1rem)] z-40 lg:right-6 lg:bottom-6">
      <AssistantDialog
        lang={lang}
        events={events}
        venue={venue}
        label={showHint ? `${hint} ${label}` : label}
        className="press enter-scale group flex cursor-pointer items-center focus-visible:outline-none"
      >
        {showHint && (
          <span aria-hidden className="-mr-3.5 flex h-10 items-center bg-ink pr-6 pl-4 text-sm font-semibold text-on-dark">
            {hint}
          </span>
        )}
        <AiHexagon className="lg:h-14 lg:w-16" />
      </AssistantDialog>
    </div>
  )
}
