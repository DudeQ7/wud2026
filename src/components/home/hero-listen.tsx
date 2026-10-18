"use client"

import { Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { claimPlayback, clock, releasePlayback } from "@/components/event/fragment-player"
import { iconProps } from "@/components/fs/icons"
import type { Fragment } from "@/content/audio"

type Props = {
  fragment: Fragment
  /** Nazwa wydarzenia – do opisu przycisku */
  label: string
  text: { listen: string; pause: string; demo: string }
}

/**
 * Odsłuch w hero (§6.12): jeden przycisk, bez autoodtwarzania. Gra tylko jeden fragment naraz
 * (wspólny rejestr z odtwarzaczem na karcie wydarzenia). Pasek postępu jest tylko podglądem,
 * pełna kontrola (przewijanie) jest w odtwarzaczu na karcie wydarzenia.
 */
export function HeroListen({ fragment, label, text }: Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(fragment.durationSec)

  useEffect(() => {
    const el = audio.current
    return () => {
      el?.pause()
      releasePlayback(el)
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

  const percent = duration ? Math.min((time / duration) * 100, 100) : 0

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
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? text.pause : `${text.listen}: ${label}`}
        className="flex min-h-11 w-full cursor-pointer items-center gap-3 text-left font-semibold text-text"
      >
        <span className="flex size-11 shrink-0 items-center justify-center border-[1.5px] border-line-strong">
          {playing ? <Pause {...iconProps} className="size-5" /> : <Play {...iconProps} className="size-5" />}
        </span>
        <span className="min-w-0 flex-1">{playing ? text.pause : text.listen}</span>
        {(playing || time > 0) && (
          <span className="type-meta shrink-0 font-normal text-text-muted tabular-nums">
            {clock(time)} / {clock(duration)}
          </span>
        )}
      </button>
      {(playing || time > 0) && (
        <div className="h-[1.5px] bg-line" aria-hidden>
          <div className="h-full bg-text" style={{ width: `${percent}%` }} />
        </div>
      )}
      {fragment.demo && <p className="type-meta mt-1 text-text-muted">{text.demo}</p>}
    </div>
  )
}
