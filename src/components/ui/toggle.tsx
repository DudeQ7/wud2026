"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Szybki filtr (§6.6): 44 px, kontur 1,5 px, wybrany = czerń + ✓ + aria-pressed.
const toggleVariants = cva(
  "group/toggle inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 border-[1.5px] border-line-strong bg-transparent text-[0.9375rem] leading-none font-semibold whitespace-nowrap text-text transition-colors hover:bg-bg-subtle disabled:pointer-events-none disabled:text-text-muted data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-on-dark",
  {
    variants: {
      size: {
        default: "h-11 px-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Toggle({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ size }), className)} {...props}>
      <CheckIcon
        aria-hidden
        className="hidden size-4 group-data-[state=on]/toggle:block"
        strokeWidth={2.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {children}
    </TogglePrimitive.Root>
  )
}

export { Toggle, toggleVariants }
