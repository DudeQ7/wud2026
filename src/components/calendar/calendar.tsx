"use client"

import { Search, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { FilterSheet } from "@/components/calendar/filter-sheet"
import { EventRow } from "@/components/fs/event-row"
import { iconProps } from "@/components/fs/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import {
  type ActiveFilter,
  type CalendarDay,
  type CalendarEvent,
  type Filters,
  activeFilters,
  alternatives,
  calendarDays,
  countRows,
  emptyFilters,
  parseFilters,
  plural,
  toQuery,
} from "@/lib/calendar"
import { todayKey } from "@/lib/event-format"

const PAGE_SIZE = 30

type CalendarProps = {
  events: CalendarEvent[]
  series: { key: string; label: string }[]
}

/**
 * Kalendarz z filtrami (§6.6, §7.2). Stan filtrów żyje w adresie URL – link można udostępnić,
 * a „wstecz” z karty wydarzenia wraca do tych samych wyników. Wyniki liczymy w przeglądarce,
 * więc licznik i lista zmieniają się od razu, bez zapytania do serwera.
 */
export function Calendar({ events, series }: CalendarProps) {
  const searchParams = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const [today] = useState(() => todayKey(new Date()))

  const seriesLabels = useMemo(() => Object.fromEntries(series.map((s) => [s.key, s.label])), [series])
  const days = useMemo(() => calendarDays(events, filters, today), [events, filters, today])
  const count = countRows(days)
  const active = activeFilters(filters, seriesLabels)

  const [limit, setLimit] = useState(PAGE_SIZE)
  const query = toQuery(filters)
  // Nowy zestaw filtrów zaczyna listę od początku
  const [shownQuery, setShownQuery] = useState(query)
  if (shownQuery !== query) {
    setShownQuery(query)
    setLimit(PAGE_SIZE)
  }

  function navigate(next: Filters) {
    const qs = toQuery(next)
    // replaceState: filtry nie zaśmiecają historii, a „wstecz” prowadzi tam, skąd przyszedł użytkownik
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
  }

  // Licznik dla czytników ekranu z opóźnieniem ~300 ms, żeby nie ogłaszać każdego znaku (§6.6)
  const countText = `${count} ${plural(count, "wydarzenie", "wydarzenia", "wydarzeń")}`
  const [announced, setAnnounced] = useState(countText)
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(countText), 300)
    return () => clearTimeout(t)
  }, [countText])

  const visibleDays = useMemo(() => firstRows(days, limit), [days, limit])

  const quick: { label: string; on: boolean; toggle: (on: boolean) => Filters }[] = [
    {
      label: "Dziś",
      on: filters.kiedy === "dzis",
      toggle: (on) => ({ ...filters, kiedy: on ? "dzis" : undefined, od: undefined, do: undefined }),
    },
    {
      label: "Ten weekend",
      on: filters.kiedy === "weekend",
      toggle: (on) => ({ ...filters, kiedy: on ? "weekend" : undefined, od: undefined, do: undefined }),
    },
    {
      label: "Dla dzieci",
      on: filters.dlaKogo.includes("dzieci"),
      toggle: (on) => ({ ...filters, dlaKogo: toggled(filters.dlaKogo, "dzieci", on) }),
    },
    {
      label: "Jazz",
      on: filters.rodzaj.includes("jazz"),
      toggle: (on) => ({ ...filters, rodzaj: toggled(filters.rodzaj, "jazz", on) }),
    },
    {
      label: "Wystawy",
      on: filters.rodzaj.includes("wystawa"),
      toggle: (on) => ({ ...filters, rodzaj: toggled(filters.rodzaj, "wystawa", on) }),
    },
  ]

  return (
    <>
      <SearchField value={filters.q} onCommit={(q) => navigate({ ...filters, q })} />

      <div
        role="group"
        aria-label="Szybkie filtry"
        className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {quick.map((q) => (
          <Toggle key={q.label} pressed={q.on} onPressedChange={(on) => navigate(q.toggle(on))} aria-controls="repertuar-lista">
            {q.label}
          </Toggle>
        ))}
        <FilterSheet
          events={events}
          series={series}
          filters={filters}
          today={today}
          activeCount={active.length}
          onApply={navigate}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-strong pb-3">
        <p className="type-ui text-text" aria-hidden>
          {countText}
        </p>
        <p className="sr-only" aria-live="polite">
          {announced}
        </p>
        {active.length > 0 && <ActiveFilterList filters={active} current={filters} onChange={navigate} />}
      </div>

      <div id="repertuar-lista">
        {count === 0 ? (
          <EmptyState
            options={alternatives(events, filters, today, seriesLabels)}
            onChange={navigate}
            onClear={() => navigate(emptyFilters)}
          />
        ) : (
          <>
            {visibleDays.map((group) => (
              <section key={group.day} aria-labelledby={`dzien-${group.day}`}>
                <h2
                  id={`dzien-${group.day}`}
                  className="sticky top-[var(--header-h)] z-10 mt-6 border-b border-line-strong bg-background py-2 type-h3 text-gold"
                >
                  {group.label}
                </h2>
                <div className="grid lg:grid-cols-2 lg:gap-x-8">
                  {group.rows.map(({ event, times }) => (
                    <EventRow key={event.id} event={event} times={times} />
                  ))}
                </div>
              </section>
            ))}
            {count > limit && (
              <div className="mt-8 flex flex-col items-start gap-2">
                <p className="type-meta text-text-muted">
                  Widzisz {limit} z {count}
                </p>
                <Button variant="secondary" block className="sm:w-fit" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                  Pokaż kolejne wydarzenia
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

/** Pierwsze `limit` wierszy, z zachowaniem podziału na dni */
function firstRows(days: CalendarDay[], limit: number) {
  const result: CalendarDay[] = []
  let left = limit
  for (const day of days) {
    if (left <= 0) break
    const rows = day.rows.slice(0, left)
    left -= rows.length
    result.push({ ...day, rows })
  }
  return result
}

function toggled<T>(values: T[], value: T, on: boolean) {
  return on ? [...values.filter((v) => v !== value), value] : values.filter((v) => v !== value)
}

/** Pole wyszukiwania w kalendarzu (§7.2): wykonawca, kompozytor, tytuł, cykl. URL zmienia się po 300 ms. */
function SearchField({ value, onCommit }: { value?: string; onCommit: (q?: string) => void }) {
  const [text, setText] = useState(value ?? "")
  const [seen, setSeen] = useState(value)

  // Filtr zmieniony z zewnątrz (np. „×” przy aktywnym filtrze) aktualizuje też pole
  if (value !== seen) {
    setSeen(value)
    if ((value ?? "") !== text.trim()) setText(value ?? "")
  }

  useEffect(() => {
    if (text.trim() === (value ?? "")) return
    const t = setTimeout(() => onCommit(text.trim() || undefined), 300)
    return () => clearTimeout(t)
  }, [text, value, onCommit])

  return (
    <div role="search" className="flex flex-col gap-2">
      <label htmlFor="repertuar-szukaj" className="text-[0.9375rem] font-semibold text-text">
        Szukaj wykonawcy, kompozytora lub tytułu
      </label>
      <div className="relative">
        <Search {...iconProps} className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-text" />
        <Input
          id="repertuar-szukaj"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="np. Karłowicz, Mendelssohn, jazz"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="pr-12 pl-12 [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <Button
            variant="icon"
            aria-label="Wyczyść wyszukiwanie"
            onClick={() => setText("")}
            className="absolute top-1/2 right-1 -translate-y-1/2"
          >
            <X {...iconProps} className="size-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

function ActiveFilterList({
  filters,
  current,
  onChange,
}: {
  filters: ActiveFilter[]
  current: Filters
  onChange: (f: Filters) => void
}) {
  return (
    <ul aria-label="Aktywne filtry" className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <li key={f.id}>
          <button
            type="button"
            onClick={() => onChange(f.remove(current))}
            aria-label={`Usuń filtr: ${f.label}`}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1 border-[1.5px] border-line-strong px-3 text-[0.9375rem] font-semibold text-text hover:bg-bg-subtle"
          >
            {f.label}
            <X {...iconProps} className="size-4" />
          </button>
        </li>
      ))}
      {filters.length > 1 && (
        <li>
          <Button variant="link" onClick={() => onChange({ ...emptyFilters })}>
            Wyczyść wszystkie
          </Button>
        </li>
      )}
    </ul>
  )
}

/** Stan „brak wyników” (§6.7): co wyklucza wyniki i do 3 propozycji alternatyw */
function EmptyState({
  options,
  onChange,
  onClear,
}: {
  options: ReturnType<typeof alternatives>
  onChange: (f: Filters) => void
  onClear: () => void
}) {
  return (
    <div className="py-8">
      <h2 className="type-h3 text-gold">Nic nie pasuje do tych filtrów</h2>
      {options.length > 0 && (
        <>
          <p className="mt-3 type-body text-text">Spróbuj bez jednego z nich:</p>
          <ul className="mt-4 flex flex-col border-t border-line">
            {options.map(({ filter, relaxed, count }) => (
              <li key={filter.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => onChange(relaxed)}
                  className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-2 text-left hover:bg-bg-subtle"
                >
                  <span className="type-ui text-text">Bez filtra „{filter.label}”</span>
                  <span className="type-meta whitespace-nowrap text-text-muted">
                    {count} {plural(count, "wydarzenie", "wydarzenia", "wydarzeń")} →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <Button variant="link" onClick={onClear} className="mt-4">
        Wyczyść filtry
      </Button>
    </div>
  )
}
