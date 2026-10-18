"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"

import { Eyebrow } from "@/components/fs/layout"
import type { AccessKind, AccessLevel } from "@/content/stairs"
import type { Dictionary } from "@/i18n"
import { cn } from "@/lib/utils"

import { ART_HEIGHT, ART_WIDTH, SLOTS, StairsArt, slotCenterY, xPercent } from "./stairs-art"
import { StairsHintIcons } from "./stairs-hint-icons"

export type StairsItem = {
  id: number
  title: string
  subtitle?: string
  kind: string
  /** „SR 28.10” – znacznik daty na plakacie */
  badge: string
  /** Etykieta przycisku plakatu dla czytników ekranu */
  label: string
  time: string
  venue: string
  duration?: string
  lead?: string
  image?: string
  href: string
  ticketsUrl?: string
}

type Text = Omit<Dictionary["home"]["stairs"], "selectEvent">

const POSTER_H = 126
const FOCUS_W = 99
const FOCUS_H = 139
const HINT_GAP = 12
const MAX_SCALE = 1.5

type Props = {
  items: StairsItem[]
  access: Record<AccessKind, AccessLevel>
  outfit: "shirt"
  text: Text
}

export function StairsClient({ items, access, outfit, text }: Props) {
  // Hint otwiera się tylko po kliknięciu plakatu (selected); przewijanie go nie otwiera.
  const [selected, setSelected] = useState<number | null>(null)
  const hintId = useId()
  const artRef = useRef<HTMLDivElement>(null)
  // Skala całej ilustracji: 1 na telefonie w pionie, do 1,5 na szerszych ekranach (większe plakaty)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const art = artRef.current
    if (!art) return
    const update = () => setScale(Math.min(MAX_SCALE, Math.max(1, art.clientWidth / ART_WIDTH)))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(art)
    return () => observer.disconnect()
  }, [])

  // Esc zamyka hint i oddaje fokus plakatowi, z którego go otwarto
  useEffect(() => {
    if (selected === null) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [selected])

  const active = selected === null ? undefined : items[selected]

  const hintTop =
    selected === null ? 0 : (slotCenterY(Math.floor(selected / 3), selected % 3) + FOCUS_H / 2) * scale + HINT_GAP

  return (
    // Schody rozciągają się w poziomie na całą szerokość treści (SVG bez zachowania proporcji, plakaty w % szerokości);
    // wysokość i plakaty rosną do skali MAX_SCALE, dalej rozjeżdżają się już tylko odstępy.
    // Poniżej 360 px ilustracja jest przycinana po bokach (docs/schody §2). Na telefonie i tablecie wychodzi
    // poza marginesy kontenera – od krawędzi do krawędzi ekranu, jak w projekcie (360 px na 360 px)
    <div className="-mx-4 flex justify-center overflow-x-clip sm:-mx-6 lg:mx-0">
      <div ref={artRef} className="relative w-full min-w-[360px] shrink-0" style={{ height: ART_HEIGHT * scale }}>
        <StairsArt />

        <ol aria-label={text.listLabel} className="contents">
          {items.map((item, i) => {
            const slot = SLOTS[i % 3]
            const cy = slotCenterY(Math.floor(i / 3), i % 3)
            const focused = i === selected
            const expanded = focused
            const side = i % 3 === 1 ? null : i % 3 === 0 ? "left" : "right"
            const width = (focused ? FOCUS_W : side ? 79 : 90) * scale
            const height = (focused ? FOCUS_H : POSTER_H) * scale
            return (
              <li key={item.id} className="contents">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-label={item.label}
                  aria-controls={expanded ? hintId : undefined}
                  onClick={() => setSelected(expanded ? null : i)}
                  // Uniesienie po najechaniu/fokusie: 6 px po 80 ms, jak kafle (photoLift); `translate` w przejściu, bo Tailwind v4 przesuwa właściwością translate
                  className="group absolute cursor-pointer [animation:poster-in_var(--dur-slow)_var(--ease-out)_backwards] transition-[width,height,top,left,translate,transform] duration-250 ease-out hover:-translate-y-1.5 hover:delay-[80ms] focus-visible:-translate-y-1.5 active:scale-[0.97] motion-reduce:transition-none"
                  style={{ animationDelay: `${Math.min(i, 8) * 50}ms`, width, height, left: `calc(${xPercent(slot.cx)}% - ${width / 2}px)`, top: cy * scale - height / 2 }}
                >
                  {/* Obrys fokusu na wrapperze: clip-path obcinałby outline (design.md §5.2) */}
                  <span
                    className={cn(
                      "absolute inset-0 block overflow-hidden bg-surface-muted transition-[outline-color] duration-150",
                      focused && "outline-2 outline-ink",
                      !focused && side === "left" && "[clip-path:polygon(0_8%,100%_0,100%_100%,0_92%)]",
                      !focused && side === "right" && "[clip-path:polygon(0_0,100%_8%,100%_92%,0_100%)]"
                    )}
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="100px"
                        loading={i < 6 ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-250 ease-out group-hover:scale-105"
                      />
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 left-0 bg-ink px-1.5 py-0.5 text-[0.625rem] leading-none font-bold text-on-dark"
                  >
                    {item.badge}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        {/* Hint pod klikniętym plakatem; ogonek wskazuje jego środek */}
        {active && selected !== null && (
          <span
            key={`tail-${active.id}`}
            aria-hidden="true"
            className="absolute h-3 w-4 bg-ink [animation:tail-in_var(--dur-base)_var(--ease-out)] [clip-path:polygon(0_100%,50%_0,100%_100%)]"
            style={{ top: hintTop - 12, left: `calc(${xPercent(slotCenterX(selected))}% - 8px)` }}
          />
        )}
        {active && selected !== null && (
        <section
          key={active.id}
          id={hintId}
          aria-label={active.title}
          className="on-dark absolute w-[296px] origin-top bg-ink text-on-dark [animation:hint-in_var(--dur-base)_var(--ease-out)]"
          // Środek hintu pod plakatem, ale z marginesem 32 px od krawędzi ilustracji (przy 360 px wypada dokładnie 32 px)
          style={{
            top: hintTop,
            left: `clamp(32px, calc(${xPercent(slotCenterX(selected))}% - 148px), calc(100% - 328px))`,
          }}
        >
          <div className="relative flex flex-col px-4 pt-4 pb-4">
            <Eyebrow tone="dark">
              {active.kind} · {active.badge} · {active.time}
            </Eyebrow>
            <h3 className="mt-1 type-title-card text-on-dark">
              <Link href={active.href} className="underline-offset-4 hover:underline">
                {active.title}
              </Link>
            </h3>
            <p className="type-meta text-on-dark">
              {[active.venue, active.duration].filter(Boolean).join(" · ")}
            </p>
            {active.lead && <p className="mt-2 line-clamp-2 type-meta text-on-dark">{active.lead}</p>}

            <hr className="my-3 border-t border-[#BBBBBB]" />

            <StairsHintIcons key={active.id} access={access} outfit={outfit} text={text} />

            <a
              href={active.ticketsUrl ?? active.href}
              {...(active.ticketsUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-4 flex h-11 items-center justify-center bg-white font-semibold text-ink hover:underline"
            >
              {text.buy}
            </a>
          </div>
        </section>
        )}
      </div>
    </div>
  )
}

const slotCenterX = (index: number) => SLOTS[index % 3].cx
