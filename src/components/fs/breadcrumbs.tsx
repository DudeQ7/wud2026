import Link from "next/link"

import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  href?: string
}

/**
 * Okruszki (§6.3, §6.18): Open Sans 14 px, separator „/”, ostatni element bez linku
 * i z aria-current="page". Na mobile zastępuje je przycisk „wstecz”.
 */
export function Breadcrumbs({
  items,
  label,
  className,
}: {
  items: BreadcrumbItem[]
  label: string
  className?: string
}) {
  return (
    <nav aria-label={label} className={cn("flex min-h-11 items-center", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 type-meta text-text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-text" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-line-strong">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
