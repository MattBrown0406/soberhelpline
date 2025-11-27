-- Add sliding scale availability field to provider submissions
ALTER TABLE provider_submissions 
ADD COLUMN sliding_scale_available boolean DEFAULT false;