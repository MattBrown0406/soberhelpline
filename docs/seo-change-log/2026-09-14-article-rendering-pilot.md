# Technical SEO correction — two public article pilot

Approved technical-rendering/accuracy exception to copy cooldown. This release does not change blogPosts.ts, article words, titles, descriptions, authors, dates, clinical/numeric claims, crisis language, prices, seven-state copy, or analytics. It does not change the existing coaching canonical relationship or redirect either coaching route.

- `/blog/alcohol-blackouts-explained-family-guide`: shared safe text renderer now recognizes Markdown H2/H3, lists, strong text, Markdown links and historical `[LINK:label:URL]`/`[IMAGE:key]` conventions. React escapes source HTML; unsafe link protocols/control characters are rejected.
- `/blog/first-al-anon-meeting-what-to-expect` and blackouts only: build-time public React article-body rendering in the actual root HTML, using the same ArticleContent component as the client. Existing createRoot replaces initial content when the client mounts (not whole-app hydration/SSR). No application auth provider or private data queried. Other routes retain their prior fallback mechanism.
- `/family-support`: correct intrinsic sizing of membership card and wrapped controls; no body-level overflow hiding.
- `/addiction-family-coaching`: stop rendering only its internal strategy panel; retain existing copy, CTAs, distinct introductory/pricing roles and existing metadata.
- Organization/Person sameAs: remove related-brand homepages from index.html, mattBrownSchema, InterventionHelp and FamilyReadinessIntensive. No guessed legal parent or new affiliation added. Existing author and affiliation URLs retained.

Verification commands: `npm run build`, `npm run seo:validate`, `npx tsc --noEmit -p tsconfig.app.json`, scoped ESLint, `node scripts/test-article-content.mjs`; serve build on port 4387 and run `node scripts/test-next-seo-acceptance.mjs`. Browser test blocks all external network calls and non-GET requests; no real forms or conversion events submitted. Set `SEO_TEST_OUT` to the before/after evidence directory to include captured baseline counts, otherwise baseline metrics are omitted. `scripts/check-next-seo-browser.mjs` captures those baseline fixtures before rebuilding (`PHASE=before`/`after`).

Claims review is a separate draft at `/root/sh-next-seo-implementation/claims-review.md`, not clinical sign-off. The 0.14% wording and absolute memory/honesty statements need qualified review. No external citations were appended as blanket validation.

Release state: GitHub main synchronization is not Lovable publication. Owner publishes via Share → Publish; then verify initial and client-rendered HTML on the two pilot URLs, family-support widths and strategy-panel removal. Observe metadata for at least 28 days and body-copy experiments for 60 days from verified publication; do not use these technical fixes as a new title/headline experiment. This is documentation, not a changed or enforced scheduler rule. No ranking, crawl or ChatGPT-citation gain is promised.
