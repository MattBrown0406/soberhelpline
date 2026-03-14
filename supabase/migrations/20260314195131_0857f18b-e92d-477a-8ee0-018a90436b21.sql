
CREATE OR REPLACE FUNCTION public.get_user_last_sign_in(_user_ids uuid[])
RETURNS TABLE(user_id uuid, last_sign_in_at timestamptz, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id AS user_id, u.last_sign_in_at, u.created_at
  FROM auth.users u
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
    AND u.id = ANY(_user_ids);
$$;
