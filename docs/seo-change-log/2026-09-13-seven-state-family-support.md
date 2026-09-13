# Seven-state family support correction — 2026-09-13

## Scope and publication

Owner approved implementation of the positioning recommendations. This is a factual service-scope correction, **not** a CTR experiment or new clinical guidance. Source baseline: `72b989b8` on `main`. Preserve kiosk/admin commits `af8570d5` and `0f3c0291` (both ancestors), mobile/backend/payment/auth flows, and Freedom Interventions source.

**Publication pending:** a Git push syncs Lovable source but does not prove public publication. Open https://lovable.dev/projects/d06fcc5d-ea53-4bb5-8116-170ffa8e9ee1 → **Share → Publish**, then verify all seven exact routes below. The inspected Lovable page says the project is private and requires an authorized sign-in; no saved login is available. Do not bypass access/security prompts.

## Shared corrections on the seven existing routes

- Describe remote phone/online family education and coaching, explicitly not a local Sober Helpline office or treatment facility.
- Distinguish free Monday Family Squares at **7 PM Pacific** from paid education membership and separately booked private coaching. Current frontend booking logic (`BookConsultation.tsx`, `displayRate`) and `FamilyCoaching.tsx` show standard $150 sessions / $125 member rate. Membership sales terms show $10/month after the trial; state pages link to current terms rather than duplicating trial/billing promises. No payment configuration changed.
- Replace source `LocalBusiness`/state-only `PostalAddress` objects with explicit `Service` + `Organization` provider + state `areaServed`, without an address, rating or invented credentials. **Important audit correction:** current `SEOHead` already normalizes address-only LocalBusiness inputs to Service; live hydrated pages already had Service, not LocalBusiness. Do not claim an invalid local office was demonstrably published. This removes the misleading source model and makes raw and hydrated service identity explicit.
- Remove uncited state overdose/ranking statistics, the repeated 64–74% versus under-30% treatment-efficacy comparison, outcome promises, coercive rent-boundary FAQ advice, stereotyped geographic/cultural claims, and absolute anonymity implications. Replace FAQs with operational availability/free-vs-paid/local-resource answers, identical to the displayed FAQ schema. No new diagnosis, medication, detox, overdose, suicide or legal/financial advice was written.
- Reuse the unchanged approved `AfterHoursSafetyStrip` with 911/988 and family-guidance routing. Existing local resource/crisis contacts remain; no new clinical claims were added and no forms/messages were submitted.
- Preserve the existing state resource sections and all 33 city destination links; simplify city-card labels to geography rather than unsupported prevalence claims. No city-page body or new page was created.
- Add shared remote-support choices linking to `/family-support`, `/family-membership`, `/family-coaching`, `/book-consultation`, and `/monday-zoom-registration`. People specifically seeking an in-person intervention can choose the clearly identified Freedom Interventions profile link; no automatic redirect or local-staffing promise.
- Remove duplicate WhatsApp buttons in the existing regional CTAs. Phone destinations are otherwise unchanged.

## Seven-state accounting

| State | Exact existing route | Distinct change/preserved resource |
|---|---|---|
| Oregon | `/oregon-family-support` | Family-support title/H1 preserved; Oregon Health Authority/Lines for Life links and seven city destinations retained. |
| Washington | `/washington-family-support` | Title shortened to avoid the existing rendered ellipsis; family-support H1 preserved. WA recovery/crisis resources and seven city destinations retained. |
| Idaho | `/idaho-family-support` | Interventionist-first title/H1/direct-answer changed to family support. CareLine/IDHW links and three city destinations retained. |
| California | `/california-family-support` | Family-support title/H1 preserved; DHCS/Medi-Cal and regional crisis resources plus seven city destinations retained. |
| Nevada | `/nevada-family-support` | Interventionist-first title/H1/direct-answer changed to family support. Nevada 211/DPBH/crisis resources and three city destinations retained. |
| Arizona | `/arizona-family-support` | Family-support title/H1 preserved; AHCCCS/crisis resources and three city destinations retained. |
| Utah | `/utah-family-support` | Family-support title/H1 preserved; USARA/Valley resources and three city destinations retained. Removed LDS stereotyping and anonymity guarantee. |

All seven descriptions/openings corrected; three titles and two H1s changed. The JSON companion contains exact before/after metadata, H1s, state schema, history and GSC query-page evidence.

## Internal-link decision and protected winners

`/family-support` and `/family-coaching` lacked a regional resource navigation section. Add one accessible section to each, with seven contextual links: **14 new incoming state links**. No metadata/body rewrite in either hub beyond this additive navigation.

Protect both articles byte-for-byte in `src/data/blogPosts.ts`:
- `/blog/loved-one-with-addiction-asks-for-money`: current 28d 10 clicks/186 impressions; already links to private booking, `/family-coaching`, and free Monday registration.
- `/blog/what-to-do-when-loved-one-lies-about-drinking-drug-use`: current 28d 6 clicks/114 impressions; already links to `/addiction-family-coaching`, an existing coaching landing route. Do not force a seven-state list into nationally relevant advice. Its unrelated historical citation-token issues are outside this change.

## Technical evidence before editing snippets

GSC URL Inspection returned **Submitted and indexed**, crawl/index allowed, and matching user/Google non-www canonicals for all seven exact destinations. Non-www HTTP checks with normal and Googlebot user agents returned 200; hydrated pages had real H1s and self-canonicals. Sitemap XML contained 380 unique URLs, including all seven. Robots advertised it.

`www.soberhelpline.com` does not resolve (NXDOMAIN independently confirmed via Google public DNS); this is not the Freedom Interventions www behavior. No in-repository redirect can repair missing DNS. Hosting/DNS changes are not included.

The static SEO route registry had divergent copy from hydrated route components. Align only these seven raw metadata/noscript entries and add the truthful Service schema. Mark those seven static Service scripts Helmet-managed so hydration leaves **one** regional Service, not duplicate static/runtime entities. Other route schema handling is unchanged.

## Evidence window, rationale and cooldown

GSC final web data, all countries/devices: Aug 15–Sep 11 versus Jul 18–Aug 14, with Jun 14–Sep 11 rolling 90-day context. Exact query/page hosts are preserved in the JSON ledger. Do not call small intervention-heavy samples a family-support CTR opportunity.

Nevada: `interventionist nevada` 28 impressions at 19.0714 (no previous-window row); `professional interventionist nevada` 53 at 29.3396, previous 59 at 32.9661, 90d 138 at 32.2391. This supports reviewing service intent, not promising rank gains. Other state query samples are much smaller.

Most state bodies were last changed Aug 2; Nevada metadata Aug 10. The 60-day body cooldown is overridden only for this owner-approved factual correction. **After verified publication, hold metadata for at least 28 days and substantive bodies for at least 60 days**, except supported safety/factual corrections. Keep source-sync and actual publication dates distinct. No cron job/config changed; this tracked log is a reviewer instruction, not executable cooldown enforcement. Evaluate a full post-publication 28-day window against prior 28/90-day context, including qualified support/consultation choices, not overnight rankings.

## Verification and known unrelated issues

- Full production build and the repository's entire static-prerender pipeline pass: 475 generated route shells plus one preserved static registration shell; 380 sitemap URLs. These are crawlable metadata/noscript shells, **not** full React server rendering for every route.
- Browser regression covers all seven hydrated state pages at 390/768/1280px, unique title/description/canonical/robots/H1/Service/FAQ schema, free/paid choices, 911/988, destinations, no horizontal overflow; keyboard-accessible hub navigation and support destination rendering. External network calls blocked; no backend writes.
- Raw `.html` and `/index.html` forms verified for each state: 14 static cases.
- Targeted TSX ESLint, Node script syntax and staged whitespace checks pass.
- Global SEO validator has one **pre-existing** unresolved article target: `dopamine-and-addiction-brain-science-for-families`. The entire blog data file and validator are unchanged; no unrelated article fix is bundled.
- Existing dependency manifest/lock mismatch and React peer conflict prevent plain `npm ci`. Fallback `npm install --legacy-peer-deps --no-package-lock` succeeded, leaving both package files unchanged. Installer reports 6 moderate/2 high vulnerabilities; no broad dependency upgrade attempted.

Local raw evidence and final source/publication status: `/root/soberhelpline-seven-state-seo/` (`RESULT.md`, `verification.json`, `change-preview.txt`, `evidence/`, build/lint/browser/static logs). Public state changes must not be described as live until their exact new text is read back after Publish.
