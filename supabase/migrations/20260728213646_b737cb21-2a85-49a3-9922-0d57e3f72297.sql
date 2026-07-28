-- Remove broad SELECT policy that lets anyone enumerate the provider-logos bucket.
-- Public bucket URLs still serve individual objects without RLS, so the storefront is unaffected.
DROP POLICY IF EXISTS "Public can view provider logos" ON storage.objects;

-- Allow owners and admins to still list/read their own logos (for dashboard flows).
CREATE POLICY "Owners can view their provider logos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'provider-logos'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);