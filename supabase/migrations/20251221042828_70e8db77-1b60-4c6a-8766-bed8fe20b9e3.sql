-- Drop and recreate provider_submissions_public view with SECURITY INVOKER = false
-- so it can bypass RLS on the underlying provider_submissions table.
-- This view intentionally excludes sensitive fields (email, phone_number) for public access.

DROP VIEW IF EXISTS public.provider_submissions_public;

CREATE VIEW public.provider_submissions_public
WITH (security_invoker = false)
AS
SELECT
  id,
  created_at,
  updated_at,
  accepts_mat_residents,
  adolescent_services,
  also_provides_outpatient,
  also_provides_sober_living,
  awake_staff_24_7,
  case_management_services,
  chores_required,
  cip_certified,
  detox_available,
  detox_only_services,
  faith_based_services,
  has_valid_passport,
  hourly_coaching_sessions,
  house_meetings_per_week,
  in_person_companion_work,
  job_assistance_provided,
  lgbt_supportive,
  license_current_good_standing,
  mandatory_curfew,
  mandatory_house_meetings,
  military_first_responder_care,
  parent_submission_id,
  residents_expected_to_work,
  sliding_scale_available,
  submitted_by,
  substance_use_disorder_experience,
  telehealth_available,
  total_treatment_beds,
  travel_expenses_included,
  works_internationally,
  works_nationally,
  year_started,
  gender_specific_treatment,
  hourly_coaching_rate,
  insurances_accepted,
  intervention_modalities,
  items_included_in_cost,
  languages_spoken,
  legal_assistance_types,
  length_of_services,
  category,
  provider_name,
  description_of_services,
  city,
  state,
  zip_code,
  address,
  website,
  logo_url,
  status,
  email,
  phone_number,
  facebook_url,
  instagram_url,
  tiktok_url,
  youtube_url,
  medication_administration,
  minimum_time_since_last_use,
  recovery_fellowships,
  required_meetings_per_week,
  co_occurring_diagnoses,
  cost,
  curfew_time,
  daily_companion_fee,
  therapeutic_modalities
FROM public.provider_submissions
WHERE status = 'approved';

-- Grant SELECT to anon and authenticated roles for public provider searches
GRANT SELECT ON public.provider_submissions_public TO anon;
GRANT SELECT ON public.provider_submissions_public TO authenticated;