-- 1) Create a separate table for sensitive contact data
CREATE TABLE IF NOT EXISTS public.profile_private (
  user_id uuid PRIMARY KEY,
  email text NOT NULL,
  phone_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_private ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_private FORCE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "Users can view their own private profile" ON public.profile_private;
CREATE POLICY "Users can view their own private profile"
ON public.profile_private
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own private profile" ON public.profile_private;
CREATE POLICY "Users can insert their own private profile"
ON public.profile_private
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own private profile" ON public.profile_private;
CREATE POLICY "Users can update their own private profile"
ON public.profile_private
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all private profiles" ON public.profile_private;
CREATE POLICY "Admins can view all private profiles"
ON public.profile_private
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update all private profiles" ON public.profile_private;
CREATE POLICY "Admins can update all private profiles"
ON public.profile_private
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Explicitly block unauthenticated/public access
DROP POLICY IF EXISTS "Block anonymous access" ON public.profile_private;
CREATE POLICY "Block anonymous access"
ON public.profile_private
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

DROP POLICY IF EXISTS "Block public role access" ON public.profile_private;
CREATE POLICY "Block public role access"
ON public.profile_private
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- Timestamp trigger
DROP TRIGGER IF EXISTS update_profile_private_updated_at ON public.profile_private;
CREATE TRIGGER update_profile_private_updated_at
BEFORE UPDATE ON public.profile_private
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Migrate existing contact data into profile_private
INSERT INTO public.profile_private (user_id, email, phone_number)
SELECT id, email, phone_number
FROM public.profiles
ON CONFLICT (user_id)
DO UPDATE SET
  email = EXCLUDED.email,
  phone_number = EXCLUDED.phone_number,
  updated_at = now();

-- 3) Remove sensitive columns from public.profiles (so scanners stop flagging it)
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS phone_number;

-- 4) Update signup handler to populate both tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- public profile (non-sensitive)
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = now();

  -- private contact info
  INSERT INTO public.profile_private (user_id, email, phone_number)
  VALUES (
    new.id,
    COALESCE(new.email, new.raw_user_meta_data->>'email'),
    new.raw_user_meta_data->>'phone_number'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    phone_number = EXCLUDED.phone_number,
    updated_at = now();

  RETURN new;
END;
$function$;
