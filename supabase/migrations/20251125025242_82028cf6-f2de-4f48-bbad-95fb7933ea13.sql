-- Add column for intervention modalities
ALTER TABLE public.provider_submissions 
ADD COLUMN intervention_modalities text[] DEFAULT NULL;

COMMENT ON COLUMN public.provider_submissions.intervention_modalities IS 'List of intervention modalities the interventionist is trained in';