-- Welcome email: send it once the new member has confirmed their email.
--
-- Until now the welcome email went out the moment a family membership became
-- active. With the one-page sign-up a membership becomes active BEFORE the
-- person has confirmed their email, so the welcome arrived first and its
-- "Go to your member home" button led to a login they could not yet use.
--
-- Now:
--   * Membership becomes active and the email is already confirmed (someone
--     who had an account first): welcome goes out right then, as before.
--   * Membership becomes active and the email is NOT confirmed yet (one-page
--     sign-up): nothing is sent or claimed. When the confirmation link signs
--     them in, the website calls claim_member_welcome() and it goes out then.
--
-- Still at most once per member ever (member_email_log 'welcome' / 'once'),
-- still skips app and admin-granted free memberships, and still never blocks
-- a membership write.
--
-- Touches only the public schema. No table, column, policy or trigger is
-- added or dropped: the existing trigger on_new_family_membership keeps
-- calling trigger_welcome_email(), whose body is replaced here.
-- Idempotent: safe to run twice.

-- ---------------------------------------------------------------------
-- 1. One place that decides and sends.
--    _only_if_joined_before_confirming: the website's call is limited to the
--    one case it exists for (membership created before the email was
--    confirmed), so it can never send a late welcome to a long-time member.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.send_member_welcome_if_due(
  _user_id uuid,
  _only_if_joined_before_confirming boolean DEFAULT false
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _email text;
  _confirmed_at timestamptz;
  _first_name text;
  _cron_secret text;
  _claimed uuid;
BEGIN
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  BEGIN
    SELECT au.email, au.email_confirmed_at
      INTO _email, _confirmed_at
      FROM auth.users au
     WHERE au.id = _user_id;
    IF _email IS NULL OR _email = '' OR _confirmed_at IS NULL THEN
      RETURN false;  -- not confirmed yet: nothing claimed, so it can go out later
    END IF;

    SELECT value INTO _cron_secret FROM public.site_settings WHERE key = 'cron_secret';
    IF _cron_secret IS NULL OR _cron_secret = '' THEN
      RETURN false;
    END IF;

    -- An active website family membership (not from the app, not admin-granted).
    IF NOT EXISTS (
      SELECT 1
        FROM public.provider_subscriptions ps
       WHERE ps.user_id = _user_id
         AND ps.provider_submission_id IS NULL
         AND ps.status = 'active'
         AND ps.plan_type IS DISTINCT FROM 'app'
         AND ps.plan_type IS DISTINCT FROM 'free'
         AND (ps.access_ends_at IS NULL OR ps.access_ends_at > now())
         AND (NOT _only_if_joined_before_confirming OR ps.created_at <= _confirmed_at)
    ) THEN
      RETURN false;
    END IF;

    INSERT INTO public.member_email_log (kind, period_key, user_id)
    VALUES ('welcome', 'once', _user_id)
    ON CONFLICT (kind, period_key, user_id) DO NOTHING
    RETURNING id INTO _claimed;
    IF _claimed IS NULL THEN
      RETURN false;  -- already welcomed
    END IF;

    SELECT p.first_name INTO _first_name FROM public.profiles p WHERE p.id = _user_id;

    PERFORM net.http_post(
      url     := 'https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/send-welcome-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := jsonb_build_object(
        'cron_secret', _cron_secret,
        'email',       _email,
        'firstName',   COALESCE(_first_name, '')
      )
    );
    RETURN true;
  EXCEPTION WHEN others THEN
    -- The claim above is rolled back with this block, so a later try can send.
    RAISE WARNING 'send_member_welcome_if_due skipped for %: %', _user_id, SQLERRM;
    RETURN false;
  END;
END;
$$;

REVOKE ALL ON FUNCTION public.send_member_welcome_if_due(uuid, boolean) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.send_member_welcome_if_due(uuid, boolean) TO service_role;

-- ---------------------------------------------------------------------
-- 2. The membership trigger: same conditions as before, then the shared
--    function (which now waits for a confirmed email).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
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
    PERFORM public.send_member_welcome_if_due(NEW.user_id, false);
  EXCEPTION WHEN others THEN
    RAISE WARNING 'trigger_welcome_email skipped for %: %', NEW.user_id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.trigger_welcome_email() FROM public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. What the website calls when a confirmation link has just signed a
--    member in. A signed-in person can only ever ask for their own welcome,
--    and only once.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_member_welcome()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  RETURN public.send_member_welcome_if_due(auth.uid(), true);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_member_welcome() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.claim_member_welcome() TO authenticated, service_role;
