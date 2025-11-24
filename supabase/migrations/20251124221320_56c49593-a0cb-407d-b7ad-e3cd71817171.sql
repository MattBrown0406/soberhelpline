-- Create GIN index on insurances_accepted for efficient array searching
CREATE INDEX idx_provider_submissions_insurances_accepted 
ON public.provider_submissions USING GIN (insurances_accepted);