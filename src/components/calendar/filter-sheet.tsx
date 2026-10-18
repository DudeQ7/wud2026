"use client"

import { ChevronDown, X } from "lucide-react"
import * as React from "react"
import { useRef, useState } from "react"
import posthog from "posthog-js"

import { iconProps } from "@/components/fs/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import type { Dictionary } from "@/i18n"
import { type CalendarEvent, type Filters, calendarDays, countRows, emptyFilters } from "@/lib/calendar"
import { cn } from "@/lib/utils"

type FilterSheetProps = {
  events: CalendarEvent[]
  series: { key: string; label: string }[]
  filters: Filters
  today: string
  t: Dictionary
  /** Liczba aktywnych filtrów – na przycisku „Wszystkie filtry (n)” */
  activeCount: number
  onApply: (filters: Filters) => void
}

/**
 * Pełne filtry (§6.6): na mobile arkusz dolny ~90% wysokości, na desktopie szuflada z prawej.
 * Zmiany są szkicem – licznik w stopce liczy wyniki na żywo, a lista zmienia się dopiero po „Pokaż”.
 * Natywny <dialog> daje aria-modal, pułapkę fokusu, Esc i powrót fokusu na przycisk otwierający.
 */
export function FilterSheet({ events, series, filters, today, t, activeCount, onApply }: FilterSheetProps) {
  const labels = t.calendar
  const s = labels.sheet
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [draft, setDraft] = useState(filters)
  const [open, setOpen] = useState(false)

  const count = open ? countRows(calendarDays(events, draft, today, t)) : 0

  function show() {
    setDraft(filters)
    dialogRef.current?.showModal()
    setOpen(true)
  }

  function close() {
    dialogRef.current?.close()
  }

  function apply() {
    const selectedFilterCount =
      Number(Boolean(draft.kiedy || draft.od || draft.do)) +
      draft.rodzaj.length +
      draft.dlaKogo.length +
      Number(Boolean(draft.wiek)) +
      draft.nastroj.length +
      draft.miejsce.length +
      Number(Boolean(draft.czas)) +
      Number(Boolean(draft.cykl)) +
      Number(Boolean(draft.cena)) +
      draft.dostepnosc.length
    posthog.capture("calendar_filters_applied", {
      result_count: count,
      selected_filter_count: selectedFilterCount,
    })
    onApply(draft)
    close()
  }

  const update = (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch }))

  function toggleIn<K extends "rodzaj" | "dlaKogo" | "miejsce" | "nastroj" | "dostepnosc">(key: K, value: Filters[K][number]) {
    setDraft((d) => {
      const values = d[key] as string[]
      return { ...d, [key]: values.includes(value) ? values.filter((v) => v !== value) : [...values, value] }
    })
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={show} aria-haspopup="dialog" aria-expanded={open}>
        {s.open}
        {activeCount > 0 && ` (${activeCount})`}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="filtry-tytul"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className={cn(
          "filter-sheet m-0 mt-auto h-[90dvh] max-h-none w-full max-w-none bg-background p-0 text-foreground",
          "lg:mt-0 lg:ml-auto lg:h-dvh lg:w-[480px] lg:border-l lg:border-line"
        )}
      >
        {open && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line py-2 pr-2 pl-4">
              <h2 id="filtry-tytul" className="type-h3 text-gold">
                {s.title}
              </h2>
              <Button variant="icon" onClick={close} aria-label={s.close}>
                <X {...iconProps} className="size-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <Group title={s.when} count={draft.kiedy || draft.od || draft.do ? 1 : 0} selected={s.selected} defaultOpen>
                <Options>
                  {entries(labels.when).map(([key, label]) => (
                    <Toggle
                      key={key}
                      pressed={draft.kiedy === key}
                      onPressedChange={(on) => update({ kiedy: on ? key : undefined, od: undefined, do: undefined })}
                    >
                      {label}
                    </Toggle>
                  ))}
                </Options>
                <fieldset className="mt-5">
                  <legend className="mb-2 text-[0.9375rem] font-semibold text-text">{s.dateRange}</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <DateField
                      id="filtr-data-od"
                      label={s.from}
                      value={draft.od}
                      min={today}
                      onChange={(od) => update({ od, kiedy: undefined })}
                    />
                    <DateField
                      id="filtr-data-do"
                      label={s.to}
                      value={draft.do}
                      min={draft.od ?? today}
                      onChange={(to) => update({ do: to, kiedy: undefined })}
                    />
                  </div>
                </fieldset>
              </Group>

              <Group title={s.type} count={draft.rodzaj.length} selected={s.selected}>
                <Options>
                  {entries(labels.types).map(([key, label]) => (
                    <Toggle key={key} pressed={draft.rodzaj.includes(key)} onPressedChange={() => toggleIn("rodzaj", key)}>
                      {label}
                    </Toggle>
                  ))}
                </Options>
              </Group>

              <Group title={s.audience} count={draft.dlaKogo.length + (draft.wiek ? 1 : 0)} selected={s.selected}>
                <Options>
                  {entries(labels.audiences).map(([key, label]) => (
                    <Toggle key={key} pressed={draft.dlaKogo.includes(key)} onPressedChange={() => toggleIn("dlaKogo", key)}>
                      {label}
                    </Toggle>
                  ))}
                </Options>
                <div className="mt-5 flex flex-col gap-2">
                  <label htmlFor="filtr-wiek" className="text-[0.9375rem] font-semibold text-text">
                    {s.age}
                  </label>
                  <Input
                    id="filtr-wiek"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={18}
                    value={draft.wiek ?? ""}
                    onChange={(e) => {
                      const wiek = Number(e.target.value)
                      update({ wiek: wiek > 0 && wiek < 19 ? Math.floor(wiek) : undefined })
                    }}
                    aria-describedby="filtr-wiek-opis"
                    className="w-32"
                  />
                  <p id="filtr-wiek-opis" className="type-meta text-text-muted">
                    {s.ageHint}
                  </p>
                </div>
              </Group>

              <Group title={s.mood} count={draft.nastroj.length} selected={s.selected}>
                <Options>
                  {entries(labels.moods).map(([key, label]) => (
                    <Toggle key={key} pressed={draft.nastroj.includes(key)} onPressedChange={() => toggleIn("nastroj", key)}>
                      {label}
                    </Toggle>
                  ))}
                </Options>
              </Group>

              <Group title={s.place} count={draft.miejsce.length} selected={s.selected}>
                <Options>
                  {entries(labels.places).map(([key, label]) => (
                    <Toggle key={key} pressed={draft.miejsce.includes(key)} onPressedChange={() => toggleIn("miejsce", key)}>
                      {label}
                    </Toggle>
                  ))}
                </Options>
                <p className="mt-4 type-meta text-text-muted">{s.placeNote}</p>
              </Group>

              <Group title={s.duration} count={draft.czas ? 1 : 0} selected={s.selected}>
                <Options>
                  {entries(labels.durations).map(([key, label]) => (
                    <Toggle key={key} pressed={draft.czas === key} onPressedChange={(on) => update({ czas: on ? key : undefined })}>
                      {label}
                    </Toggle>
                  ))}
                </Options>
                <p className="mt-4 type-meta text-text-muted">{s.durationNote}</p>
              </Group>

              <Group title={s.price} count={draft.cena ? 1 : 0} selected={s.selected}>
                <Options>
                  {entries(labels.prices).map(([key, label]) => (
                    <Toggle key={key} pressed={draft.cena === key} onPressedChange={(on) => update({ cena: on ? key : undefined })}>
                      {label}
                    </Toggle>
                  ))}
                </Options>
                <p className="mt-4 type-meta text-text-muted">{s.priceNote}</p>
              </Group>

              <Group title={s.accessibility} count={draft.dostepnosc.length} selected={s.selected}>
                <Options>
                  {entries(labels.access).map(([key, label]) => (
                    <Toggle key={key} pressed={draft.dostepnosc.includes(key)} onPressedChange={() => toggleIn("dostepnosc", key)}>
                      {label}
                    </Toggle>
                  ))}
                </Options>
                <p className="mt-4 type-meta text-text-muted">{s.accessNote}</p>
              </Group>

              <Group title={s.series} count={draft.cykl ? 1 : 0} selected={s.selected}>
                <label htmlFor="filtr-cykl" className="mb-2 block text-[0.9375rem] font-semibold text-text">
                  {s.chooseSeries}
                </label>
                <div className="relative">
                  <select
                    id="filtr-cykl"
                    value={draft.cykl ?? ""}
                    onChange={(e) => update({ cykl: e.target.value || undefined })}
                    className="h-13 w-full cursor-pointer appearance-none border-[1.5px] border-line-strong bg-background pr-12 pl-4 text-base text-text"
                  >
                    <option value="">{s.allSeries}</option>
                    {series.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    {...iconProps}
                    className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-text"
                  />
                </div>
              </Group>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(26,26,26,.08)]">
              <Button variant="link" onClick={() => setDraft({ ...emptyFilters, q: draft.q, widok: draft.widok, miesiac: draft.miesiac })}>
                {s.clear}
              </Button>
              <Button onClick={apply} className="min-w-0 flex-1 sm:flex-none">
                <span aria-live="polite">{s.show(count)}</span>
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}

const entries = <T extends Record<string, string>>(options: T) => Object.entries(options) as [keyof T & string, string][]

function Group({
  title,
  count,
  selected,
  defaultOpen,
  children,
}: {
  title: string
  count: number
  /** „wybrano 2” w języku interfejsu */
  selected: (n: number) => string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details open={defaultOpen} className="group border-b border-line">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-2 [&::-webkit-details-marker]:hidden">
        <span className="type-h4 text-text">
          {title}
          {count > 0 && <span className="type-meta font-semibold text-text-muted"> · {selected(count)}</span>}
        </span>
        <ChevronDown {...iconProps} className="size-6 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-1 pb-6">{children}</div>
    </details>
  )
}

function Options({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

function DateField({
  id,
  label,
  value,
  min,
  onChange,
}: {
  id: string
  label: string
  value?: string
  min: string
  onChange: (value?: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-text">
        {label}
      </label>
      <Input id={id} type="date" min={min} value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} className="px-3" />
    </div>
  )
}
