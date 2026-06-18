-- Fires send-welcome-email edge function when a new family membership is created.
-- provider_submission_id IS NULL distinguishes family members from providers.

CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _email TEXT;
  _first_name TEXT;
  _cron_secret TEXT;
  _supabase_url TEXT;
BEGIN
  -- Only run for brand-new active family member subscriptions
  IF NEW.status <> 'active' OR NEW.provider_submission_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Look up email and name from auth.users / profiles
  SELECT au.email INTO _email
  FROM auth.users au
  WHERE au.id = NEW.user_id;

  SELECT p.first_name INTO _first_name
  FROM public.profiles p
  WHERE p.id = NEW.user_id;

  -- Get cron_secret for auth
  SELECT value INTO _cron_secret
  FROM public.site_settings
  WHERE key = 'cron_secret';

  -- Get Supabase URL from pg_catalog (set at cluster init)
  SELECT current_setting('app.supabase_url', true) INTO _supabase_url;
  IF _supabase_url IS NULL OR _supabase_url = '' THEN
    _supabase_url := 'https://' || (
      SELECT split_part(setting, '.', 1)
      FROM pg_settings
      WHERE name = 'cluster_name'
      LIMIT 1
    ) || '.supabase.co';
  END IF;

  IF _email IS NOT NULL AND _cron_secret IS NOT NULL THEN
    PERFORM net.http_post(
      url     := _supabase_url || '/functions/v1/send-welcome-email',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body    := jsonb_build_object(
        'cron_secret', _cron_secret,
        'email',       _email,
        'firstName',   COALESCE(_first_name, '')
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_family_membership
  AFTER INSERT ON public.provider_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();
