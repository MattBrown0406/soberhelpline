-- Add timezone column to consultation_providers
ALTER TABLE public.consultation_providers 
ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'America/Los_Angeles';
