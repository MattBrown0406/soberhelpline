-- Add hourly coaching sessions field for interventionists
ALTER TABLE provider_submissions ADD COLUMN hourly_coaching_sessions boolean DEFAULT false;