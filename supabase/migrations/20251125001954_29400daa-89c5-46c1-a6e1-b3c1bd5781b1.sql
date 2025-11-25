-- Add new columns for gender-specific and LGBT supportive treatment
ALTER TABLE provider_submissions 
ADD COLUMN gender_specific_treatment text[] DEFAULT NULL,
ADD COLUMN lgbt_supportive boolean DEFAULT false;