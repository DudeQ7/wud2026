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

  // Jeśli włączone jest potwierdzenie e-mail w Supabase i brak aktywnej sesji
  if (data?.user && !data.session) {
    return {
      message: "Konto zostało utworzone. Sprawdź swoją skrzynkę e-mail, aby potwierdzić rejestrację.",
    };
  }

  redirect("/panel");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
