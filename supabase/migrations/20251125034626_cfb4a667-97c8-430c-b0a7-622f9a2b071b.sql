-- Add house meetings fields for sober living providers
ALTER TABLE provider_submissions ADD COLUMN mandatory_house_meetings boolean DEFAULT false;
ALTER TABLE provider_submissions ADD COLUMN house_meetings_per_week integer;