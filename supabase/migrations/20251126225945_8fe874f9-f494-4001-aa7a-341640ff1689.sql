-- Add telehealth_available column to provider_submissions table
ALTER TABLE public.provider_submissions 
ADD COLUMN telehealth_available boolean DEFAULT false;