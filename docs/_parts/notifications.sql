-- =====================================================================
-- Workstream B: member notifications & email. 2026-11-10.
-- Idempotent (safe to run twice). Run as ONE migration, BEFORE deploying
-- send-forum-notifications / send-member-weekly-note / send-welcome-email.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Email preferences: three new switches (a missing row = all on).
-- ---------------------------------------------------------------------
ALTER TABLE public.user_notification_preferences
  ADD COLUMN IF NOT EXISTS reply_notifications boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS followed_topic_notifications boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS weekly_member_note boolean NOT NULL DEFAULT true;

-- Members read, create and update only their own row (same policies as the
-- 2026-01-20 migration, re-asserted so the settings card works even if they
-- were changed since; WITH CHECK added so a row can't be moved to another user).
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_notification_preferences;
CREATE POLICY "Users can view their own preferences"
  ON public.user_notification_preferences FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own preferences" ON public.user_notification_preferences;
CREATE POLICY "Users can create their own preferences"
  ON public.user_notification_preferences FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_notification_preferences;
CREATE POLICY "Users can update their own preferences"
  ON public.user_notification_preferences FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.user_notification_preferences TO authenticated;
GRANT ALL ON public.user_notification_preferences TO service_role;

-- ---------------------------------------------------------------------
-- 2. Ledgers (service role only: RLS on, no client policies).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('reply', 'mention', 'followed', 'host_alert')),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  -- No foreign key to auth.users (not allowed here); see account-cleanup.sql.
  recipient_user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT forum_notification_log_unique UNIQUE (kind, post_id, recipient_user_id)
);
CREATE INDEX IF NOT EXISTS forum_notification_log_post_idx ON public.forum_notification_log (post_id);
REVOKE ALL ON public.forum_notification_log FROM anon, authenticated;
GRANT ALL ON public.forum_notification_log TO service_role;
ALTER TABLE public.forum_notification_log ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.member_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  period_key text NOT NULL,
  -- No foreign key to auth.users (not allowed here); see account-cleanup.sql.
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT member_email_log_unique UNIQUE (kind, period_key, user_id)
);
CREATE INDEX IF NOT EXISTS member_email_log_kind_period_idx ON public.member_email_log (kind, period_key);
REVOKE ALL ON public.member_email_log FROM anon, authenticated;
GRANT ALL ON public.member_email_log TO service_role;
ALTER TABLE public.member_email_log ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 3. Welcome email: existing members are marked as already welcomed, so
--    the new UPDATE trigger only welcomes people who join from now on.
--    "Existing" = anyone with a website family membership row that is not
--    just 'pending' (a pending PayPal checkout that activates later still
--    gets its welcome). Only inserts ledger rows; sends nothing.
-- ---------------------------------------------------------------------
INSERT INTO public.member_email_log (kind, period_key, user_id)
SELECT DISTINCT 'welcome', 'once', ps.user_id
FROM public.provider_subscriptions ps
WHERE ps.provider_submission_id IS NULL
  AND ps.user_id IS NOT NULL
  AND ps.status IS DISTINCT FROM 'pending'
ON CONFLICT (kind, period_key, user_id) DO NOTHING;

-- Fires when a website family membership is inserted active OR becomes
-- active later (PayPal rows are inserted 'pending' and activated by UPDATE).
-- Skips memberships that came from the mobile app (plan_type 'app'). At most
-- once per user ever: claims member_email_log ('welcome', 'once') and only
-- posts if that claim is new. Never blocks the membership write: any error
-- is turned into a WARNING (and the claim is rolled back with it).
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _email text;
  _first_name text;
  _cron_secret text;
  _claimed uuid;
BEGIN
  IF NEW.status IS DISTINCT FROM 'active'
     OR NEW.provider_submission_id IS NOT NULL
     OR NEW.plan_type IS NOT DISTINCT FROM 'app'
     OR NEW.plan_type IS NOT DISTINCT FROM 'free' THEN
    -- 'app': joined in the mobile app. 'free': granted by an admin, whose
    -- screen already sends its own welcome (send-free-membership-email).
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status IS NOT DISTINCT FROM 'active' THEN
    RETURN NEW;  -- already active before this update
  END IF;

  BEGIN
    SELECT au.email INTO _email FROM auth.users au WHERE au.id = NEW.user_id;
    SELECT value INTO _cron_secret FROM public.site_settings WHERE key = 'cron_secret';
    IF _email IS NULL OR _email = '' OR _cron_secret IS NULL OR _cron_secret = '' THEN
      RETURN NEW;  -- nothing claimed, so a later activation can still welcome them
    END IF;

    INSERT INTO public.member_email_log (kind, period_key, user_id)
    VALUES ('welcome', 'once', NEW.user_id)
    ON CONFLICT (kind, period_key, user_id) DO NOTHING
    RETURNING id INTO _claimed;
    IF _claimed IS NULL THEN
      RETURN NEW;  -- already welcomed
    END IF;

    SELECT p.first_name INTO _first_name FROM public.profiles p WHERE p.id = NEW.user_id;

    PERFORM net.http_post(
      url     := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-welcome-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := jsonb_build_object(
        'cron_secret', _cron_secret,
        'email',       _email,
        'firstName',   COALESCE(_first_name, '')
      )
    );
  EXCEPTION WHEN others THEN
    RAISE WARNING 'trigger_welcome_email skipped for %: %', NEW.user_id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.trigger_welcome_email() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS on_new_family_membership ON public.provider_subscriptions;
CREATE TRIGGER on_new_family_membership
  AFTER INSERT OR UPDATE ON public.provider_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();

-- ---------------------------------------------------------------------
-- 4. Scheduled jobs. cron.schedule with an existing name replaces that job,
--    so re-running does not duplicate. The cron secret is read from
--    site_settings when each job runs (never pasted into the job).
-- ---------------------------------------------------------------------

-- Forum emails start from now: nothing posted before this moment is ever
-- emailed (the function does nothing until this is set). Kept if already set.
INSERT INTO public.site_settings (key, value)
VALUES ('forum_notifications_start_at', to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
ON CONFLICT (key) DO NOTHING;

-- Forum notifications: every 15 minutes.
SELECT cron.schedule(
  'send-forum-notifications-15min',
  '*/15 * * * *',
  $cmd$
  select net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-forum-notifications',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
      'source', 'cron'),
    timeout_milliseconds := 150000
  ) as request_id;
  $cmd$
);

-- Weekly member note: Tuesday from 4 PM Pacific. The function only sends on
-- Tuesday between 4 and 7 PM Pacific; these UTC hours cover that window in
-- both seasons (PDT: 23:xx Tue to 01:xx Wed; PST: 00:xx to 02:xx Wed), and
-- the runs outside it are no-ops. Every 10 minutes so a long member list, or
-- a bad half hour at the email provider, is caught up the same evening (the
-- ledger stops repeats).
SELECT cron.schedule(
  'send-member-weekly-note-a',
  '*/10 23 * * 2',
  $cmd$
  select net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-member-weekly-note',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
      'source', 'cron'),
    timeout_milliseconds := 150000
  ) as request_id;
  $cmd$
);

SELECT cron.schedule(
  'send-member-weekly-note-b',
  '*/10 0-2 * * 3',
  $cmd$
  select net.http_post(
    url := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-member-weekly-note',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'cron_secret', (select value from public.site_settings where key = 'cron_secret'),
      'source', 'cron'),
    timeout_milliseconds := 150000
  ) as request_id;
  $cmd$
);
