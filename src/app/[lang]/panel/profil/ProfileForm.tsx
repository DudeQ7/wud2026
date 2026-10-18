"use client";

import { useActionState } from "react";
import posthog from "posthog-js";
import { updateProfile } from "@/app/actions/panel";
import { FormMessage } from "@/components/fs/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Locale, getDictionary, locales } from "@/i18n";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  lang: Locale;
  profile: Profile | null;
  userEmail: string;
}

/** Formularz profilu (§6.17): etykieta nad polem, kontur 1,5 px, komunikaty bez czerwieni i zieleni */
export function ProfileForm({ lang, profile, userEmail }: ProfileFormProps) {
  const dict = getDictionary(lang);
  const t = dict.panel.profile;
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await updateProfile(formData);
      if ("success" in result && result.success) {
        posthog.capture("profile_updated");
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="uiLang" value={lang} />
      {state?.error && (
        <FormMessage tone="error" errorPrefix={dict.newsletter.error}>
          {state.error}
        </FormMessage>
      )}
      {state?.success && <FormMessage tone="success">{state.message}</FormMessage>}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t.email}</Label>
        <Input id="email" type="email" value={userEmail} disabled aria-describedby="email-hint" />
        <p id="email-hint" className="type-meta text-text-muted">
          {t.emailHint}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">{t.fullName}</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          defaultValue={profile?.full_name || ""}
          placeholder={t.fullNamePlaceholder}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">{t.phone}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={profile?.phone || ""}
          placeholder="+48 123 456 789"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lang">{t.contactLang}</Label>
        <select
          id="lang"
          name="lang"
          defaultValue={profile?.lang || "pl"}
          className="h-13 w-full border-[1.5px] border-line-strong bg-background px-4 text-base text-text"
        >
          {locales.map((code) => (
            <option key={code} value={code}>
              {t.langOptions[code]}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isPending} aria-busy={isPending || undefined} className="self-start">
        {isPending ? t.saving : t.save}
      </Button>
    </form>
  );
}
