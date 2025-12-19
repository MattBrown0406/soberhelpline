-- Fix linter: avoid SECURITY DEFINER view by using SECURITY INVOKER + column-level privileges

-- 1) Recreate public view as security_invoker so it uses querying user's privileges/RLS
DROP VIEW IF EXISTS public.provider_submissions_public;

CREATE VIEW public.provider_submissions_public
WITH (security_invoker = true)
AS
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

-- 2) Ensure anon can SELECT approved submissions but cannot read email/phone_number columns
GRANT SELECT ON TABLE public.provider_submissions TO anon;
REVOKE SELECT (email, phone_number) ON TABLE public.provider_submissions FROM anon;

-- Re-add a public/anon RLS policy for approved submissions (no contact columns due to column privileges)
DROP POLICY IF EXISTS "Anonymous can view approved submissions" ON public.provider_submissions;
CREATE POLICY "Anonymous can view approved submissions"
ON public.provider_submissions
FOR SELECT
TO anon
USING (status = 'approved'::text);

-- 3) Keep public view readable
REVOKE ALL ON TABLE public.provider_submissions_public FROM public;
GRANT SELECT ON TABLE public.provider_submissions_public TO anon;
GRANT SELECT ON TABLE public.provider_submissions_public TO authenticated;