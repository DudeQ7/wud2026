"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useLayoutEffect, useMemo, useRef, useState } from "react"

import { Calendar, type CalendarProps } from "@/components/calendar/calendar"
import { MoreGlyph, TypeGlyph } from "@/components/calendar/type-glyph"
import { EventRow } from "@/components/fs/event-row"
import { iconProps } from "@/components/fs/icons"
import { type Dictionary, getDictionary } from "@/i18n"
import { type CalendarDay, type EventType, PRIMARY_ORDER, calendarDays, parseFilters, primaryType } from "@/lib/calendar"
import { addDays, formatLongDate, todayKey, weekday } from "@/lib/event-format"

/** Czas obrotu o 90° – zgodnie z docs/calendar/calendar_design.md */
const TURN_MS = 1000
/** Szybki start i koniec, wolniejszy środek obrotu (rogiem do widza) */
const TURN_EASING = "cubic-bezier(0, 0.2, 1, 0.8)"
/** Fasada w obrocie 45° jest szersza niż w spoczynku (przekątna), więc na środku ruchu lekko się zmniejsza */
const MID_SCALE = 0.78
/** Połowa szerokości ściany (kontener minus boczne marginesy sceny px-4) – promień wpisany w kwadratową bryłę */
const APOTHEM = "calc(50cqw - 1rem)"
const BACK = "calc(1rem - 50cqw)"

type Turn = { to: string; direction: 1 | -1; selectedDay: string }

export function Calendar3D(props: CalendarProps) {
  const t = getDictionary(props.lang)
  const [displayMode, setDisplayMode] = useState<"list" | "month">("month")

  return (
    <>
      <div role="group" aria-label={t.calendar.viewControls} className="mb-4 flex justify-end gap-2">
        {(["list", "month"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={displayMode === mode}
            onClick={() => setDisplayMode(mode)}
            className={`min-h-11 border px-4 type-ui font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              displayMode === mode ? "border-ink bg-ink text-on-dark" : "border-line-strong text-text hover:bg-bg-subtle"
            }`}
          >
            {mode === "list" ? t.calendar.viewList : t.calendar.viewMonth}
          </button>
        ))}
      </div>
      <Calendar {...props} displayMode={displayMode} monthView={<MonthView events={props.events} lang={props.lang} />} />
    </>
  )
}

function MonthView({ events, lang }: Pick<CalendarProps, "events" | "lang">) {
  const t = getDictionary(lang)
  const searchParams = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const [today] = useState(() => todayKey(new Date()))
  const [monthStart, setMonthStart] = useState(() => `${today.slice(0, 7)}-01`)
  const [selectedDay, setSelectedDay] = useState(today)
  const [turn, setTurn] = useState<Turn | null>(null)
  const [halfway, setHalfway] = useState(false)
  const days = useMemo(() => calendarDays(events, filters, today, t), [events, filters, today, t])
  const dayLookup = useMemo(() => new Map(days.map((day) => [day.day, day])), [days])
  const selected = dayLookup.get(selectedDay)

  const rotorRef = useRef<HTMLDivElement>(null)

  // Obracamy całą fasadę (obrys, dni tygodnia i daty). Dopiero po obrocie podmieniamy miesiąc w stanie:
  // ściana, która stanęła z przodu, jest identyczna z nową ścianą w spoczynku, więc nie ma skoku.
  useLayoutEffect(() => {
    const rotor = rotorRef.current
    if (!turn || !rotor) return
    const { direction, to, selectedDay: nextDay } = turn

    const finish = () => {
      setMonthStart(to)
      setSelectedDay(nextDay)
      setTurn(null)
      setHalfway(false)
    }
    if (typeof rotor.animate !== "function") {
      const fallback = setTimeout(finish, 0)
      return () => clearTimeout(fallback)
    }

    const frame = (deg: number, scale: number) => `scale(${scale}) translateZ(${BACK}) rotateY(${deg * -direction}deg)`
    const animations = [
      rotor.animate(
        [{ transform: frame(0, 1) }, { transform: frame(45, MID_SCALE), offset: 0.5 }, { transform: frame(90, 1) }],
        { duration: TURN_MS, easing: TURN_EASING, fill: "forwards" }
      ),
    ]
    animations[0].onfinish = finish
    const mid = setTimeout(() => setHalfway(true), TURN_MS / 2)

    return () => {
      clearTimeout(mid)
      animations.forEach((a) => a.cancel())
    }
  }, [turn])

  function changeMonth(offset: 1 | -1) {
    if (turn) return
    const to = shiftMonth(monthStart, offset)
    const nextDay = firstDayWithEvents(to, days)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMonthStart(to)
      setSelectedDay(nextDay)
      return
    }
    setTurn({ to, direction: offset, selectedDay: nextDay })
  }

  function selectDay(day: string) {
    if (turn) return
    setSelectedDay(day)
  }

  const shownMonth = turn && halfway ? turn.to : monthStart
  const heading = monthHeading(shownMonth, t)

  return (
    <>
      <section aria-label={`${t.calendar.viewMonth}: ${heading}`} className="@container">
        <div className="flex items-center justify-between gap-4 pb-3">
          <ArrowButton
            label={`${t.calendar.previousMonth}: ${monthHeading(shiftMonth(monthStart, -1), t)}`}
            busy={Boolean(turn)}
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft {...iconProps} aria-hidden="true" className="size-5" />
          </ArrowButton>
          <h2 className="type-h2 text-text" aria-live="polite">
            {heading}
          </h2>
          <ArrowButton
            label={`${t.calendar.nextMonth}: ${monthHeading(shiftMonth(monthStart, 1), t)}`}
            busy={Boolean(turn)}
            onClick={() => changeMonth(1)}
          >
            <ChevronRight {...iconProps} aria-hidden="true" className="size-5" />
          </ArrowButton>
        </div>
        <Legend types={monthTypes(dayLookup, shownMonth, today)} t={t} />

        {/* Scena: perspektywa ~2,5 × szerokość fasady. Rotor stoi na osi bryły (translateZ −½ szerokości). */}
        <div className="overflow-x-clip px-4 [perspective:250cqw]">
          <div
            ref={rotorRef}
            className="relative [transform-style:preserve-3d]"
            style={{ transform: `translateZ(${BACK})` }}
          >
            <Facade
              monthStart={monthStart}
              selectedDay={selectedDay}
              today={today}
              dayLookup={dayLookup}
              t={t}
              onSelectDay={selectDay}
              inert={Boolean(turn)}
              style={{ transform: `translateZ(${APOTHEM})` }}
            />
            {turn && (
              <Facade
                monthStart={turn.to}
                selectedDay={turn.selectedDay}
                today={today}
                dayLookup={dayLookup}
                t={t}
                onSelectDay={selectDay}
                inert
                hidden
                className="absolute inset-0"
                style={{ transform: `rotateY(${turn.direction * 90}deg) translateZ(${APOTHEM})` }}
              />
            )}
          </div>
        </div>
      </section>

      <p className="sr-only" aria-live="polite">
        {formatLongDate(selectedDay, t)}
      </p>
      <section aria-labelledby="calendar3d-selected-day" aria-hidden={turn ? true : undefined} className={turn ? "invisible" : undefined}>
        <h2 id="calendar3d-selected-day" className="mt-8 border-b border-line-strong py-2 type-h3 text-gold">
          {formatLongDate(selectedDay, t)}
        </h2>
        {selected?.rows.length ? (
          <div className="grid lg:grid-cols-2 lg:gap-x-8">
            {selected.rows.map(({ event, times }) => (
              <EventRow key={event.id} event={event} times={times} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="py-6 type-body text-text">{t.calendar.emptyDay}</p>
        )}
      </section>
    </>
  )
}

function ArrowButton({
  label,
  busy,
  onClick,
  children,
}: {
  label: string
  busy: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={busy || undefined}
      onClick={onClick}
      className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-line-strong text-text hover:bg-bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </button>
  )
}

/**
 * Jedna ściana bryły: dach z siedmioma szczytami (= dni tygodnia), pod nim 6 rzędów dat i cokół.
 * Wybrany dzień to ciemne „okno”, liczbę wydarzeń pokazują kreski pod datą (1, 2, 3+).
 */
function Facade({
  monthStart,
  selectedDay,
  today,
  dayLookup,
  t,
  onSelectDay,
  inert,
  hidden,
  className = "",
  style,
}: {
  monthStart: string
  selectedDay: string
  today: string
  dayLookup: Map<string, CalendarDay>
  t: Dictionary
  onSelectDay: (day: string) => void
  inert: boolean
  hidden?: boolean
  className?: string
  style: React.CSSProperties
}) {
  const dates = useMemo(() => monthGrid(monthStart), [monthStart])
  const weekdays = [...t.weekdaysShort.slice(1), t.weekdaysShort[0]]
  const month = monthStart.slice(0, 7)

  return (
    <div
      inert={inert}
      aria-hidden={hidden || undefined}
      className={`${className} bg-background [backface-visibility:hidden]`}
      style={style}
    >
      <FacadeRoof />
      <div className="border-x-[1.5px] border-gold">
        <div className="grid grid-cols-7">
          {weekdays.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className={`flex min-h-9 items-center justify-center type-label font-semibold text-text-muted ${
                index > 0 ? "border-l border-line" : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {dates.map((day, index) => {
            const edge = index % 7 > 0 ? "border-l border-line" : ""
            if (day.slice(0, 7) !== month) return <div key={day} aria-hidden="true" className={`min-h-[3.25rem] ${edge}`} />

            const isSelected = day === selectedDay
            const isToday = day === today
            const isPast = day < today
            const count = dayLookup.get(day)?.rows.length ?? 0
            // Rodzaje wydarzeń tego dnia (bez minionych dni) – po jednym symbolu na rodzaj
            const kinds = isPast ? [] : dayTypes(dayLookup.get(day))
            const shown = kinds.length > 2 ? kinds.slice(0, 1) : kinds

            return (
              <button
                key={day}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectDay(day)}
                className={`flex min-h-[3.25rem] min-w-0 cursor-pointer items-center justify-center focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring ${edge}`}
              >
                {/* Nazwa z tekstu, nie z aria-label: aria-label bez widocznego „18 dziś” łamał WCAG 2.5.3 */}
                <span className="sr-only">
                  {`${formatLongDate(day, t)}${isToday ? `, ${t.calendar.todayLabel}` : ""}, ${t.calendar.count(count)}${
                    kinds.length ? `: ${kinds.map((kind) => t.calendar.types[kind]).join(", ")}` : ""
                  }`}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-[2.875rem] w-11 max-w-full flex-col items-center justify-center gap-[3px] ${
                    isSelected
                      ? "bg-ink text-on-dark"
                      : `hover:bg-bg-subtle ${
                          // Dni z wydarzeniami wystają (ciemny tekst, tło, symbol), puste i minione się cofają
                          kinds.length ? "bg-bg-subtle text-text" : "text-text-muted"
                        } ${
                          // Dziś: obrys 2 px (nie sam kolor), słowo „dziś” gdy nic nie gra
                          isToday ? "outline-2 -outline-offset-2 outline-ink" : ""
                        }`
                  }`}
                >
                  <span className={`font-heading text-lg leading-none tabular-nums ${kinds.length ? "font-bold" : "font-normal"}`}>{Number(day.slice(8))}</span>
                  {kinds.length === 0 && isToday ? (
                    <span className="type-meta leading-none">{t.calendar.todayLabel}</span>
                  ) : (
                    <span aria-hidden="true" className="flex h-3.5 items-center gap-1">
                      {shown.map((kind) => (
                        <TypeGlyph key={kind} type={kind} />
                      ))}
                      {kinds.length > 2 && <MoreGlyph />}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <FacadePlinth />
    </div>
  )
}

/** Rodzaje (po jednym na rodzaj główny) wydarzeń danego dnia, w stałej kolejności PRIMARY_ORDER */
function dayTypes(day?: CalendarDay): EventType[] {
  if (!day) return []
  const present = new Set(day.rows.map(({ event }) => primaryType(event.facets.types)))
  return PRIMARY_ORDER.filter((type) => present.has(type))
}

/** Rodzaje, które występują w pokazanym miesiącu (od dziś) – tylko je pokazuje legenda */
function monthTypes(dayLookup: Map<string, CalendarDay>, monthStart: string, today: string): EventType[] {
  const month = monthStart.slice(0, 7)
  const present = new Set<EventType>()
  for (const [day, value] of dayLookup) {
    if (!day.startsWith(month) || day < today) continue
    for (const type of dayTypes(value)) present.add(type)
  }
  return PRIMARY_ORDER.filter((type) => present.has(type))
}

/** Legenda symboli: symbol + nazwa rodzaju. Dzięki niej symbol pod datą czyta się bez zgadywania. */
function Legend({ types, t }: { types: EventType[]; t: Dictionary }) {
  if (!types.length) return null
  return (
    <div className="mb-3">
      <p className="type-meta text-text-muted">{t.calendar.markLegend}</p>
      <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
        {types.map((type) => (
          <li key={type} className="flex min-h-6 items-center gap-1.5 type-meta text-text">
            <TypeGlyph type={type} />
            {t.calendar.types[type]}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Geometria dachu (jednostki = piksele makiety 328 px): wysokości dolin przy kolumnach i (położenie, wysokość) szczytów
const W = 328
const COL = W / 7
const ROOF_H = 100
const VALLEYS = [34, 20, 32, 14, 26, 8, 22, 34]
const PEAKS: [number, number][] = [
  [0.3, 100],
  [0.5, 68],
  [0.5, 86],
  [0.45, 56],
  [0.55, 78],
  [0.5, 50],
  [0.68, 72],
]
const ROOF: [number, number][] = [[0, ROOF_H - VALLEYS[0]]]
PEAKS.forEach(([offset, height], i) => {
  ROOF.push([(i + offset) * COL, ROOF_H - height], [(i + 1) * COL, ROOF_H - VALLEYS[i + 1]])
})

function roofY(u: number) {
  for (let i = 0; i < ROOF.length - 1; i++) {
    const [x1, y1] = ROOF[i]
    const [x2, y2] = ROOF[i + 1]
    if (u >= x1 && u <= x2) return y1 + ((y2 - y1) * (u - x1)) / (x2 - x1)
  }
  return ROOF.at(-1)![1]
}

const round = (n: number) => Math.round(n * 100) / 100
const ROOF_LINE = `M0 ${ROOF_H} ${ROOF.map(([x, y]) => `L${round(x)} ${round(y)}`).join(" ")} L${W} ${ROOF_H}`
// Pionowe żebra w szczytach (osiem na kolumnę, bez granic kolumn) i doliny między szczytami
const RIBS = Array.from({ length: 55 }, (_, k) => k + 1)
  .filter((k) => k % 8 !== 0)
  .map((k) => ({ u: (k * COL) / 8, top: roofY((k * COL) / 8) + 4 }))
  .filter(({ top }) => top < ROOF_H - 38)
  .map(({ u, top }) => `M${round(u)} ${round(top)}V${ROOF_H - 34}`)
  .join("")
const VALLEY_LINES = VALLEYS.slice(1, 7)
  .map((h, i) => `M${round((i + 1) * COL)} ${ROOF_H - h}V${ROOF_H}`)
  .join("")
const PLINTH_TICKS = Array.from({ length: 111 }, (_, k) => k + 1)
  .filter((k) => k % 16 !== 0)
  .map((k) => `M${round((k * COL) / 16)} 4V20`)
  .join("")

function FacadeRoof() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${W} ${ROOF_H}`}
      preserveAspectRatio="none"
      className="pointer-events-none block h-auto w-full"
      fill="none"
    >
      <path d={`${ROOF_LINE}Z`} className="fill-background" />
      <path d={`${RIBS}${VALLEY_LINES}`} className="stroke-line" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={ROOF_LINE} className="stroke-gold" strokeWidth="1.5" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function FacadePlinth() {
  return (
    <div className="border-x-[1.5px] border-b-[1.5px] border-gold">
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${W} 20`}
        preserveAspectRatio="none"
        className="pointer-events-none block h-5 w-full"
        fill="none"
      >
        <path d={`M0 0.5H${W}${PLINTH_TICKS}`} className="stroke-line" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

function monthHeading(monthStart: string, t: Dictionary) {
  const label = new Intl.DateTimeFormat(t.intl, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${monthStart}T12:00:00Z`)
  )
  return label.charAt(0).toLocaleUpperCase(t.intl) + label.slice(1)
}

function firstDayWithEvents(monthStart: string, days: CalendarDay[]) {
  return days.find((day) => day.day.startsWith(monthStart.slice(0, 7)))?.day ?? monthStart
}

function monthGrid(monthStart: string) {
  const firstDay = (weekday(monthStart) + 6) % 7
  const gridStart = addDays(monthStart, -firstDay)
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

function shiftMonth(monthStart: string, offset: number) {
  const date = new Date(`${monthStart.slice(0, 7)}-01T12:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() + offset)
  return date.toISOString().slice(0, 10)
}
