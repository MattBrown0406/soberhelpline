-- Fix handle_new_user to gracefully handle missing first/last name
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    updated_at = now();

  INSERT INTO public.profile_private (user_id, email, phone_number)
  VALUES (
    new.id,
    COALESCE(new.email, new.raw_user_meta_data->>'email'),
    new.raw_user_meta_data->>'phone_number'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    phone_number = COALESCE(EXCLUDED.phone_number, profile_private.phone_number),
    updated_at = now();

  RETURN new;
END;
$function$;

-- Fix link_provider_on_signup to match any placeholder user_id pattern
CREATE OR REPLACE FUNCTION public.link_provider_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  signup_email TEXT;
BEGIN
  signup_email := LOWER(COALESCE(NEW.email, NEW.raw_user_meta_data->>'email'));
  IF signup_email IS NULL THEN RETURN NEW; END IF;

  -- Link consultation provider record (match any placeholder UUID)
  UPDATE consultation_providers
  SET user_id = NEW.id
  WHERE notification_email = signup_email
    AND user_id::text LIKE '00000000-0000-0000-0000-%';

  -- Auto-grant moderator role for consultation providers
  IF EXISTS (SELECT 1 FROM consultation_providers WHERE notification_email = signup_email) THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'moderator')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;