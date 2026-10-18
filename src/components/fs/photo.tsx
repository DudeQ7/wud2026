import Image from "next/image"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const RATIOS = {
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
} as const

type PhotoProps = {
  src?: string
  alt: string
  ratio?: keyof typeof RATIOS
  /** Kadrowanie bez edycji pliku (§5.6) – CSS object-position */
  position?: string
  /** Ścięty narożnik motywu znaku (§5.2) – maks. 1–2 na ekran */
  chamfer?: boolean
  sizes?: string
  priority?: boolean
  /** Tekst w miejscu brakującego zdjęcia */
  placeholder?: string
  className?: string
  children?: React.ReactNode
}

/**
 * Zdjęcie FS zawsze w oryginale: tylko skalowanie i kadrowanie (object-fit / object-position).
 * Bez filtrów, nakładek i przyciemnień. Elementy UI (np. znacznik daty) idą jako `children`.
 */
export function Photo({
  src,
  alt,
  ratio = "3/2",
  position = "center",
  chamfer,
  sizes = "(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw",
  priority,
  placeholder,
  className,
  children,
}: PhotoProps) {
  return (
    // Tło #EDEBE5 tylko jako placeholder – pod zdjęciem byłoby widać je przez przezroczyste PNG FS
    <div
      className={cn("relative overflow-hidden", !src && "bg-surface-muted", RATIOS[ratio], chamfer && "chamfer-tr", className)}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover photo-zoom"
          style={{ objectPosition: position }}
        />
      ) : (
        placeholder && (
          <p className="absolute inset-0 flex items-center p-3 text-[0.8125rem] font-semibold text-text-muted">
            {placeholder}
          </p>
        )
      )}
      {children}
    </div>
  )
}

/**
 * Uniesienie zdjęcia w klikalnym kaflu lub plakacie (rodzic z klasą `group`): po 80 ms od najechania lub fokusu ramka
 * podnosi się o 6 px, po zjechaniu od razu wraca (250 ms, ease-in-out). Samo zdjęcie się nie zmienia (§5.6).
 */
export const photoLift =
  "transition-transform duration-[250ms] ease-in-out group-focus-within:-translate-y-1.5 group-focus-within:delay-[80ms] group-hover:-translate-y-1.5 group-hover:delay-[80ms]"

/** Czarny znacznik daty w lewym górnym rogu zdjęcia (§6.10) */
export function PhotoDateBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="date" className="absolute top-0 left-0">
      {children}
    </Badge>
  )
}
