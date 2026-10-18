"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { PRIVACY_BUTTON_ID } from "@/components/fs/privacy-settings-button"
import { buttonVariants } from "@/components/ui/button"
import { type Locale, getDictionary } from "@/i18n"
import { disableAnalytics, initAnalytics } from "@/lib/analytics"
import { CONSENT_OPEN_EVENT, type ConsentValue, readConsent, writeConsent } from "@/lib/consent"
import { cn } from "@/lib/utils"

/**
 * Baner zgód (§6.18): „Odrzuć” i „Akceptuj” mają równą wagę, analityka startuje po zgodzie.
 * Ustawienia pozwalają wybrać tylko analitykę; marketing w prototypie nie istnieje.
 */
export function ConsentBanner({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).consent
  const [ready, setReady] = useState(false)
  const [choice, setChoice] = useState<ConsentValue | null>(null)
  const [settings, setSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)

  // Baner otwarty ponownie ze stopki: zmiana zgody, nie pierwszy wybór
  const [reopened, setReopened] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const stored = readConsent()
    setChoice(stored)
    setAnalytics(stored !== "essential")
    setReady(true)

    const reopen = () => {
      setAnalytics(readConsent() !== "essential")
      setSettings(true)
      setChoice(null)
      setReopened(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  // Fokus przechodzi do otwartego okna ustawień, a po zamknięciu wraca na przycisk w stopce
  useEffect(() => {
    if (reopened && !choice) sectionRef.current?.querySelector("input")?.focus()
  }, [reopened, choice])

  if (!ready || choice) return null

  function close(value: ConsentValue | null) {
    setChoice(value)
    if (reopened) {
      setReopened(false)
      setSettings(false)
      document.getElementById(PRIVACY_BUTTON_ID)?.focus()
    }
  }

  function save(value: ConsentValue) {
    writeConsent(value)
    close(value)
    if (value === "analytics") initAnalytics()
    else disableAnalytics()
  }

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label={t.label}
      className="fixed inset-x-0 bottom-20 z-50 mx-auto w-full max-w-3xl border border-line bg-background p-4 md:bottom-6 md:p-5"
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="type-body text-text">{t.text}</p>
          <Link
            href="https://filharmonia.szczecin.pl/polityka_prywatnosci"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex min-h-11 items-center type-meta text-text underline underline-offset-2 hover:no-underline"
          >
            {t.privacy}
          </Link>
        </div>

        {settings ? (
          <div className="flex flex-col gap-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 size-5 shrink-0 accent-ink"
              />
              <span>
                <span className="block font-semibold text-text">{t.analytics}</span>
                <span className="mt-1 block type-meta text-text-muted">{t.analyticsText}</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => (reopened ? close(readConsent()) : setSettings(false))}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1 sm:flex-none")}
              >
                {t.back}
              </button>
              <button
                type="button"
                onClick={() => save(analytics ? "analytics" : "essential")}
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "flex-1 sm:flex-none")}
              >
                {t.save}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => save("essential")}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1")}
            >
              {t.reject}
            </button>
            <button
              type="button"
              onClick={() => save("analytics")}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1")}
            >
              {t.accept}
            </button>
            <button
              type="button"
              onClick={() => setSettings(true)}
              className="min-h-11 px-2 text-sm font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2"
            >
              {t.settings}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
