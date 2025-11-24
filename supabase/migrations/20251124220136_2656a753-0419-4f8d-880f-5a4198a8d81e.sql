-- Add zip_code column to provider_submissions table
ALTER TABLE public.provider_submissions
ADD COLUMN zip_code text;

-- Add an index on zip_code for faster searching
CREATE INDEX idx_provider_submissions_zip_code ON public.provider_submissions(zip_code);