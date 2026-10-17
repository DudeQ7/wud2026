import type { Metadata } from "next"

import { BottomNav } from "@/components/fs/bottom-nav"
import { eventCards, venue } from "@/lib/assistant"

import Chat from "./Chat"

export const metadata: Metadata = {
  title: "Asystent Filharmonii w Szczecinie",
  description: "Asystent AI Filharmonii im. Mieczysława Karłowicza w Szczecinie",
}

export default function AssistantPage() {
  return (
    // Bezpośredni link do czatu; z nawigacji asystent otwiera się jako nakładka.
    // Czat zajmuje ekran nad dolną nawigacją, żeby pole pytania nie chowało się pod paskiem
    <>
      <main>
        <Chat lang="pl" events={eventCards} venue={venue} className="h-[calc(100dvh-var(--bottom-nav-h))]" />
      </main>
      <BottomNav />
    </>
  )
}
