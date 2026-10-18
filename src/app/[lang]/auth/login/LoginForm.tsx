"use client";

import { AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { login, type AuthState } from "@/app/actions/auth";
import { iconProps } from "@/components/fs/icons";
import { Button } from "@/components/ui/button";
import { type Locale, getDictionary, localizedPath } from "@/i18n";

const initialState: AuthState = {
  error: null,
  message: null,
};

const field =
  "h-13 w-full border-[1.5px] border-line-strong bg-background px-3 text-base text-text placeholder:text-text-muted";
const label = "mb-1.5 block text-[0.9375rem] font-semibold text-text";

export function LoginForm({ lang }: { lang: Locale }) {
  const { auth: t } = getDictionary(lang);
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="border border-line p-6 sm:p-8">
      <div className="mb-6 space-y-2">
        <h1 className="type-h2 text-gold">{t.login.title}</h1>
        <p className="max-w-[52ch] type-body text-text">{t.login.intro}</p>
      </div>

      {state?.error && (
        <div role="alert" className="mb-5 flex gap-3 border-[3px] border-ink p-4">
          <AlertCircle {...iconProps} className="mt-0.5 size-5 shrink-0 text-text" />
          <p className="type-body text-text">
            <strong>{t.errorLabel}</strong> {state.error}
          </p>
        </div>
      )}

      {state?.message && (
        <div role="status" className="mb-5 flex gap-3 border-[1.5px] border-line-strong p-4">
          <Check {...iconProps} className="mt-0.5 size-5 shrink-0 text-text" />
          <p className="type-body text-text">{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="uiLang" value={lang} />
        <div>
          <label htmlFor="email" className={label}>
            {t.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t.emailPlaceholder}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="password" className={label}>
            {t.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={field}
          />
        </div>

        <Button type="submit" block disabled={isPending}>
          {isPending ? t.login.pending : t.login.submit}
        </Button>
      </form>

      <div className="mt-6 border-t border-line pt-6 text-center type-body text-text-muted">
        {t.login.noAccount}{" "}
        <Link
          href={localizedPath(lang, "/auth/register")}
          className="font-semibold text-text underline underline-offset-4 hover:no-underline"
        >
          {t.login.registerLink}
        </Link>
      </div>
    </div>
  );
}
