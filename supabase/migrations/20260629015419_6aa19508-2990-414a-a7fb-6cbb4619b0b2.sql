
CREATE TABLE public.provider_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  provider_id uuid NULL,
  provider_name text,
  requester_name text,
  relationship text,
  phone text,
  email text,
  best_time text,
  note text,
  status text NOT NULL DEFAULT 'new'
);

GRANT ALL ON public.provider_inquiries TO service_role;
GRANT SELECT ON public.provider_inquiries TO authenticated;

ALTER TABLE public.provider_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view provider inquiries"
  ON public.provider_inquiries
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update provider inquiries"
  ON public.provider_inquiries
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
