-- consultation_providers: public can view active, authenticated can insert/update own
GRANT SELECT ON TABLE public.consultation_providers TO anon, authenticated;
GRANT INSERT, UPDATE ON TABLE public.consultation_providers TO authenticated;

-- provider_availability: public can view active, authenticated can manage own
GRANT SELECT ON TABLE public.provider_availability TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.provider_availability TO authenticated;

-- provider_date_overrides: authenticated can view active provider overrides, manage own
GRANT SELECT ON TABLE public.provider_date_overrides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.provider_date_overrides TO authenticated;

-- consultation_bookings: authenticated can view own, create own
GRANT SELECT, INSERT, UPDATE ON TABLE public.consultation_bookings TO authenticated;

-- consultation_payouts: authenticated can view own
GRANT SELECT ON TABLE public.consultation_payouts TO authenticated;

-- coaching_plans: authenticated can view
GRANT SELECT ON TABLE public.coaching_plans TO authenticated;