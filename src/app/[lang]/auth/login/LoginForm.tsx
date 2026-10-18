"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/app/actions/auth";
import { FormMessage } from "@/components/fs/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Locale, getDictionary, localizedPath } from "@/i18n";

const initialState: AuthState = {
  error: null,
  message: null,
};

/** Logowanie (§6.17, WCAG 3.3.8): autocomplete dla menedżerów haseł, wklejanie dozwolone, bez testów poznawczych */
export function LoginForm({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const t = dict.auth;
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div>
      <h1 className="type-h1 text-gold">{t.login.title}</h1>
      <p className="mt-2 type-body text-text">{t.login.intro}</p>

      <form action={formAction} className="mt-8 flex flex-col gap-6">
        <input type="hidden" name="uiLang" value={lang} />
        {state?.error && (
          <FormMessage tone="error" errorPrefix={t.errorLabel}>
            {state.error}
          </FormMessage>
        )}
        {state?.message && <FormMessage tone="success">{state.message}</FormMessage>}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={t.emailPlaceholder}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t.password}</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>

        <Button type="submit" block disabled={isPending} aria-busy={isPending || undefined}>
          {isPending ? t.login.pending : t.login.submit}
        </Button>
      </form>

      <p className="mt-8 border-t border-line pt-6 type-body text-text">
        {t.login.noAccount}{" "}
        <Link
          href={localizedPath(lang, "/auth/register")}
          className="font-semibold underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2"
        >
          {t.login.registerLink}
        </Link>
      </p>
    </div>
  );
}
