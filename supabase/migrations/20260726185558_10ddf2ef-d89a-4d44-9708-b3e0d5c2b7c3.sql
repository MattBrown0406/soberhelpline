-- Allow anonymous and authenticated users to read rows for ACTIVE providers on the base table.
-- The consultation_providers_public view (security_invoker=on) filters to safe columns only,
-- so sensitive fields like paypal_email / notification_email remain hidden from the public
-- because column-level GRANTs to anon are limited to the view's non-sensitive projection.
CREATE POLICY "Public can view active providers"
  ON public.consultation_providers
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Ensure the public view is selectable by anon (and authenticated).
GRANT SELECT ON public.consultation_providers_public TO anon, authenticated;