import Image from "next/image"
import Link from "next/link"

import logoDark from "@/images/logo-fs-ciemne.png"
import logoLight from "@/images/logo-fs-jasne.png"
import { cn } from "@/lib/utils"

/**
 * Logo FS (znak + logotyp) – plik oryginalny, bez deformacji (§5.7):
 * czarne na jasnym tle, białe na ciemnym. Wysokość ustala `className` (np. h-12), szerokość idzie z proporcji.
 */
export function Logo({
  tone = "dark",
  className,
  priority,
}: {
  tone?: "dark" | "light"
  className?: string
  priority?: boolean
}) {
  return (
    <Link href="/" className={cn("flex w-fit shrink-0 items-center", className)}>
      <Image
        src={tone === "dark" ? logoDark : logoLight}
        alt="Filharmonia Szczecin – strona główna"
        priority={priority}
        sizes="120px"
        style={{ height: "100%", width: "auto" }}
      />
    </Link>
  )
}
