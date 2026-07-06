
-- Tighten open INSERT policies on public analytics/booking tables with input validation
-- to mitigate spam/spoofing while preserving anonymous insert functionality.

-- abandoned_bookings: require sane length limits and, if user_id provided, must match auth.uid()
DROP POLICY IF EXISTS "Anyone can create abandoned booking record" ON public.abandoned_bookings;
CREATE POLICY "Anyone can create abandoned booking record"
ON public.abandoned_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND (client_email IS NULL OR length(client_email) <= 320)
  AND (client_name IS NULL OR length(client_name) <= 200)
  AND (client_phone IS NULL OR length(client_phone) <= 40)
  AND (plan_type IS NULL OR length(plan_type) <= 80)
  AND (provider_name IS NULL OR length(provider_name) <= 200)
  AND (selected_time IS NULL OR length(selected_time) <= 20)
  AND completed = false
);

-- conversion_events: length limits on all free-text fields
DROP POLICY IF EXISTS "Anyone can insert conversion events" ON public.conversion_events;
CREATE POLICY "Anyone can insert conversion events"
ON public.conversion_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_name IS NOT NULL AND length(event_name) <= 120
  AND (page_path IS NULL OR length(page_path) <= 500)
  AND (page_title IS NULL OR length(page_title) <= 500)
  AND (source IS NULL OR length(source) <= 200)
  AND (label IS NULL OR length(label) <= 300)
  AND (target_href IS NULL OR length(target_href) <= 1000)
  AND (utm_source IS NULL OR length(utm_source) <= 200)
  AND (utm_medium IS NULL OR length(utm_medium) <= 200)
  AND (utm_campaign IS NULL OR length(utm_campaign) <= 200)
  AND (utm_content IS NULL OR length(utm_content) <= 300)
  AND (utm_term IS NULL OR length(utm_term) <= 300)
  AND (referrer IS NULL OR length(referrer) <= 1000)
  AND (first_landing_path IS NULL OR length(first_landing_path) <= 500)
);

-- guide_views: cap sizes; enforce user_id matches auth for authed inserts
DROP POLICY IF EXISTS "Anyone can insert anonymous guide views" ON public.guide_views;
CREATE POLICY "Anyone can insert anonymous guide views"
ON public.guide_views
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL
  AND guide_path IS NOT NULL AND length(guide_path) <= 500
  AND (guide_name IS NULL OR length(guide_name) <= 300)
  AND (session_id IS NULL OR length(session_id) <= 100)
);

DROP POLICY IF EXISTS "Authenticated users can insert guide views" ON public.guide_views;
CREATE POLICY "Authenticated users can insert guide views"
ON public.guide_views
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND guide_path IS NOT NULL AND length(guide_path) <= 500
  AND (guide_name IS NULL OR length(guide_name) <= 300)
  AND (session_id IS NULL OR length(session_id) <= 100)
);

-- provider_clicks: allowlist click_type, cap sizes, require valid provider
DROP POLICY IF EXISTS "Anyone can insert clicks" ON public.provider_clicks;
CREATE POLICY "Anyone can insert clicks"
ON public.provider_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (
  provider_id IS NOT NULL
  AND click_type IN ('card_view','website_click','phone_click','email_click')
  AND (session_id IS NULL OR length(session_id) <= 100)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
  AND (referrer IS NULL OR length(referrer) <= 1000)
  AND (country IS NULL OR length(country) <= 80)
  AND (region IS NULL OR length(region) <= 120)
  AND (city IS NULL OR length(city) <= 120)
);

-- survey_responses: require valid survey_id reference and jsonb answers
DROP POLICY IF EXISTS "Anyone can submit survey responses" ON public.survey_responses;
CREATE POLICY "Anyone can submit survey responses"
ON public.survey_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  survey_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.surveys s WHERE s.id = survey_responses.survey_id)
  AND answers IS NOT NULL
  AND jsonb_typeof(answers) = 'object'
  AND pg_column_size(answers) <= 32768
);

-- zoom_meeting_registrations: cap sizes; if user_id provided, must match auth.uid()
DROP POLICY IF EXISTS "Anyone can register for zoom meetings" ON public.zoom_meeting_registrations;
CREATE POLICY "Anyone can register for zoom meetings"
ON public.zoom_meeting_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND name IS NOT NULL AND length(name) BETWEEN 1 AND 200
  AND email IS NOT NULL AND length(email) BETWEEN 3 AND 320 AND email LIKE '%_@_%.__%'
  AND (phone IS NULL OR length(phone) <= 40)
  AND (question IS NULL OR length(question) <= 4000)
  AND (preferred_contact_date IS NULL OR length(preferred_contact_date) <= 40)
  AND (preferred_contact_time IS NULL OR length(preferred_contact_time) <= 40)
  AND (preferred_timezone IS NULL OR length(preferred_timezone) <= 80)
);
