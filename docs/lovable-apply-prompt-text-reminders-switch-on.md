SWITCH ON TEXT REMINDERS FOR THE MONDAY MEETING. Read all of this before doing anything.

Only run this after the owner has confirmed that the Twilio messaging service is approved to send Family Squares meeting reminders collected through the website opt-in box.

DO NOT TOUCH anything except the one setting below. No deploys, no schedules, no migrations, no manual invocations. Never print a secret value. Counts only: no names, emails or phone numbers.

STEP 0. Checks (read-only)
Confirm, by name only, that the function secrets `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` and `TWILIO_MESSAGING_SERVICE_SID` all exist. If any is missing, STOP.

```sql
SELECT (SELECT count(*) FROM public.family_squares_sms_optins) AS optins,
       (SELECT count(*) FROM public.site_settings WHERE key = 'family_squares_sms_enabled') AS switch_rows;
```

STEP 1. Switch on (a data statement, not a schema migration)

```sql
INSERT INTO public.site_settings (key, value, is_public)
VALUES ('family_squares_sms_enabled', 'true', true)
ON CONFLICT (key) DO UPDATE SET value = 'true', is_public = true;
```

`is_public` is true on purpose: the website reads this one setting to decide whether to show the text-reminder box. Its value is only "true".

STEP 2. Confirm

```sql
SELECT key, value, is_public FROM public.site_settings WHERE key = 'family_squares_sms_enabled';
```

REPORT
Paste the results of steps 0 and 2.

TO SWITCH OFF AGAIN: `UPDATE public.site_settings SET value = 'false' WHERE key = 'family_squares_sms_enabled';`
