import { ChevronDown } from "lucide-react"
import type * as React from "react"

import { iconProps } from "@/components/fs/icons"

/** Odpowiedź w akordeonie (§7.3): <details>, cel dotyku 56 px, bez JS. „Planuj wizytę” i FAQ */
export function Answer({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-2 font-heading text-lg font-semibold text-text [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown {...iconProps} className="size-6 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="flex max-w-[68ch] flex-col gap-3 pb-5 type-body text-text">{children}</div>
    </details>
  )
}
