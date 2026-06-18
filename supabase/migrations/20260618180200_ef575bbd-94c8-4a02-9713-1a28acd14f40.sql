CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _email TEXT;
  _first_name TEXT;
  _cron_secret TEXT;
  _supabase_url TEXT;
BEGIN
  IF NEW.status <> 'active' OR NEW.provider_submission_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT au.email INTO _email FROM auth.users au WHERE au.id = NEW.user_id;
  SELECT p.first_name INTO _first_name FROM public.profiles p WHERE p.id = NEW.user_id;

  SELECT value INTO _cron_secret FROM public.site_settings WHERE key = 'cron_secret';
  SELECT value INTO _supabase_url FROM public.site_settings WHERE key = 'supabase_url';

  IF _email IS NOT NULL AND _cron_secret IS NOT NULL AND _supabase_url IS NOT NULL THEN
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

DROP TRIGGER IF EXISTS on_new_family_membership ON public.provider_subscriptions;
CREATE TRIGGER on_new_family_membership
  AFTER INSERT ON public.provider_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();