import { funders, fundersCopy } from "@/content/funders"
import type { Locale } from "@/i18n"
import { cn } from "@/lib/utils"

/** Dwanaście gwiazd w kręgu: monochromatyczny znak UE (dekoracyjny, nazwę niesie tekst obok) */
function EuEmblem({ className }: { className?: string }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI) / 6
    const cx = 24 + 14 * Math.sin(angle)
    const cy = 24 - 14 * Math.cos(angle)
    const points = Array.from({ length: 10 }, (_, k) => {
      const r = k % 2 === 0 ? 3 : 1.2
      const a = (k * Math.PI) / 5
      return `${(cx + r * Math.sin(a)).toFixed(2)},${(cy - r * Math.cos(a)).toFixed(2)}`
    }).join(" ")
    return <polygon key={i} points={points} fill="currentColor" />
  })
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <rect x="1" y="1" width="46" height="46" fill="none" stroke="currentColor" strokeWidth="2" />
      {stars}
    </svg>
  )
}

/**
 * Baner instytucji współfinansujących: znak UE z napisem oraz Miasto Szczecin i MKiDN (monochromatycznie, bez zmian kolorów).
 * `tone="dark"` na czerni (stopka), `tone="light"` na białym (strona główna, partnerzy).
 */
export function FundersBar({ lang, tone = "light", className }: { lang: Locale; tone?: "light" | "dark"; className?: string }) {
  const copy = fundersCopy[lang]
  const dark = tone === "dark"
  const cell = cn(
    "flex min-h-16 items-center gap-3 border-[1.5px] px-4 py-2",
    dark ? "border-on-dark text-on-dark" : "border-line-strong text-text"
  )
  return (
    <section aria-label={copy.label} className={className}>
      <p className={cn("mb-3 type-eyebrow", dark ? "text-gold-on-dark" : "text-gold")}>{copy.label}</p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <li className={cell}>
          <EuEmblem className="size-10 shrink-0" />
          <span className="type-ui">
            <span className="block">{copy.eu}</span>
            <span className={cn("block type-meta", dark ? "text-on-dark-muted" : "text-text-muted")}>{copy.euLine}</span>
          </span>
        </li>
        {funders.map((f) => (
          <li key={f.key}>
            <a
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              // Logotypy FS są białe (do użycia na czerni), więc kafel logo jest zawsze czarny
              className={cn("flex h-full min-h-16 items-center justify-center border-[1.5px] bg-ink px-4 py-2", dark ? "border-on-dark" : "border-ink")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG z public/, bez optymalizacji */}
              <img src={f.logo.src} alt={f.name} width={f.logo.width} height={f.logo.height} className="h-14 w-auto max-w-full" />
              <span className="sr-only"> ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
