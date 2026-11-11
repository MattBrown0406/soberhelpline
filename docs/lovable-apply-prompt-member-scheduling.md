# Lovable prompt: schedules for the member emails (2026-11-11)

Steps 1 to 4 and 6 of the member-area prompt are applied. Step 5 (the
scheduled jobs) was held: Lovable creates HTTP schedules with its own managed
scheduling controls, which sign each call with a platform secret, and does not
accept hand-written cron SQL any more.

This change makes the two email functions accept that managed scheduler: each
one first calls `authenticateCronRequest` from the generated
`supabase/functions/_shared/cron-auth.ts`, and otherwise falls back to the
site's own automation credentials as before. The generated helper is not
edited.

How to use: after this is merged to `main` and Lovable has synced, paste the
section below.

---

## Prompt for Lovable

This finishes step 5 of the member-area work, using your managed HTTP
scheduling controls and no hand-written cron SQL.

After the latest sync from `main`, `send-forum-notifications` and
`send-member-weekly-note` accept your managed scheduler: each calls
`authenticateCronRequest` from `supabase/functions/_shared/cron-auth.ts` first
and falls back to the site's own automation credentials. I did not edit the
generated helper.

Please do these in order and tell me the result of each. If one fails, stop
and tell me the error.

### A. Deploy two functions from the synced code

- `send-forum-notifications`
- `send-member-weekly-note`

Please do not change or redeploy any other function.

### B. One data statement (run as SQL, not a migration; it makes no HTTP call)

Records when forum emails start, so nothing posted before now is ever emailed.
Kept if it is already set.

```sql
INSERT INTO public.site_settings (key, value)
VALUES ('forum_notifications_start_at', to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
ON CONFLICT (key) DO NOTHING;
```

### C. Three schedules, with your managed HTTP scheduling controls

Each is a POST with the JSON body `{"source": "cron"}`. Times are UTC.

| Function | Schedule | Why |
|---|---|---|
| `send-forum-notifications` | `7 * * * *` | Once an hour. One call that does nothing unless there is new forum activity. |
| `send-member-weekly-note` | `*/10 23 * * 2` | Tuesday 4 PM Pacific in summer. |
| `send-member-weekly-note` | `*/10 0-2 * * 3` | Tuesday 4 to 7 PM Pacific in winter, and the catch-up hours. |

The weekly note only sends on Tuesday between 4 and 7 PM Pacific, once per
member per week; its runs outside that window return without sending. In
total this is 24 calls a day plus 24 a week. I approve creating these three
schedules.

### D. If the scheduling controls are not available in this session

Please do not fall back to cron SQL. Tell me exactly what I need to do to make
them available (a new session, a setting, or anything else), and I will do it.

### E. Checks (read-only): please paste the results

```sql
-- E1. The start time is set (expect 1 row).
select key, value from public.site_settings where key = 'forum_notifications_start_at';
```

- E2. List the three schedules you created (function, schedule, enabled).
- E3. After the first hourly run: the response status and body of
  `send-forum-notifications`. Expected: 200 with `"success": true`. No email is
  expected unless someone posted in the forum after the start time.
