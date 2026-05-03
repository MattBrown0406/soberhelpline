create table if not exists public.conversion_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  page_title text,
  source text,
  label text,
  target_href text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  first_landing_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversion_events_event_name on public.conversion_events(event_name);
create index if not exists idx_conversion_events_created_at on public.conversion_events(created_at);
create index if not exists idx_conversion_events_utm_source on public.conversion_events(utm_source);
create index if not exists idx_conversion_events_page_path on public.conversion_events(page_path);
create index if not exists idx_conversion_events_source on public.conversion_events(source);

alter table public.conversion_events enable row level security;

drop policy if exists "Admins can view conversion events" on public.conversion_events;
create policy "Admins can view conversion events"
on public.conversion_events
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);