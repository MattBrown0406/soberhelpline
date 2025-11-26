-- Add recovery_fellowships column to provider_submissions table
ALTER TABLE public.provider_submissions 
ADD COLUMN recovery_fellowships text[] DEFAULT NULL;