
-- 1) abandoned_bookings: revoke column-level UPDATE on PII fields from anon
REVOKE UPDATE (client_email, client_name, client_phone) ON public.abandoned_bookings FROM anon;
-- ensure authenticated users can still update their own row's PII (matches existing RLS scoped by user_id)
GRANT UPDATE (client_email, client_name, client_phone) ON public.abandoned_bookings TO authenticated;

-- 2) consultation_providers: drop the broad public SELECT on the base table.
-- Public listings already use the consultation_providers_public view; provider/admin self-access
-- is preserved by the remaining "Providers can view own profile" and "Admins can manage providers" policies.
DROP POLICY IF EXISTS "Public can view active providers (safe cols via view)" ON public.consultation_providers;

-- 3) family_squares_followup_queue: add restrictive policies to make intent explicit.
CREATE POLICY "Block non-admin inserts on followup queue"
  ON public.family_squares_followup_queue
  AS RESTRICTIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Block non-admin updates on followup queue"
  ON public.family_squares_followup_queue
  AS RESTRICTIVE
  FOR UPDATE
  TO anon, authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Block non-admin deletes on followup queue"
  ON public.family_squares_followup_queue
  AS RESTRICTIVE
  FOR DELETE
  TO anon, authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
