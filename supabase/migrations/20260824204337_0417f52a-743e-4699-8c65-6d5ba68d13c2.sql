CREATE OR REPLACE FUNCTION public.prevent_provider_subscription_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Service role (PayPal edge functions, webhooks) and admins bypass.
  IF current_user = 'service_role'
     OR session_user = 'service_role'
     OR coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role'
     OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.amount IS DISTINCT FROM OLD.amount
     OR NEW.plan_type IS DISTINCT FROM OLD.plan_type
     OR NEW.paypal_subscription_id IS DISTINCT FROM OLD.paypal_subscription_id
     OR NEW.provider_submission_id IS DISTINCT FROM OLD.provider_submission_id
     OR NEW.next_billing_date IS DISTINCT FROM OLD.next_billing_date
     OR NEW.start_date IS DISTINCT FROM OLD.start_date
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only administrators or the payment service may modify subscription status or billing fields'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;