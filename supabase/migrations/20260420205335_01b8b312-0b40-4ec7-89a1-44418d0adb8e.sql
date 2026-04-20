-- Allow anonymous (logged-out) visitors to read site_settings so that the public
-- Monday Zoom registration page can fetch the meeting ID/passcode and show the
-- "Join Meeting" button after registration. None of the keys in site_settings
-- are sensitive (only Monday Zoom join info, which is also emailed to attendees).

DROP POLICY IF EXISTS "Block anonymous select" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can read settings" ON public.site_settings;

CREATE POLICY "Anyone can read settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);