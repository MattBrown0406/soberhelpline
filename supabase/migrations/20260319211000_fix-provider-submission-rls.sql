-- Fix: Provider application form errors on submit
--
-- BUG: The SELECT policy on provider_submissions required an active
-- provider_subscription to read your own row. When a new provider submits
-- the application form, the code does .insert().select('id').single().
-- The INSERT succeeds but the chained SELECT returns 0 rows (no subscription
-- exists yet → RLS blocks it) → .single() throws PGRST116 → user sees an error.
--
-- FIX:
--   1. Allow users to SELECT their own submissions freely (regardless of sub).
--   2. Allow UPDATE on draft/pending submissions freely; still require active
--      subscription to edit approved listings.

-- 1. SELECT: drop the subscription-gated policy, replace with simple ownership check
DROP POLICY IF EXISTS "Users can view their own active submissions" ON public.provider_submissions;

CREATE POLICY "Users can view their own submissions"
ON public.provider_submissions
FOR SELECT
TO authenticated
USING (auth.uid() = submitted_by);

-- 2. UPDATE: allow editing draft/pending submissions without a subscription;
--    keep the subscription requirement only for approved listings
DROP POLICY IF EXISTS "Users can update their own active submissions" ON public.provider_submissions;

CREATE POLICY "Users can update their own submissions"
ON public.provider_submissions
FOR UPDATE
TO authenticated
USING (
  auth.uid() = submitted_by
  AND (
    status IN ('draft', 'pending')
    OR public.has_active_provider_subscription(auth.uid(), id)
  )
)
WITH CHECK (
  auth.uid() = submitted_by
  AND (
    status IN ('draft', 'pending')
    OR public.has_active_provider_subscription(auth.uid(), id)
  )
);
