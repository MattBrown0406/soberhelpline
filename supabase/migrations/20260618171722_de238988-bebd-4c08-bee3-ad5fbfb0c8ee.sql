CREATE POLICY "Restrict reads to admins only"
ON public.family_squares_followup_queue
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Restrict reads to admins only"
ON public.pending_free_memberships
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));