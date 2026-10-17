"use server";

import { type Dictionary, getDictionary, hasLocale, localizedPath } from "@/i18n";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Akcje serwera nie znają parametrów trasy – język interfejsu przychodzi w ukrytym polu „uiLang”
function uiLang(formData: FormData) {
  const value = String(formData.get("uiLang") ?? "");
  return hasLocale(value) ? value : "pl";
}

const loginSchema = (t: Dictionary["auth"]["errors"]) =>
  z.object({
    email: z.string().trim().email(t.invalidEmail),
    password: z.string().min(6, t.passwordMin(6)),
  });

const registerSchema = (t: Dictionary["auth"]["errors"]) =>
  z.object({
    fullName: z.string().trim().min(2, t.nameMin),
    email: z.string().trim().email(t.invalidEmail),
    password: z.string().min(8, t.passwordMin(8)),
  });

export type AuthState = {
  error?: string | null;
  message?: string | null;
};

export async function login(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const lang = uiLang(formData);
  const t = getDictionary(lang).auth.errors;
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema(t).safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || t.invalidLoginData };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: t.wrongCredentials };
  }

  redirect(localizedPath(lang, "/panel"));
}

export async function register(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const lang = uiLang(formData);
  const t = getDictionary(lang).auth.errors;
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema(t).safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || t.invalidRegisterData };
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return { error: error.message || t.registerFailed };
  }

  // Supabase zwraca pustą tablicę identities, jeśli użytkownik o tym mailu już istnieje
  if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
    return { error: t.accountExists };
  }

  // Jeśli brak sesji (np. włączone potwierdzanie w panelu Supabase), logujemy użytkownika
  if (data?.user && !data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (signInError) {
      return {
        error:
          signInError.message === "Invalid login credentials"
            ? t.credentialsMismatch
            : signInError.message,
      };
    }
  }

  redirect(localizedPath(lang, "/panel"));
}

export async function logout(formData: FormData): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(localizedPath(uiLang(formData), "/auth/login"));
}
