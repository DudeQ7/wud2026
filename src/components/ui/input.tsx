import * as React from "react"

import { cn } from "@/lib/utils"

// design.md §6.17 – 52 px, kontur 1,5 px #2B2B2B, błąd: kontur 3 px (bez czerwieni).
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-13 w-full min-w-0 border-[1.5px] border-line-strong bg-background px-4 text-base text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:bg-surface-muted aria-invalid:border-[3px] aria-invalid:border-ink",
        className
      )}
      {...props}
    />
  )
}

export { Input }
