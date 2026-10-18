import type { Metadata } from "next"

import { fontVariables } from "@/app/fonts"
import { ToolsNav } from "@/components/fs/tools-nav"

import "../globals.css"

export const metadata: Metadata = {
  title: "Mini-CMS – Filharmonia (demo)",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={fontVariables}>
      <body className="min-h-dvh">
        <ToolsNav />
        {children}
      </body>
    </html>
  )
}
