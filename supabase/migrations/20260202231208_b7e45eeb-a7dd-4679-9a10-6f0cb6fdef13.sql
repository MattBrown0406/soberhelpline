-- Add blocking policies for anonymous access (these don't exist yet)
-- The "Block anonymous select" policy ensures unauthenticated users cannot read profiles

CREATE POLICY "Block anonymous select on profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous insert on profiles"
ON public.profiles
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block anonymous update on profiles"
ON public.profiles
FOR UPDATE
USING (false);

CREATE POLICY "Block anonymous delete on profiles"
ON public.profiles
FOR DELETE
USING (false);

-- Add policies for admins, moderators, and active members if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles') THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Moderators can view all profiles') THEN
    CREATE POLICY "Moderators can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (public.has_role(auth.uid(), 'moderator'::public.app_role));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Active members can view profiles') THEN
    CREATE POLICY "Active members can view profiles"
    ON public.profiles
    FOR SELECT
    USING (public.is_active_family_member(auth.uid()));
  END IF;
END $$;

COMMENT ON TABLE public.profiles IS 'User profile data. RLS restricts access to authenticated users only - anonymous access blocked to prevent data scraping.';