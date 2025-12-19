-- Provide safe, limited profile access for forum/messaging without exposing email/phone

CREATE OR REPLACE FUNCTION public.is_active_family_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.provider_subscriptions ps
    WHERE ps.user_id = _user_id
      AND ps.status = 'active'
      AND ps.provider_submission_id IS NULL
  );
$$;

-- RPC to fetch ONLY non-sensitive display fields for a set of users.
-- This intentionally excludes email and phone_number.
CREATE OR REPLACE FUNCTION public.get_public_profiles(_user_ids uuid[])
RETURNS TABLE(
  id uuid,
  username text,
  first_name text,
  last_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow signed-in active family members, moderators, or admins
  SELECT p.id, p.username, p.first_name, p.last_name
  FROM public.profiles p
  WHERE auth.uid() IS NOT NULL
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'moderator'::public.app_role)
      OR public.is_active_family_member(auth.uid())
    )
    AND p.id = ANY(_user_ids);
$$;

REVOKE ALL ON FUNCTION public.get_public_profiles(uuid[]) FROM public;
GRANT EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) TO authenticated;

REVOKE ALL ON FUNCTION public.is_active_family_member(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_active_family_member(uuid) TO authenticated;
