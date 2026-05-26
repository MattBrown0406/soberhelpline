
-- Restrict UPDATE/DELETE on provider-logos storage bucket to the uploader (owner)
CREATE POLICY "Owners can update their provider logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'provider-logos' AND owner = auth.uid())
WITH CHECK (bucket_id = 'provider-logos' AND owner = auth.uid());

CREATE POLICY "Owners can delete their provider logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'provider-logos' AND owner = auth.uid());

-- Admins retain full management of provider logos
CREATE POLICY "Admins can manage provider logos"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'provider-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'provider-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
