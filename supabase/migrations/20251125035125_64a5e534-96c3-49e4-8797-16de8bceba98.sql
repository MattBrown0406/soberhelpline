-- Add substance use disorder experience field for therapists and psychiatrists
ALTER TABLE provider_submissions ADD COLUMN substance_use_disorder_experience boolean DEFAULT false;