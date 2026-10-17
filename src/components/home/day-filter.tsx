"use client"

import { useState } from "react"

import { EventRow } from "@/components/fs/event-row"
import { Toggle } from "@/components/ui/toggle"
import type { FsEvent } from "@/lib/event-format"

export type DayGroup = {
  /** YYYY-MM-DD */
  day: string
  /** „Sobota, 17 października” */
  label: string
  rows: { event: FsEvent; times: string[] }[]
}

export type DayTab = {
  key: "today" | "tomorrow" | "weekend"
  label: string
  /** Nagłówek sekcji dla tej zakładki */
  heading: string
  /** Linia pod nagłówkiem: data i godziny otwarcia budynku */
  meta: string
  /** Informacja o kasie na dole sekcji */
  boxOffice: string
  groups: DayGroup[]
}

/**
 * „Dziś w Filharmonii” z szybkim wyborem dnia (§6.6): Dziś / Jutro / Ten weekend.
 * Przy jednym dniu lista bez nagłówka dnia; przy weekendzie – nagłówki dni (h3, §6.7).
 */
export function DayFilter({ tabs, headingId }: { tabs: DayTab[]; headingId: string }) {
  const [active, setActive] = useState<DayTab["key"]>(tabs[0].key)
  const tab = tabs.find((t) => t.key === active) ?? tabs[0]
  const multiDay = tab.groups.length > 1

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 lg:mb-8">
        <h2 id={headingId} className="type-h2 text-gold">
          {tab.heading}
        </h2>
        <p className="type-meta whitespace-pre-line text-text-muted">{tab.meta}</p>
      </div>

      <div role="group" aria-label="Wybierz dzień" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <Toggle
            key={t.key}
            pressed={t.key === active}
            onPressedChange={(on) => on && setActive(t.key)}
            aria-controls={`${headingId}-list`}
          >
            {t.label}
          </Toggle>
        ))}
      </div>

      <div id={`${headingId}-list`} aria-live="polite" className="mt-6">
        {tab.groups.every((g) => g.rows.length === 0) ? (
          <p className="type-body border-y border-line py-4 text-text">
            Tego dnia nie ma wydarzeń. Zajrzyj do pełnego kalendarza.
          </p>
        ) : (
          tab.groups.map((group) =>
            group.rows.length === 0 ? null : (
              <div key={group.day}>
                {multiDay && (
                  <h3 className="sticky top-[var(--header-h)] z-10 mt-4 border-b border-line-strong bg-background py-2 type-h4 text-gold">
                    {group.label}
                  </h3>
                )}
                <div className="grid lg:grid-cols-2 lg:gap-x-8">
                  {group.rows.map(({ event, times }) => (
                    <EventRow key={`${group.day}-${event.id}`} event={event} times={times} />
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>

      <p className="mt-6 type-meta text-text-muted">{tab.boxOffice}</p>
    </>
  )
}
