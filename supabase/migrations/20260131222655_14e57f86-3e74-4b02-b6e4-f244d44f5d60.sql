-- Drop the overly general "Block anonymous access" policy and replace with explicit restrictive policies
-- This makes the security intent clearer and removes any ambiguity

-- First, drop the general policy
DROP POLICY IF EXISTS "Block anonymous access" ON public.provider_subscriptions;

-- Add explicit blocking policies for each operation type
-- These are more restrictive: they block anonymous AND enforce owner/admin checks in single policies

-- For SELECT: Only owner or admin can view
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.provider_subscriptions;

CREATE POLICY "Owner or admin can view subscriptions"
ON public.provider_subscriptions
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- For UPDATE: Only owner or admin can update
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Admins can update all subscriptions" ON public.provider_subscriptions;

CREATE POLICY "Owner or admin can update subscriptions"
ON public.provider_subscriptions
FOR UPDATE
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- For INSERT: Only owner can insert their own subscription
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.provider_subscriptions;

CREATE POLICY "Users can insert their own subscriptions"
ON public.provider_subscriptions
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Add explicit block for DELETE (no one should delete subscriptions directly)
CREATE POLICY "Block all subscription deletions"
ON public.provider_subscriptions
FOR DELETE
USING (false);