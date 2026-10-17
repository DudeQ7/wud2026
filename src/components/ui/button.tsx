import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// design.md §6.1 – promień 0, wysokość 52/48 px, jeden przycisk główny na sekcję.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 border-2 border-transparent text-center type-ui whitespace-nowrap transition-colors select-none disabled:pointer-events-none aria-disabled:pointer-events-none aria-disabled:border-surface-muted aria-disabled:bg-surface-muted aria-disabled:text-text-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        // Czarny, biały tekst – „Kup bilet”, „Zapisz się”
        primary: "bg-ink text-on-dark hover:bg-black hover:underline hover:underline-offset-4",
        // Kontur 2 px – „Zobacz”, „Pełny repertuar”
        secondary: "border-line-strong bg-transparent text-text hover:bg-bg-subtle",
        // Na czerni: białe tło, czarny tekst
        inverted: "bg-on-dark text-ink hover:bg-bg-subtle",
        // Na czerni: biały kontur
        "inverted-outline": "border-on-dark bg-transparent text-on-dark hover:bg-white/10",
        // Link tekstowy z podkreśleniem 1,5 px
        link: "h-auto min-h-11 justify-start border-0 px-0 text-text underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2",
        // Ikona bez tła, pole dotyku 44 px
        icon: "size-11 border-0 bg-transparent p-0 text-text hover:bg-bg-subtle",
      },
      size: {
        default: "h-13 px-5 lg:h-12 lg:px-6",
        sm: "h-11 px-4",
        none: "",
      },
      block: {
        true: "w-full",
      },
    },
    compoundVariants: [
      { variant: ["link", "icon"], className: "h-auto px-0 lg:h-auto lg:px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, block, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
