"use client"

import { Accessibility, Ear, Glasses, Shirt } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState } from "react"

import { iconProps } from "@/components/fs/icons"
import type { AccessKind, AccessLevel } from "@/content/stairs"
import type { Dictionary } from "@/i18n"
import { cn } from "@/lib/utils"

type Text = Omit<Dictionary["home"]["stairs"], "selectEvent">
type TipKey = "outfit" | AccessKind

const ICONS = { motor: Accessibility, visual: Glasses, hearing: Ear } as const
const ORDER: AccessKind[] = ["motor", "visual", "hearing"]
// Monochrom (design.md D3/D6): ikony są białe, a poziom dostępności niesie słowo pod ikoną,
// nie kolor (WCAG 1.4.1). Pełny opis jest w aria-label i w podpowiedzi.

type Props = {
  access: Record<AccessKind, AccessLevel>
  outfit: "shirt"
  text: Text
}

/** Strój i trzy ikony dostępności jako przyciski z podpowiedzią (docs/schody §6.6) */
export function StairsHintIcons({ access, outfit, text }: Props) {
  const rowRef = useRef<HTMLDivElement>(null)
  const tipId = useId()
  const [tip, setTip] = useState<TipKey | null>(null)
  // Środek aktywnej ikony względem wiersza – tam wskazuje ogonek podpowiedzi
  const [tailX, setTailX] = useState(0)

  // Ogonek podpowiedzi wskazuje środek ikony, więc liczymy go z elementu, który wywołał zdarzenie
  const open = useCallback((key: TipKey, target: HTMLElement) => {
    const row = rowRef.current?.getBoundingClientRect()
    const button = target.getBoundingClientRect()
    if (row) setTailX(button.left - row.left + button.width / 2)
    setTip(key)
  }, [])
  // Hover myszą otwiera podpowiedź po 150 ms (docs/schody §6.6) – krótkie przejechanie kursorem nic nie robi
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const close = useCallback(() => {
    clearTimeout(hoverTimer.current)
    setTip(null)
  }, [])
  const hover = useCallback(
    (key: TipKey, target: HTMLElement) => {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = setTimeout(() => open(key, target), 150)
    },
    [open]
  )
  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  // Esc albo dotknięcie poza ikonami zamyka podpowiedź
  useEffect(() => {
    if (!tip) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close()
    const onPointer = (event: PointerEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [tip, close])

  const tileClass = (key: TipKey) =>
    cn(
      "relative flex size-11 cursor-help items-center justify-center bg-ink",
      tip === key ? "border-[3px] border-white" : "border-[1.5px] border-[#DDDDDD]"
    )

  const tooltip =
    tip === "outfit"
      ? { title: text.outfit, body: text.outfitTip, width: 240 }
      : tip
        ? {
            title: text.kindTitles[tip],
            body: `${text.levels[access[tip]]}. ${text.details[tip][access[tip]]}`,
            width: 264,
          }
        : null

  return (
    // Zjechanie myszą z wiersza (ikon i podpowiedzi) zamyka podpowiedź; na podpowiedź można najechać (WCAG 1.4.13)
    <div
      ref={rowRef}
      className="relative flex gap-4"
      onPointerLeave={(event) => event.pointerType === "mouse" && close()}
    >
      <div className="flex flex-col gap-2">
        <p className="type-label text-gold-on-dark">{text.outfit}</p>
        <div className="flex w-11 flex-col items-center gap-1">
          <TipButton
            tipKey="outfit"
            tipId={tip === "outfit" ? tipId : undefined}
            onOpen={open}
            onHover={hover}
            onClose={close}
            aria-label={`${text.outfits[outfit]}. ${text.outfitTip}`}
            className={tileClass("outfit")}
          >
            <Shirt {...iconProps} className="size-6 text-gold-on-dark" />
            <InfoMark />
          </TipButton>
          <span className="text-xs text-on-dark">{text.outfits[outfit]}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <p className="type-label text-gold-on-dark">{text.access}</p>
        <ul className="flex gap-2">
          {ORDER.map((kind) => {
            const Icon = ICONS[kind]
            return (
              <li key={kind} className="flex min-w-13 flex-1 flex-col items-center gap-1 text-center">
                <TipButton
                  tipKey={kind}
                  tipId={tip === kind ? tipId : undefined}
                  onOpen={open}
                  onHover={hover}
                  onClose={close}
                  aria-label={`${text.kinds[kind]}: ${text.levels[access[kind]]}`}
                  className={tileClass(kind)}
                >
                  <Icon {...iconProps} strokeWidth={1.8} className="size-9 p-1 text-on-dark" />
                  <InfoMark />
                </TipButton>
                <span className="text-xs text-on-dark">
                  {text.kinds[kind]}
                  <span className="block font-semibold">{text.levelsShort[access[kind]]}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {tooltip && (
        <div
          id={tipId}
          role="tooltip"
          className="absolute left-0 z-10 border border-[#BBBBBB] bg-[#444444] p-3 text-sm text-on-dark"
          style={{ width: tooltip.width, bottom: "calc(100% - 16px)" }}
        >
          <p className="font-bold">{tooltip.title}</p>
          <p>{tooltip.body}</p>
          <span
            aria-hidden="true"
            className="absolute -bottom-[9px] h-[9px] w-[14px] bg-[#BBBBBB] [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={{ left: Math.min(Math.max(tailX, 14), tooltip.width - 14) - 7 }}
          />
        </div>
      )}
    </div>
  )
}

/** Znacznik „i” w prawym górnym rogu kafelka: sygnał, że to przycisk z opisem (§6.6) */
function InfoMark() {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-[7px] -right-[7px] flex size-3.5 items-center justify-center border border-[#DDDDDD] bg-ink text-[11px] leading-none font-bold text-white"
    >
      i
    </span>
  )
}

type TipButtonProps = {
  tipKey: TipKey
  tipId?: string
  onOpen: (key: TipKey, target: HTMLElement) => void
  onHover: (key: TipKey, target: HTMLElement) => void
  onClose: () => void
  "aria-label": string
  className: string
  children: React.ReactNode
}

/**
 * Przycisk z podpowiedzią (§6.6): mysz – hover, telefon – dotknięcie, klawiatura – fokus.
 * Kliknięcie myszą niczego nie przełącza, żeby nie zamykało podpowiedzi otwartej hoverem.
 */
function TipButton({ tipKey, tipId, onOpen, onHover, onClose, children, ...rest }: TipButtonProps) {
  const pointerType = useRef("")
  return (
    <button
      type="button"
      aria-describedby={tipId}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType
      }}
      onPointerEnter={(event) => event.pointerType === "mouse" && onHover(tipKey, event.currentTarget)}
      onClick={(event) => pointerType.current !== "mouse" && onOpen(tipKey, event.currentTarget)}
      // Fokus otwiera podpowiedź tylko z klawiatury
      onFocus={(event) => event.currentTarget.matches(":focus-visible") && onOpen(tipKey, event.currentTarget)}
      onBlur={onClose}
      {...rest}
    >
      {children}
    </button>
  )
}
