"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { type Locale, getDictionary, localizedPath, stripLocale } from "@/i18n";

interface PanelNavProps {
  lang: Locale;
  userEmail: string;
  userName?: string | null;
}

const navItems = [
  { href: "/panel", key: "dashboard", icon: "📊" },
  { href: "/panel/ulubione", key: "favorites", icon: "❤️" },
  { href: "/panel/historia", key: "history", icon: "💬" },
  { href: "/panel/profil", key: "profile", icon: "👤" },
] as const;

export function PanelNav({ lang, userEmail, userName }: PanelNavProps) {
  const t = getDictionary(lang).panel;
  // Adres bez prefiksu języka – „/en/panel” i „/panel” to ta sama pozycja menu
  const pathname = stripLocale(usePathname());

  return (
    <aside className="w-full shrink-0 border-b border-border bg-background md:w-64 md:border-r md:border-b-0">
      <div className="flex h-full flex-col justify-between p-4 md:p-6">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <Link href={localizedPath(lang, "/panel")} className="text-lg font-bold tracking-tight">
              {t.title}
            </Link>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-muted/40 p-3 text-xs">
            <p className="font-semibold text-foreground truncate">
              {userName || t.userFallback}
            </p>
            <p className="text-muted-foreground truncate">{userEmail}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={localizedPath(lang, item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-base" aria-hidden>{item.icon}</span>
                  <span>{t.nav[item.key]}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 border-t border-border pt-4 space-y-2">
          <Link
            href={localizedPath(lang, "/asystent")}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span aria-hidden>✨</span>
            <span>{t.assistantLink}</span>
          </Link>

          <form action={logout}>
            <input type="hidden" name="uiLang" value={lang} />
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400"
            >
              <span aria-hidden>🚪</span>
              <span>{t.logout}</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
