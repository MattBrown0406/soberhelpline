-- Add columns for sober companion work
ALTER TABLE public.provider_submissions 
ADD COLUMN in_person_companion_work boolean DEFAULT NULL,
ADD COLUMN has_valid_passport boolean DEFAULT NULL;

COMMENT ON COLUMN public.provider_submissions.in_person_companion_work IS 'Whether the sober coach/companion does in-person work';
COMMENT ON COLUMN public.provider_submissions.has_valid_passport IS 'Whether the sober coach/companion has a valid passport';