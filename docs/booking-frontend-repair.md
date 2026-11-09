# Booking frontend regression gates

Frontend only: no database, Edge Function, payment-provider, or marketing-consent changes are included.

```sh
npx tsc -p tsconfig.app.json --noEmit
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4315
# In another terminal:
SITE=sh ORIGIN=http://127.0.0.1:4315 EVIDENCE=/path/to/evidence CHROMIUM=/path/to/chrome node tests/booking-browser.mjs
for zone in UTC America/Los_Angeles America/New_York Europe/London; do TZ="$zone" node tests/booking-time.mjs; done
```

Create EVIDENCE first. Every non-loopback browser request is intercepted or blocked. Provider/availability responses are synthetic. The intentional Next test fulfills a synthetic recovery-record POST inside Playwright; no request reaches Supabase. No checkout, booking, meeting, email, or message is created.

Coverage: native provider button activation with Enter/Space; 320/390/768/1024/1440px provider/slot/intake layouts; no floating contact widget across booking; per-required-query HTTP failures (public providers, weekly availability, booked slots, date overrides), network failure, empty success, retry; no recovery capture while typing; capture only after validated Contact Information Next; UTC and Los Angeles/New York/London display across US DST changes, with additional pure formatter tests on London DST days.

Availability is usable only after **all** required reads succeed. Retry retains the provider/date, clears stale lookup data, and gates Next; current chosen slots are rechecked against the refreshed list before advancing. Responses from older requests cannot replace newer lookup data. The existing authoritative backend still decides whether a booking is allowed.

Recovery persistence now occurs only on existing validated intake Next actions. The adjacent email disclosure explains that action and potential unfinished-booking follow-up. No new marketing opt-in was added. Recovery delivery/suppression and durable persistence are backend-owner review items; this frontend change does not certify them.

Local date/time labels in slots, selected multi-session entries, and review derive from the provider wall-clock instant. The provider date selector is explicitly labeled with its timezone; local display does not change canonical booking payload date/time. Readiness-intensive slots now use the already advertised 90-minute duration rather than the provider's ordinary 60-minute session duration.

Publication, live booking truth, notification delivery and controlled end-to-end tests remain separate gates. The offline HTML preview is non-live and cannot submit data.

## Legacy compatibility release boundary

The new completion-field/payment-return protocol is excluded from this release. PayPal capture handling and the existing paid-conflict screen are byte-identical to main a157ff31019328b92284aa730ec6812ebaa20956; tests verify that identity and exercise successful legacy responses without processingComplete, explicit-complete responses and the existing paid-conflict path. No successful legacy customer is newly routed to manual review. This preserves the existing payment UX, including its known limitations; it does not certify payment/notification correctness or deploy the held backend changes. Run `ORIGIN=http://127.0.0.1:4315 node tests/payment-return-review.mjs` against the production build. Main source synchronization is authorized; Lovable publication remains separate.
