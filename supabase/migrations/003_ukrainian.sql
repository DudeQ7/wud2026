-- Add Ukrainian ('uk') to the allowed interface languages.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.conrelid::regclass AS tbl, c.conname
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
    WHERE c.contype = 'c' AND a.attname = 'lang'
      AND c.conrelid::regclass::text IN ('public.profiles', 'public.chat_sessions', 'public.newsletter_subscribers')
      AND pg_get_constraintdef(c.oid) LIKE '%''pl''%'
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', r.tbl, r.conname);
    EXECUTE format('ALTER TABLE %s ADD CONSTRAINT %I CHECK (lang IN (''pl'', ''en'', ''de'', ''uk''))', r.tbl, r.conname);
  END LOOP;
END $$;
