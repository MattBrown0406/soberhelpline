import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyChatGPT, isChatGPTReferrer, ga4Request, summarize } from './chatgpt-referrals.mjs';

test('exact domains, URL normalization and no lookalike attribution', () => {
  for (const url of ['https://chatgpt.com/', 'https://CHATGPT.COM/c/private?prompt=secret#private', 'https://www.chatgpt.com/', 'https://chatgpt.com./']) assert.equal(isChatGPTReferrer(url), true);
  for (const url of ['', 'chatgpt.com', 'https://notchatgpt.com/', 'https://chatgpt.com.evil.example/', 'https://evil.chatgpt.com/', 'https://chatgpt.com@evil.example/', 'https://user@chatgpt.com/', 'ftp://chatgpt.com/', 'javascript:chatgpt.com']) assert.equal(isChatGPTReferrer(url), false, url);
});
test('documented UTM source and explicit campaign precedence', () => {
  const params = new URL('https://site.example/?utm_source=chatgpt.com&question=PRIVATE').searchParams;
  assert.equal(classifyChatGPT({ source: params.get('utm_source') }), 'chatgpt');
  assert.equal(classifyChatGPT({ source: ' ChatGPT.COM ' }), 'chatgpt');
  assert.equal(classifyChatGPT({ source: 'notchatgpt.com' }), 'other');
  for (const source of ['sober_helpline', 'nomoreenabling', 'google', 'newsletter', 'https://chatgpt.com']) assert.equal(classifyChatGPT({ source, referrer: 'https://chatgpt.com/' }), 'other');
  assert.equal(classifyChatGPT({ referrer: 'https://chatgpt.com/' }), 'chatgpt');
});
test('no processing without confirmed export consent', () => {
  for (const consent of [false, undefined, 'true']) assert.deepEqual(summarize([{ sessions: 9 }], {consent}), {status: 'not_processed_without_confirmed_consent', landings: []});
});
test('consented aggregate result strips query/referrer/identifiers and rejects private paths', () => {
  const result = summarize([
    { source: 'chatgpt.com', landingPage: '/family-consultation?email=PRIVATE#PRIVATE', sessions: 2, email: 'PRIVATE' },
    { referrer: 'https://chatgpt.com/c/PRIVATE?question=PRIVATE', landingPage: '/family-consultation', sessions: 3 },
    { source: 'chatgpt.com', landingPage: '/admin/PRIVATE', sessions: 99 },
    { source: 'notchatgpt.com', landingPage: '/family-consultation', sessions: 99 },
  ], { consent: true, approvedPaths: ['/family-consultation'] });
  assert.deepEqual(result.landings, [{landingPage:'/family-consultation',sessions:5}]);
  assert.ok(!JSON.stringify(result).includes('PRIVATE'));
  assert.throws(() => summarize([{ source:'chatgpt.com', landingPage:'/', sessions:-1}], {consent:true, approvedPaths:['/']}));
});
test('GA4 request uses query-free landing page and exact session source; no user dimensions', () => {
  const request = ga4Request('2026-08-14', '2026-09-10');
  assert.deepEqual(request.dimensions.map(x=>x.name), ['sessionSource','sessionMedium','landingPage']);
  assert.equal(request.dimensionFilter.filter.stringFilter.matchType, 'EXACT');
  assert.throws(() => ga4Request('2026-09-10', '2026-08-14'));
});
