
-- Extend meeting_blocklist to support last-name blocks
ALTER TABLE public.meeting_blocklist
  ADD COLUMN IF NOT EXISTS blocked_last_name text;

-- Allow rows that are either email-based or last-name based
ALTER TABLE public.meeting_blocklist
  ALTER COLUMN email DROP NOT NULL;

-- Helper to check if an email OR a name (we extract last token) is blocked
CREATE OR REPLACE FUNCTION public.is_meeting_blocked(_email text, _name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH name_parts AS (
    SELECT lower(trim(regexp_replace(coalesce(_name, ''), '\s+', ' ', 'g'))) AS norm
  ),
  last_token AS (
    SELECT CASE
      WHEN norm = '' THEN ''
      ELSE split_part(norm, ' ', array_length(string_to_array(norm, ' '), 1))
    END AS lname
    FROM name_parts
  )
  SELECT EXISTS (
    SELECT 1 FROM public.meeting_blocklist mb, last_token lt
    WHERE (mb.email IS NOT NULL AND lower(mb.email) = lower(coalesce(_email, '')))
       OR (mb.blocked_last_name IS NOT NULL AND lower(mb.blocked_last_name) = lt.lname AND lt.lname <> '')
  );
$$;
