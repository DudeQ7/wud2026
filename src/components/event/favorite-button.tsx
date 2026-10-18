"use client"

import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { useEffect, useState, useTransition } from "react"

import { getFavoriteEventIds, toggleFavorite } from "@/app/actions/panel"
import { iconProps } from "@/components/fs/icons"
import { type Locale, getDictionary } from "@/i18n"
import { localizedPath } from "@/i18n/config"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type Props = {
  eventId: number
  lang: Locale
  className?: string
}

/**
 * Ulubione na karcie wydarzenia (§6.11). Stan pobieramy po montażu, bo strona jest cache'owana
 * i nie zna użytkownika. Gość po kliknięciu idzie do logowania.
 */
export function FavoriteButton({ eventId, lang, className }: Props) {
  const t = getDictionary(lang).event.favorite
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!active) return
        setLoggedIn(Boolean(user))
        if (user) {
          const ids = await getFavoriteEventIds()
          if (active) setIsFavorite(ids.includes(eventId))
        }
      } catch {
        // Brak Supabase w środowisku – przycisk zostaje w stanie „nie zapisano”
      } finally {
        if (active) setReady(true)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [eventId])

  function toggle() {
    if (!ready) return
    if (!loggedIn) {
      router.push(localizedPath(lang, "/auth/login"))
      return
    }

    const next = !isFavorite
    setIsFavorite(next)
    startTransition(async () => {
      const result = await toggleFavorite(eventId, lang)
      if ("error" in result) {
        setIsFavorite(!next)
        return
      }
      setIsFavorite(result.isFavorite)
      posthog.capture(result.isFavorite ? "favorite_added" : "favorite_removed", { event_id: eventId })
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t.remove : t.add}
      title={isFavorite ? t.remove : t.add}
      className={cn(
        "flex size-11 shrink-0 cursor-pointer items-center justify-center border-[1.5px] border-line-strong text-text hover:bg-bg-subtle disabled:cursor-wait disabled:opacity-50",
        className
      )}
    >
      <Heart {...iconProps} className="size-5" fill={isFavorite ? "currentColor" : "none"} />
    </button>
  )
}
