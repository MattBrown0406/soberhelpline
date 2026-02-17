
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_initial TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  experience TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved testimonials
CREATE POLICY "Anyone can view approved testimonials"
ON public.testimonials FOR SELECT
USING (is_approved = true);

-- Admins can view all testimonials
CREATE POLICY "Admins can view all testimonials"
ON public.testimonials FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can submit testimonials
CREATE POLICY "Users can submit testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own testimonials
CREATE POLICY "Users can update own testimonials"
ON public.testimonials FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can update any testimonial (for approval)
CREATE POLICY "Admins can update testimonials"
ON public.testimonials FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Block anonymous access
CREATE POLICY "Block anon insert testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block anon select testimonials"
ON public.testimonials FOR SELECT
USING (false);

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
