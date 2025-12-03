-- Add columns to track additional services provided under the same name
ALTER TABLE public.provider_submissions 
ADD COLUMN IF NOT EXISTS also_provides_outpatient boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS also_provides_sober_living boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS parent_submission_id uuid REFERENCES public.provider_submissions(id) ON DELETE CASCADE;