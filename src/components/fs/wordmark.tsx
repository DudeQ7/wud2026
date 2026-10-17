import Image from "next/image"
import Link from "next/link"

import logoDark from "@/images/logo-fs-ciemne.png"
import { type Locale, getDictionary, localizedPath } from "@/i18n"
import logoLight from "@/images/logo-fs-jasne.png"
import { cn } from "@/lib/utils"

/**
 * Logo FS (znak + logotyp) – plik oryginalny, bez deformacji (§5.7):
 * czarne na jasnym tle, białe na ciemnym. Wysokość ustala `className` (np. h-12), szerokość idzie z proporcji.
 */
export function Logo({
  lang,
  tone = "dark",
  className,
  priority,
}: {
  lang: Locale
  tone?: "dark" | "light"
  className?: string
  priority?: boolean
}) {
  return (
    <Link href={localizedPath(lang, "/")} className={cn("flex w-fit shrink-0 items-center", className)}>
      <Image
        src={tone === "dark" ? logoDark : logoLight}
        alt={getDictionary(lang).common.logoAlt}
        priority={priority}
        sizes="120px"
        style={{ height: "100%", width: "auto" }}
      />
    </Link>
  )
}
