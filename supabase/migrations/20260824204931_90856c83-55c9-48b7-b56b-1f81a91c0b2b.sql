-- coaching_checkout_orders is written and read exclusively by trusted edge functions
-- (PayPal order lifecycle). It has FORCE RLS with no policies, so client roles are
-- already default-denied; remove the leftover table grants as defense in depth.
REVOKE ALL ON TABLE public.coaching_checkout_orders FROM authenticated;
REVOKE ALL ON TABLE public.coaching_checkout_orders FROM anon;
GRANT ALL ON TABLE public.coaching_checkout_orders TO service_role;