-- Add employment fields for sober living providers
ALTER TABLE provider_submissions ADD COLUMN residents_expected_to_work boolean DEFAULT false;
ALTER TABLE provider_submissions ADD COLUMN job_assistance_provided boolean DEFAULT false;