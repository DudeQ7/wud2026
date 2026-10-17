"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = {
  error: null,
  message: null,
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-xs sm:p-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Rejestracja</h1>
        <p className="text-sm text-muted-foreground">
          Utwórz darmowe konto, aby zapisywać ulubione koncerty i personalizować rekomendacje.
        </p>
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
            required
            placeholder="Jan Kowalski"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Adres e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="twoj@email.pl"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Hasło (min. 8 znaków)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
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
          {isPending ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        Masz już konto?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
        >
          Zaloguj się
        </Link>
      </div>
    </div>
  );
}
