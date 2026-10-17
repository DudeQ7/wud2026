"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Kwadrat 24 px z konturem 1,5 px; pole dotyku poszerzone do 44 px (after:).
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-6 shrink-0 cursor-pointer items-center justify-center border-[1.5px] border-line-strong bg-background after:absolute after:-inset-2.5 disabled:cursor-not-allowed disabled:bg-surface-muted aria-invalid:border-[3px] aria-invalid:border-ink data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-on-dark",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center">
        <CheckIcon className="size-4" strokeWidth={2.5} strokeLinecap="square" strokeLinejoin="miter" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
