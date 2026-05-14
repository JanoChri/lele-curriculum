create table if not exists public.modules (
  id text primary key,
  title text not null,
  year integer not null,
  area text not null,
  department text default 'offen',
  subjects text[] default '{}',
  status text default 'idee',
  quarter text default 'Q1',
  owner text default 'offen',
  description text default '',
  digital_part text default 'optional',
  repetition text default '',
  materials text[] default '{}',
  updated_at timestamptz default now()
);

alter table public.modules enable row level security;

create policy "Alle dürfen Module lesen"
on public.modules
for select
to anon
using (true);

create policy "Alle dürfen Module anlegen"
on public.modules
for insert
to anon
with check (true);

create policy "Alle dürfen Module bearbeiten"
on public.modules
for update
to anon
using (true)
with check (true);
