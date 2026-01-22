-- Add explicit blocking policy for anonymous access to journal_entries
-- This ensures even if other policies are misconfigured, anonymous users cannot access journals

CREATE POLICY "Block anonymous access to journal entries"
ON public.journal_entries
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Add comment explaining security design
COMMENT ON TABLE public.journal_entries IS 'Private user journal entries. RLS enforces that only the owning user can access their own entries. The is_private flag is for potential future sharing features but currently all entries are private to the owner.';