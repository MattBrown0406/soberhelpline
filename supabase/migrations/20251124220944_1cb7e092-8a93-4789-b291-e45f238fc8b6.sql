-- Add logo_url column to provider_submissions table
ALTER TABLE public.provider_submissions
ADD COLUMN logo_url text;

-- Create storage bucket for provider logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-logos', 'provider-logos', true);

-- Allow anyone to upload logos (INSERT)
CREATE POLICY "Anyone can upload provider logos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'provider-logos');

-- Allow public read access to logos (SELECT)
CREATE POLICY "Public read access to provider logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'provider-logos');