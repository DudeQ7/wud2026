-- Mini-CMS (demo hackathonowe): nadpisania statusu biletów, ceny i programu PDF per wydarzenie.
-- Źródłem wydarzeń zostaje koncerty.json; ta tabela udaje API iksoris + CMS.
-- UWAGA: zapis jest otwarty dla anon (tryb demo bez logowania do /admin). Przed produkcją zamknąć polityki zapisu.
create table public.event_overrides (
  event_id integer primary key,
  ticket_status text check (ticket_status in ('available', 'last', 'soldout')),
  price_free boolean,
  price_min integer check (price_min >= 0),
  price_max integer check (price_max >= 0),
  program_pdf text,
  updated_at timestamptz not null default now()
);

comment on table public.event_overrides is 'Demo CMS/iksoris: nadpisania statusu biletów, ceny i PDF programu. event_id = id z koncerty.json.';

alter table public.event_overrides enable row level security;

create policy "overrides_read" on public.event_overrides for select to anon, authenticated using (true);
create policy "overrides_insert_demo" on public.event_overrides for insert to anon, authenticated with check (true);
create policy "overrides_update_demo" on public.event_overrides for update to anon, authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('programs', 'programs', true, 10485760, array['application/pdf'])
on conflict (id) do nothing;

create policy "programs_upload_demo" on storage.objects for insert to anon, authenticated with check (bucket_id = 'programs');
