"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Nieprawidłowy adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().trim().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

export type AuthState = {
  error?: string | null;
  message?: string | null;
};

export async function login(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Błędne dane logowania" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Nieprawidłowy login lub hasło." };
  }

  redirect("/panel");
}

export async function register(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Błędne dane rejestracji" };
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
    return { error: error.message || "Błąd podczas rejestracji." };
  }

  // Supabase zwraca pustą tablicę identities, jeśli użytkownik o tym mailu już istnieje
  if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
    return {
      error: "Konto z tym adresem e-mail już istnieje. Przejdź do strony logowania lub podaj inny e-mail.",
    };
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
            ? "Nieprawidłowe dane logowania lub konto już istnieje z innym hasłem."
            : signInError.message,
      };
    }
  }

  redirect("/panel");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
