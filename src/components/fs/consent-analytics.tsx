"use client"

import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"

import { CONSENT_EVENT, readConsent } from "@/lib/consent"

/**
 * Vercel Analytics montujemy dopiero po zgodzie – tak samo jak PostHog.
 * Nasłuchuje zmiany zgody, bo baner i ten komponent są osobnymi drzewami Reacta.
 */
export function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(readConsent() === "analytics")
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  return enabled ? <Analytics /> : null
}
