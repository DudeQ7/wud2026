import { Analytics } from "@vercel/analytics/next"
import { fontVariables } from "@/app/fonts"
import { ToolsNav } from "@/components/fs/tools-nav"

import "../globals.css"

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={fontVariables}>
      <body className="min-h-dvh">
        <ToolsNav />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
