export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  lang: "pl" | "en" | "de" | "uk";
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: number;
  user_id: string;
  event_id: number;
  created_at: string;
}

export interface ChatSession {
  id: number;
  user_id: string;
  title: string | null;
  lang: "pl" | "en" | "de" | "uk";
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  session_id: number;
  role: "user" | "assistant";
  content: string;
  metadata: Json | null;
  created_at: string;
}

export interface EventNotification {
  id: number;
  user_id: string;
  event_id: number;
  notify_at: string;
  sent: boolean;
  created_at: string;
}
