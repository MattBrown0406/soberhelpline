-- Stop public scraping of provider contact info by removing public SELECT from base table
-- and exposing ONLY a sanitized public view.

-- 1) Base table: no public access
ALTER TABLE public.provider_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_submissions FORCE ROW LEVEL SECURITY;

-- Remove the anonymous approved-policy (public should use the sanitized view instead)
DROP POLICY IF EXISTS "Anonymous can view approved submissions" ON public.provider_submissions;

-- Ensure anon/public cannot read the base table at all
REVOKE ALL ON TABLE public.provider_submissions FROM anon;
REVOKE ALL ON TABLE public.provider_submissions FROM public;

-- Authenticated users need privileges (RLS still applies)
GRANT SELECT, INSERT, UPDATE ON TABLE public.provider_submissions TO authenticated;

-- Allow providers to view their own submissions
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.provider_submissions;
CREATE POLICY "Users can view their own submissions"
ON public.provider_submissions
FOR SELECT
TO authenticated
USING (auth.uid() = submitted_by);

-- 2) Public view: sanitized fields, invoker security
DROP VIEW IF EXISTS public.provider_submissions_public;

CREATE VIEW public.provider_submissions_public
WITH (security_invoker = true, security_barrier = true) AS
SELECT
  ps.id,
  ps.category,
  ps.provider_name,
  ps.description_of_services,
  ps.city,
  ps.state,
  ps.zip_code,
  ps.address,
  ps.website,
  ps.logo_url,
  ps.status,
  ps.created_at,
  ps.updated_at,

  -- Keep social links if you want them public
  ps.facebook_url,
  ps.instagram_url,
  ps.tiktok_url,
  ps.youtube_url,

  -- Keep all other non-contact fields used for filters/cards
  ps.accepts_mat_residents,
  ps.adolescent_services,
  ps.also_provides_outpatient,
  ps.also_provides_sober_living,
  ps.awake_staff_24_7,
  ps.case_management_services,
  ps.chores_required,
  ps.cip_certified,
  ps.co_occurring_diagnoses,
  ps.cost,
  ps.curfew_time,
  ps.daily_companion_fee,
  ps.detox_available,
  ps.detox_only_services,
  ps.faith_based_services,
  ps.gender_specific_treatment,
  ps.has_valid_passport,
  ps.hourly_coaching_rate,
  ps.hourly_coaching_sessions,
  ps.house_meetings_per_week,
  ps.in_person_companion_work,
  ps.insurances_accepted,
  ps.intervention_modalities,
  ps.items_included_in_cost,
  ps.job_assistance_provided,
  ps.languages_spoken,
  ps.legal_assistance_types,
  ps.length_of_services,
  ps.lgbt_supportive,
  ps.license_current_good_standing,
  ps.mandatory_curfew,
  ps.mandatory_house_meetings,
  ps.medication_administration,
  ps.military_first_responder_care,
  ps.minimum_time_since_last_use,
  ps.parent_submission_id,
  ps.recovery_fellowships,
  ps.required_meetings_per_week,
  ps.residents_expected_to_work,
  ps.sliding_scale_available,
  ps.submitted_by,
  ps.substance_use_disorder_experience,
  ps.telehealth_available,
  ps.total_treatment_beds,
  ps.travel_expenses_included,
  ps.works_internationally,
  ps.works_nationally,
  ps.year_started,

  -- Sensitive contact info: always NULL in the public view
  NULL::text AS email,
  NULL::text AS phone_number
FROM public.provider_submissions ps
WHERE ps.status = 'approved';

-- Make the public view readable
REVOKE ALL ON TABLE public.provider_submissions_public FROM anon;
REVOKE ALL ON TABLE public.provider_submissions_public FROM public;
GRANT SELECT ON TABLE public.provider_submissions_public TO anon;
GRANT SELECT ON TABLE public.provider_submissions_public TO authenticated;
