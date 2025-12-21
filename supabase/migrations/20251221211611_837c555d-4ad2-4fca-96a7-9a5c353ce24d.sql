-- Lock down subscription tables/views so anonymous users have zero access

-- Revoke any accidental anon/public privileges on the base table
REVOKE ALL ON TABLE public.provider_subscriptions FROM anon;
REVOKE ALL ON TABLE public.provider_subscriptions FROM public;

-- Ensure authenticated users still have the needed privileges (RLS will enforce row ownership)
GRANT SELECT, INSERT, UPDATE ON TABLE public.provider_subscriptions TO authenticated;

-- Ensure the derived view is not publicly selectable
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM anon;
REVOKE ALL ON TABLE public.provider_subscriptions_with_provider FROM public;

-- Allow authenticated reads of the view (still constrained by provider_subscriptions RLS)
GRANT SELECT ON TABLE public.provider_subscriptions_with_provider TO authenticated;
