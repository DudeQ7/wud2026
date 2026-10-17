import * as React from "react"

import { cn } from "@/lib/utils"

/** Kontener treści: margines 16/24/32 px, maks. 1320 px (§4.1) */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8", className)} {...props} />
}

type SectionProps = React.ComponentProps<"section"> & {
  /** Tło sekcji: biel (domyślnie) albo czerń marki */
  tone?: "light" | "dark"
}

/** Sekcja strony głównej – stały rytm odstępów (§4.2): 32 px u góry, 64 px na dole */
export function Section({ tone = "light", className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("pt-8 pb-16 lg:pt-12 lg:pb-24", tone === "dark" ? "on-dark bg-ink" : "bg-background", className)}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  )
}

type EyebrowProps = React.ComponentProps<"p"> & { tone?: "light" | "dark" | "muted" }

/** Etykieta nad tytułem: złoto na bieli / złoto „on dark” na czerni (§2.3) */
export function Eyebrow({ tone = "light", className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        tone === "muted" ? "type-label text-text-muted" : "type-eyebrow",
        tone === "light" && "text-gold",
        tone === "dark" && "text-gold-on-dark",
        className
      )}
      {...props}
    />
  )
}

type SectionHeadingProps = {
  id: string
  title: React.ReactNode
  lead?: React.ReactNode
  /** Krótki opis pod tytułem w kolorze metadanych (np. data dnia) */
  meta?: React.ReactNode
  as?: "h2" | "h3"
  className?: string
}

/** Złoty nagłówek sekcji (h2) – tylko na białym tle (§2.3) */
export function SectionHeading({ id, title, lead, meta, as: Tag = "h2", className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-2 lg:mb-8", className)}>
      <Tag id={id} className={cn(Tag === "h2" ? "type-h2" : "type-h3", "text-gold")}>
        {title}
      </Tag>
      {meta && <p className="type-meta whitespace-pre-line text-text-muted">{meta}</p>}
      {lead && <p className="type-body max-w-[68ch] text-text">{lead}</p>}
    </div>
  )
}
