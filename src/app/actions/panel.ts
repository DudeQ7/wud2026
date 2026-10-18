"use server";

import { type Locale, getDictionary, hasLocale } from "@/i18n";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Panel jest w każdej wersji językowej – odświeżamy cały segment /[lang]/panel
const revalidatePanel = () => revalidatePath("/[lang]/panel", "layout");
import type { Profile, ChatSession, ChatMessage } from "@/types/database";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function updateProfile(formData: FormData) {
  // „uiLang” – język interfejsu (komunikaty); „lang” niżej to preferowany język kontaktu z profilu
  const ui = String(formData.get("uiLang") ?? "");
  const t = getDictionary(hasLocale(ui) ? ui : "pl").panel.profile;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: t.notLoggedIn };
  }

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const lang = (formData.get("lang") as "pl" | "en" | "de" | "uk") || "pl";

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone: phone || null,
      lang,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: t.updateFailed };
  }

  revalidatePanel();
  return { success: true, message: t.updated };
}

export async function getFavoriteEventIds(): Promise<number[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("event_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data || []).map((row) => row.event_id);
}

export async function toggleFavorite(eventId: number, lang: Locale = "pl") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: getDictionary(lang).panel.favorites.loginRequired };
  }

  // Check if exists
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    revalidatePanel();
    return { isFavorite: false };
  } else {
    await supabase.from("favorites").insert({
      user_id: user.id,
      event_id: eventId,
    });
    revalidatePanel();
    return { isFavorite: true };
  }
}

export async function getChatSessions(): Promise<ChatSession[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (data as ChatSession[]) || [];
}

export async function getChatMessages(sessionId: number): Promise<ChatMessage[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  return (data as ChatMessage[]) || [];
}
