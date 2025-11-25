-- Add curfew fields for sober living providers
ALTER TABLE provider_submissions ADD COLUMN mandatory_curfew boolean DEFAULT false;
ALTER TABLE provider_submissions ADD COLUMN curfew_time text;