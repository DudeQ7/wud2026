"use client"

import { useEffect, useState } from "react"

export type KeyboardViewport = { height: number; top: number; keyboard: boolean }

/**
 * Widoczna część ekranu nad klawiaturą telefonu (visualViewport). Chrome na Androidzie i Safari nie zmniejszają
 * 100dvh przy otwartej klawiaturze, więc pełnoekranowy czat bierze stąd wysokość i położenie, żeby pole pytania
 * nie chowało się pod klawiaturą. Zwraca null, gdy nieaktywny albo przeglądarka nie ma visualViewport.
 */
export function useKeyboardViewport(active: boolean): KeyboardViewport | null {
  const [state, setState] = useState<KeyboardViewport | null>(null)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!active || !viewport) return
    const update = () =>
      setState({
        height: viewport.height,
        top: viewport.offsetTop,
        // Klawiatura zabiera zwykle ponad 1/4 ekranu; mniejsze zmiany to chowający się pasek adresu
        keyboard: viewport.height < window.innerHeight * 0.75,
      })
    update()
    viewport.addEventListener("resize", update)
    viewport.addEventListener("scroll", update)
    return () => {
      viewport.removeEventListener("resize", update)
      viewport.removeEventListener("scroll", update)
      setState(null)
    }
  }, [active])

  return active ? state : null
}
