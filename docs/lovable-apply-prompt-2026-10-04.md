# Lovable apply prompt: app links, sign-in from the app on any page, coaching bookings (2026-10-04)

How to use: after this change is on GitHub and Lovable has synced it, paste the
"Prompt for Lovable" section below into Lovable as one message. Then publish the
site and run the checklist at the end.

**One small SQL step: remove one database rule (item 12).** Lovable first runs
a read-only check and pastes back the result, then one migration with a single
`DROP POLICY`, then the check again and one read-only report. Nothing else in
the database changes: no tables, no data, no grants.

The functions don't need that SQL and work on the current database, so it
doesn't matter whether they deploy before or after it. The two booking functions
use `is_active_family_member`, already live from the 2026-10-03 migration, and
fall back to the same rule in code if that call ever fails. `book-consultation`
uses `auth_user_id_by_email`, live since the 2026-10-02 migration; if that call
fails, a guest booking just stays unlinked (item 13). They also read the
existing `provider_availability`, `provider_date_overrides` and
`consultation_bookings` tables.

What this change does:

1. **Universal links (app ⇄ website).** New file
   `public/.well-known/apple-app-site-association` (no file extension, JSON).
   It tells iOS that `https://soberhelpline.com/app` and `/app/*` open the Sober
   Helpline app (`4D2KRG86P2.com.soberhelplineapp`). `npm run build` now fails if
   the file is missing, isn't valid JSON, doesn't match, or didn't reach `dist/`
   (`scripts/validate-app-site-association.mjs`; also part of `npm run seo:validate`).
2. **`/app` pages on the website.** When the app isn't installed, or the link is
   opened on a computer, `/app` and `/app/*` show "Open this in the Sober
   Helpline app" with the App Store button. Where the website has the same thing,
   they also link to it:
   - `/app/family-squares` → `/family-squares`
   - `/app/coaching` and `/app/coaching/booked` → `/book-consultation`
   - `/app/learn` → `/family-education`

   These pages are noindex, not in the sitemap, and not prerendered.
3. **Smart App Banner unchanged:** still plain `app-id=6780034996`, with no
   `app-argument`. The app now on the App Store (4.0 (2)) can't open
   `https://soberhelpline.com/app` ("Unmatched Route"). Add the argument once
   4.0 (3)+ is what most people have; the comments in `index.html` and the
   scripts say where.
4. **Sign-in from the app works on every page, and always asks first.** The
   app adds a one-time `?sso_token=` to website links. Before, only member pages
   understood it. Now one site-wide handler:
   - redeems it exactly once, on any page (for example `/book-consultation` and
     `/family-coaching` from the app's "Book coaching");
   - removes it from the address bar, and no longer sends it to Google
     Analytics;
   - signs in only after a tap, on every page (member pages too):
     - signed out: "Sign in from the Sober Helpline app?" with "Continue as
       <email>" and "Not you? Continue without signing in";
     - signed in as a different account: "Switch accounts?" with "Continue as
       <email>" and "Stay signed in as <email>";
     - already signed in as that same account: no question, nothing changes.

     Before, a signed-out visitor was signed in without being asked, so anyone
     could send a link carrying their own token and sign the visitor into the
     sender's account. On `/book-consultation` the visitor's booking, intake
     answers and Zoom link would then sit in that account. "Not you?" leaves
     the visitor signed out, and the token is never used;
   - shows "Signed in from the Sober Helpline app as …" after "Continue".

   Staff (admin/moderator) accounts are still refused and told to use their
   password.
5. **The browser tab remembers it came from the app.** The new app (4.0 (3)+)
   adds `from_app=1&app_links=1` to every soberhelpline.com address it opens.
   A sign-in token also counts as "from the app", which covers 4.0 (2). The tab
   remembers this for as long as it's open, including through the PayPal round
   trip.
6. **Coaching price uses the site's one membership rule.** `consultation-payment`
   now gives the $125 member price to a signed-in account that
   `is_active_family_member` says is a member:
   - website members;
   - app members signed in from the app (their `plan_type 'app'` membership);
   - cancelled members until their paid-through date.

   Everyone else pays the standard price ($150). Before, it got this wrong
   three ways:
   - it counted any `status = 'active'` row, including app memberships whose
     grace period had ended;
   - it missed cancelled members who had paid through the current period;
   - it priced guests by the email they typed. Anyone could claim a member's
     discount by typing that member's email, and the price showed whether an
     email belonged to a member.

   Guests who are members now see "Already a member? Sign in for the member
   rate" on the booking page.
7. **One payment = one plan's sessions.** Before, `consultation-payment` priced
   by plan alone and never checked the list of sessions, so a hand-made request
   could pay once and get many confirmed sessions with Zoom links (for example
   12 sessions for the $500 plan). Now, when the PayPal order is created, the
   booking must have:
   - a known plan;
   - exactly that plan's number of sessions: 1 for a single session,
     "emergency" or the Family Readiness Intensive; 4 for stabilization; 12 for
     parallel recovery;
   - each time in the future and inside the booking window;
   - each time on the provider's calendar (weekly hours plus date overrides,
     the same rules the booking page uses to list times) and not already booked.

   The booking page shows the reason when a booking is refused. Before inserting
   anything, `book-consultation` checks the plan and the number of sessions
   again (`supabase/functions/_shared/bookingRules.ts`).
8. **`book-consultation` is locked down.** It creates confirmed bookings and sends
   Zoom links, and until now anyone could call it directly and book without
   paying. It now accepts only `consultation-payment` (this project's service role
   key), after PayPal has captured the payment. It records the account, member
   status and the amount PayPal actually captured.
9. **"Back to the app" buttons** (with a small "Open the App Store" link under
   them). They use the app's own link scheme, because iOS keeps a tap from a
   soberhelpline.com page to another soberhelpline.com address in Safari. Such a
   link does nothing without the app, so the buttons only show to people who
   came from the app:
   - If the tab came from app 4.0 (3)+ (`app_links=1`): "Return to the Sober
     Helpline app", which opens the matching screen:
     - `sober-helpline://app/coaching/booked` after a booking (`/coaching-onboarding`);
     - `sober-helpline://app/plan-review` after a plan-review payment
       (`/coaching-checkout`), or when it was already paid.
   - Otherwise (4.0 (2), which can't open those): "Open the Sober Helpline app",
     which just opens the app (`sober-helpline://`). It appears in the same
     places: on the booking confirmation when the tab came from the app, and
     always after a plan-review payment, since those links only come from the app.
10. **No website membership sales to people who came from the app** (App Store
    guideline 3.1.1: the app opens these pages). In a tab opened from the app:
    - the footer's "Membership" link is hidden on every page;
    - `/family-membership` shows "Membership is available in the Sober Helpline
      app" (plain text, no checkout);
    - the member-page gate shows "Membership is included in Essential and
      Premier plans in the Sober Helpline app…" instead of "Become a member —
      $9.99/month";
    - `/book-consultation` hides "Join membership to save $25" and "Join for
      $9.99/mo" (the $125 member price is still explained);
    - `/family-coaching` hides "Explore Membership" and its discount banner
      becomes plain text. Its locked member tools link to the member pages
      (which show the gate above) instead of the membership sales page.

    Everyone else sees these pages as before.
11. **Emails: no checkout link for plan clients, and links point at
    soberhelpline.com.**
    - `process-consultation-booking`, the "session complete" email that
      Stabilization and Parallel Recovery clients get after each session:
      - The "Schedule Next Session" button is gone. It opened the checkout for
        a NEW plan (`soberhelpline.lovable.app/book-consultation?plan=parallel`,
        which actually priced a single session), but a plan's sessions are all
        chosen and paid for when it's booked.
      - That box is now "Your Next Session": the remaining sessions were
        scheduled when the plan was booked, each session's confirmation email
        has its date, time and Zoom link, and "Need to change a time? Reply to
        this email or call (458) 298-8008." Replies go to
        matt@soberhelpline.com, as before.
      - "Write a Testimonial" now goes to
        `https://soberhelpline.com/testimonials`.
      - There's no "View your sessions" button: `/coaching-onboarding` is the
        "Booking Confirmed" page right after paying, it only lists bookings
        linked to a signed-in account, and guests see no sessions there.
    - `send-survey-emails`: the survey link is now
      `https://soberhelpline.com/survey` (it used the old
      `soberhelpline.lovable.app` address).
12. **No more free confirmed bookings (the SQL step).** A database rule,
    "Clients create bookings", let any signed-in visitor add a row to
    `consultation_bookings` for themselves straight through the database API.
    New rows are `confirmed` by default, so within 15 minutes the recovery job
    (`recover-consultation-zoom-links`) created a Zoom meeting and emailed the
    client and the provider for a booking nobody paid for.
    - No page or function uses that rule. Bookings are created only by
      `book-consultation` (service role, after PayPal captured the payment) and
      by admins (the "Admins manage bookings" rule). The service role isn't
      subject to these rules at all.
    - The migration removes that one rule. The table permissions stay as they
      are; with the rule gone, the database refuses a signed-in non-admin's
      insert.
    - `process-consultation-booking` (creates the Zoom meeting and sends the
      "confirmed" emails) now runs only when the system (`book-consultation`,
      the recovery job) or an admin asks, and only for a `confirmed` booking.
      Before, the booking's own client or provider could also start it for a
      booking in any status. No page did that. Providers still trigger their
      payouts from their dashboard, unchanged.
13. **Guest bookings are linked by the login email.** When someone books without
    signing in, `book-consultation` links the booking to a website account so
    it shows on that account's coaching pages. Before, it matched the email in
    the account's profile. Anyone can change that email to someone else's
    address and then see that person's booking, intake answers and Zoom link.
    Now it links only to the account that signs in with that email, and only if
    the email is confirmed. Otherwise the booking stays a guest booking, which
    still works fully through email.
14. **Paid but not booked: Matt is told.** If PayPal takes the payment but the
    booking can't be made (almost always because someone else booked the same
    time a moment earlier), `consultation-payment` marks the order
    `captured_booking_failed` as before, and now also emails
    matt@soberhelpline.com with the client, amount, plan, the requested times
    and the PayPal order number, so the client can be called to pick a new time
    or refunded. It uses the existing `SENDGRID_API_KEY`. The booking page now
    shows the "Payment Received — our team will follow up" message in that
    case instead of a generic error.

## Prompt for Lovable

> Please sync from GitHub and deploy this change exactly as it is in the repo.
> Do not edit any of the files listed here.
>
> 1. **Edge functions — deploy these, as they are in the repo:**
>    - `consultation-payment`
>    - `book-consultation`
>
>    They import two new shared files that must be deployed with them:
>    `supabase/functions/_shared/familyMembership.ts` and
>    `supabase/functions/_shared/bookingRules.ts`. Leave their
>    `verify_jwt = false` settings in `supabase/config.toml` unchanged.
>
>    Also deploy these two, as they are in the repo:
>    - `process-consultation-booking` (who may run it, and the "session
>      complete" email)
>    - `send-survey-emails` (one link in an email)
>
>    No other function changed, and no other shared file changed.
> 2. **One database change, with read-only checks around it.** Do these in
>    order.
>
>    **2a. Read-only check. Run this and paste me the full output.** It changes
>    nothing:
>
>    ```sql
>    select polname, polcmd, polpermissive, polroles::regrole[] as roles,
>           pg_get_expr(polqual, polrelid) as using_expr,
>           pg_get_expr(polwithcheck, polrelid) as check_expr
>    from pg_policy
>    where polrelid = 'public.consultation_bookings'::regclass
>    order by polname;
>    ```
>
>    `polcmd` is `r` = SELECT, `a` = INSERT, `w` = UPDATE, `d` = DELETE,
>    `*` = ALL. The repo's migrations expect nine rows: "Admins manage
>    bookings" (`*`, `has_role(auth.uid(), 'admin'::app_role)`); "Block anon
>    select/insert/update/delete bookings" (each `false`); "Clients create
>    bookings" (`a`, check `(auth.uid() = client_user_id)`); "Clients view own
>    bookings" (`r`); "Providers view their bookings" (`r`); and "Providers
>    update their bookings" (`w`).
>
>    **Stop rule.** Look at every row with `polcmd` `a` or `*` and
>    `polpermissive` = `true`. Three are fine: "Clients create bookings" (2b
>    removes it), "Block anon insert bookings" (check `false`) and "Admins
>    manage bookings" (only `has_role(auth.uid(), 'admin'::app_role)`). If ANY
>    other such row exists, whatever its name, it could let a signed-in
>    non-admin insert bookings. Then do not run 2b and do not change, add or
>    drop any policy: paste me the output and stop. Don't improvise a fix.
>
>    **2b. Only if the stop rule didn't trigger, create and run this migration
>    exactly as written:**
>
>    ```sql
>    -- Coaching bookings are created only by the book-consultation edge function
>    -- (service role, after PayPal has captured the payment) and by admins
>    -- ("Admins manage bookings"). This policy let any signed-in user insert a
>    -- booking for themselves straight through the API. New rows default to
>    -- status 'confirmed', so the Zoom recovery job then created a Zoom meeting
>    -- and emailed both sides for a booking nobody paid for.
>    -- Table grants stay as they are: admins insert through the admin policy, and
>    -- the service role bypasses row-level security.
>    DROP POLICY IF EXISTS "Clients create bookings" ON public.consultation_bookings;
>    ```
>
>    **2c. Run the 2a query again and paste me the output.** The only
>    difference should be that "Clients create bookings" is gone.
>
>    **2d. One more read-only report. Paste me the output; change nothing.**
>    These are bookings with no PayPal order: admin-made bookings, and any that
>    were created through the removed rule. No names or emails are printed.
>
>    ```sql
>    select id, created_at, booking_date, status, amount_paid, zoom_status,
>           client_notified, client_user_id is not null as has_account,
>           coaching_plan_id is not null as in_plan
>    from public.consultation_bookings
>    where paypal_order_id is null
>    order by created_at desc
>    limit 100;
>    ```
>
>    Don't change any other policy, grant, table or data.
> 3. **Publish the frontend** (Share → Publish → Update).
>    - Keep `public/.well-known/apple-app-site-association` exactly as it is: same
>      folder, same name, no `.json` extension, same content. Do not move it into
>      `src/`, rename it, or reformat it.
>    - Keep the `build` script in `package.json` as it is (it ends with
>      `node scripts/validate-app-site-association.mjs`). If that step fails,
>      stop and tell me the error; do not remove the step.
> 4. When the site is published, run this and paste me the full output:
>
>    ```sh
>    curl -sS -i https://soberhelpline.com/.well-known/apple-app-site-association
>    ```
>
>    I expect `HTTP/2 200`, no `location:` header, and the JSON body from the
>    repo file (not the website's HTML page and not "Not found").

## After publishing — checklist

1. **The association file is served** (no login, no redirect):

   ```sh
   curl -sS -i https://soberhelpline.com/.well-known/apple-app-site-association
   curl -sS -o /dev/null -w "%{http_code} %{content_type} redirect=%{redirect_url}\n" \
     https://soberhelpline.com/.well-known/apple-app-site-association
   curl -sS https://soberhelpline.com/.well-known/apple-app-site-association | python3 -m json.tool
   ```

   - Expect `200` and an empty `redirect=`. The body is the JSON with
     `"appIDs": ["4D2KRG86P2.com.soberhelplineapp"]` and the `/app` + `/app/*`
     components. Before this change it was `404 text/plain "Not found"`.
   - **Content type:** Lovable serves files without an extension as
     `application/octet-stream` (that's how `/_redirects` is served today), and it
     has no setting for response headers. `public/_headers` and `vercel.json`
     now ask for `application/json`, but Lovable ignores both. That's fine:
     Apple requires only HTTPS with a valid certificate and no redirects, and
     Apple's CDN accepts `octet-stream`. Step 2 is the real test. If you see
     `application/json`, even better.
   - It must NOT come back as `text/html` (that would be the website page). If
     it does, Lovable didn't publish the `.well-known` folder.
2. **Apple's CDN has it.** iOS 14+ devices ask Apple's CDN, not the website:

   ```sh
   curl -sS -i https://app-site-association.cdn-apple.com/a/v1/soberhelpline.com
   ```

   - Expect `200` and the same JSON. Today it is `404` with
     `Apple-Failure-Reason: SWCERR00101 Bad HTTP Response: 404 Not Found`.
   - The CDN caches results (failures for about an hour, `Cache-Control:
     max-age=3600`), so it can take a few hours, sometimes up to a day, to
     update after publishing. If it still fails, the `Apple-Failure-Reason`
     header says why.
   - Devices fetch it when the app is installed or updated. To test on a phone:
     1. Delete and reinstall the app build that has the
        `applinks:soberhelpline.com` entitlement.
     2. Tap `https://soberhelpline.com/app/coaching` in Notes or Messages (not
        by typing it into Safari).
3. **`/app` fallback pages.**
   - On a computer, open `https://soberhelpline.com/app/coaching`. Expect "Open
     this in the Sober Helpline app", the App Store button and "Book coaching
     on the website".
   - In DevTools, the page's `<meta name="robots">` is `noindex, nofollow`.
   - `curl -s https://soberhelpline.com/sitemap.xml | grep -c "soberhelpline.com/app/"`
     → `0`.
4. **Smart App Banner unchanged:**
   `curl -s https://soberhelpline.com/book-consultation | grep -o '<meta name="apple-itunes-app"[^>]*>'`
   → `content="app-id=6780034996"` (one tag, no app-argument).
5. **Coaching price** (no charge needed: stop at PayPal's page and cancel):
   - Signed in as a website or app member, open `/book-consultation`, pick a
     time, fill in the form, and press "Book & Pay $125". PayPal must show
     **$125.00**.
   - Signed in as a non-member (or signed out): the page says $150 and PayPal
     shows **$150.00**. Typing a member's email while signed out no longer gives
     $125.
   - Stabilization (`/book-consultation?plan=stabilization`): picking 4 times
     still reaches PayPal at $500.00.
6. **Bookings can't be stretched.** The anon key is the public
   `VITE_SUPABASE_PUBLISHABLE_KEY` from `.env`.

   ```sh
   # book-consultation refuses outside calls → 403 {"error":"Forbidden"}
   curl -sS -i -X POST https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/book-consultation \
     -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>" \
     -H "content-type: application/json" -d '{}'

   # Two sessions for a single-session order → 400 "wrong_session_count".
   # Nothing is created; it fails before PayPal.
   curl -sS -i -X POST https://anwqprmpzmcqbkttmxos.supabase.co/functions/v1/consultation-payment \
     -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>" -H "content-type: application/json" \
     -d '{"action":"create-order","provider_id":"<an active provider id>","plan_type":"single",
          "bookings":[{"booking_date":"2030-01-07","start_time":"10:00:00","end_time":"11:00:00","timezone":"America/Los_Angeles"},
                      {"booking_date":"2030-01-08","start_time":"10:00:00","end_time":"11:00:00","timezone":"America/Los_Angeles"}],
          "client_name":"Test","client_email":"test@example.com",
          "return_url":"https://soberhelpline.com/book-consultation","cancel_url":"https://soberhelpline.com/book-consultation"}'
   ```

   A real paid booking still completes: the function logs show
   `consultation-payment` capturing, then the booking being created, then
   `process-consultation-booking` sending the confirmation emails with the Zoom
   link (it now runs only for the system and admins, and this is the system).
7. **Sign-in from the app on any page.** The store app (4.0 (2)) already opens
   member pages with a token; coaching from the app needs the next build. Test
   in a Safari window where you're signed out of soberhelpline.com.
   - **App 4.0 (2), any member page** (Learn → family education):
     - you first see "Sign in from the Sober Helpline app?" with "Continue as
       <your app email>", and the address bar already has no `sso_token`;
     - tap "Continue as …": you're signed in, the page opens, and the "Signed
       in from the Sober Helpline app as …" bar shows;
     - the footer has no "Membership" link.
   - **"Not you?"**: open another member-page link from the app and tap "Not
     you? Continue without signing in". You stay signed out (the member-page
     gate shows), nothing about the account appears, and opening the same
     link again says it expired or was already used.
   - **Next build (4.0 (3)+):**
     - "Book coaching" opens `/book-consultation` with
       `from_app=1&app_links=1` in the address and asks "Continue as …".
       After the tap you're signed in. A member sees $125 (and PayPal shows
       $125.00), a non-member $150, and neither sees "Join membership".
     - After paying, the confirmation page shows "Return to the Sober Helpline
       app", which opens the app's "you're booked" screen.
     - A plan-review payment ends with the same button, which opens the app's
       plan-review status. On 4.0 (2) it says "Open the Sober Helpline app"
       and just opens the app.
   - **Different account already signed in on the website:** the app link asks
     "Switch accounts?" before changing anything.
   - **Already signed in as the same account:** no question; the page just
     opens.
8. **Signed-in visitors can't create bookings directly** (after the SQL step).
   Sign in on soberhelpline.com as an ordinary test account (not an admin),
   open DevTools → Console on any page, and run this. `<anon key>` is the public
   `VITE_SUPABASE_PUBLISHABLE_KEY`. The provider id doesn't exist, so nothing
   can be created whatever happens.

   ```js
   const s = JSON.parse(localStorage.getItem('sb-anwqprmpzmcqbkttmxos-auth-token'));
   const r = await fetch('https://anwqprmpzmcqbkttmxos.supabase.co/rest/v1/consultation_bookings', {
     method: 'POST',
     headers: { apikey: '<anon key>', Authorization: 'Bearer ' + s.access_token,
                'content-type': 'application/json', Prefer: 'return=minimal' },
     body: JSON.stringify({ provider_id: '00000000-0000-0000-0000-000000000000',
       client_user_id: s.user.id, booking_date: '2030-01-07', start_time: '10:00',
       end_time: '11:00', client_name: 'RLS test', client_email: 'rls-test@example.com',
       status: 'cancelled' }),
   });
   console.log(r.status, await r.text());
   ```

   - After the SQL: `403` with `new row violates row-level security policy`
     (code `42501`).
   - Before the SQL, the same request got past the security rule and only
     failed on the made-up provider (`409`, code `23503`).
9. **"Session complete" email** (next time a Stabilization or Parallel Recovery
   session is marked complete): no "Schedule Next Session" button. The "Your
   Next Session" box says the remaining sessions are already scheduled and
   "Need to change a time? Reply to this email or call (458) 298-8008."
   "Write a Testimonial" opens `https://soberhelpline.com/testimonials`.

## Notes for Matt

- **Universal links open the app from other apps, not from soberhelpline.com
  itself.** Apple's rule: a tap in Safari from a soberhelpline.com page to
  another soberhelpline.com address stays in Safari. Links to
  `https://soberhelpline.com/app/...` open the app from email, Messages, Notes
  and other apps. That's why the website's own "back to the app" buttons use
  `sober-helpline://`.
- `www.soberhelpline.com` has no DNS record, so app links work only on
  `soberhelpline.com`. The app's entitlement must be
  `applinks:soberhelpline.com`.
- **Booking checks: what's checked when.** The calendar checks (future,
  window, provider hours, not booked) run when the PayPal order is created.
  They don't run again after payment, so a provider editing hours, or a slot
  starting while someone pays, never turns a paid order into a failed booking.
  If someone else books the same time first, the existing conflict check still
  catches it after payment, as before.
- **Orders already at PayPal when this deploys** still complete. Their plan
  value isn't re-checked: old orders accepted any value and priced unknown ones
  as a single session, so those count as one session. A legitimate old order
  always has the right number of sessions. A hand-made one with extra sessions
  is refused after payment and shows up as `captured_booking_failed` for manual
  handling.
- **Plan clients and the "session complete" email.** The email no longer
  links to `/book-consultation`, which is the checkout for a new plan. It used
  `?plan=parallel`, which actually priced a single session. A plan's sessions
  are all chosen and paid for up front, so clients who need to move one reply
  to the email (it goes to matt@soberhelpline.com) or call (458) 298-8008, and
  you change it from the admin side.
  - There's no "view your sessions" link because the website has no page for
    that yet. `/coaching-onboarding` is the "Booking Confirmed" welcome page
    shown right after paying. It lists only bookings linked to the signed-in
    account, so guests (and anyone signed out) see none.
- **Already-made free bookings.** Step 2d lists bookings with no PayPal order.
  Admin-made ones are expected. Any others are worth a look: they may have
  been created through the rule the SQL step removes.
- **Sign-in from the app now always takes one tap** ("Continue as …"), even
  for app members opening member pages. That's the price of making sure a
  link someone else sent can't sign a visitor into the sender's account.
  Someone already signed in to the website as the same account sees no
  question.
