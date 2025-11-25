-- Add column for daily companion fee
ALTER TABLE public.provider_submissions 
ADD COLUMN daily_companion_fee text DEFAULT NULL;

COMMENT ON COLUMN public.provider_submissions.daily_companion_fee IS 'Daily fee for in-person sober companion work';