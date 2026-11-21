DROP POLICY "Anyone can view badges" ON public.forum_badges;

CREATE POLICY "Members can view badges"
ON public.forum_badges
FOR SELECT
TO authenticated
USING (
  public.is_active_family_member(auth.uid())
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);