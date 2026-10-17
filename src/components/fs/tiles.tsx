import Link from "next/link"
import * as React from "react"

import { Eyebrow } from "@/components/fs/layout"
import { Photo } from "@/components/fs/photo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stretchedLink =
  "after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"

type LinkTileProps = { title: string; description: string; href: string; className?: string }

/** Kafel tekstowy z konturem 1,5 px – „Dla Ciebie” (§6.18) */
export function LinkTile({ title, description, href, className }: LinkTileProps) {
  return (
    <article
      className={cn(
        "group relative flex min-h-34 flex-col gap-1 border-[1.5px] border-line-strong p-4 transition-colors hover:bg-bg-subtle",
        className
      )}
    >
      <h3 className="font-heading text-lg leading-tight font-semibold text-text">
        <Link href={href} className={stretchedLink}>
          {title}
        </Link>
      </h3>
      <p className="type-meta text-text-muted">{description}</p>
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
    <article className={cn("on-dark flex flex-col gap-3 bg-ink px-5 py-6 lg:p-8", className)}>
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
  className?: string
}

/** Kafel „Odkryj Filharmonię” (§6.18): zdjęcie 3:2 + nazwa (h3) + 1 linia opisu */
export function DiscoverTile({ title, description, href, image, placeholder, className }: DiscoverTileProps) {
  return (
    <article className={cn("group relative flex flex-col gap-2", className)}>
      <Photo
        src={image}
        alt=""
        placeholder={placeholder}
        sizes="(min-width: 1024px) 33vw, 50vw"
      />
      <h3 className="font-heading text-lg leading-tight font-semibold text-text">
        <Link href={href} className={cn(stretchedLink, "group-hover:underline group-hover:underline-offset-4")}>
          {title}
        </Link>
      </h3>
      <p className="type-meta text-text-muted">{description}</p>
    </article>
  )
}
