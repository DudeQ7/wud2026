import { fontVariables } from "@/app/fonts"

import "../globals.css"

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={fontVariables}>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
