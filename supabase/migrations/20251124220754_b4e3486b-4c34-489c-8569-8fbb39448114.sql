-- Add description_of_services column to provider_submissions table
ALTER TABLE public.provider_submissions
ADD COLUMN description_of_services text;