alter table public.zoom_meeting_registrations
add column if not exists lead_score integer not null default 0,
add column if not exists lead_tier text not null default 'support_nurture',
add column if not exists revenue_path text not null default 'family_squares',
add column if not exists lead_reasons text[] not null default '{}',
add column if not exists nme_attributed boolean not null default false,
add column if not exists next_revenue_action text not null default 'invite_back',
add column if not exists followup_sequence_status text not null default 'not_queued',
add column if not exists last_followup_at timestamptz,
add column if not exists next_followup_at timestamptz;

create index if not exists idx_zoom_registrations_lead_score on public.zoom_meeting_registrations(lead_score desc);
create index if not exists idx_zoom_registrations_lead_tier on public.zoom_meeting_registrations(lead_tier);
create index if not exists idx_zoom_registrations_revenue_path on public.zoom_meeting_registrations(revenue_path);
create index if not exists idx_zoom_registrations_nme_attributed on public.zoom_meeting_registrations(nme_attributed);
create index if not exists idx_zoom_registrations_next_followup on public.zoom_meeting_registrations(next_followup_at);

create table if not exists public.family_squares_followup_queue (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references public.zoom_meeting_registrations(id) on delete cascade,
  email text not null,
  name text,
  lead_tier text not null default 'support_nurture',
  revenue_path text not null default 'family_squares',
  sequence_step integer not null,
  subject text not null,
  body_html text not null,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  skipped_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  unique(registration_id, sequence_step)
);

create index if not exists idx_family_squares_followup_queue_due
on public.family_squares_followup_queue(scheduled_for)
where sent_at is null and skipped_at is null;

create index if not exists idx_family_squares_followup_queue_registration
on public.family_squares_followup_queue(registration_id);

alter table public.family_squares_followup_queue enable row level security;

drop policy if exists "Admins can view family squares followups" on public.family_squares_followup_queue;
create policy "Admins can view family squares followups"
on public.family_squares_followup_queue
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
