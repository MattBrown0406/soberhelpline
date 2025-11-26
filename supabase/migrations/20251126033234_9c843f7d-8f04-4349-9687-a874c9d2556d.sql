-- Add social media URL columns to provider_submissions table
ALTER TABLE public.provider_submissions
ADD COLUMN youtube_url text NULL,
ADD COLUMN tiktok_url text NULL,
ADD COLUMN instagram_url text NULL,
ADD COLUMN facebook_url text NULL;