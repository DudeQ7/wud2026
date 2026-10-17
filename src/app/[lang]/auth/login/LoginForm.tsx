"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/app/actions/auth";
import { type Locale, getDictionary, localizedPath } from "@/i18n";

const initialState: AuthState = {
  error: null,
  message: null,
};

export function LoginForm({ lang }: { lang: Locale }) {
  const { auth: t } = getDictionary(lang);
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-xs sm:p-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t.login.title}</h1>
        <p className="text-sm text-muted-foreground">{t.login.intro}</p>
      </div>

      {state?.error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </div>
      )}

      {state?.message && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400"
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="uiLang" value={lang} />
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t.emailPlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t.password}
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? t.login.pending : t.login.submit}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        {t.login.noAccount}{" "}
        <Link
          href={localizedPath(lang, "/auth/register")}
          className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
        >
          {t.login.registerLink}
        </Link>
      </div>
    </div>
  );
}
