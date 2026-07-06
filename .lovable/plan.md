## What I'll build

**1. Cancel the 7/6 meeting + block new registrations for that date**

- Add a `cancelled_meeting_dates` table (just a list of dates flagged as cancelled, with an optional message).
- Insert `2026-07-06` into it.
- Update the Monday Zoom registration flow so that if someone tries to register for a cancelled date, they see:
  > "Tonight's Monday meeting (July 6) has been cancelled — Matt is traveling to Texas to help a family with an intervention. Please join us next Monday at 7 PM PT for the regularly scheduled meeting."
- Registration for all other Mondays keeps working normally.

**2. Poll infrastructure**

- Two tables:
  - `email_polls` — the poll itself (question + created_at).
  - `email_poll_votes` — one row per recipient, with a unique `token` (UUID), the recipient email, the meeting date it relates to, and the chosen option (nullable until they vote).
- Public page `/poll/:token` where clicking a vote button records the choice and shows a thank-you + live tally. No login required; the token is the auth. One vote per token; changing vote is allowed until poll closes.

**3. Send the cancellation + poll email**

- New edge function `send-meeting-cancellation-poll`:
  - Pulls all 35 registrants for 2026-07-06.
  - Creates one poll and one `email_poll_votes` row per unique email (dedupes).
  - Sends a personalized email via SendGrid (already configured) with your apology, the reason (family intervention in Texas), and two big buttons:
    1. **Wait until next Monday (July 13, 7 PM PT)**
    2. **Move to Thursday July 9 at 7 PM PT**
  - Each button links to `/poll/<token>?choice=1` (or 2) so one click = one vote.
- Admin-triggered from an existing admin page (I'll add a small "Send cancellation poll" button on the Zoom admin area), so nothing sends until you click it.

**4. Admin view of results**

- Small results panel on the admin page showing live vote counts and the list of who voted for what, so you can decide the reschedule.

## Email copy I'll use (you can edit before sending)

> Subject: Monday Meeting Cancelled — Quick Vote on Reschedule
>
> Hi {first_name},
>
> I'm so sorry to do this on short notice — I have to cancel tonight's 7 PM Monday meeting. I'll be on a plane to Texas during our normal meeting time to help a family with an intervention. I hate letting you down, and I truly appreciate your understanding.
>
> To make it up to everyone, I'd like to hear from you. Would you rather:
>
> [ Wait until next Monday, July 13 ]   [ Move it to Thursday, July 9 at 7 PM PT ]
>
> One click above records your vote. I'll go with whatever the group prefers.
>
> Thank you for your patience,
> Matt

## Technical details

- Poll tables: RLS locked to admins for reads; public vote goes through a `SECURITY DEFINER` RPC that only accepts a valid token.
- Cancellation table: public SELECT (needed to render the cancellation message on the registration page); admin-only writes.
- Email sending: reuses existing SendGrid setup via a new dedicated edge function (not `send-custom-email`) so retries, logging, and the poll-token join stay clean.
- Nothing sends automatically — you click "Send cancellation poll" in admin, we send to all 35, then you watch results roll in.

## What I need from you before building

Just confirm two things:

1. Target meeting date is **Monday July 6, 2026 (7 PM PT)** — the 35-registrant meeting. ✅ or correct me.
2. Reply-to on the email — use your usual `matt@soberhelpline.com` / support address, or a different one?
