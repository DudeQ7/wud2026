"use client";

import { useActionState } from "react";
import posthog from "posthog-js";
import { updateProfile } from "@/app/actions/panel";
import { type Locale, getDictionary, locales } from "@/i18n";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  lang: Locale;
  profile: Profile | null;
  userEmail: string;
}

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
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="uiLang" value={lang} />
      {state?.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </div>
      )}

      {state?.success && (
        <div
          role="status"
          className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400"
        >
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {t.email}
        </label>
        <input
          id="email"
          type="email"
          value={userEmail}
          disabled
          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground outline-none cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-muted-foreground">{t.emailHint}</p>
      </div>

      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {t.fullName}
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={profile?.full_name || ""}
          placeholder={t.fullNamePlaceholder}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {t.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile?.phone || ""}
          placeholder="+48 123 456 789"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="lang"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {t.contactLang}
        </label>
        <select
          id="lang"
          name="lang"
          defaultValue={profile?.lang || "pl"}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        >
          {locales.map((code) => (
            <option key={code} value={code}>
              {t.langOptions[code]}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? t.saving : t.save}
        </button>
      </div>
    </form>
  );
}
