-- Drop the existing problematic policies on provider_subscriptions
DROP POLICY IF EXISTS "Block anonymous access" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.provider_subscriptions;
DROP POLICY IF EXISTS "Admins can update all subscriptions" ON public.provider_subscriptions;

-- Ensure RLS is enabled
ALTER TABLE public.provider_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create proper PERMISSIVE policies that require authentication
-- Users can view their own subscriptions (must be authenticated)
CREATE POLICY "Users can view their own subscriptions"
ON public.provider_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own subscriptions (must be authenticated)
CREATE POLICY "Users can insert their own subscriptions"
ON public.provider_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions (must be authenticated)
CREATE POLICY "Users can update their own subscriptions"
ON public.provider_subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.provider_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can update all subscriptions
CREATE POLICY "Admins can update all subscriptions"
ON public.provider_subscriptions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));