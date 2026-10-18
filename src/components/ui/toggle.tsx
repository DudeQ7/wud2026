"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Szybki filtr (§6.6): 44 px, kontur 1,5 px, wybrany = czerń + ✓ + aria-pressed.
const toggleVariants = cva(
  "group/toggle relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 border-[1.5px] border-line-strong bg-transparent text-[0.9375rem] leading-none font-semibold whitespace-nowrap text-text transition-colors hover:bg-bg-subtle disabled:pointer-events-none disabled:text-text-muted data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-on-dark",
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
      {/*
        ✓ jako znacznik w rogu (jak „i” w hincie schodów): zaznaczenie nie zmienia szerokości chipa, więc pasek szybkich
        filtrów nie „skacze” i nic z niego nie wypada. Czerń chipa + ✓ + aria-pressed – stan nie zależy od koloru (§6.6).
      */}
      <span
        aria-hidden
        className="absolute -top-1.5 -right-1.5 hidden size-4 items-center justify-center border-[1.5px] border-ink bg-background text-ink group-data-[state=on]/toggle:flex"
      >
        <CheckIcon className="size-3" strokeWidth={3} strokeLinecap="square" strokeLinejoin="miter" />
      </span>
      {children}
    </TogglePrimitive.Root>
  )
}

export { Toggle, toggleVariants }
