-- Standalone SUPERSEDING delta: runner owns transaction; no registration mutations.
set local lock_timeout = '5s';
set local statement_timeout = '60s';
set local row_security = off;
do $$
declare c record;
begin
  if to_regnamespace('monday_notification_private') is not null then
    raise exception 'Notification schema already exists; inspect deployment, do not replay';
  end if;
  for c in select * from (values ('id','uuid'),('email','text'),('name','text'),('created_at','timestamp with time zone'),
    ('meeting_date','date'),('question','text'),('registration_source','text'),
    ('language','text'),('consent_email_list','boolean'),('request_follow_up','boolean'),
    ('phone','text'),('preferred_contact_date','text'),('preferred_contact_time','text'),
    ('preferred_timezone','text')) v(n,t)
  loop
    if not exists(select 1 from pg_attribute where attrelid = 'public.zoom_meeting_registrations'::regclass
      and attname=c.n and not attisdropped and format_type(atttypid,atttypmod)=c.t) then
      raise exception 'Required registration column/type mismatch: % expected %',c.n,c.t;
    end if;
  end loop;
  if not exists(select 1 from pg_roles where rolname='service_role' and rolbypassrls) then
    raise exception 'Expected service_role BYPASSRLS';
  end if;
end $$;
lock table public.zoom_meeting_registrations in share mode;
create schema monday_notification_private;
revoke all on schema monday_notification_private from public, anon, authenticated;
grant usage on schema monday_notification_private to service_role;
create table monday_notification_private.deliveries (
  email_key text not null check(email_key=lower(btrim(email_key)) and email_key<>''),
  meeting_date date not null,
  recipient_kind text not null check(recipient_kind in ('owner','attendee')),
  state text not null check(state in ('legacy_unknown_hold','attempting','accepted','failed_or_suppressed')),
  token uuid unique,
  registration_id uuid,
  attempted_at timestamptz,
  accepted_at timestamptz,
  primary key(email_key,meeting_date,recipient_kind),
  check ((state='legacy_unknown_hold' and token is null and attempted_at is null and accepted_at is null)
    or (state<>'legacy_unknown_hold' and token is not null and attempted_at is not null
      and (state='accepted')=(accepted_at is not null)))
);
alter table monday_notification_private.deliveries enable row level security;
revoke all on monday_notification_private.deliveries from public, anon, authenticated;
grant select,insert,update on monday_notification_private.deliveries to service_role;
insert into monday_notification_private.deliveries(email_key,meeting_date,recipient_kind,state)
select distinct lower(btrim(email)),meeting_date,k,'legacy_unknown_hold'
from public.zoom_meeting_registrations cross join (values ('owner'),('attendee')) kinds(k);
create table monday_notification_private.control (
 singleton boolean primary key default true check(singleton),
 enabled boolean not null default false,
 lock_guard boolean not null default false,
 expected_revision text not null default 'monday-ledger-disabled-v1',
 installed_at timestamptz not null default clock_timestamp(),
 activated_at timestamptz,
 activation_ack uuid,
 routing_risk_accepted boolean not null default false,
 pilot_email_key text,
 pilot_meeting_date date,
 claim_deadline timestamptz,
 check ((pilot_email_key is null and pilot_meeting_date is null and claim_deadline is null)
   or (pilot_email_key is not null and pilot_email_key<>'' and pilot_email_key=lower(btrim(pilot_email_key))
     and pilot_meeting_date is not null and claim_deadline is not null)),
 check (not enabled or (activated_at is not null and activation_ack is not null and routing_risk_accepted))
);
insert into monday_notification_private.control(singleton) values(true);
create table monday_notification_private.revision_acks (
 id uuid primary key default gen_random_uuid(),
 revision text not null,
 observed_at timestamptz not null default clock_timestamp()
);
create table monday_notification_private.legacy_rows (
 registration_id uuid primary key,
 email_key text not null,
 meeting_date date not null,
 original_created_at timestamptz not null,
 held_at timestamptz not null default clock_timestamp()
);
alter table monday_notification_private.control enable row level security;
alter table monday_notification_private.revision_acks enable row level security;
alter table monday_notification_private.legacy_rows enable row level security;
revoke all on monday_notification_private.control,monday_notification_private.revision_acks,monday_notification_private.legacy_rows from public,anon,authenticated,service_role;
grant select on monday_notification_private.control,monday_notification_private.legacy_rows to service_role;
grant update(lock_guard) on monday_notification_private.control to service_role;
grant select,insert on monday_notification_private.revision_acks to service_role;
insert into monday_notification_private.legacy_rows(registration_id,email_key,meeting_date,original_created_at)
select id,lower(btrim(email)),meeting_date,created_at from public.zoom_meeting_registrations;
create function public.monday_notification_status(_revision text, _acknowledge boolean default false)
returns jsonb language plpgsql security invoker set search_path='' set row_security=off as $$
declare c monday_notification_private.control; ack uuid;
begin
 select * into strict c from monday_notification_private.control where singleton;
 if _revision is distinct from c.expected_revision then raise exception 'Sender revision mismatch'; end if;
 if _acknowledge then
   insert into monday_notification_private.revision_acks(revision) values(_revision) returning id into ack;
 end if;
 return jsonb_build_object('revision',c.expected_revision,'enabled',c.enabled,
   'activated_at',c.activated_at,'acknowledgment',ack,
   'bounded_pilot',c.pilot_email_key is not null,'claim_deadline',c.claim_deadline);
end $$;
revoke all on function public.monday_notification_status(text,boolean) from public,anon,authenticated;
grant execute on function public.monday_notification_status(text,boolean) to service_role;
create function monday_notification_private.activate(_revision text,_ack uuid,_accept_unverified_legacy_routing boolean)
returns timestamptz language plpgsql security invoker set search_path='' set row_security=off as $$
declare c monday_notification_private.control; boundary timestamptz;
begin
 if current_setting('transaction_isolation') <> 'read committed' then
   raise exception 'Activation requires READ COMMITTED';
 end if;
 if _accept_unverified_legacy_routing is distinct from true then
   raise exception 'Explicit legacy-routing risk acceptance required; acknowledgment does not prove routing';
 end if;
 select * into strict c from monday_notification_private.control where singleton for update;
 if c.enabled or c.activated_at is not null then raise exception 'Already activated; never resnapshot/reset'; end if;
 if _revision is distinct from c.expected_revision or not exists (
   select 1 from monday_notification_private.revision_acks where id=_ack and revision=_revision
      and observed_at>=c.installed_at and observed_at>=clock_timestamp()-interval '10 minutes'
 ) then raise exception 'Fresh deployed-revision acknowledgment required'; end if;
 lock table public.zoom_meeting_registrations in share mode;
 boundary := clock_timestamp();
 insert into monday_notification_private.legacy_rows(registration_id,email_key,meeting_date,original_created_at)
 select id,lower(btrim(email)),meeting_date,created_at from public.zoom_meeting_registrations
 on conflict(registration_id) do nothing;
 insert into monday_notification_private.deliveries(email_key,meeting_date,recipient_kind,state)
  select distinct lower(btrim(email)),meeting_date,k,'legacy_unknown_hold'
 from public.zoom_meeting_registrations cross join (values ('owner'),('attendee')) kinds(k)
 on conflict(email_key,meeting_date,recipient_kind) do nothing;
 update monday_notification_private.control set enabled=true,activated_at=boundary,
   activation_ack=_ack,routing_risk_accepted=true where singleton;
 return boundary;
end $$;
revoke all on function monday_notification_private.activate(text,uuid,boolean) from public,anon,authenticated,service_role;
create function public.monday_notification_context(_registration_id uuid)
returns jsonb language sql stable security invoker set search_path='' set row_security=off as $$
with target as (select * from public.zoom_meeting_registrations where id=_registration_id),
prior as (
 select r.meeting_date, bool_or(r.registration_source='automatic') as has_automatic
 from public.zoom_meeting_registrations r cross join target t
 where lower(btrim(r.email))=lower(btrim(t.email))
   and r.meeting_date<t.meeting_date
   and r.meeting_date<(current_timestamp at time zone 'America/Los_Angeles')::date
 group by r.meeting_date
), notes as (
 select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'source',r.registration_source,'question',r.question)
 order by r.id),'[]'::jsonb) as items
 from public.zoom_meeting_registrations r cross join target t
 where lower(btrim(r.email))=lower(btrim(t.email)) and r.meeting_date=t.meeting_date
)
select jsonb_build_object('priorRegisteredWeeks',(select count(*) from prior),
 'weeksWithAutomaticSource',(select count(*) from prior where has_automatic),
 'comments',(select items from notes)) from target;
$$;
create function public.claim_monday_notification(_registration_id uuid,_email text,_meeting_date date,_kind text)
returns uuid language plpgsql security invoker set search_path='' set row_security=off as $$
declare result uuid; c monday_notification_private.control; r public.zoom_meeting_registrations;
begin
 if _kind is null or _kind not in ('owner','attendee') then raise exception 'Invalid recipient kind'; end if;
 select * into strict c from monday_notification_private.control where singleton for share;
 if not c.enabled then return null; end if;
 if c.pilot_email_key is not null and (
   lower(btrim(_email)) is distinct from c.pilot_email_key
   or _meeting_date is distinct from c.pilot_meeting_date
   or clock_timestamp()>=c.claim_deadline
 ) then return null; end if;
 select * into r from public.zoom_meeting_registrations where id=_registration_id
   and lower(btrim(email))=lower(btrim(_email)) and meeting_date=_meeting_date for share;
 if not found then raise exception 'Registration identity changed or absent'; end if;
 if r.created_at is null or r.created_at<=c.activated_at
   or (c.claim_deadline is not null and clock_timestamp()>=c.claim_deadline)
   or _meeting_date<(clock_timestamp() at time zone 'America/Los_Angeles')::date
   or exists(select 1 from monday_notification_private.legacy_rows where registration_id=_registration_id)
 then return null; end if;
 insert into monday_notification_private.deliveries(email_key,meeting_date,recipient_kind,state,token,registration_id,attempted_at)
 values(lower(btrim(_email)),_meeting_date,_kind,'attempting',gen_random_uuid(),_registration_id,clock_timestamp())
 on conflict(email_key,meeting_date,recipient_kind) do nothing returning token into result;
 if result is not null and c.claim_deadline is not null
   and clock_timestamp()>=c.claim_deadline then
   raise exception 'Monday notification claim deadline expired';
 end if;
 return result;
end $$;
create function public.finish_monday_notification(_token uuid,_accepted boolean)
returns boolean language plpgsql security invoker set search_path='' set row_security=off as $$
begin
 if _accepted is null then raise exception 'Missing outcome'; end if;
 update monday_notification_private.deliveries set
   state=case when _accepted then 'accepted' else 'failed_or_suppressed' end,
   accepted_at=case when _accepted then clock_timestamp() else null end
 where token=_token and state='attempting';
 return found;
end $$;
revoke all on function public.monday_notification_context(uuid) from public,anon,authenticated;
revoke all on function public.claim_monday_notification(uuid,text,date,text) from public,anon,authenticated;
revoke all on function public.finish_monday_notification(uuid,boolean) from public,anon,authenticated;
grant execute on function public.monday_notification_context(uuid) to service_role;
grant execute on function public.claim_monday_notification(uuid,text,date,text) to service_role;
grant execute on function public.finish_monday_notification(uuid,boolean) to service_role;