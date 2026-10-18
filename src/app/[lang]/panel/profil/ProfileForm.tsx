"use client";

import { AlertCircle, Check } from "lucide-react";
import posthog from "posthog-js";
import { useActionState } from "react";

import { updateProfile } from "@/app/actions/panel";
import { iconProps } from "@/components/fs/icons";
import { Button } from "@/components/ui/button";
import { type Locale, getDictionary, locales } from "@/i18n";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  lang: Locale;
  profile: Profile | null;
  userEmail: string;
}

const field =
  "h-13 w-full border-[1.5px] border-line-strong bg-background px-3 text-base text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-muted";
const label = "mb-1.5 block text-[0.9375rem] font-semibold text-text";

export function ProfileForm({ lang, profile, userEmail }: ProfileFormProps) {
  const t = getDictionary(lang).panel.profile;
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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="uiLang" value={lang} />

      {state?.error && (
        <div role="alert" className="flex gap-3 border-[3px] border-ink p-4">
          <AlertCircle {...iconProps} className="mt-0.5 size-5 shrink-0 text-text" />
          <p className="type-body text-text">
            <strong>{t.errorLabel}</strong> {state.error}
          </p>
        </div>
      )}

      {state?.success && (
        <div role="status" className="flex gap-3 border-[1.5px] border-line-strong p-4">
          <Check {...iconProps} className="mt-0.5 size-5 shrink-0 text-text" />
          <p className="type-body text-text">{state.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className={label}>
          {t.email}
        </label>
        <input id="email" type="email" value={userEmail} disabled className={field} aria-describedby="email-hint" />
        <p id="email-hint" className="mt-1 type-meta text-text-muted">
          {t.emailHint}
        </p>
      </div>

      <div>
        <label htmlFor="fullName" className={label}>
          {t.fullName}
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={profile?.full_name || ""}
          placeholder={t.fullNamePlaceholder}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="phone" className={label}>
          {t.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile?.phone || ""}
          placeholder="+48 123 456 789"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="lang" className={label}>
          {t.contactLang}
        </label>
        <select id="lang" name="lang" defaultValue={profile?.lang || "pl"} className={field}>
          {locales.map((code) => (
            <option key={code} value={code}>
              {t.langOptions[code]}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? t.saving : t.save}
        </Button>
      </div>
    </form>
  );
}
