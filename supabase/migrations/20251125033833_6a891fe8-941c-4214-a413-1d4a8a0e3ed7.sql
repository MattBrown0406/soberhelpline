-- Add minimum time since last use field for sober living providers
ALTER TABLE provider_submissions ADD COLUMN minimum_time_since_last_use text;