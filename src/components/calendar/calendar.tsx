"use client"

import { Search, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { type ReactNode, useEffect, useMemo, useState } from "react"

import { FilterSheet } from "@/components/calendar/filter-sheet"
import { EventRow } from "@/components/fs/event-row"
import { iconProps } from "@/components/fs/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { type Dictionary, type Locale, getDictionary } from "@/i18n"
import {
  type ActiveFilter,
  type CalendarDay,
  type CalendarEvent,
  type DisplayMode,
  type Filters,
  activeFilters,
  alternatives,
  calendarDays,
  countEvents,
  countRows,
  LAST_CALENDAR_QUERY_KEY,
  emptyFilters,
  parseFilters,
  toQuery,
  withView,
} from "@/lib/calendar"
import { todayKey } from "@/lib/event-format"

const PAGE_SIZE = 30

export type CalendarProps = {
  events: CalendarEvent[]
  series: { key: string; label: string }[]
  lang: Locale
  displayMode?: DisplayMode
  monthView?: ReactNode
  /** Przełącznik Lista | Miesiąc – stoi w wierszu z licznikiem wyników */
  viewSwitch?: ReactNode
}

/**
 * Kalendarz z filtrami (§6.6, §7.2). Stan filtrów żyje w adresie URL – link można udostępnić,
 * a „wstecz” z karty wydarzenia wraca do tych samych wyników. Wyniki liczymy w przeglądarce,
 * więc licznik i lista zmieniają się od razu, bez zapytania do serwera.
 */
export function Calendar({ events, series, lang, displayMode = "list", monthView, viewSwitch }: CalendarProps) {
  const t = getDictionary(lang)
  const searchParams = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const [today] = useState(() => todayKey(new Date()))

  const seriesLabels = useMemo(() => Object.fromEntries(series.map((s) => [s.key, s.label])), [series])
  const days = useMemo(() => calendarDays(events, filters, today, t), [events, filters, today, t])
  // Licznik pokazuje wydarzenia; lista i „pokaż więcej” idą po terminach (wiersz = wydarzenie w danym dniu)
  const count = countEvents(days)
  const rows = countRows(days)
  const active = activeFilters(filters, seriesLabels, t)

  const [limit, setLimit] = useState(PAGE_SIZE)
  // Adres z filtrami i widokiem – „← Repertuar” na karcie wydarzenia wraca do tego samego miejsca
  const query = withView(toQuery(filters), displayMode)

  // Zapamiętujemy filtry dla „← Repertuar” na karcie wydarzenia
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_CALENDAR_QUERY_KEY, query ? `?${query}` : "")
    } catch {
      // Prywatne okno lub zablokowany storage – link wróci do pełnego repertuaru
    }
  }, [query])
  // Nowy zestaw filtrów zaczyna listę od początku
  const [shownQuery, setShownQuery] = useState(query)
  if (shownQuery !== query) {
    setShownQuery(query)
    setLimit(PAGE_SIZE)
  }

  function navigate(next: Filters) {
    const qs = withView(toQuery(next), displayMode)
    // replaceState: filtry nie zaśmiecają historii, a „wstecz” prowadzi tam, skąd przyszedł użytkownik
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
  }

  // Licznik dla czytników ekranu z opóźnieniem ~300 ms, żeby nie ogłaszać każdego znaku (§6.6)
  const countText = t.calendar.count(count)
  const [announced, setAnnounced] = useState(countText)
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(countText), 300)
    return () => clearTimeout(t)
  }, [countText])

  const visibleDays = useMemo(() => firstRows(days, limit), [days, limit])

  const quick: { key: keyof typeof t.calendar.quick; label: string; on: boolean; toggle: (on: boolean) => Filters }[] = [
    {
      key: "today",
      label: t.calendar.quick.today,
      on: filters.kiedy === "dzis",
      toggle: (on) => ({ ...filters, kiedy: on ? "dzis" : undefined, od: undefined, do: undefined }),
    },
    {
      key: "weekend",
      label: t.calendar.quick.weekend,
      on: filters.kiedy === "weekend",
      toggle: (on) => ({ ...filters, kiedy: on ? "weekend" : undefined, od: undefined, do: undefined }),
    },
    {
      key: "kids",
      label: t.calendar.quick.kids,
      on: filters.dlaKogo.includes("dzieci"),
      toggle: (on) => ({ ...filters, dlaKogo: toggled(filters.dlaKogo, "dzieci", on) }),
    },
    {
      key: "jazz",
      label: t.calendar.quick.jazz,
      on: filters.rodzaj.includes("jazz"),
      toggle: (on) => ({ ...filters, rodzaj: toggled(filters.rodzaj, "jazz", on) }),
    },
    {
      key: "exhibitions",
      label: t.calendar.quick.exhibitions,
      on: filters.rodzaj.includes("wystawa"),
      toggle: (on) => ({ ...filters, rodzaj: toggled(filters.rodzaj, "wystawa", on) }),
    },
  ]

  return (
    <>
      {/* Wiersz 1: szukaj + Filtry w jednej linii (na telefonie pole nie zajmuje już całej szerokości) */}
      <div className="flex items-end gap-2">
        <SearchField value={filters.q} onCommit={(q) => navigate({ ...filters, q })} t={t} />
        <FilterSheet
          events={events}
          series={series}
          filters={filters}
          today={today}
          t={t}
          activeCount={active.length}
          onApply={navigate}
        />
      </div>

      {/* Wiersz 2: szybkie filtry w jednej, przewijanej linii; ucięty ostatni chip zdradza, że jest więcej (§6.6) */}
      <div
        role="group"
        aria-label={t.calendar.quickFilters}
        className="-mx-4 mt-1 flex gap-1 overflow-x-auto px-4 py-2 md:mx-0 md:gap-2 md:px-0"
      >
        {/* Zawsze jedna linia, bez zawijania. Na telefonie krótkie etykiety i zwarty rozmiar, żeby wszystkie pięć chipów
            (także z ✓ po zaznaczeniu) mieściło się na ekranie; gdy ekran jest za wąski (np. DE na 360 px), linia się przewija. */}
        {quick.map((q) => (
          <Toggle
            key={q.key}
            pressed={q.on}
            onPressedChange={(on) => navigate(q.toggle(on))}
            aria-controls="repertuar-lista"
            className="min-w-11 px-2 text-[0.875rem] md:px-4 md:text-[0.9375rem]"
          >
            <span className="md:hidden">{t.calendar.quickShort[q.key]}</span>
            <span className="hidden md:inline">{q.label}</span>
          </Toggle>
        ))}
      </div>

      {/* Wiersz 3: licznik wyników i przełącznik widoku razem */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line-strong pb-3">
        <p className="flex flex-col type-ui text-text" aria-hidden>
          {countText}
          {/* Terminy tylko, gdy różnią się od liczby wydarzeń – np. wystawa otwarta przez miesiąc */}
          {rows !== count && <span className="type-meta font-normal text-text-muted">{t.calendar.dates(rows)}</span>}
        </p>
        <p className="sr-only" aria-live="polite">
          {announced}
        </p>
        {viewSwitch}
      </div>
      {active.length > 0 && (
        <div className="mt-3">
          <ActiveFilterList filters={active} current={filters} onChange={navigate} t={t} />
        </div>
      )}

      {/* Kontener wyników jest zawsze w DOM (cel aria-controls przełączników), także w widoku miesiąca */}
      <div id="repertuar-lista">
      {displayMode === "month" && monthView ? (
        // Ten sam id co lista: szybkie filtry wskazują go w aria-controls w obu widokach
        <div id="repertuar-lista">{monthView}</div>
      ) : (
        <div>
          {count === 0 ? (
            <EmptyState
              options={alternatives(events, filters, today, seriesLabels, t)}
              onChange={navigate}
              onClear={() => navigate(emptyFilters)}
              t={t}
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
                      <EventRow key={event.id} event={event} times={times} lang={lang} />
                    ))}
                  </div>
                </section>
              ))}
              {rows > limit && (
                <div className="mt-8 flex flex-col items-start gap-2">
                  <p className="type-meta text-text-muted">{t.calendar.shown(limit, rows)}</p>
                  <Button variant="secondary" block className="sm:w-fit" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                    {t.calendar.showMore}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
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
function SearchField({ value, onCommit, t }: { value?: string; onCommit: (q?: string) => void; t: Dictionary }) {
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
    <div role="search" className="flex min-w-0 flex-1 flex-col gap-2">
      {/* Etykieta widoczna od 640 px; na telefonie zostaje w nazwie pola (sr-only) – oszczędza wiersz, a lupa i podpowiedź mówią, czym jest pole */}
      <label htmlFor="repertuar-szukaj" className="sr-only text-[0.9375rem] font-semibold text-text sm:not-sr-only">
        {t.calendar.searchLabel}
      </label>
      <div className="relative">
        <Search {...iconProps} className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-text" />
        <Input
          id="repertuar-szukaj"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder={t.calendar.searchPlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="pr-12 pl-12 [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <Button
            variant="icon"
            aria-label={t.calendar.clearSearch}
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
  t,
}: {
  filters: ActiveFilter[]
  current: Filters
  onChange: (f: Filters) => void
  t: Dictionary
}) {
  return (
    <ul aria-label={t.calendar.activeFilters} className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <li key={f.id}>
          <button
            type="button"
            onClick={() => onChange(f.remove(current))}
            aria-label={t.calendar.removeFilter(f.label)}
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
            {t.calendar.clearAll}
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
  t,
}: {
  options: ReturnType<typeof alternatives>
  onChange: (f: Filters) => void
  onClear: () => void
  t: Dictionary
}) {
  return (
    <div className="py-8">
      <h2 className="type-h3 text-gold">{t.calendar.emptyTitle}</h2>
      {options.length > 0 && (
        <>
          <p className="mt-3 type-body text-text">{t.calendar.tryWithout}</p>
          <ul className="mt-4 flex flex-col border-t border-line">
            {options.map(({ filter, relaxed, count }) => (
              <li key={filter.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => onChange(relaxed)}
                  className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-2 text-left hover:bg-bg-subtle"
                >
                  <span className="type-ui text-text">{t.calendar.withoutFilter(filter.label)}</span>
                  <span className="type-meta whitespace-nowrap text-text-muted">{t.calendar.count(count)} →</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <Button variant="link" onClick={onClear} className="mt-4">
        {t.calendar.clearFilters}
      </Button>
    </div>
  )
}
