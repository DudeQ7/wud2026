-- ============================================================================
-- WUD 2026 – Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Creates all tables, triggers, RLS policies, and indexes
--              for the user panel (profiles, favorites, chat, notifications).
-- ============================================================================

-- ==========================================================
-- 1. PROFILES
-- Stores additional user info beyond what auth.users provides.
-- Auto-populated on signup via trigger.
-- ==========================================================
CREATE TABLE public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  avatar_url TEXT,
  phone      TEXT,
  lang       TEXT        NOT NULL DEFAULT 'pl'
                         CHECK (lang IN ('pl', 'en', 'de')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Extended user profile data, one row per auth user.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================================
-- 2. AUTO-CONFIRM USER & HANDLE_NEW_USER TRIGGERS
-- Automatically marks users as confirmed (skipping email verification)
-- and creates a profile row when a new user signs up.
-- ==========================================================

-- 2a. Auto-confirm email immediately upon signup
CREATE OR REPLACE FUNCTION public.handle_auto_confirm_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;

CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auto_confirm_user();

-- Auto-confirm any existing unconfirmed users
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;

-- 2b. Automatically create profile row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a public.profiles row for every new auth.users entry.';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- 3. FAVORITES
-- Lets users bookmark events from koncerty.json by event_id.
-- ==========================================================
CREATE TABLE public.favorites (
  id         BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id   INTEGER     NOT NULL,  -- matches id from koncerty.json
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, event_id)
);

COMMENT ON TABLE public.favorites IS 'User-bookmarked events. event_id references koncerty.json ids.';

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can see their own favorites
CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add favorites for themselves
CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Index on FK for efficient joins and cascade deletes
CREATE INDEX idx_favorites_user_id ON public.favorites (user_id);

-- ==========================================================
-- 4. CHAT_SESSIONS
-- Groups chat messages into conversations per user.
-- ==========================================================
CREATE TABLE public.chat_sessions (
  id         BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT,        -- auto-generated from the first user question
  lang       TEXT        NOT NULL DEFAULT 'pl'
                         CHECK (lang IN ('pl', 'en', 'de')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chat_sessions IS 'AI chat conversations grouped by session.';

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Users can see their own sessions
CREATE POLICY "chat_sessions_select_own" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create sessions for themselves
CREATE POLICY "chat_sessions_insert_own" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own sessions (cascade deletes messages)
CREATE POLICY "chat_sessions_delete_own" ON public.chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Index on FK for efficient lookups
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions (user_id);

-- ==========================================================
-- 5. CHAT_MESSAGES
-- Individual messages within a chat session.
-- metadata stores structured Reply data (events[], showMap, suggestions).
-- ==========================================================
CREATE TABLE public.chat_messages (
  id         BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id BIGINT      NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT        NOT NULL,
  metadata   JSONB,      -- stores events[], showMap, suggestions from Reply
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chat_messages IS 'Messages within a chat session. metadata holds structured AI reply data.';

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages from their own sessions
CREATE POLICY "chat_messages_select_own" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = session_id
        AND cs.user_id = auth.uid()
    )
  );

-- Users can insert messages into their own sessions
CREATE POLICY "chat_messages_insert_own" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = session_id
        AND cs.user_id = auth.uid()
    )
  );

-- Index on FK for efficient message retrieval by session
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages (session_id);

-- ==========================================================
-- 6. EVENT_NOTIFICATIONS
-- Scheduled reminders for upcoming events.
-- ==========================================================
CREATE TABLE public.event_notifications (
  id         BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id   INTEGER     NOT NULL,
  notify_at  TIMESTAMPTZ NOT NULL,
  sent       BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, event_id)
);

COMMENT ON TABLE public.event_notifications IS 'User-scheduled event reminders. Processed by a background job.';

ALTER TABLE public.event_notifications ENABLE ROW LEVEL SECURITY;

-- Users have full control over their own notification rows
CREATE POLICY "event_notifications_all_own" ON public.event_notifications
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index on FK for efficient lookups and cascade deletes
CREATE INDEX idx_event_notifications_user_id ON public.event_notifications (user_id);

-- Partial index for unsent notifications (used by the sending job)
CREATE INDEX idx_event_notifications_pending
  ON public.event_notifications (notify_at)
  WHERE sent = false;
