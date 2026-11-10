# Lovable apply prompt: audit fixes (2026-11-10)

How to use: after this change is merged to `main` and Lovable has synced it,
paste everything in the "Prompt for Lovable" section below into Lovable as one
message. Lovable deploys edge-function code as soon as it syncs, before any SQL
runs. Every function in this change works against the current database, so that
order is safe.

What this change does:

1. **Weekly Zoom report.** `send-weekly-zoom-report` now needs credentials to be
   run on demand (`preview` / `force`) and only returns attendee lists to a
   verified caller. The scheduled Tuesday email keeps working as before.
2. **Coaching providers.** Only an admin can create a coaching provider, and a
   provider can no longer change their own status or owner, or re-point a
   booking to a different client.
3. **Directory listings.** A new listing always starts as a draft or pending
   review, whatever the browser sends. The `FREELIST` code waives the fee only;
   it no longer tries to approve the listing.
4. **Weekly PayPal sync.** `paypal-sync-all` only looks up real PayPal
   agreements, so free and promo memberships (`FAMILY6-…`, `FREELIST-…`) are no
   longer marked expired. The migration restores the ones it expired by mistake.
5. **Family Readiness Intensive.** The server now accepts the 90-minute times
   the booking page offers for that plan.
6. **Multi-session plans.** Guests can buy the 4- and 12-session plans: the
   plan row no longer requires an account, and `parallel-recovery` is an allowed
   plan type.
7. **Automation enforcement.** The two functions above join the scheduled jobs
   that send the cron secret. If every scheduled job is ready, the last step
   turns enforcement on.
8. **Monday confirmation emails.** A read-only check of the notification ledger
   (nothing is activated here). The registration page no longer says "check your
   email" when the confirmation was not sent.
9. **Cancelled Mondays.** Auto-registration, the "starting in 1 hour" reminder,
   the member reminder, the first-timer follow-up and the re-engagement invite
   all skip a date listed in `cancelled_meeting_dates`.
10. **Blog index.** Frontend only (cards link by slug). Needs a Publish.

---

## Prompt for Lovable

Please do these things in order and tell me the result of each. Steps 0 and 3
are checks; please paste their results in your reply.

### 0. Checks first (read-only)

**0a. Scheduled jobs that call edge functions.** Does not print job commands.

```sql
select
  j.jobname,
  j.schedule,
  j.active,
  substring(j.command from '/functions/v1/([A-Za-z0-9_-]+)') as function_name,
  coalesce(substring(j.command from '/functions/v1/([A-Za-z0-9_-]+)') = any (array[
    'auto-create-monday-zoom', 'auto-register-zoom', 'send-first-timer-followup',
    'send-monthly-provider-analytics', 'send-weekly-blog-digest',
    'send-zoom-reengagement', 'send-zoom-starting-soon', 'send-member-zoom-reminder',
    'sync-app-memberships', 'sync-website-to-app-entitlements',
    'paypal-sync-all', 'send-weekly-zoom-report'
  ]), false) as needs_secret,
  j.command ~* 'cron_secret' as sends_cron_secret,
  j.command ~* '(x-automation-secret|x-cron-secret)' as sends_secret_header,
  j.command ~* 'net\.http_get' as uses_http_get
from cron.job j
where j.command ilike '%/functions/v1/%'
order by needs_secret desc, function_name, j.jobname;
```

**0b. Settings (no secret values).**

```sql
select key, value from public.site_settings where key = 'enforce_function_auth';
select exists (
  select 1 from public.site_settings where key = 'cron_secret' and length(value) > 0
) as cron_secret_is_set;
```

If `cron_secret_is_set` is false, **stop and tell me.**

**0c. Monday confirmation emails.** Is the notification ledger switched on, and
are confirmations being accepted? Counts only, no addresses.

```sql
select enabled, activated_at, claim_deadline,
       (pilot_email_key is not null) as pilot_email_set,
       pilot_meeting_date
from monday_notification_private.control;

select recipient_kind, state, count(*)
from monday_notification_private.deliveries
where created_at > now() - interval '21 days'
group by 1, 2 order by 1, 2;

select meeting_date, count(*) as registrations
from public.zoom_meeting_registrations
where meeting_date >= current_date - 21
group by 1 order by 1;
```

If the second query errors on `created_at`, run it without the `where` line and
say so. **Do not change anything in `monday_notification_private`.** Just report
the three results.

**0d. What the migration will repair, and who is listed today.**

```sql
-- Free memberships the weekly PayPal sync expired by mistake (counts only).
select split_part(paypal_subscription_id, '-', 1) as kind, count(*) as to_restore
from public.provider_subscriptions
where status = 'expired'
  and (
    (paypal_subscription_id like 'FAMILY6-%'
      and coalesce(access_ends_at, coalesce(start_date, created_at) + interval '6 months') > now())
    or paypal_subscription_id like 'FREELIST-%'
  )
group by 1;

-- Coaching providers currently bookable. These should all be people I added.
select id, full_name, status, created_at from public.consultation_providers order by created_at;

-- Directory listings approved in the last 120 days. These should all be ones I approved.
select id, category, status, created_at
from public.provider_submissions
where status = 'approved' and created_at > now() - interval '120 days'
order by created_at desc;
```

Continue with step 1 without waiting, unless 0b told you to stop.

### 1. Create and run this database migration (exactly as written, as one migration)

Idempotent: safe to run twice.

```sql
-- =====================================================================
-- Sober Helpline website: audit fixes. 2026-11-10.
-- Idempotent (safe to run twice). Run as ONE migration.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Coaching providers are created by admins only, and a provider cannot
--    change their own status or the account the profile belongs to.
--    (The admin "manage providers" policy already covers admin inserts.)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Providers can insert own profile" ON public.consultation_providers;

CREATE OR REPLACE FUNCTION public.guard_consultation_provider_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Service role (edge functions), database-side jobs (no signed-in user:
  -- migrations, cron, the sign-up trigger) and admins are not restricted.
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role'
     OR auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only administrators may create coaching providers'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only administrators may change a coaching provider''s status or owner'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_consultation_provider_changes ON public.consultation_providers;
CREATE TRIGGER guard_consultation_provider_changes
  BEFORE INSERT OR UPDATE ON public.consultation_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_consultation_provider_changes();

-- ---------------------------------------------------------------------
-- 2. A provider may update their bookings (mark complete, Zoom details), but
--    not who the client is, which provider it belongs to, or what was paid.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_consultation_booking_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role'
     OR auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.client_user_id IS DISTINCT FROM OLD.client_user_id
     OR NEW.provider_id IS DISTINCT FROM OLD.provider_id
     OR NEW.client_email IS DISTINCT FROM OLD.client_email
     OR NEW.amount_paid IS DISTINCT FROM OLD.amount_paid
     OR NEW.paypal_order_id IS DISTINCT FROM OLD.paypal_order_id
     OR NEW.coaching_plan_id IS DISTINCT FROM OLD.coaching_plan_id THEN
    RAISE EXCEPTION 'Only administrators may change the client, provider or payment on a booking'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_consultation_booking_changes ON public.consultation_bookings;
CREATE TRIGGER guard_consultation_booking_changes
  BEFORE UPDATE ON public.consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_consultation_booking_changes();

-- ---------------------------------------------------------------------
-- 3. A new directory listing starts as a draft or pending review, whatever
--    status the browser sends. (Status changes after that are already guarded.)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_provider_submission_insert_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role'
     OR auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS NOT NULL AND NEW.status NOT IN ('draft', 'pending') THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_provider_submission_insert_status ON public.provider_submissions;
CREATE TRIGGER trg_enforce_provider_submission_insert_status
  BEFORE INSERT ON public.provider_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_provider_submission_insert_status();

-- ---------------------------------------------------------------------
-- 4. Multi-session coaching plans: a guest (no account) can hold one, and
--    the 12-session plan type is allowed. NOT VALID: checks new rows only.
-- ---------------------------------------------------------------------
ALTER TABLE public.coaching_plans ALTER COLUMN client_user_id DROP NOT NULL;

DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.coaching_plans'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%plan_type%'
  LOOP
    EXECUTE format('ALTER TABLE public.coaching_plans DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.coaching_plans
  ADD CONSTRAINT coaching_plans_plan_type_check
  CHECK (plan_type IN ('emergency', 'stabilization', 'parallel-recovery')) NOT VALID;

-- ---------------------------------------------------------------------
-- 5. Restore free memberships the weekly PayPal sync expired by mistake.
--    It asked PayPal about ids PayPal never issued (FAMILY6-…, FREELIST-…),
--    got "not found" and marked them expired. A 6-month family code is only
--    restored while its 6 months are still running, and keeps that end date.
--    The tampering trigger only allows service_role/admins, so it is paused
--    INSIDE this DO block: if anything fails, the pause is rolled back too.
-- ---------------------------------------------------------------------
DO $$
BEGIN
  ALTER TABLE public.provider_subscriptions DISABLE TRIGGER prevent_provider_subscription_tampering;

  UPDATE public.provider_subscriptions
  SET status = 'active',
      access_ends_at = coalesce(access_ends_at, coalesce(start_date, created_at) + interval '6 months'),
      updated_at = now()
  WHERE status = 'expired'
    AND paypal_subscription_id LIKE 'FAMILY6-%'
    AND coalesce(access_ends_at, coalesce(start_date, created_at) + interval '6 months') > now();

  UPDATE public.provider_subscriptions
  SET status = 'active', updated_at = now()
  WHERE status = 'expired'
    AND paypal_subscription_id LIKE 'FREELIST-%';

  ALTER TABLE public.provider_subscriptions ENABLE TRIGGER prevent_provider_subscription_tampering;
END $$;

-- ---------------------------------------------------------------------
-- 6. The weekly PayPal sync and the weekly Zoom report now accept the same
--    credentials as the other scheduled functions. Add the cron secret to
--    their jobs' JSON body (read from site_settings when the job runs, never
--    pasted into the job). Same method as the 2026-10-03 migration: only the
--    command changes; each rewritten command is checked with EXPLAIN first; a
--    job that can't be rewritten safely is left unchanged and reported.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  j record;
  new_command text;
BEGIN
  FOR j IN
    SELECT jobid, jobname, command
    FROM cron.job
    WHERE command !~* 'cron_secret'
      AND command !~* 'x-cron-secret'
      AND command ~* 'net\.http_post'
      AND command ~* '\mbody\s*(:=|=>)'
      AND substring(command from '/functions/v1/([A-Za-z0-9_-]+)') = ANY (ARRAY[
        'paypal-sync-all', 'send-weekly-zoom-report',
        'auto-create-monday-zoom', 'auto-register-zoom', 'send-first-timer-followup',
        'send-monthly-provider-analytics', 'send-weekly-blog-digest',
        'send-zoom-reengagement', 'send-zoom-starting-soon', 'send-member-zoom-reminder'
      ])
  LOOP
    new_command := regexp_replace(
      j.command,
      '(\mbody\s*(:=|=>)\s*)',
      '\1jsonb_build_object(''cron_secret'', (select value from public.site_settings where key = ''cron_secret'')) || ',
      'i');
    BEGIN
      EXECUTE 'EXPLAIN ' || rtrim(new_command, E'; \n\r\t');
      PERFORM cron.alter_job(j.jobid, command := new_command);
      RAISE NOTICE 'cron job % now sends cron_secret', j.jobname;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'cron job % left unchanged (%)', j.jobname, SQLERRM;
    END;
  END LOOP;
END $$;
```

### 2. Edge functions

Redeploy these from the synced code. `supabase/functions/_shared/cancelledMeetings.ts`
is new and `_shared/bookingRules.ts` changed, so every function that imports
them must be deployed:

- `send-weekly-zoom-report`
- `paypal-sync-all`
- `paypal-subscriptions`
- `consultation-payment`
- `book-consultation`
- `auto-register-zoom`
- `send-zoom-starting-soon`
- `send-first-timer-followup`
- `send-zoom-reengagement`
- `send-member-zoom-reminder`

Do not change any function's `verify_jwt` setting.

### 3. Turn on enforcement, only if every scheduled job is ready

Run the step 0a query again and paste the result.

- If **every** row with `needs_secret = true` and `active = true` shows
  `sends_cron_secret = true` or `sends_secret_header = true`, run:

  ```sql
  update public.site_settings set value = 'true', updated_at = now()
  where key = 'enforce_function_auth';
  select key, value from public.site_settings where key = 'enforce_function_auth';
  ```

  (If `site_settings` has no `updated_at` column, run the update without it.)

- If **any** such row shows both as false, **do not run the update.** Tell me
  which jobs they are. I will fix those jobs first (the 2026-10-03 prompt has
  the pattern for adding the secret by hand) and turn enforcement on afterwards.

### 4. Report back

- The results of 0a (before and after), 0b, 0c and 0d.
- Any `NOTICE` lines from the migration.
- Whether step 3's update ran, and the final value of `enforce_function_auth`.
- Confirmation that all ten functions deployed.

### 5. Publish

Publish the frontend so the blog index and the Monday registration page changes
go live.

---

## After Lovable replies

- **0c decides item 8.** If `enabled` is false, or `pilot_email_set` is true
  with a `claim_deadline` in the past, new registrants are not getting the
  "You're Registered" email (the 6 PM reminder still goes out). Turning it on is
  the activation procedure in `docs/monday-disabled-activation-rollout.md`; this
  prompt deliberately does not do it.
- **0d lists.** Any coaching provider or approved listing you don't recognise
  was not added by you: set its status back in the admin panel.
- **If step 3 ran,** the first scheduled runs to watch are Monday's
  re-engagement invite (8 AM Pacific) and the 6 PM "starting in 1 hour"
  reminder. If either fails to arrive, set `enforce_function_auth` back to
  `'false'` and tell me; nothing else needs undoing.
