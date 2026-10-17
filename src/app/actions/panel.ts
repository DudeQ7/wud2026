"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Musisz być zalogowany" };
  }

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const lang = (formData.get("lang") as "pl" | "en" | "de") || "pl";

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
    return { error: "Nie udało się zaktualizować profilu" };
  }

  revalidatePath("/panel");
  revalidatePath("/panel/profil");
  return { success: true, message: "Profil został zaktualizowany" };
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

export async function toggleFavorite(eventId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Zaloguj się, aby dodawać koncerty do ulubionych" };
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
    revalidatePath("/panel");
    revalidatePath("/panel/ulubione");
    return { isFavorite: false };
  } else {
    await supabase.from("favorites").insert({
      user_id: user.id,
      event_id: eventId,
    });
    revalidatePath("/panel");
    revalidatePath("/panel/ulubione");
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
