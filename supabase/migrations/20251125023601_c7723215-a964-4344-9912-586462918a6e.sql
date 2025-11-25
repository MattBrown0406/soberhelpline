-- Add column for therapeutic modalities
ALTER TABLE public.provider_submissions 
ADD COLUMN therapeutic_modalities text[] DEFAULT NULL;

COMMENT ON COLUMN public.provider_submissions.therapeutic_modalities IS 'List of therapeutic modalities offered by the provider';