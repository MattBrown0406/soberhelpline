-- Add column for co-occurring diagnoses
ALTER TABLE public.provider_submissions 
ADD COLUMN co_occurring_diagnoses text[] DEFAULT NULL;

COMMENT ON COLUMN public.provider_submissions.co_occurring_diagnoses IS 'List of co-occurring diagnoses the provider can treat';