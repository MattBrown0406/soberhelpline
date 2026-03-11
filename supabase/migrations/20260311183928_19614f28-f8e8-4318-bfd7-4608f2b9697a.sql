
-- Table for pending free membership invitations (for users who don't have an account yet)
CREATE TABLE public.pending_free_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  UNIQUE(email)
);

-- RLS: only admins can manage
ALTER TABLE public.pending_free_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage pending free memberships"
  ON public.pending_free_memberships
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Function to auto-grant free membership when a pending invitation exists
CREATE OR REPLACE FUNCTION public.check_pending_free_membership()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  pending_email TEXT;
  pending_record RECORD;
BEGIN
  -- Get the email from the new user
  pending_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');
  
  IF pending_email IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check for pending free membership
  SELECT * INTO pending_record
  FROM public.pending_free_memberships
  WHERE email = LOWER(pending_email)
    AND status = 'pending'
  FOR UPDATE;

  IF FOUND THEN
    -- Grant the free membership
    INSERT INTO public.provider_subscriptions (
      user_id, provider_submission_id, plan_type, status, amount, start_date, paypal_subscription_id
    ) VALUES (
      NEW.id, NULL, 'free', 'active', 0, now(), NULL
    );

    -- Mark the pending invitation as claimed
    UPDATE public.pending_free_memberships
    SET status = 'claimed', claimed_at = now()
    WHERE id = pending_record.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger on auth.users to check for pending invitations after user creation
CREATE TRIGGER on_auth_user_created_check_free_membership
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_pending_free_membership();
