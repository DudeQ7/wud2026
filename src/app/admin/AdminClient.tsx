"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

import { type OverrideInput, saveOverride } from "./actions"

export type AdminEvent = {
  id: number
  title: string
  kind: string
  firstDate?: string
  override: Omit<OverrideInput, "eventId">
}

const STATUS_LABEL: Record<string, string> = {
  "": "Domyślny (z mocka)",
  available: "Dostępne",
  last: "Ostatnie miejsca",
  soldout: "Wyprzedane",
}

const SESSION_KEY = "fs-admin-demo"
const ENTER_EVENT = "fs-admin-enter"

function subscribeEntered(onChange: () => void) {
  window.addEventListener(ENTER_EVENT, onChange)
  return () => window.removeEventListener(ENTER_EVENT, onChange)
}

function readEntered() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1"
  } catch {
    return false
  }
}

/** Mini-CMS: wejście jednym przyciskiem (demo, bez logowania), lista wydarzeń i formularz nadpisań */
export function AdminClient({ events }: { events: AdminEvent[] }) {
  const entered = React.useSyncExternalStore(subscribeEntered, readEntered, () => false)
  const [query, setQuery] = React.useState("")

  function enter() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {}
    window.dispatchEvent(new Event(ENTER_EVENT))
  }

  if (!entered) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-4 py-16">
        <p className="type-eyebrow text-gold">Filharmonia Szczecin · demo</p>
        <h1 className="type-h1 text-gold">Mini-CMS</h1>
        <p className="type-body text-text">
          Symuluje CMS i system biletowy (iksoris): zmień status biletów, cenę i program PDF wydarzenia, a strona od razu
          pokaże zmianę. To środowisko demonstracyjne, bez logowania.
        </p>
        <Button onClick={enter} className="self-start">
          Wejdź do trybu admina
        </Button>
      </main>
    )
  }

  const q = query.trim().toLowerCase()
  const filtered = q ? events.filter((e) => `${e.title} ${e.kind} ${e.id}`.toLowerCase().includes(q)) : events

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="type-eyebrow text-gold">Mini-CMS · demo</p>
      <h1 className="mt-1 type-h1 text-gold">Wydarzenia</h1>
      <p className="mt-2 max-w-[68ch] type-body text-text">
        Zmiany zapisują się w Supabase i działają na stronie głównej, w kalendarzu, na karcie wydarzenia i w kreatorze.
      </p>
      <label htmlFor="admin-q" className="mt-6 block type-ui text-text">
        Szukaj wydarzenia
      </label>
      <Input id="admin-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="np. Przybysz, jazz, 2608" />
      <p className="mt-3 type-meta text-text-muted" aria-live="polite">
        {filtered.length} z {events.length}
      </p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {filtered.map((e) => (
          <EventRow key={e.id} event={e} />
        ))}
      </ul>
    </main>
  )
}

function EventRow({ event }: { event: AdminEvent }) {
  const [open, setOpen] = React.useState(false)
  const o = event.override
  const changed = o.ticketStatus || o.priceFree != null || o.priceMin != null || o.programPdf
  return (
    <li className="py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-start justify-between gap-4 text-left"
      >
        <span>
          <span className="block type-title-card text-text">{event.title}</span>
          <span className="block type-meta text-text-muted">
            {event.kind} · {event.firstDate?.slice(0, 10)} · id {event.id}
          </span>
        </span>
        <span className="type-meta text-text-muted">{changed ? "Zmienione" : open ? "Zwiń" : "Edytuj"}</span>
      </button>
      {open && <EventForm event={event} />}
    </li>
  )
}

function EventForm({ event }: { event: AdminEvent }) {
  const o = event.override
  const [status, setStatus] = React.useState<string>(o.ticketStatus ?? "")
  const [free, setFree] = React.useState(o.priceFree === true)
  const [min, setMin] = React.useState(o.priceMin?.toString() ?? "")
  const [max, setMax] = React.useState(o.priceMax?.toString() ?? "")
  const [pdf, setPdf] = React.useState(o.programPdf ?? "")
  const [msg, setMsg] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const id = `ev-${event.id}`

  async function upload(file: File) {
    setBusy(true)
    setMsg("Wgrywanie PDF…")
    const path = `${event.id}-${Date.now()}.pdf`
    const supabase = createClient()
    const { error } = await supabase.storage.from("programs").upload(path, file, { contentType: "application/pdf" })
    if (error) {
      setMsg(`Błąd wgrywania: ${error.message}`)
    } else {
      setPdf(supabase.storage.from("programs").getPublicUrl(path).data.publicUrl)
      setMsg("PDF wgrany. Zapisz zmiany.")
    }
    setBusy(false)
  }

  async function save(reset = false) {
    setBusy(true)
    setMsg("Zapisywanie…")
    const toNum = (v: string) => (v.trim() === "" ? null : Number(v))
    const input: OverrideInput = reset
      ? { eventId: event.id, ticketStatus: null, priceFree: null, priceMin: null, priceMax: null, programPdf: null }
      : {
          eventId: event.id,
          ticketStatus: (status || null) as OverrideInput["ticketStatus"],
          priceFree: free ? true : null,
          priceMin: free ? null : toNum(min),
          priceMax: free ? null : toNum(max),
          programPdf: pdf.trim() || null,
        }
    const res = await saveOverride(input)
    if (res.ok) {
      setMsg(reset ? "Przywrócono wartości domyślne" : "Zapisano, zmiana jest już na stronie")
      if (reset) {
        setStatus("")
        setFree(false)
        setMin("")
        setMax("")
        setPdf("")
      }
    } else {
      setMsg(`Błąd: ${res.error}`)
    }
    setBusy(false)
  }

  return (
    <div className="mt-4 grid gap-4 border-l-2 border-line-strong pl-4">
      <div>
        <label htmlFor={`${id}-status`} className="block type-ui text-text">
          Status biletów
        </label>
        <select
          id={`${id}-status`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-13 w-full border-[1.5px] border-line-strong bg-background px-4 text-base text-text"
        >
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="grid gap-3">
        <legend className="type-ui text-text">Cena biletu</legend>
        <label className="flex min-h-11 items-center gap-3 type-body text-text">
          <input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} className="size-5" />
          Wstęp wolny
        </label>
        {!free && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${id}-min`} className="block type-meta text-text-muted">
                Od (zł)
              </label>
              <Input id={`${id}-min`} inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} placeholder="np. 40" />
            </div>
            <div>
              <label htmlFor={`${id}-max`} className="block type-meta text-text-muted">
                Do (zł)
              </label>
              <Input id={`${id}-max`} inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} placeholder="np. 90" />
            </div>
          </div>
        )}
      </fieldset>

      <div>
        <label htmlFor={`${id}-pdf`} className="block type-ui text-text">
          Program koncertu (PDF)
        </label>
        <input
          id={`${id}-pdf`}
          type="file"
          accept="application/pdf"
          disabled={busy}
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          className="mt-1 block w-full type-body text-text"
        />
        {pdf && (
          <p className="mt-2 break-all type-meta text-text-muted">
            <a href={pdf} target="_blank" rel="noopener noreferrer" className="underline">
              Aktualny plik
            </a>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => save()} disabled={busy} size="sm">
          Zapisz
        </Button>
        <Button onClick={() => save(true)} disabled={busy} variant="secondary" size="sm">
          Przywróć domyślne
        </Button>
        <span role="status" className="type-meta text-text">
          {msg}
        </span>
      </div>
    </div>
  )
}
