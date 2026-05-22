
-- 1) abandoned_bookings: restrict permissive UPDATE
DROP POLICY IF EXISTS "Anyone can update abandoned booking by id" ON public.abandoned_bookings;
CREATE POLICY "Update only incomplete bookings and own row"
  ON public.abandoned_bookings
  FOR UPDATE
  TO anon, authenticated
  USING (
    completed = false
    AND (user_id IS NULL OR auth.uid() = user_id)
  )
  WITH CHECK (
    completed = false
    AND (user_id IS NULL OR auth.uid() = user_id)
  );

-- 2) consultation_providers: hide paypal_email & notification_email from anon
REVOKE SELECT ON public.consultation_providers FROM anon;
GRANT SELECT
  (id, user_id, full_name, title, bio, photo_url, specialties,
   session_rate, session_duration_minutes, status, created_at,
   updated_at, timezone)
  ON public.consultation_providers TO anon;

-- 3) provider_submissions: hide phone_number & email from anon
REVOKE SELECT ON public.provider_submissions FROM anon;
GRANT SELECT
  (id, category, provider_name, address, website, length_of_services,
   total_treatment_beds, detox_available, cost, insurances_accepted,
   status, created_at, updated_at, zip_code, description_of_services,
   logo_url, city, state, gender_specific_treatment, lgbt_supportive,
   license_current_good_standing, co_occurring_diagnoses,
   therapeutic_modalities, intervention_modalities,
   in_person_companion_work, has_valid_passport, daily_companion_fee,
   hourly_coaching_sessions, hourly_coaching_rate,
   case_management_services, year_started, items_included_in_cost,
   awake_staff_24_7, residents_expected_to_work, job_assistance_provided,
   medication_administration, accepts_mat_residents,
   minimum_time_since_last_use, required_meetings_per_week,
   mandatory_curfew, curfew_time, chores_required,
   mandatory_house_meetings, house_meetings_per_week,
   substance_use_disorder_experience, legal_assistance_types,
   submitted_by, cip_certified, travel_expenses_included,
   detox_only_services, works_nationally, works_internationally,
   languages_spoken, recovery_fellowships, youtube_url, tiktok_url,
   instagram_url, facebook_url, telehealth_available,
   sliding_scale_available, adolescent_services, faith_based_services,
   military_first_responder_care, also_provides_outpatient,
   also_provides_sober_living, parent_submission_id)
  ON public.provider_submissions TO anon;

-- 4) provider_submissions_public view: drop email/phone, use security_invoker
DROP VIEW IF EXISTS public.provider_submissions_public;
CREATE VIEW public.provider_submissions_public
  WITH (security_invoker = true) AS
  SELECT id, created_at, updated_at, accepts_mat_residents,
    adolescent_services, also_provides_outpatient, also_provides_sober_living,
    awake_staff_24_7, case_management_services, chores_required,
    cip_certified, detox_available, detox_only_services, faith_based_services,
    has_valid_passport, hourly_coaching_sessions, house_meetings_per_week,
    in_person_companion_work, job_assistance_provided, lgbt_supportive,
    license_current_good_standing, mandatory_curfew, mandatory_house_meetings,
    military_first_responder_care, parent_submission_id,
    residents_expected_to_work, sliding_scale_available, submitted_by,
    substance_use_disorder_experience, telehealth_available,
    total_treatment_beds, travel_expenses_included, works_internationally,
    works_nationally, year_started, gender_specific_treatment,
    hourly_coaching_rate, insurances_accepted, intervention_modalities,
    items_included_in_cost, languages_spoken, legal_assistance_types,
    length_of_services, category, provider_name, description_of_services,
    city, state, zip_code, NULL::text AS address, website, logo_url, status,
    facebook_url, instagram_url, tiktok_url, youtube_url,
    medication_administration, minimum_time_since_last_use,
    recovery_fellowships, required_meetings_per_week, co_occurring_diagnoses,
    cost, curfew_time, daily_companion_fee, therapeutic_modalities
  FROM public.provider_submissions
  WHERE status = 'approved';
GRANT SELECT ON public.provider_submissions_public TO anon, authenticated;

-- 5) family_control_worksheets: add DELETE policy
CREATE POLICY "Users can delete their own worksheets"
  ON public.family_control_worksheets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6) roadmap_users: restrict SELECT/UPDATE to admins
DROP POLICY IF EXISTS "Users can read own roadmap data" ON public.roadmap_users;
DROP POLICY IF EXISTS "Users can update own roadmap data" ON public.roadmap_users;
CREATE POLICY "Admins can read roadmap users"
  ON public.roadmap_users FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update roadmap users"
  ON public.roadmap_users FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 7) zoom_attendance: SELECT admin-only
DROP POLICY IF EXISTS "Block anon select attendance" ON public.zoom_attendance;
CREATE POLICY "Admins can read attendance"
  ON public.zoom_attendance FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 8) zoom_link_clicks: SELECT admin-only
DROP POLICY IF EXISTS "Block anon select clicks" ON public.zoom_link_clicks;
CREATE POLICY "Admins can read zoom link clicks"
  ON public.zoom_link_clicks FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 9) pending_consultation_orders: explicit deny-all policies
CREATE POLICY "Block all client select"
  ON public.pending_consultation_orders FOR SELECT
  TO anon, authenticated USING (false);
CREATE POLICY "Block all client insert"
  ON public.pending_consultation_orders FOR INSERT
  TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Block all client update"
  ON public.pending_consultation_orders FOR UPDATE
  TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Block all client delete"
  ON public.pending_consultation_orders FOR DELETE
  TO anon, authenticated USING (false);

-- 10) provider-logos bucket: prevent anon listing & restrict uploads
DROP POLICY IF EXISTS "Public read access to provider logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload provider logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload provider logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'provider-logos');
