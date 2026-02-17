
ALTER TABLE public.provider_submissions DROP CONSTRAINT provider_submissions_status_check;
ALTER TABLE public.provider_submissions ADD CONSTRAINT provider_submissions_status_check CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'draft'::text]));
