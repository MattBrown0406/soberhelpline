# Current tasks

- [ ] Narrow credential repair for jobs 28 and 38 only: both pre-repair waiting counts verified 0. Blocked because both jobs are unmanaged legacy callbacks; available managed scheduling controls cannot replace their credential while preserving the existing jobs, and Lovable Cloud does not expose the managed service-role key or a supported Vault synchronization control. No credentials, jobs, schedules, functions, or database rows changed; no manual invocation, sending, or publication. Requires a supported internal credential-only synchronization/repointing operation scoped to these two jobs with job 26 excluded. Post-repair 16-minute checks not run because no repair occurred.

- [x] Complete replacement November 11 member-area step 5 A–E2: deployed only send-forum-notifications and send-member-weekly-note unchanged from synced main 03762116; preserved/set forum_notifications_start_at (read-back 2026-11-11T22:24:45Z); created and read back enabled managed HTTP jobs 43 (7 * * * *, forum), 44 (*/10 23 * * 2, weekly note), and 45 (*/10 0-2 * * 3, weekly note), each with body {"source":"cron"}. Generated helper unchanged; no migrations, manual invocations, other function changes, or publication. Build OK.
- [ ] Step E3: read the first natural hourly send-forum-notifications response after 2026-11-11 23:07 UTC (3:07 PM Pacific). No logs yet at 22:25 UTC; status/body and actual delivery remain unverified. Do not manually invoke the sender. Matt is handling publication separately.
- [x] Complete revised steps 6 and available step 7 read-only checks: types regeneration succeeded (already current); all six tables have RLS, five service-role CRUD checks pass, cleanup/welcome triggers exist, welcome history count is 30, secure view is owner-rights, forum is out of realtime, authenticated users can read all base columns except user_id, broad profile/admin workbook policies are absent. information_schema returned no column grants under the inspection role, so direct has_column_privilege checks verified each column. Forum start time absent; schedule/response checks blocked by step 5. Build OK.

- [x] Execute November 10 ordered audit handoff with approved separate steps: safeguards applied and isolated PostgreSQL tests pass; zero eligible memberships to restore; three cron commands repaired, all ten functions deployed unchanged and automation enforcement verified true; article/contact/shared-rule tests and desktop/mobile non-submitting checks pass; publication requested for soberhelpline.com (live completion not yet verified).

- [x] Add the uploaded November 8 insurance deductible and year-end rehab guide as article 206 with a photo and five FAQs; 229 article renders pass, card and slug navigation and suggested links verified, desktop/mobile fit checked, listings refreshed; not published.

- [x] Add the uploaded November 7 surprise rehab bill guide as article 205 with a photo and all six FAQs; 228 article renders pass, card navigation and available links verified, desktop/mobile fit checked, listings refreshed; not published. The suggested insurance-appeal article is unavailable and was not linked.

- [x] Confirm and fix weekly-report duplicate attendees on loose-name rejoins; real handler with synthetic rows reproduces the failure before the fix and passes rejoin-minute, exact-plus-loose, and ambiguity regressions afterward; existing name-matching tests pass. No deployment, database changes, or report sending.

- [x] Add the uploaded November 6 addiction-medication insurance guide as article 204 with a photo and five FAQs; 227 article renders pass, card navigation and available suggested links verified, desktop/mobile fit checked, listings refreshed; not published. The suggested insurance-appeal article is unavailable and was not linked.

- [x] Add the uploaded November 5 faith-based rehab guide as article 203 with a photo and its four FAQs; 226 article renders pass, card navigation and suggested links verified, desktop/mobile fit checked, listings refreshed; not published.
- [x] Add the uploaded November 4 older-adults addiction treatment guide as article 202 with a photo and five FAQs; 225 article renders pass, blog-card navigation and suggested links verified, desktop/mobile checked without overflow, listings refreshed; not published.
- [x] Add the uploaded November 1 young-adult rehab guide with a photo, five FAQs, verified links, and unique article number 200; 223 article renders pass, blog-card navigation and desktop/mobile article checks verified. Listing and sitemap refreshed; not published.
- [x] Add the uploaded October 31 dating-in-early-recovery guide with a matching photo and all 5 FAQs; 222 article renders pass, desktop/mobile article appearance and linked-page responses verified. Blog listing and sitemap refreshed; blog-card click check timed out. Unavailable suggested sponsor article omitted.
- [x] Add the uploaded October 26 distance-support family guide with a photo and verified links; article tests and desktop/mobile browser checks pass, including blog-card navigation.
- [x] Add the uploaded October 30 pink cloud in recovery family guide with a photo, 5 FAQs, and verified links; article tests and browser checks pass.

- [x] Add confirmed removal of followed-up abandoned bookings without deleting history or sending emails; helper tests and authenticated synthetic cancel/save/refresh flow pass, with no real leads changed.

- [x] Add and verify searchable auto-registration removal in the Zoom Meeting admin tab without deleting registrations or changing email delivery.
- [x] Audit manual registration notifications: required notification controls/functions are absent live; recent logs cannot establish the deployed sender's exact failure.
- [x] Activate new-registration notifications after Matt's explicit changeover-risk approval; enabled at 10:14 AM Pacific October 24 and verified through deployed no-send probe.
- [ ] Confirm owner delivery after the next genuine eligible manual registration; blocked by no new real registration, with test emails and replays prohibited. Deployed caller flow and inbox delivery remain unverified.

- [x] Add the uploaded grandparents self-care guide, photo, and verified blog links.
- [x] Add the uploaded sibling self-care guide and photo to the blog.
- [x] Refresh the blog listings and verify the article and its links.
- [x] Install the standalone notification ledger with runner-managed transactions and deploy only the compatible sender; authenticated no-send probe verified disabled revision, all 1,298 IDs preserved and zero send attempts.
- [x] Prepare and synthetically test a separate owner-only app notification candidate with app attribution, suppression, and replay guards.
- [ ] Connect verified new app RSVP events and receipt/control contracts; blocked by app-side event integration and revised database/release review.
- [ ] Enable app owner notifications; blocked by missing verified app-event contracts and separate deployment/activation authorization.
