CREATE OR REPLACE FUNCTION public.link_provider_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  signup_email TEXT;
BEGIN
  signup_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');
  IF signup_email IS NULL THEN RETURN NEW; END IF;

  UPDATE consultation_providers
  SET user_id = NEW.id
  WHERE notification_email = LOWER(signup_email)
    AND user_id LIKE '00000000-0000-0000-0000-%';

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_link_provider
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.link_provider_on_signup();