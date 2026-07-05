-- Table des badges validés manuellement par membre
create table if not exists public.member_badges (
  id uuid primary key default gen_random_uuid(),
  member_id text not null,
  badge_name text not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_badges_member_id_idx
  on public.member_badges (member_id);

alter table public.member_badges enable row level security;

create policy "Lecture publique des badges"
  on public.member_badges for select
  using (true);

create policy "Insertion publique des badges"
  on public.member_badges for insert
  with check (true);

create policy "Mise à jour publique des badges"
  on public.member_badges for update
  using (true);

create policy "Suppression publique des badges"
  on public.member_badges for delete
  using (true);

-- Activer Realtime dans Supabase : Database → Replication → member_badges
