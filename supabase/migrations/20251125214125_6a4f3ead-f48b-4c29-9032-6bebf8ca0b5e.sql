-- Add detox_only_services column to provider_submissions
ALTER TABLE public.provider_submissions
ADD COLUMN detox_only_services boolean DEFAULT NULL;