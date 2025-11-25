-- Add awake staff 24/7 field for sober living providers
ALTER TABLE provider_submissions ADD COLUMN awake_staff_24_7 boolean DEFAULT false;