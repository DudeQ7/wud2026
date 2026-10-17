"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSyncExternalStore } from "react"

import { iconProps } from "@/components/fs/icons"
import { type Locale, getDictionary, localizedPath } from "@/i18n"
import { LAST_CALENDAR_QUERY_KEY } from "@/lib/calendar"

const noop = () => () => {}

function readSavedQuery() {
  try {
    return sessionStorage.getItem(LAST_CALENDAR_QUERY_KEY) ?? ""
  } catch {
    return ""
  }
}

/**
 * „← Repertuar” wraca do kalendarza z ostatnio ustawionymi filtrami (§6.4: wstecz zachowuje filtry).
 * Filtry zapamiętuje kalendarz w sessionStorage; bez niego link prowadzi do pełnego repertuaru.
 */
export function BackLink({ lang }: { lang: Locale }) {
  const query = useSyncExternalStore(noop, readSavedQuery, () => "")

  return (
    <Link
      href={localizedPath(lang, `/repertuar${query}`)}
      className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-[0.9375rem] font-semibold text-text underline-offset-4 hover:underline"
    >
      <ArrowLeft {...iconProps} className="size-5" />
      {getDictionary(lang).calendar.title}
    </Link>
  )
}
