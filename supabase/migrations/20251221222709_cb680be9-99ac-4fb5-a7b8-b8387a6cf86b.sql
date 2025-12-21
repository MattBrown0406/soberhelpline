-- Lock down profile_private table at privilege level
REVOKE ALL ON public.profile_private FROM anon;
REVOKE ALL ON public.profile_private FROM public;

-- Ensure only authenticated users can access through RLS policies
GRANT SELECT, INSERT, UPDATE ON public.profile_private TO authenticated;