-- Text-message reminders for the free Monday meeting (Family Squares).
--
-- People opt in on the thank-you screen after registering: they enter a mobile
-- number and tick an unticked consent box. Nothing here changes Monday
-- registration or its tables.
--
-- Both tables are reachable only by the service role (edge functions). No
-- phone number is readable from the website.

create table if not exists public.family_squares_sms_optins (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,          -- E.164, US/Canada
  email text not null,                 -- the address the person registered with
  registration_id uuid references public.zoom_meeting_registrations(id) on delete set null,
  consent_text text not null,          -- the exact wording the person agreed to
  consented_at timestamptz not null default now(),
  confirmation_sent_at timestamptz,
  opted_out_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_family_squares_sms_optins_email
  on public.family_squares_sms_optins (lower(email));

-- One row per person per meeting per kind of text: the claim that stops a
-- second run from texting the same person twice.
create table if not exists public.family_squares_sms_log (
  id uuid primary key default gen_random_uuid(),
  optin_id uuid not null references public.family_squares_sms_optins(id) on delete cascade,
  meeting_date date not null,
  kind text not null default 'reminder',
  status text not null default 'claimed',   -- claimed | sent | failed | opted_out
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now(),
  unique (optin_id, meeting_date, kind)
);

alter table public.family_squares_sms_optins enable row level security;
alter table public.family_squares_sms_log enable row level security;

revoke all on public.family_squares_sms_optins from public, anon, authenticated;
revoke all on public.family_squares_sms_log from public, anon, authenticated;
grant select, insert, update on public.family_squares_sms_optins to service_role;
grant select, insert, update on public.family_squares_sms_log to service_role;
