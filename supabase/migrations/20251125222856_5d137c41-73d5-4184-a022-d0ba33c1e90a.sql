-- Add fields for national/international work and languages spoken
ALTER TABLE public.provider_submissions
ADD COLUMN IF NOT EXISTS works_nationally boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS works_internationally boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS languages_spoken text[] DEFAULT NULL;