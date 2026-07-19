
-- Stop exposing sensitive columns (paypal_email, notification_email) via the public SELECT policy.
-- Switch consultation_providers_public to security_invoker=off so it runs with owner privileges,
-- then drop the broad public SELECT policy on the base table. The public view continues to expose
-- only non-sensitive columns.

ALTER VIEW public.consultation_providers_public SET (security_invoker = off);

GRANT SELECT ON public.consultation_providers_public TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view active providers" ON public.consultation_providers;
