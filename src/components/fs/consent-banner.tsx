"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { PRIVACY_BUTTON_ID } from "@/components/fs/privacy-settings-button"
import { buttonVariants } from "@/components/ui/button"
import { type Locale, getDictionary } from "@/i18n"
import { disableAnalytics, initAnalytics } from "@/lib/analytics"
import {
  CONSENT_OPEN_EVENT,
  CONSENT_PENDING_ATTR,
  type ConsentValue,
  readConsent,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent"
import { cn } from "@/lib/utils"

/** Na serwerze zgody nie znamy – baner pokazuje się dopiero w przeglądarce */
const UNKNOWN = "unknown"

/**
 * Baner zgód (§6.18): „Odrzuć” i „Akceptuj” mają równą wagę, analityka startuje po zgodzie.
 * Ustawienia pozwalają wybrać tylko analitykę; marketing w prototypie nie istnieje.
 */
export function ConsentBanner({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).consent
  const stored = useSyncExternalStore(subscribeConsent, readConsent, () => UNKNOWN)
  const [settings, setSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)

  // Baner otwarty ponownie ze stopki: zmiana zgody, nie pierwszy wybór
  const [reopened, setReopened] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const visible = reopened || stored === null
  // Miejsce rezerwujemy tylko przy pierwszym wyborze; ponowne otwarcie ze stopki nie przesuwa strony
  const reserve = visible && !reopened

  useEffect(() => {
    const reopen = () => {
      setAnalytics(readConsent() !== "essential")
      setSettings(true)
      setReopened(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  // Fokus przechodzi do otwartego okna ustawień, a po zamknięciu wraca na przycisk w stopce
  useEffect(() => {
    if (reopened) sectionRef.current?.querySelector("input")?.focus()
  }, [reopened])

  // Baner nie zasłania treści (§6.18): --consent-space to pas od górnej krawędzi banera do dołu ekranu.
  // Otwarcie strony głównej odejmuje go od wysokości, więc „Kup bilet / Zobacz” stoją nad banerem.
  // Skrypt w <head> ustawia przybliżoną wartość przed pierwszym malowaniem, tu ją doprecyzowujemy.
  const hydrated = stored !== UNKNOWN
  useEffect(() => {
    // Render hydratacji ma migawkę z serwera – nie zdejmujemy wtedy rezerwacji ze skryptu w <head>
    if (!hydrated) return
    const root = document.documentElement
    const section = sectionRef.current
    if (!reserve || !section) {
      root.removeAttribute(CONSENT_PENDING_ATTR)
      root.style.removeProperty("--consent-space")
      return
    }
    const update = () =>
      root.style.setProperty("--consent-space", `${Math.max(0, window.innerHeight - section.getBoundingClientRect().top)}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(section)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
      root.removeAttribute(CONSENT_PENDING_ATTR)
      root.style.removeProperty("--consent-space")
    }
  }, [reserve, hydrated])

  if (!visible) return null

  function close() {
    if (reopened) {
      setReopened(false)
      setSettings(false)
      document.getElementById(PRIVACY_BUTTON_ID)?.focus()
    }
  }

  function save(value: ConsentValue) {
    writeConsent(value)
    close()
    if (value === "analytics") initAnalytics()
    else disableAnalytics()
  }

  // Na telefonie cienki pasek: jedno krótkie zdanie z linkiem i jeden rząd przycisków równej wagi
  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label={t.label}
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 mx-auto w-full max-w-3xl border-t border-line bg-background px-4 py-2.5 shadow-[0_-4px_16px_rgba(26,26,26,.08)] md:bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:border md:p-5 lg:bottom-6"
    >
      <p className="type-meta text-text">
        <span className="sm:hidden">{t.textShort}</span>
        <span className="hidden sm:inline">{t.text}</span>{" "}
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
              onClick={() => (reopened ? close() : setSettings(false))}
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
        <div className="mt-2 grid grid-cols-[1fr_1fr_auto] items-center gap-2 sm:mt-3 sm:flex">
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
