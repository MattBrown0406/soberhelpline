# member-core — database notes

## What to apply

- `docs/_parts/member-core.sql`: creates `public.member_learning_paths` (one row per member: the
  learning path they chose) with RLS (own row select/insert/update/delete; admins can read all).
  Idempotent.
- No edge functions to deploy. No secrets.
- No order constraints with the other parts. `member-core.sql` only needs `public.has_role` and
  `public.app_role`, which already exist.

## What the frontend relies on (already live; nothing to change)

- `education_progress` has `UNIQUE (user_id, resource_path)` and own-row SELECT / INSERT / UPDATE
  policies. The site now upserts on `(user_id, resource_path)` and, to "unmark" something, updates
  the row back to `status = 'in_progress'` (there is no DELETE policy and none is needed).
- `education_bookmarks` has `UNIQUE (user_id, resource_path)` and own-row SELECT / INSERT / DELETE
  policies (used by the "Save" button on guide pages).
- New resource paths that will start appearing in `education_progress.resource_path`:
  - `/workbook/<exerciseId>` (guided exercises, type `worksheet`, written by the workbook build),
  - `/family-education#<card id>` (the long worksheets on the Education Center, type `worksheet`),
  - `/audio/<file>.mp3` (meditations, type `meditation`).

## Read-only checks (after applying)

```sql
-- 1. Table, RLS and policies exist.
SELECT relrowsecurity FROM pg_class WHERE oid = 'public.member_learning_paths'::regclass;   -- true
SELECT policyname, cmd FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'member_learning_paths' ORDER BY policyname;     -- 5 rows

-- 2. The unique keys the site upserts on are present.
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
WHERE conrelid IN ('public.education_progress'::regclass, 'public.education_bookmarks'::regclass)
  AND contype = 'u';                                                    -- (user_id, resource_path) on both

-- 3. education_progress UPDATE policy exists (needed for "Mark complete" and "unmark").
SELECT policyname, cmd FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'education_progress';      -- includes an UPDATE policy

-- 4. After launch: how many members chose each path.
SELECT track_id, count(*) FROM public.member_learning_paths GROUP BY track_id ORDER BY 2 DESC;

-- 5. After launch: is progress moving?
SELECT resource_type, status, count(*) FROM public.education_progress
WHERE updated_at > now() - interval '7 days' GROUP BY 1, 2 ORDER BY 1, 2;
```

After applying, ask Lovable to regenerate `src/integrations/supabase/types.ts` so
`member_learning_paths` appears there; then `src/hooks/useLearningPath.ts` can switch from
`untypedSupabase` back to the typed client.
