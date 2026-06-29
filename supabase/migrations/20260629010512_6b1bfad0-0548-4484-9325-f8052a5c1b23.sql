
-- 1. member_warnings: allow members to view warnings against them
CREATE POLICY "Members can view warnings against them"
  ON public.member_warnings
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

-- 2. roadmap_users: restrict authenticated non-admins to own email row
CREATE POLICY "Users can read their own roadmap row"
  ON public.roadmap_users
  FOR SELECT
  TO authenticated
  USING (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "Restrict roadmap_users reads to own row or admin"
  ON public.roadmap_users
  AS RESTRICTIVE
  FOR SELECT
  TO authenticated
  USING (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- 3. zoom_meeting_registrations: restrictive policy preventing reads of NULL-user_id rows by non-admins
CREATE POLICY "Restrict zoom registration reads to owner or admin"
  ON public.zoom_meeting_registrations
  AS RESTRICTIVE
  FOR SELECT
  TO authenticated
  USING (
    (user_id IS NOT NULL AND user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );
