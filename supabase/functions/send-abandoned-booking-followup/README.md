# Abandoned booking follow-up

This function sends one follow-up email to abandoned booking records that are:

- older than 4 hours
- not marked completed
- missing `followup_sent_at`
- not on the email suppression list
- not already followed by a completed consultation booking

The admin dashboard can trigger it manually from **Abandoned Bookings**.

For production automation, schedule `send-abandoned-booking-followup` to run hourly from Supabase scheduled functions or an external cron service. Keep `SENDGRID_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` configured in Supabase function secrets.
