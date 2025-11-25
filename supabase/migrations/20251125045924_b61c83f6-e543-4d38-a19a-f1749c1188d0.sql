-- Add cip_certified column for Interventionists
ALTER TABLE provider_submissions 
ADD COLUMN cip_certified boolean DEFAULT false;