"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Etykieta nad polem (§6.17): Open Sans 600 15 px, nigdy placeholder zamiast etykiety.
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-[0.9375rem] leading-snug font-semibold text-text peer-disabled:cursor-not-allowed peer-disabled:text-text-muted",
        className
      )}
      {...props}
    />
  )
}

export { Label }
