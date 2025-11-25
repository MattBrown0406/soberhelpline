-- Add license verification field
ALTER TABLE provider_submissions 
ADD COLUMN license_current_good_standing boolean DEFAULT NULL;