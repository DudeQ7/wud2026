"use client"

import { useEffect } from "react"

export function RefreshAnalyticsButton() {
  useEffect(() => {
    const interval = window.setInterval(() => {
      window.location.reload()
    }, 60_000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
    >
      Odśwież teraz
    </button>
  )
}
