"use client";

import { Heart, LayoutDashboard, LogOut, MessageSquare, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { useEffect } from "react";

import { logout } from "@/app/actions/auth";
import { iconProps } from "@/components/fs/icons";
import { type Locale, getDictionary, localizedPath, stripLocale } from "@/i18n";
import { cn } from "@/lib/utils";

interface PanelNavProps {
  lang: Locale;
  userId: string;
  userEmail: string;
  userName?: string | null;
}

const navItems = [
  { href: "/panel", key: "dashboard", icon: LayoutDashboard },
  { href: "/panel/ulubione", key: "favorites", icon: Heart },
  { href: "/panel/historia", key: "history", icon: MessageSquare },
  { href: "/panel/profil", key: "profile", icon: User },
] as const;

export function PanelNav({ lang, userId, userEmail, userName }: PanelNavProps) {
  const t = getDictionary(lang).panel;
  // Adres bez prefiksu języka – „/en/panel” i „/panel” to ta sama pozycja menu
  const pathname = stripLocale(usePathname());

  useEffect(() => {
    posthog.identify(userId, {
      ...(userEmail ? { email: userEmail } : {}),
      ...(userName ? { name: userName } : {}),
    });
  }, [userEmail, userId, userName]);

  return (
    <aside className="w-full shrink-0 border-b border-line bg-background md:w-72 md:border-r md:border-b-0">
      <div className="flex h-full flex-col justify-between p-4 md:p-6">
        <div>
          <div className="mb-6 border-b border-line pb-4">
            <Link href={localizedPath(lang, "/panel")} className="type-h3 text-gold">
              {t.title}
            </Link>
          </div>

          <div className="mb-6 border border-line bg-bg-subtle p-3">
            <p className="truncate text-sm font-semibold text-text">{userName || t.userFallback}</p>
            <p className="truncate type-meta text-text-muted">{userEmail}</p>
          </div>

          <nav aria-label={t.title}>
            <ul>
              {navItems.map(({ href, key, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <li key={href} className="border-b border-line">
                    <Link
                      href={localizedPath(lang, href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center gap-3 px-3 text-sm font-semibold transition-colors",
                        isActive ? "bg-ink text-on-dark" : "text-text hover:bg-bg-subtle"
                      )}
                    >
                      <Icon {...iconProps} className="size-5 shrink-0" />
                      <span>{t.nav[key]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-6 border-t border-line pt-4">
          <Link
            href={localizedPath(lang, "/asystent")}
            className="flex min-h-11 items-center gap-2 text-sm font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2"
          >
            <Sparkles {...iconProps} className="size-5 shrink-0" />
            <span>{t.assistantLink}</span>
          </Link>

          <form
            action={logout}
            onSubmit={() => {
              posthog.reset();
            }}
          >
            <input type="hidden" name="uiLang" value={lang} />
            <button
              type="submit"
              className="flex min-h-11 w-full cursor-pointer items-center gap-2 text-left text-sm font-semibold text-text hover:underline hover:underline-offset-4"
            >
              <LogOut {...iconProps} className="size-5 shrink-0" />
              <span>{t.logout}</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
