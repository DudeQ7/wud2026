"use client"

import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"

import { type Locale, getDictionary, languageNames, locales, localizedPath, stripLocale } from "@/i18n"
import { cn } from "@/lib/utils"

/**
 * Przełącznik języka (§6.18): bieżący język jako przycisk, pozostałe wysuwają się w lewo w samym pasku,
 * bez panelu, więc tłem jest tło nagłówka. Otwierany kliknięciem, Enter lub spacją (§6.3).
 * W DOM przycisk stoi pierwszy, a `flex-row-reverse` układa go z prawej, dzięki czemu Tab idzie od przycisku na zewnątrz.
 * Esc zamyka i oddaje fokus przyciskowi; zamyka też kliknięcie poza grupą i wyjście fokusu.
 * Po zmianie języka użytkownik zostaje na tej samej podstronie, z tymi samymi filtrami w adresie.
 */
export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const t = getDictionary(lang)
  // Ta sama podstrona bez prefiksu języka – na serwerze adres może być już przepisany na /pl/…
  const page = stripLocale(usePathname())
  const others = locales.filter((code) => code !== lang)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="flex flex-row-reverse items-center text-sm text-ink"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${lang.toUpperCase()}, ${t.common.language}: ${languageNames[lang]}`}
        onClick={() => setOpen((o) => !o)}
        className="flex size-11 cursor-pointer items-center justify-center font-semibold"
      >
        <span lang={lang} className="hover-line">
          {lang.toUpperCase()}
        </span>
      </button>

      <ul
        id={listId}
        inert={!open}
        className={cn(
          "flex flex-row-reverse overflow-hidden transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
          open ? "max-w-24 opacity-100" : "max-w-0 opacity-0"
        )}
      >
        {others.map((code) => (
          <li key={code}>
            <a
              href={localizedPath(code, page)}
              // Filtry kalendarza żyją w query stringu – przenosimy je do nowej wersji językowej
              onClick={(e) => (e.currentTarget.search = window.location.search)}
              lang={code}
              hrefLang={code}
              aria-label={`${code.toUpperCase()} – ${languageNames[code]}`}
              className="flex size-11 items-center justify-center font-semibold focus-visible:outline-offset-[-2px]"
            >
              <span className="hover-line">{code.toUpperCase()}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
