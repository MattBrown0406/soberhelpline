
-- Surveys table: each monthly survey
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Survey questions
CREATE TABLE public.survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'rating' CHECK (question_type IN ('rating', 'text', 'multiple_choice')),
  options JSONB,
  is_standard BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Survey responses (anonymous)
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Surveys: anyone can read active surveys, admins can CRUD
CREATE POLICY "Anyone can view active surveys"
  ON public.surveys FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage surveys"
  ON public.surveys FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Questions: anyone can read questions for active surveys, admins can CRUD
CREATE POLICY "Anyone can view questions for active surveys"
  ON public.survey_questions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.surveys WHERE id = survey_id AND is_active = true));

CREATE POLICY "Admins can manage survey questions"
  ON public.survey_questions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Responses: anyone can insert (anonymous), only admins can read
CREATE POLICY "Anyone can submit survey responses"
  ON public.survey_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view survey responses"
  ON public.survey_responses FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger for updated_at on surveys
CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON public.surveys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant anon insert on responses for anonymous submissions
GRANT INSERT ON public.survey_responses TO anon;
GRANT SELECT ON public.surveys TO anon;
GRANT SELECT ON public.survey_questions TO anon;
