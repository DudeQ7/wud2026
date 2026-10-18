"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, type AuthState } from "@/app/actions/auth";
import { FormMessage } from "@/components/fs/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Locale, getDictionary, localizedPath } from "@/i18n";

const initialState: AuthState = {
  error: null,
  message: null,
};

/** Rejestracja (§6.17): etykiety nad polami, autocomplete, komunikaty bez kolorów funkcjonalnych */
export function RegisterForm({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const t = dict.auth;
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <div>
      <h1 className="type-h1 text-gold">{t.register.title}</h1>
      <p className="mt-2 type-body text-text">{t.register.intro}</p>

      <form action={formAction} className="mt-8 flex flex-col gap-6">
        <input type="hidden" name="uiLang" value={lang} />
        {state?.error && (
          <FormMessage tone="error" errorPrefix={t.errorLabel}>
            {state.error}
          </FormMessage>
        )}
        {state?.message && <FormMessage tone="success">{state.message}</FormMessage>}

        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">{t.register.fullName}</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder={t.register.fullNamePlaceholder}
          />
        </div>

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
          <Label htmlFor="password">{t.register.password}</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </div>

        <Button type="submit" block disabled={isPending} aria-busy={isPending || undefined}>
          {isPending ? t.register.pending : t.register.submit}
        </Button>
      </form>

      <p className="mt-8 border-t border-line pt-6 type-body text-text">
        {t.register.haveAccount}{" "}
        <Link
          href={localizedPath(lang, "/auth/login")}
          className="font-semibold underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2"
        >
          {t.register.loginLink}
        </Link>
      </p>
    </div>
  );
}
