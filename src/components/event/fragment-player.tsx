"use client"

import { ExternalLink, Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { iconProps } from "@/components/fs/icons"
import type { Fragment } from "@/content/audio"
import { type Locale, getDictionary } from "@/i18n"

type Props = {
  fragment: Fragment
  /** „Mahler, Adagietto” – do opisu przycisku */
  label: string
  lang: Locale
}

// Jednocześnie gra tylko jeden fragment (§6.12): nowy odtwarzacz zatrzymuje poprzedni
let current: HTMLAudioElement | null = null

/** Zatrzymuje inny grający fragment i zapisuje ten jako aktualny – wołać tuż przed play() */
export function claimPlayback(el: HTMLAudioElement) {
  if (current && current !== el) current.pause()
  current = el
}

/** Zwalnia miejsce po odmontowaniu odtwarzacza */
export function releasePlayback(el: HTMLAudioElement | null) {
  if (current === el) current = null
}

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/**
 * Odtwarzacz fragmentu (§6.12) na elemencie <audio>: bez autoodtwarzania, bez reklam i bez
 * osadzonego serwisu zewnętrznego. Pasek postępu to slider obsługiwany strzałkami.
 */
export function FragmentPlayer({ fragment, label, lang }: Props) {
  const text = getDictionary(lang).event.player
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(fragment.durationSec)

  useEffect(() => {
    const el = audio.current
    return () => {
      el?.pause()
      releasePlayback(el ?? null)
    }
  }, [])

  function toggle() {
    const el = audio.current
    if (!el) return
    if (el.paused) {
      claimPlayback(el)
      void el.play().catch(() => setPlaying(false))
    } else {
      el.pause()
    }
  }

  function seek(to: number) {
    const el = audio.current
    if (!el) return
    el.currentTime = Math.min(Math.max(to, 0), duration)
    setTime(el.currentTime)
  }

  const percent = duration ? (time / duration) * 100 : 0

  return (
    <div className="mt-2">
      <audio
        ref={audio}
        src={fragment.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false)
          setTime(0)
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={`${playing ? text.pause : text.play} ${text.excerpt}: ${label} (1 min)`}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center border-[1.5px] border-line-strong text-text hover:bg-bg-subtle"
        >
          {playing ? <Pause {...iconProps} className="size-5" /> : <Play {...iconProps} className="size-5" />}
        </button>

        <div
          role="slider"
          tabIndex={0}
          aria-label={`${text.progress}: ${label}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${clock(time)} ${text.of} ${clock(duration)}`}
          onKeyDown={(e) => {
            const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 15, PageDown: -15 }[e.key]
            if (step !== undefined) {
              e.preventDefault()
              seek(time + step)
            } else if (e.key === "Home") seek(0)
            else if (e.key === "End") seek(duration)
          }}
          onClick={(e) => {
            const box = e.currentTarget.getBoundingClientRect()
            seek(((e.clientX - box.left) / box.width) * duration)
          }}
          className="relative flex h-11 flex-1 cursor-pointer items-center"
        >
          <span className="h-[1.5px] w-full bg-line" />
          <span className="absolute h-[1.5px] bg-text" style={{ width: `${percent}%` }} />
          <span className="absolute size-4 -translate-x-1/2 bg-ink" style={{ left: `${percent}%` }} />
        </div>

        <span className="type-meta shrink-0 text-text-muted tabular-nums">
          {clock(time)} / {clock(duration)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4">
        {fragment.fullUrl && (
          <a
            href={fragment.fullUrl}
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-text underline decoration-[1.5px] underline-offset-[3px]"
          >
            {text.full}
            <ExternalLink {...iconProps} className="size-4" />
          </a>
        )}
        {fragment.demo && (
          <p className="type-meta text-text-muted">{text.demo}</p>
        )}
      </div>
    </div>
  )
}
