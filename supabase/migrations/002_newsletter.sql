-- Public signup without exposing the subscriber list or allowing arbitrary updates.
CREATE TABLE public.newsletter_subscribers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE CHECK (
    email = lower(btrim(email)) AND length(email) <= 254
    AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  lang text NOT NULL CHECK (lang IN ('pl', 'en', 'de')),
  consent_version text NOT NULL,
  consented_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.newsletter_subscribers FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.newsletter_subscribers_id_seq FROM anon, authenticated;

-- Same response for a new and existing address; duplicates cannot overwrite consent.
CREATE FUNCTION public.subscribe_newsletter(p_email text, p_lang text, p_consent boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_consent IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Consent required' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.newsletter_subscribers (email, lang, consent_version)
  VALUES (lower(btrim(p_email)), p_lang, 'newsletter-v1-2026-10-18')
  ON CONFLICT (email) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_newsletter(text, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text, text, boolean) TO anon, authenticated;
