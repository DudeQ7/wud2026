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
    // Czat zajmuje ekran nad dolną nawigacją, żeby pole pytania nie chowało się pod paskiem
    <div className="[&>main]:h-[calc(100dvh-var(--bottom-nav-h))]">
      <Chat lang="pl" events={eventCards} venue={venue} />
      <BottomNav current="/asystent" />
    </div>
  )
}
