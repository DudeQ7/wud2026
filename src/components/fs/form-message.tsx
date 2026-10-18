import { Check, TriangleAlert } from "lucide-react"

import { iconProps } from "@/components/fs/icons"
import { cn } from "@/lib/utils"

type Props = {
  tone: "error" | "success"
  /** „Błąd:” w języku strony – komunikat błędu zaczyna się od słowa, nie od koloru (§6.17) */
  errorPrefix?: string
  children: React.ReactNode
  className?: string
}

/**
 * Komunikat formularza bez kolorów funkcjonalnych (D3): błąd to kontur 3 px, ikona i słowo „Błąd:”,
 * sukces – kontur 1,5 px i ikona ✓.
 */
export function FormMessage({ tone, errorPrefix, children, className }: Props) {
  const error = tone === "error"
  const Icon = error ? TriangleAlert : Check
  return (
    <div
      role={error ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 bg-background p-4 type-meta text-text",
        error ? "border-[3px] border-ink" : "border-[1.5px] border-line-strong",
        className
      )}
    >
      <Icon {...iconProps} className="mt-0.5 size-5 shrink-0" />
      <p>
        {error && errorPrefix && <span className="font-semibold">{errorPrefix} </span>}
        {children}
      </p>
    </div>
  )
}
