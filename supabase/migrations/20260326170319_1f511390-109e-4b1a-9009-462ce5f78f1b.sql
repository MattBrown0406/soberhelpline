DROP POLICY "Block anon select testimonials" ON public.testimonials;
DROP POLICY "Block anon insert testimonials" ON public.testimonials;

CREATE POLICY "Block anon select testimonials" ON public.testimonials
  FOR SELECT TO anon USING (false);

CREATE POLICY "Block anon insert testimonials" ON public.testimonials
  FOR INSERT TO anon WITH CHECK (false);