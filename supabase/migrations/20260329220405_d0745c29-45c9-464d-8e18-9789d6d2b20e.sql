CREATE OR REPLACE FUNCTION public.link_provider_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  signup_email TEXT;
BEGIN
  signup_email := LOWER(COALESCE(NEW.email, NEW.raw_user_meta_data->>'email'));
  IF signup_email IS NULL THEN RETURN NEW; END IF;

  -- Link consultation provider record
  UPDATE consultation_providers
  SET user_id = NEW.id
  WHERE notification_email = signup_email
    AND user_id LIKE '00000000-0000-0000-0000-%';

  -- Auto-grant moderator role for consultation providers
  IF EXISTS (SELECT 1 FROM consultation_providers WHERE notification_email = signup_email) THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'moderator')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;