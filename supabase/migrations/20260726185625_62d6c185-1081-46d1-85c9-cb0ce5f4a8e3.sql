-- Grant anon SELECT on only the safe columns exposed by consultation_providers_public
-- (security_invoker view resolves grants as the caller). Sensitive columns like
-- paypal_email and notification_email are intentionally excluded.
GRANT SELECT (
  id, user_id, full_name, title, bio, photo_url, specialties,
  session_rate, session_duration_minutes, status, timezone,
  created_at, updated_at
) ON public.consultation_providers TO anon;