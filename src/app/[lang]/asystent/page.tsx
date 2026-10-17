import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BottomNav } from "@/components/fs/bottom-nav"
import { getDictionary, hasLocale } from "@/i18n"
import { eventCards, venue } from "@/lib/assistant"

import Chat from "./Chat"

export async function generateMetadata({ params }: PageProps<"/[lang]/asystent">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return getDictionary(lang).meta.assistant
}

export default async function AssistantPage({ params }: PageProps<"/[lang]/asystent">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    // Bezpośredni link do czatu; z nawigacji asystent otwiera się jako nakładka.
    // Czat zajmuje ekran nad dolną nawigacją, żeby pole pytania nie chowało się pod paskiem
    <>
      <main>
        <Chat lang={lang} events={eventCards} venue={venue} className="h-[calc(100dvh-var(--bottom-nav-h))]" />
      </main>
      <BottomNav lang={lang} />
    </>
  )
}
