-- Add adolescent services field to provider_submissions table
ALTER TABLE provider_submissions
ADD COLUMN adolescent_services boolean DEFAULT false;