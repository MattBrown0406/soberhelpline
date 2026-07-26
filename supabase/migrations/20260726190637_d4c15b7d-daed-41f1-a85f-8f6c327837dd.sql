
-- 1) Remove private_messages from realtime publication to prevent any broadcast risk.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'private_messages'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.private_messages';
  END IF;
END $$;

-- 2) Tighten provider_submissions self-service update policies with explicit target-status whitelist.
DROP POLICY IF EXISTS "Users can update their own draft submissions" ON public.provider_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.provider_submissions;

CREATE POLICY "Users can update their own submissions"
  ON public.provider_submissions
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = submitted_by
    AND (
      status = ANY (ARRAY['draft'::text, 'pending'::text])
      OR public.has_active_provider_subscription(auth.uid(), id)
    )
  )
  WITH CHECK (
    auth.uid() = submitted_by
    AND (
      -- Draft owners may keep it as draft or submit for review.
      status = ANY (ARRAY['draft'::text, 'pending'::text])
      -- Active subscribers editing their approved listing must keep status = 'approved'.
      OR (public.has_active_provider_subscription(auth.uid(), id) AND status = 'approved'::text)
    )
  );

-- The enforce_provider_submission_status_transition trigger continues to block any
-- non-admin transition other than draft -> pending, providing defense in depth.

-- 3) Explicit public SELECT policy for the provider-logos storage bucket.
DROP POLICY IF EXISTS "Public can view provider logos" ON storage.objects;
CREATE POLICY "Public can view provider logos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'provider-logos');
