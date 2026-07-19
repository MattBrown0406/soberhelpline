
-- Allow public (anon) read of active provider scheduling info so the public
-- booking page can list available dates. These tables contain only scheduling
-- windows (day/time), not PII.

DROP POLICY IF EXISTS "View active provider availability" ON public.provider_availability;
DROP POLICY IF EXISTS "Block anon select availability" ON public.provider_availability;

CREATE POLICY "Public can view active provider availability"
  ON public.provider_availability
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.consultation_providers cp
      WHERE cp.id = provider_availability.provider_id
        AND cp.status = 'active'
    )
  );

GRANT SELECT ON public.provider_availability TO anon, authenticated;

DROP POLICY IF EXISTS "View active provider date overrides" ON public.provider_date_overrides;
DROP POLICY IF EXISTS "Block anon select date overrides" ON public.provider_date_overrides;

CREATE POLICY "Public can view active provider date overrides"
  ON public.provider_date_overrides
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.consultation_providers cp
      WHERE cp.id = provider_date_overrides.provider_id
        AND cp.status = 'active'
    )
  );

GRANT SELECT ON public.provider_date_overrides TO anon, authenticated;
