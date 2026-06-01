-- Remove Katie Barr from bookable coaches (consultation_providers)
-- Her card remains in the interventionist directory (provider_submissions_public)
UPDATE consultation_providers
SET status = 'inactive'
WHERE full_name = 'Katie Barr';
