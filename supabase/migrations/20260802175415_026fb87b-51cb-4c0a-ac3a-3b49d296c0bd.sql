CREATE TABLE public.app_membership_sync_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  app_account_id TEXT,
  tier TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  reason TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'open',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX app_membership_sync_issues_unique_open
  ON public.app_membership_sync_issues (COALESCE(app_account_id, ''), COALESCE(email, ''), reason)
  WHERE status = 'open';

GRANT SELECT, UPDATE, DELETE ON public.app_membership_sync_issues TO authenticated;
GRANT ALL ON public.app_membership_sync_issues TO service_role;

ALTER TABLE public.app_membership_sync_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view app membership sync issues"
  ON public.app_membership_sync_issues FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update app membership sync issues"
  ON public.app_membership_sync_issues FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete app membership sync issues"
  ON public.app_membership_sync_issues FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_app_membership_sync_issues_updated_at
  BEFORE UPDATE ON public.app_membership_sync_issues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.provider_subscriptions
  ADD COLUMN IF NOT EXISTS app_grace_until TIMESTAMP WITH TIME ZONE;