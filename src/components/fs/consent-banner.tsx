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

  // Kompaktowo na telefonie (≈ 1/5 ekranu): tekst z linkiem w zdaniu, dwa przyciski równej wagi w jednym
  // rzędzie i „Ustawienia” obok. Wcześniej baner zasłaniał „Kup bilet” na otwarciu strony.
  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label={t.label}
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 mx-auto w-full max-w-3xl border-t border-line bg-background px-4 py-3 shadow-[0_-4px_16px_rgba(26,26,26,.08)] md:bottom-6 md:border md:p-5 lg:bottom-6"
    >
      <p className="type-meta text-text">
        {t.text}{" "}
        <Link
          href="https://filharmonia.szczecin.pl/polityka_prywatnosci"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:no-underline"
        >
          {t.privacy}
        </Link>
      </p>

      {settings ? (
        <div className="mt-3 flex flex-col gap-3">
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
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => (reopened ? close(readConsent()) : setSettings(false))}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              {t.back}
            </button>
            <button
              type="button"
              onClick={() => save(analytics ? "analytics" : "essential")}
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              {t.save}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-[1fr_1fr_auto] items-center gap-2 sm:flex">
          <button type="button" onClick={() => save("essential")} className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-3 sm:flex-1")}>
            {t.reject}
          </button>
          <button type="button" onClick={() => save("analytics")} className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-3 sm:flex-1")}>
            {t.accept}
          </button>
          <button
            type="button"
            onClick={() => setSettings(true)}
            className="min-h-11 px-1 text-[0.9375rem] font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2"
          >
            {t.settings}
          </button>
        </div>
      )}
    </section>
  )
}
