-- Flat-Finale storage. Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
create table if not exists public.flat_finale_kv (
  key text primary key,
  value jsonb not null,
  expires_at timestamptz not null default now() + interval '30 days'
);

-- Only the server (service role key) can read or write. No public access.
alter table public.flat_finale_kv enable row level security;
grant select, insert, update, delete on public.flat_finale_kv to service_role;
