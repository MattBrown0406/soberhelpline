CREATE OR REPLACE FUNCTION public.auto_approve_high_rating_testimonials()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.rating >= 4 THEN
    NEW.is_approved := true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_approve_testimonials
  BEFORE INSERT ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_approve_high_rating_testimonials();