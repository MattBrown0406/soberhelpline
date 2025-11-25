-- Add chores requirement field for sober living providers
ALTER TABLE provider_submissions ADD COLUMN chores_required boolean DEFAULT false;