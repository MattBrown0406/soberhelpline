# ChatGPT referral measurement — review and operator procedure

## What is implemented

`scripts/chatgpt-referrals.mjs` is an **offline reporting tool**, not a new browser tracker. It generates a read-only GA4 Data API request for exact `sessionSource=chatgpt.com`, with `sessionMedium` and query-free `landingPage`. It can summarize already-consented aggregate rows against an explicit public-path allowlist. It never contacts a service or emits events. Run tests with:

```
node --test scripts/chatgpt-referrals.test.mjs
node scripts/chatgpt-referrals.mjs request 2026-08-14 2026-09-10
```

The example dates are an explicit reporting window, not evidence of returned traffic. Execute the generated request against the site's numeric property with existing **read-only** authorization. If `rowCount` exceeds returned rows, paginate using `offset`; do not report a partial set as a total. Save request, response, date window and reporting timezone. GA4 session attribution is not a count of citations or recommendations.

`classifyChatGPT` accepts a source token (e.g. `utm_source` from URLSearchParams or GA4 sessionSource) and/or referrer. Exact `chatgpt.com` source wins; other explicit campaign sources keep precedence. Referrers allow only `chatgpt.com` and `www.chatgpt.com` (HTTP/S, normalized case/trailing DNS dot). Arbitrary subdomains, credentials-in-URL and lookalikes are excluded. This is a conservative reporting definition, not verification that a human came from OpenAI.

For `summarize`, input is `{ "consent": true, "approvedPaths": ["/"], "rows": [...] }`; rows use `source`, `referrer`, `landingPage`, `sessions`. Only use aggregates lawfully collected with appropriate consent; this flag is an operator acknowledgment, **not a website consent implementation**. Missing/false acknowledgment processes nothing. No raw visits, user IDs, emails, form values, prompts or private route IDs belong in input. Output includes only allowlisted paths and session sums. Test counts are synthetic fixtures, never production metrics.

## Current implementation findings / do not extend blindly

- Freedom: `index.html` and `src/lib/analytics.ts` initialize GA4; RouteAnalytics and funnelAttribution already capture UTMs. Referrer-only ChatGPT is currently categorized as generic `referral` by first-party attribution. GA4 native session source can still classify it. Existing attribution contains full URLs/referrers and a session ID.
- Sober: AnalyticsScripts initializes GA4 (plus optional GTM/Plausible), and conversionTracking stores UTMs and referrer. Existing route analytics sends query strings and full page URLs; conversion payloads can include full referrer and arbitrary supplied values. Existing `privacySafe` kiosk behavior does not establish site-wide consent.
- No general analytics opt-in gate was found in the inspected initialization/route/conversion paths of either repository. A follow-up form consent checkbox is consent to a requested contact, **not** analytics consent. Do not treat it as permission to track.
- No new tags, events, browser storage, fingerprinting, form capture or runtime attribution were added by this work. Existing client privacy behavior is **not certified safe**. Site-wide consent/URL/event minimization remains a separate release gate before extending measurement. Existing private-guide/kiosk isolation is preserved.

## Meaningful outcomes

Use session source/medium + landing page to measure visits. Inspect existing event definitions before treating any as a key event. A `phone_click`, `coaching_click`, booking start or provider-selection event is an **intent action**, not a completed call or consultation. Sober's `monday_zoom_registration_success` is a registration outcome, not a paid consultation. Generic GA4 `keyEvents` must not be labeled qualified consultations until the property's configuration and fulfillment boundary have been verified. No consultation total is claimed here; no new key-event configuration or test conversions were sent to production.

Prefer aggregate, consented confirmation of completed consultations without family details. Never send names, email/phone values, symptoms, diagnoses, free-text messages, full query strings/referrers, booking identifiers or case information to analytics. Disable automatic form-interaction collection where applicable only through an explicitly reviewed account configuration change; do not bypass consent or weaken security.

## Read-only access blocker

Both properties returned HTTP 403 `SERVICE_DISABLED` on 2026-09-13: the Analytics Data API is disabled/not used in OAuth consumer project **84792696159**. The relevant Cloud project owner must enable `analyticsdata.googleapis.com` in that exact project (not merely grant GA4 property access), or provide a separate read-only OAuth client in an enabled project. Existing GSC credentials and permissions were not changed.

## Sources

- https://developers.openai.com/api/docs/bots
- https://help.openai.com/en/articles/12627856-publishers-and
- https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema

OAI-SearchBot eligibility is separate from GPTBot training consent. No robots/training policy changes were needed. UTM/referral observations are neither authenticated OpenAI crawler evidence nor a search ranking.
