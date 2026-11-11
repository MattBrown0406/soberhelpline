# Workstream D: My Workbook (guided exercises)

## What ships

- `/workbook` (My Workbook: every exercise as a card + saved results, newest first,
  with compare and delete) and `/workbook/:exerciseId` (one question per screen,
  about five minutes, ends in a result the member keeps).
- Eight exercises defined as data in `src/data/exercises/` (ids, titles, minutes and
  summaries come from `supabase/functions/_shared/memberExercises.json`, now version 2
  with a `summary` field; ids unchanged).
- `src/components/workbook/ExerciseGrid.tsx` (default export, optional `limit`) for
  `/family-education` and `/member-home`.
- Results are stored in a new table, `public.workbook_entries`. Finishing an exercise
  also records `education_progress` (`resource_path = /workbook/<id>`,
  `resource_type = worksheet`).

## Database

Run `docs/_parts/workbook.sql` once (idempotent). It creates `workbook_entries`, its
index, three guard constraints and four RLS policies (own rows select/insert/delete,
admin select). No order dependency on the other parts.

## Edge functions / secrets

None.

## Order

1. Apply `workbook.sql`.
2. Publish the site. (If the site is published before the SQL, the exercises still work
   and show the result, but saving says "We couldn't save this to My Workbook just
   now"; the answers stay on the device and "Try saving again" works once the table exists.)

## Read-only checks (after applying)

```sql
-- 1. Table, columns and defaults
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'workbook_entries'
order by ordinal_position;
-- expect: id uuid NO gen_random_uuid(); user_id uuid NO; exercise_id text NO;
--         answers jsonb NO '{}'; output jsonb NO '{}'; score integer YES; completed_at timestamptz NO now()

-- 2. RLS is on, and the four policies exist
select relrowsecurity from pg_class where oid = 'public.workbook_entries'::regclass;  -- true
select policyname, cmd from pg_policies
where schemaname = 'public' and tablename = 'workbook_entries' order by policyname;
-- expect: Admins read all workbook entries (SELECT), Members add own (INSERT),
--         Members delete own (DELETE), Members read own (SELECT). No UPDATE policy.

-- 3. Index
select indexname, indexdef from pg_indexes
where schemaname = 'public' and tablename = 'workbook_entries';
-- expect workbook_entries_user_exercise_completed_idx on (user_id, exercise_id, completed_at DESC)

-- 4. Guard constraints
select conname from pg_constraint
where conrelid = 'public.workbook_entries'::regclass and contype = 'c' order by conname;
-- expect workbook_entries_exercise_id_format, workbook_entries_score_range, workbook_entries_size

-- 5. After a member finishes one exercise (counts only, no answers shown)
select exercise_id, count(*) as entries, max(completed_at) as latest
from public.workbook_entries group by exercise_id order by exercise_id;

-- 6. The matching progress rows
select resource_path, status, count(*)
from public.education_progress
where resource_path like '/workbook/%'
group by resource_path, status order by resource_path, status;
```

## Manual check on the site (as a member)

1. Open `/workbook`: eight cards and an empty-state invitation.
2. Start "Write one boundary you can hold", answer two questions, refresh: it offers
   "Continue where you left off" and returns to the same question.
3. Finish: the result shows Copy, Print (prints only the result), "Saved to My
   Workbook" and the retake date (30 days later).
4. Do "Nervous system check-in" twice: the second result offers "Compare with last
   time" with both scores, bands and the difference.
5. On `/workbook`, expand a saved result, compare, and delete it (with confirmation).
6. `/workbook/not-a-real-id` shows a friendly "couldn't find that exercise" page.

## Privacy notes

- In-progress answers live in the browser's localStorage under
  `workbook-draft:<user id>:<exercise id>` until the exercise is finished (then cleared)
  or the member chooses "Start over". Nothing is emailed.
- Members cannot update a saved result, only delete it.
