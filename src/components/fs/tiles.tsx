import Link from "next/link"
import * as React from "react"

import { ArrowRight } from "lucide-react"

import { iconProps } from "@/components/fs/icons"
import { Eyebrow } from "@/components/fs/layout"
import { Photo, photoLift } from "@/components/fs/photo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stretchedLink =
  "after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"

type LinkTileProps = {
  title: string
  description: string
  href: string
  /** Np. „4 wydarzenia” – ile wyników czeka po kliknięciu */
  meta?: string
  className?: string
}

/** Kafel tekstowy z konturem 1,5 px – „Dla Ciebie” (§6.18). Na dole liczba wyników i strzałka: wiadomo, co da kliknięcie. */
export function LinkTile({ title, description, href, meta, className }: LinkTileProps) {
  return (
    <article
      className={cn(
        "group press enter relative flex min-h-32 flex-col gap-1 border-[1.5px] border-line-strong p-4 hover:bg-bg-subtle",
        className
      )}
    >
      <h3 className="font-heading text-lg leading-tight font-semibold text-text">
        <Link href={href} className={stretchedLink}>
          {title}
        </Link>
      </h3>
      <p className="type-meta text-text-muted">{description}</p>
      <p className="mt-auto flex items-center justify-between gap-2 pt-2 text-[0.875rem] font-semibold text-text">
        <span className="tabular-nums">{meta}</span>
        <ArrowRight {...iconProps} className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
      </p>
    </article>
  )
}

type CtaTileProps = {
  eyebrow: string
  title: string
  description: string
  action: { label: string; href: string }
  className?: string
}

/** Czarny kafel z jedną akcją – „Pomóż mi wybrać” (§6.18). Złoto „on dark”, przycisk odwrócony. */
export function CtaTile({ eyebrow, title, description, action, className }: CtaTileProps) {
  return (
    <article className={cn("on-dark enter-scale flex flex-col gap-3 bg-ink px-5 py-6 lg:p-8", className)}>
      <Eyebrow tone="dark">{eyebrow}</Eyebrow>
      <h3 className="type-h2 text-on-dark">{title}</h3>
      <p className="type-body max-w-[52ch] text-on-dark-muted">{description}</p>
      <Link href={action.href} className={cn(buttonVariants({ variant: "inverted", block: true }), "mt-1 sm:w-fit")}>
        {action.label}
      </Link>
    </article>
  )
}

type DiscoverTileProps = {
  title: string
  description: string
  href: string
  image?: string
  /** Tekst w miejscu brakującego zdjęcia */
  placeholder: string
  /** Własna grafika 3:2 zamiast zdjęcia (np. ilustracja schodów w kaflu „Budynek”) */
  visual?: React.ReactNode
  className?: string
}

/** Kafel „Odkryj Filharmonię” (§6.18): zdjęcie 3:2 (unoszone przy najechaniu) + nazwa (h3) + 1 linia opisu */
export function DiscoverTile({ title, description, href, image, placeholder, visual, className }: DiscoverTileProps) {
  return (
    <article className={cn("group press enter relative flex flex-col gap-2", className)}>
      {visual ? (
        <div className={cn("relative aspect-[3/2] overflow-hidden bg-bg-subtle", photoLift)}>{visual}</div>
      ) : (
        <Photo
          src={image}
          alt=""
          placeholder={placeholder}
          sizes="(min-width: 1024px) 33vw, 50vw"
          className={photoLift}
        />
      )}
      <h3 className="font-heading text-lg leading-tight font-semibold text-text">
        <Link href={href} className={cn(stretchedLink, "group-hover:underline group-hover:underline-offset-4")}>
          {title}
        </Link>
      </h3>
      <p className="type-meta text-text-muted">{description}</p>
    </article>
  )
}
