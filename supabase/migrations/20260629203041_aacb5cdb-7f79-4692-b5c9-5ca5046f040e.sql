
-- 1) provider_submissions: stop exposing email/phone publicly via the table.
-- Switch the public view to SECURITY DEFINER so it returns only the safe column subset,
-- then drop the permissive table-level SELECT for anon/authenticated.
ALTER VIEW public.provider_submissions_public SET (security_invoker = false);
GRANT SELECT ON public.provider_submissions_public TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view approved providers" ON public.provider_submissions;

-- 2) provider_inquiries: keep anon submissions but constrain payload to prevent abuse
DROP POLICY IF EXISTS "Anyone can submit a provider inquiry" ON public.provider_inquiries;
DROP POLICY IF EXISTS "Public can insert provider inquiries" ON public.provider_inquiries;

CREATE POLICY "Public can submit provider inquiries"
ON public.provider_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(coalesce(requester_name, '')) BETWEEN 1 AND 200
  AND char_length(coalesce(relationship, '')) BETWEEN 1 AND 100
  AND char_length(coalesce(provider_name, '')) BETWEEN 1 AND 200
  AND char_length(coalesce(best_time, '')) BETWEEN 1 AND 200
  AND char_length(coalesce(note, '')) <= 2000
  AND char_length(coalesce(phone, '')) <= 40
  AND char_length(coalesce(email, '')) <= 254
  AND (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  AND status = 'new'
);

-- 3) roadmap_assessments: add session_token ownership and restrict inserts
ALTER TABLE public.roadmap_assessments
  ADD COLUMN IF NOT EXISTS session_token uuid,
  ADD COLUMN IF NOT EXISTS user_id uuid;

DROP POLICY IF EXISTS "Anyone can create assessment" ON public.roadmap_assessments;

CREATE POLICY "Anyone can create assessment with session token"
ON public.roadmap_assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_token IS NOT NULL
  AND (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  )
);

CREATE POLICY "Users can view their own assessments"
ON public.roadmap_assessments
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can delete their own assessments"
ON public.roadmap_assessments
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
