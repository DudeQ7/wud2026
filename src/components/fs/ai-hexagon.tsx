import { cn } from "@/lib/utils"

/**
 * Heksagon – wyłącznie dla asystenta AI (§5.3), 56 × 48 px ze złotym „AI” (#AD9450 na czerni, 5,91:1).
 * `dark`: czarny heksagon na jasnym tle. `on-dark`: biały kontur na czarnym pasku zakupu (§6.11).
 * Fokus klawiatury rysuje obrys w kształcie heksagonu – przycisk-rodzic musi mieć klasę `group`
 * i wyłączony prostokątny outline (`focus-visible:outline-none`).
 */
export function AiHexagon({ tone = "dark", className }: { tone?: "dark" | "on-dark"; className?: string }) {
  return (
    <span className={cn("relative flex h-12 w-14 shrink-0 items-center justify-center", className)}>
      <svg viewBox="0 0 56 48" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <path
          d="M14 0h28l14 24-14 24H14L0 24Z"
          className={tone === "dark" ? "fill-ink" : "fill-ink stroke-on-dark"}
          strokeWidth={tone === "dark" ? undefined : 1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* Obrys fokusu: 2 px, ok. 3 px od krawędzi heksagonu, kolor z --ring (czerń, a na .on-dark biel) */}
        <path
          d="M11.7-4h32.6L60 24 44.3 52H11.7L-4 24Z"
          className="fill-none stroke-[var(--ring)] opacity-0 group-focus-visible:opacity-100"
          strokeWidth={2}
        />
      </svg>
      <span className="relative font-heading text-lg font-bold text-gold-on-dark">AI</span>
    </span>
  )
}
