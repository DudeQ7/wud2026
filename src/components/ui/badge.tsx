import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// design.md §6.8 – status zawsze słowem i kształtem, bez kolorów funkcjonalnych.
const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1 border-[1.5px] border-transparent px-2 type-badge whitespace-nowrap [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        // Dostępne, Wstęp wolny, Zapisy, informacje (np. „Otwarta do 22.11”)
        outline: "border-line-strong text-text",
        // Ostatnie miejsca
        solid: "bg-ink text-on-dark",
        // Wyprzedane
        muted: "bg-surface-muted text-text-muted",
        // Sprzedaż wkrótce
        dashed: "border-dashed border-line-strong text-text",
        // Znacznik daty na zdjęciu karty (§6.10)
        date: "h-7 border-0 bg-ink px-2.5 text-[0.8125rem] font-bold tracking-[0.04em] text-on-dark",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
