-- Stores auto-saved worksheet responses as JSONB (one row per user per worksheet).
-- Using upsert on (user_id, worksheet_key) so saves are idempotent.

CREATE TABLE public.worksheet_responses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worksheet_key TEXT       NOT NULL,
  responses    JSONB       NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, worksheet_key)
);

ALTER TABLE public.worksheet_responses ENABLE ROW LEVEL SECURITY;

-- Members read and write only their own rows
CREATE POLICY "users manage own worksheet responses"
  ON public.worksheet_responses FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
