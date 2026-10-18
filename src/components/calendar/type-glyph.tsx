import {
  Clapperboard,
  Footprints,
  Globe,
  Image,
  type LucideIcon,
  Mic2,
  Music,
  Piano,
  Plus,
  Shapes,
} from "lucide-react"

import type { EventType } from "@/lib/calendar"
import { cn } from "@/lib/utils"

/**
 * Jeden symbol na rodzaj wydarzenia (brief §6.2 „Rodzaj”, design.md §6.7): w kalendarzu widać od razu,
 * że 15 października jest koncert, a 18 – wydarzenie dla dzieci. Monochromatycznie (D5/D6): rodzaj rozróżnia
 * kształt, nie kolor, a każdy symbol ma w legendzie i w aria-label nazwę słowem.
 */
const GLYPHS: Record<EventType, LucideIcon> = {
  symfoniczny: Music,
  kameralny: Piano,
  jazz: Mic2,
  "muzyka-swiata": Globe,
  edukacja: Shapes,
  wystawa: Image,
  zwiedzanie: Footprints,
  festiwal: Music,
  spotkania: Clapperboard,
}

export function TypeGlyph({ type, className }: { type: EventType; className?: string }) {
  const Icon = GLYPHS[type]
  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cn("size-3.5 shrink-0", className)}
    />
  )
}

/** „+” gdy w danym dniu jest więcej rodzajów, niż mieści się pod datą */
export function MoreGlyph({ className }: { className?: string }) {
  return <Plus aria-hidden="true" focusable="false" strokeWidth={2.5} className={cn("size-3.5 shrink-0", className)} />
}
