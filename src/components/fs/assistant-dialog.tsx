"use client"

import { useId, useRef, useState } from "react"

import Chat from "@/app/[lang]/asystent/Chat"
import type { EventCard, Lang, Venue } from "@/lib/assistant"
import { useKeyboardViewport } from "@/lib/use-keyboard-viewport"
import { cn } from "@/lib/utils"

type AssistantDialogProps = {
  lang?: Lang
  events: EventCard[]
  venue: Venue
  /** Wygląd przycisku otwierającego (heksagon z dolnej nawigacji) */
  className?: string
  /** Nazwa dla przycisku bez pełnego podpisu (np. sam heksagon „AI”) */
  label?: string
  children: React.ReactNode
}

/**
 * Asystent AI jako nakładka nad bieżącą stroną (§6.14): pełny ekran na mobile,
 * szuflada 420 px z prawej na desktopie. Natywny <dialog> daje aria-modal,
 * blokadę reszty strony, zamykanie Esc i powrót fokusu na przycisk otwierający.
 * Rozmowa zostaje w pamięci po zamknięciu – ponowne otwarcie wraca do niej.
 */
export function AssistantDialog({ lang = "pl", events, venue, className, label, children }: AssistantDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // Dwie instancje (dolna nawigacja i heksagon na desktopie) – każda potrzebuje własnego id nagłówka
  const titleId = useId()
  // Czat montujemy dopiero przy pierwszym otwarciu, żeby nie obciążać każdej strony
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  // Klawiatura na telefonie: okno ma wysokość i położenie widocznej części ekranu (pole pytania nad klawiaturą)
  const viewport = useKeyboardViewport(open)

  function show() {
    setMounted(true)
    dialogRef.current?.showModal()
    setOpen(true)
  }

  function close() {
    dialogRef.current?.close()
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        className={className}
      >
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        data-keyboard={viewport?.keyboard || undefined}
        style={viewport ? { height: viewport.height, top: viewport.top } : undefined}
        // Kliknięcie w tło (poza szufladą na desktopie) zamyka nakładkę
        onClick={(e) => e.target === e.currentTarget && close()}
        className={cn(
          "assistant-dialog m-0 h-dvh max-h-none w-full max-w-none bg-background p-0 text-foreground",
          "lg:ml-auto lg:w-[420px] lg:border-l lg:border-line"
        )}
      >
        {mounted && (
          <Chat
            lang={lang}
            events={events}
            venue={venue}
            titleId={titleId}
            onClose={close}
            // Przy otwartej klawiaturze dolny margines bezpieczny nie jest potrzebny – pole stoi tuż nad klawiaturą
            className="h-full pb-[env(safe-area-inset-bottom)] in-data-keyboard:pb-0"
          />
        )}
      </dialog>
    </>
  )
}
