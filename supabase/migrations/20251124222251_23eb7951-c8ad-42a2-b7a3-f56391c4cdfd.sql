-- Add city and state columns to provider_submissions table
ALTER TABLE public.provider_submissions
ADD COLUMN city text,
ADD COLUMN state text;

-- Create indexes for efficient searching
CREATE INDEX idx_provider_submissions_city ON public.provider_submissions(city);
CREATE INDEX idx_provider_submissions_state ON public.provider_submissions(state);