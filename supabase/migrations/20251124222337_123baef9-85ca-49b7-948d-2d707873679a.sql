-- Make address column nullable since we're replacing it with city and state
ALTER TABLE public.provider_submissions
ALTER COLUMN address DROP NOT NULL;