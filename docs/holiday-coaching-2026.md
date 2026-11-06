# Holiday coaching homepage placement (2026)

The homepage-only banner promotes the existing paid single-session coaching flow, not a workshop or a new product. CTA: `/book-consultation?plan=single`; existing booking code recognizes `single`. Prices, providers, availability, intake, and payment remain owned by the existing booking flow. The banner does not quote a rate, duration, availability, or promise a written deliverable.

## Removal

Remove the `HolidayCoachingBanner` import and mount in `src/pages/Index.tsx` in **January 2027**, then remove its component, scoped CSS, and this campaign's validator if retiring the campaign. There is intentionally no date-dependent rendering, cron, migration, or backend change. Do not leave the seasonal message up indefinitely or automatically renew it next year.

## Verification

- `node scripts/validate-holiday-coaching.mjs`
- `npx tsc --noEmit -p tsconfig.app.json`
- `npm run lint`
- `npm run build` (includes prerender and AASA validation)
- Browser: homepage CTA reaches the single-session booking route; banner absent from admin, family-coaching and booking pages; visible keyboard focus and >=44px target; banner has no overflow at 320/390/768/1024/1440.
- Existing homepage-wide overflow at 768 and 1024/1025 is outside this banner: unchanged when banner is removed. Do not misreport this as a globally overflow-free page.

## Publication boundary

GitHub main synchronization is not publication. Use Lovable Share → Publish after reviewing the self-contained HTML preview. No SQL, migrations, Edge Function deployment, new prices, or booking/payment/message submissions are needed for this release. Verify the rendered live banner and single-session provider-selection page without submitting a booking.
