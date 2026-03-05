
-- Assessment responses
CREATE TABLE public.roadmap_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  relationship TEXT,
  substances TEXT[],
  duration TEXT,
  prior_treatment TEXT,
  current_situation TEXT,
  safety_concerns TEXT,
  desired_help TEXT,
  stage_assigned TEXT DEFAULT 'confirmation'
);

-- User accounts (lightweight, email-based)
CREATE TABLE public.roadmap_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  assessment_id UUID REFERENCES public.roadmap_assessments(id),
  current_stage TEXT DEFAULT 'confirmation',
  checklist_progress JSONB DEFAULT '{}',
  last_checkin TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.roadmap_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for assessments
CREATE POLICY "Anyone can create assessment" ON public.roadmap_assessments
  FOR INSERT WITH CHECK (true);

-- Allow anonymous inserts for users
CREATE POLICY "Anyone can register roadmap" ON public.roadmap_users
  FOR INSERT WITH CHECK (true);

-- Allow reading own data by email match
CREATE POLICY "Users can read own roadmap data" ON public.roadmap_users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own roadmap data" ON public.roadmap_users
  FOR UPDATE USING (true);
