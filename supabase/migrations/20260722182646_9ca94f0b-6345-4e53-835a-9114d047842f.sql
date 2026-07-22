-- Remove public SELECT policy on base table; public access flows through consultation_providers_public view (excludes paypal_email, notification_email)
DROP POLICY IF EXISTS "Public can view active providers" ON public.consultation_providers;

-- Ensure the public view is accessible
GRANT SELECT ON public.consultation_providers_public TO anon, authenticated;