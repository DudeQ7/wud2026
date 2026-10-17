"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/panel";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  profile: Profile | null;
  userEmail: string;
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      return await updateProfile(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6">
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
          Adres e-mail (login)
        </label>
        <input
          id="email"
          type="email"
          value={userEmail}
          disabled
          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground outline-none cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Adres e-mail jest powiązany z Twoim kontem i nie może być zmieniony z tego miejsca.
        </p>
      </div>

      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Imię i nazwisko
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={profile?.full_name || ""}
          placeholder="Jan Kowalski"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Numer telefonu (opcjonalnie)
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
          Domyślny język kontaktu
        </label>
        <select
          id="lang"
          name="lang"
          defaultValue={profile?.lang || "pl"}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        >
          <option value="pl">Polski</option>
          <option value="en">English (angielski)</option>
          <option value="de">Deutsch (niemiecki)</option>
        </select>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Zapisywanie zmian..." : "Zapisz zmiany w profilu"}
        </button>
      </div>
    </form>
  );
}
