"use client"

import { useRef, useState } from "react"

import Chat from "@/app/asystent/Chat"
import type { EventCard, Lang, Venue } from "@/lib/assistant"
import { cn } from "@/lib/utils"

type AssistantDialogProps = {
  lang?: Lang
  events: EventCard[]
  venue: Venue
  /** Wygląd przycisku otwierającego (heksagon z dolnej nawigacji) */
  className?: string
  children: React.ReactNode
}

/**
 * Asystent AI jako nakładka nad bieżącą stroną (§6.14): pełny ekran na mobile,
 * szuflada 420 px z prawej na desktopie. Natywny <dialog> daje aria-modal,
 * blokadę reszty strony, zamykanie Esc i powrót fokusu na przycisk otwierający.
 * Rozmowa zostaje w pamięci po zamknięciu – ponowne otwarcie wraca do niej.
 */
export function AssistantDialog({ lang = "pl", events, venue, className, children }: AssistantDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // Czat montujemy dopiero przy pierwszym otwarciu, żeby nie obciążać każdej strony
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

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
      <button type="button" onClick={show} aria-haspopup="dialog" aria-expanded={open} className={className}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="asystent-tytul"
        onClose={() => setOpen(false)}
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
            titleId="asystent-tytul"
            onClose={close}
            className="h-full pb-[env(safe-area-inset-bottom)]"
          />
        )}
      </dialog>
    </>
  )
}
