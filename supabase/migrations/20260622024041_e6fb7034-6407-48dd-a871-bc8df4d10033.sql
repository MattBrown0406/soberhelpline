
-- 1. Restrict site_settings: hide sensitive keys (cron_secret, supabase_url, *_secret, *_token, *_key) from public; allow only safe public keys
DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read non-sensitive settings" ON public.site_settings;

CREATE POLICY "Public can read non-sensitive settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (
  key IN ('monday_zoom_link', 'monday_zoom_meeting_id', 'monday_zoom_passcode')
);

-- Admins retain full read via existing admin policies; ensure one exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='site_settings' AND policyname='Admins can read all settings'
  ) THEN
    CREATE POLICY "Admins can read all settings"
      ON public.site_settings
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END$$;

-- 2. Defensive RESTRICTIVE SELECT on abandoned_bookings (admin-only)
DROP POLICY IF EXISTS "Restrict abandoned_bookings select to admins" ON public.abandoned_bookings;
CREATE POLICY "Restrict abandoned_bookings select to admins"
ON public.abandoned_bookings
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. Defensive RESTRICTIVE SELECT on zoom_link_clicks (admin-only)
DROP POLICY IF EXISTS "Restrict zoom_link_clicks select to admins" ON public.zoom_link_clicks;
CREATE POLICY "Restrict zoom_link_clicks select to admins"
ON public.zoom_link_clicks
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
