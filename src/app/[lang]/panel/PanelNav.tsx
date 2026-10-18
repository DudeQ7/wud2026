"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutGrid, LogOut, MessageSquare, User } from "lucide-react";
import posthog from "posthog-js";
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
  { href: "/panel", key: "dashboard", icon: LayoutGrid },
  { href: "/panel/ulubione", key: "favorites", icon: Heart },
  { href: "/panel/historia", key: "history", icon: MessageSquare },
  { href: "/panel/profil", key: "profile", icon: User },
] as const;

/**
 * Nawigacja panelu: na telefonie poziomy pasek jak szybkie filtry (§6.6), od 1024 px boczna kolumna 3/12.
 * Aktywna pozycja: wypełnienie / linia 2 px, pogrubienie i aria-current – nigdy sam kolor (§6.4).
 */
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
    <aside className="flex flex-col gap-4 lg:col-span-3 lg:gap-6">
      <div>
        <p className="type-eyebrow text-gold">{t.title}</p>
        <p className="mt-2 truncate font-semibold text-text">{userName || t.userFallback}</p>
        <p className="truncate type-meta text-text-muted">{userEmail}</p>
      </div>

      <nav aria-label={t.title}>
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
          {navItems.map(({ href, key, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="shrink-0">
                <Link
                  href={localizedPath(lang, href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-2 border-[1.5px] px-4 text-[0.9375rem] whitespace-nowrap",
                    "lg:border-0 lg:border-l-2 lg:px-3",
                    isActive
                      ? "border-ink bg-ink font-bold text-on-dark lg:bg-transparent lg:text-text"
                      : "border-line-strong font-semibold text-text hover:bg-bg-subtle lg:border-transparent"
                  )}
                >
                  <Icon {...iconProps} className="size-5" />
                  {t.nav[key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-wrap gap-x-6 lg:flex-col lg:border-t lg:border-line lg:pt-4">
        <Link
          href={localizedPath(lang, "/asystent")}
          className="flex min-h-11 items-center font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2"
        >
          {t.assistantLink}
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
            className="flex min-h-11 cursor-pointer items-center gap-2 font-semibold text-text underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2"
          >
            <LogOut {...iconProps} className="size-5" />
            {t.logout}
          </button>
        </form>
      </div>
    </aside>
  );
}
