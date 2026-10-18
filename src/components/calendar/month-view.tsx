"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { EventRow } from "@/components/fs/event-row"
import { iconProps } from "@/components/fs/icons"
import { Button } from "@/components/ui/button"
import type { Dictionary, Locale } from "@/i18n"
import type { CalendarDay } from "@/lib/calendar"
import { formatLongDate } from "@/lib/event-format"
import { cn } from "@/lib/utils"

/** Ostatni dzień miesiąca „2026-10” → „2026-10-31” */
export function monthEnd(month: string) {
  const [y, m] = month.split("-").map(Number)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return `${month}-${String(last).padStart(2, "0")}`
}

/** „2026-10” ± n miesięcy */
export function shiftMonth(month: string, n: number) {
  const [y, m] = month.split("-").map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
}

type Props = {
  /** Dni z wydarzeniami w tym miesiącu (już po filtrach) */
  days: CalendarDay[]
  month: string
  today: string
  lang: Locale
  t: Dictionary
  onMonthChange: (month: string) => void
}

/**
 * Widok miesiąca (design.md §6.16, scenariusz F – nauczyciel porównuje terminy).
 * Siatka 7 kolumn: numer dnia, do 2 tytułów (desktop) albo liczba wydarzeń (telefon), „+3 więcej”.
 * Dziś: obrys 2 px i słowo „dziś”. Klawiatura: strzałki między dniami, Home/End, Enter/spacja wybiera dzień,
 * a lista wydarzeń wybranego dnia pojawia się pod siatką.
 */
export function MonthView({ days, month, today, lang, t, onMonthChange }: Props) {
  const labels = t.calendar
  const [y, m] = month.split("-").map(Number)
  const dayCount = Number(monthEnd(month).slice(8))
  // Poniedziałek = 0
  const offset = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7
  const byDay = new Map(days.map((d) => [d.day, d]))
  const keys = Array.from({ length: dayCount }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`)

  const firstWithEvents = keys.find((k) => byDay.has(k))
  const [selection, setSelection] = useState<{ month: string; day?: string }>({ month, day: firstWithEvents })
  // Inny miesiąc (strzałki, filtry) = wybór od nowa
  const selected = selection.month === month ? selection.day : firstWithEvents
  const [focusDay, setFocusDay] = useState<string | undefined>()
  const focused = focusDay?.startsWith(month) ? focusDay : (selected ?? (today.startsWith(month) ? today : keys[0]))
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const [moved, setMoved] = useState(false)

  useEffect(() => {
    if (moved && focused) buttons.current.get(focused)?.focus()
  }, [focused, moved])

  const weekdays = [1, 2, 3, 4, 5, 6, 0].map((i) => t.weekdaysShort[i])
  const monthName = new Intl.DateTimeFormat(t.intl, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, 1))
  )
  const title = monthName.charAt(0).toUpperCase() + monthName.slice(1)
  const canGoBack = month > today.slice(0, 7)
  const total = days.reduce((n, d) => n + d.rows.length, 0)

  function select(day: string) {
    setSelection({ month, day })
    setFocusDay(day)
  }

  function onKey(event: React.KeyboardEvent, day: string) {
    const index = keys.indexOf(day)
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    let next: number | undefined
    if (event.key in step) next = index + step[event.key]
    if (event.key === "Home") next = index - ((index + offset) % 7)
    if (event.key === "End") next = index + (6 - ((index + offset) % 7))
    if (next === undefined) return
    event.preventDefault()
    const clamped = Math.min(Math.max(next, 0), keys.length - 1)
    setMoved(true)
    setFocusDay(keys[clamped])
  }

  const selectedDay = selected ? byDay.get(selected) : undefined

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="icon"
          onClick={() => onMonthChange(shiftMonth(month, -1))}
          disabled={!canGoBack}
          aria-label={labels.prevMonth}
          className="disabled:opacity-40"
        >
          <ChevronLeft {...iconProps} className="size-6" />
        </Button>
        <h2 className="type-h3 text-gold" aria-live="polite">
          {title}
        </h2>
        <Button variant="icon" onClick={() => onMonthChange(shiftMonth(month, 1))} aria-label={labels.nextMonth}>
          <ChevronRight {...iconProps} className="size-6" />
        </Button>
      </div>

      <table className="mt-3 w-full table-fixed border-collapse">
        <caption className="sr-only">
          {title}. {labels.monthHint}
        </caption>
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w} scope="col" className="pb-2 text-center type-label text-text-muted">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil((offset + dayCount) / 7) }, (_, week) => (
            <tr key={week}>
              {Array.from({ length: 7 }, (_, col) => {
                const i = week * 7 + col - offset
                if (i < 0 || i >= dayCount) return <td key={col} className="border border-line bg-bg-subtle" />
                const key = keys[i]
                const day = byDay.get(key)
                const n = day?.rows.length ?? 0
                const isToday = key === today
                const isSelected = key === selected
                const past = key < today
                return (
                  <td key={col} className="border border-line p-0 align-top">
                    <button
                      ref={(el) => {
                        if (el) buttons.current.set(key, el)
                        else buttons.current.delete(key)
                      }}
                      type="button"
                      tabIndex={key === focused ? 0 : -1}
                      aria-pressed={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={labels.dayLabel(formatLongDate(key, t), n)}
                      onClick={() => select(key)}
                      onKeyDown={(e) => onKey(e, key)}
                      onFocus={() => setFocusDay(key)}
                      className={cn(
                        "flex min-h-14 w-full cursor-pointer flex-col items-start gap-1 p-1.5 text-left lg:min-h-28 lg:p-2",
                        isSelected ? "bg-ink text-on-dark" : "text-text hover:bg-bg-subtle",
                        isToday && !isSelected && "outline-2 -outline-offset-2 outline-ink",
                        past && !n && "text-text-muted"
                      )}
                    >
                      <span className="flex w-full items-baseline justify-between gap-1">
                        <span className="font-heading text-base leading-none font-semibold tabular-nums lg:text-lg">
                          {i + 1}
                        </span>
                        {isToday && <span className="text-[0.75rem] leading-none font-bold">{labels.todayMark}</span>}
                      </span>
                      {n > 0 && (
                        <>
                          {/* Telefon: sama liczba; desktop: do 2 tytułów i „+N więcej” */}
                          <span className="text-[0.8125rem] leading-tight font-semibold lg:hidden">{n}</span>
                          <span className="hidden w-full flex-col gap-0.5 lg:flex">
                            {day!.rows.slice(0, 2).map((r) => (
                              <span key={r.event.id} className="block truncate text-[0.8125rem] leading-snug">
                                {r.times[0].slice(11, 16)} {r.event.headline}
                              </span>
                            ))}
                            {n > 2 && <span className="text-[0.8125rem] font-semibold">{labels.moreInDay(n - 2)}</span>}
                          </span>
                        </>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {total === 0 && <p className="mt-6 type-body text-text">{labels.monthEmpty}</p>}

      {selected && (
        <section aria-labelledby="miesiac-dzien" className="mt-8">
          <h3 id="miesiac-dzien" className="border-b border-line-strong pb-2 type-h3 text-gold">
            {formatLongDate(selected, t)}
          </h3>
          {selectedDay ? (
            <div className="grid lg:grid-cols-2 lg:gap-x-8">
              {selectedDay.rows.map(({ event, times }) => (
                <EventRow key={event.id} event={event} times={times} lang={lang} />
              ))}
            </div>
          ) : (
            <p className="py-4 type-body text-text-muted">{labels.noEvents}</p>
          )}
        </section>
      )}
    </div>
  )
}
