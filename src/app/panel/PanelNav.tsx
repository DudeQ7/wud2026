"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

interface PanelNavProps {
  userEmail: string;
  userName?: string | null;
}

const navItems = [
  { href: "/panel", label: "Pulpit", icon: "📊" },
  { href: "/panel/ulubione", label: "Ulubione koncerty", icon: "❤️" },
  { href: "/panel/historia", label: "Historia zapytań", icon: "💬" },
  { href: "/panel/profil", label: "Mój profil", icon: "👤" },
];

export function PanelNav({ userEmail, userName }: PanelNavProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-border bg-background md:w-64 md:border-r md:border-b-0">
      <div className="flex h-full flex-col justify-between p-4 md:p-6">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <Link href="/panel" className="text-lg font-bold tracking-tight">
              Panel Melomana
            </Link>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-muted/40 p-3 text-xs">
            <p className="font-semibold text-foreground truncate">
              {userName || "Użytkownik"}
            </p>
            <p className="text-muted-foreground truncate">{userEmail}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 border-t border-border pt-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>✨</span>
            <span>Asystent AI Filharmonii</span>
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400"
            >
              <span>🚪</span>
              <span>Wyloguj się</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
