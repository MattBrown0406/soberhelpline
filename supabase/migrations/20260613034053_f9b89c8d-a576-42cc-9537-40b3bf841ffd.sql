
-- 1. abandoned_bookings: prevent anonymous users from overwriting PII on existing rows
-- (INSERT still allowed; UPDATE of last_step/completed/etc. still works; only PII columns are locked down)
REVOKE UPDATE (client_email, client_name, client_phone) ON public.abandoned_bookings FROM anon, authenticated;
GRANT UPDATE (client_email, client_name, client_phone) ON public.abandoned_bookings TO service_role;

-- 2. consultation_providers: stop exposing paypal_email / notification_email publicly.
-- Create a public-safe view and drop the broad public SELECT policy. Owners/admins keep full row access via remaining policies.
CREATE OR REPLACE VIEW public.consultation_providers_public
WITH (security_invoker = on) AS
SELECT
  id, user_id, full_name, title, bio, photo_url, specialties,
  session_rate, session_duration_minutes, status, timezone,
  created_at, updated_at
FROM public.consultation_providers
WHERE status = 'active';

GRANT SELECT ON public.consultation_providers_public TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view active providers" ON public.consultation_providers;

-- Allow the public view (security_invoker) to read the underlying active rows for anon/auth
CREATE POLICY "Public can view active providers (safe cols via view)"
  ON public.consultation_providers
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Revoke direct anon SELECT on sensitive columns so even if someone hits the base table, PII is blocked.
REVOKE SELECT (paypal_email, notification_email) ON public.consultation_providers FROM anon;

-- 3. provider_submissions: drop the public SELECT policy on the base table.
-- The provider_submissions_public view already exposes only safe columns and is what the app uses.
DROP POLICY IF EXISTS "Anyone can view approved submissions via public view" ON public.provider_submissions;

-- 4. roadmap_users: explicit anon SELECT deny (defense in depth)
CREATE POLICY "Block anonymous select on roadmap_users"
  ON public.roadmap_users
  FOR SELECT
  TO anon
  USING (false);

-- 5. zoom_link_clicks: explicit anon SELECT deny
CREATE POLICY "Block anonymous select on zoom_link_clicks"
  ON public.zoom_link_clicks
  FOR SELECT
  TO anon
  USING (false);

-- 6. zoom_meeting_registrations: explicit anon SELECT deny
CREATE POLICY "Block anonymous select on zoom_meeting_registrations"
  ON public.zoom_meeting_registrations
  FOR SELECT
  TO anon
  USING (false);
