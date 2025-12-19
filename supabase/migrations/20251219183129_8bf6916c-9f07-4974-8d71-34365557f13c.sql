-- Create a public-safe provider submissions view that masks email/phone for unauthenticated users
-- Then remove anonymous/public access from the base table so scrapers cannot harvest contact info.

-- 1) Lock down base table grants (RLS remains for admin/providers/owners)
REVOKE ALL ON TABLE public.provider_submissions FROM anon;
REVOKE ALL ON TABLE public.provider_submissions FROM public;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.provider_submissions TO authenticated;

-- 2) Replace any public SELECT policy on the base table
DROP POLICY IF EXISTS "Anyone can view approved provider submissions" ON public.provider_submissions;

-- 3) Create/replace public view with masked contact fields
DROP VIEW IF EXISTS public.provider_submissions_public;

CREATE VIEW public.provider_submissions_public AS
SELECT
  ps.accepts_mat_residents,
  ps.address,
  ps.adolescent_services,
  ps.also_provides_outpatient,
  ps.also_provides_sober_living,
  ps.awake_staff_24_7,
  ps.case_management_services,
  ps.category,
  ps.chores_required,
  ps.cip_certified,
  ps.city,
  ps.co_occurring_diagnoses,
  ps.cost,
  ps.created_at,
  ps.curfew_time,
  ps.daily_companion_fee,
  ps.description_of_services,
  ps.detox_available,
  ps.detox_only_services,
  NULL::text AS email,
  ps.facebook_url,
  ps.faith_based_services,
  ps.gender_specific_treatment,
  ps.has_valid_passport,
  ps.hourly_coaching_rate,
  ps.hourly_coaching_sessions,
  ps.house_meetings_per_week,
  ps.id,
  ps.in_person_companion_work,
  ps.instagram_url,
  ps.insurances_accepted,
  ps.intervention_modalities,
  ps.items_included_in_cost,
  ps.job_assistance_provided,
  ps.languages_spoken,
  ps.legal_assistance_types,
  ps.length_of_services,
  ps.lgbt_supportive,
  ps.license_current_good_standing,
  ps.logo_url,
  ps.mandatory_curfew,
  ps.mandatory_house_meetings,
  ps.medication_administration,
  ps.military_first_responder_care,
  ps.minimum_time_since_last_use,
  ps.parent_submission_id,
  NULL::text AS phone_number,
  ps.provider_name,
  ps.recovery_fellowships,
  ps.required_meetings_per_week,
  ps.residents_expected_to_work,
  ps.sliding_scale_available,
  ps.state,
  ps.status,
  ps.submitted_by,
  ps.substance_use_disorder_experience,
  ps.telehealth_available,
  ps.therapeutic_modalities,
  ps.tiktok_url,
  ps.total_treatment_beds,
  ps.travel_expenses_included,
  ps.updated_at,
  ps.website,
  ps.works_internationally,
  ps.works_nationally,
  ps.year_started,
  ps.youtube_url,
  ps.zip_code
FROM public.provider_submissions ps
WHERE ps.status = 'approved';

-- 4) Allow everyone to read the public view
REVOKE ALL ON TABLE public.provider_submissions_public FROM anon;
REVOKE ALL ON TABLE public.provider_submissions_public FROM public;
GRANT SELECT ON TABLE public.provider_submissions_public TO anon;
GRANT SELECT ON TABLE public.provider_submissions_public TO authenticated;