import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import nodePath from 'node:path';
import assert from 'node:assert/strict';

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:4398';
const output = process.env.TEST_OUTPUT || '/tmp/soberhelpline-regional-tests/browser-tests.json';
const evidenceDir = nodePath.join(nodePath.dirname(output), 'evidence');
await fs.mkdir(evidenceDir, { recursive: true });
const states = ['Oregon', 'Washington', 'Idaho', 'California', 'Nevada', 'Arizona', 'Utah'];
const rows = [];
const failures = [];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext();
// No production API writes, analytics, payments, forms, or messaging.
await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
const page = await context.newPage();
async function inspect(path) {
  await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
  await page.locator('h1').first().waitFor();
  await page.waitForTimeout(300);
  return page.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map(x => x.textContent.trim()),
    canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(x => x.href),
    description: [...document.querySelectorAll('meta[name="description"]')].map(x => x.content),
    ogUrl: [...document.querySelectorAll('meta[property="og:url"]')].map(x => x.content),
    robots: [...document.querySelectorAll('meta[name="robots"]')].map(x => x.content),
    schema: [...document.scripts].filter(x => x.type === 'application/ld+json').map(x => JSON.parse(x.textContent)),
    text: document.body.innerText,
    overflow: document.documentElement.scrollWidth > innerWidth,
    links: [...document.querySelectorAll('#root a')].map(x => ({ text: x.textContent.trim(), href: x.getAttribute('href') })),
  }));
}
for (const width of [390, 768, 1280]) {
  await page.setViewportSize({ width, height: 900 });
  for (const state of states) {
    const path = `/${state.toLowerCase()}-family-support`;
    try {
      const d = await inspect(path); rows.push({ state, path, width, ...d });
      assert.equal(d.h1.length, 1); assert(d.h1[0].includes(state));
      assert.deepEqual(d.canonical, ['https://soberhelpline.com' + path]);
      assert.deepEqual(d.ogUrl, d.canonical); assert.equal(d.description.length, 1);
      assert.deepEqual(d.robots, ['index, follow']);
      assert(d.title.includes(state)); assert(!d.title.includes('Interventionist'));
      assert(!d.overflow, 'Horizontal overflow');
      assert(d.text.includes('remote support, not a local office'));
      assert(d.text.includes('Standard sessions are $150, or $125 for members'));
      assert(!/64–74%|outperforms|Overdose Deaths|Join thousands|completely anonymous/.test(d.text));
      assert(!d.schema.some(x => x['@type'] === 'LocalBusiness'));
      const services = d.schema.filter(x => x['@type'] === 'Service');
      assert.equal(services.length, 1, 'One regional Service schema');
      assert.equal(services[0].areaServed.name, state); assert(!services[0].address);
      assert.equal(services[0].url, d.canonical[0]);
      const faq = d.schema.filter(x => x['@type'] === 'FAQPage'); assert.equal(faq.length, 1);
      assert.equal(faq[0].mainEntity.length, 3);
      for (const q of faq[0].mainEntity) { assert(d.text.includes(q.name)); assert(d.text.includes(q.acceptedAnswer.text)); }
      for (const href of ['/family-support','/family-membership','/family-coaching','/book-consultation','/monday-zoom-registration','tel:911','tel:988','https://freedominterventions.com/interventionist']) assert(d.links.some(x => x.href === href), `Missing ${href}`);
      await fs.writeFile(nodePath.join(evidenceDir, `${state}-${width}-rendered.html`), await page.content());
    } catch (error) { failures.push({ state, width, error: error.message }); }
  }
  for (const path of ['/family-support', '/family-coaching']) {
    try {
      await inspect(path);
      const nav = page.getByRole('navigation', { name: 'Western state family support resources' });
      assert.equal(await nav.locator('a').count(), states.length);
      for (const state of states) {
        const a = nav.getByRole('link', { name: `${state} family support`, exact: true });
        assert.equal(await a.getAttribute('href'), `/${state.toLowerCase()}-family-support`);
        await a.focus(); assert(await a.evaluate(x => x === document.activeElement));
      }
      await nav.getByRole('link', { name: 'Nevada family support', exact: true }).press('Enter');
      await page.waitForURL('**/nevada-family-support');
      assert.equal(await page.locator('#root h1').count(), 1);
      rows.push({ path, width, regionalLinks: states.length, keyboardNavigation: 'pass' });
    } catch (error) { failures.push({ path, width, error: error.message }); }
  }
}
// Read-only route checks for support CTAs; no submission or purchase.
for (const path of ['/monday-zoom-registration','/family-membership','/book-consultation','/addiction-family-coaching']) {
  try { const d = await inspect(path); assert(!d.text.includes('Page Not Found')); rows.push({ path, h1: d.h1, routeExists: true }); }
  catch(error) { failures.push({ path, error: error.message }); }
}
await browser.close();
await fs.writeFile(output, JSON.stringify({ rows, failures, cases: rows.length, passed: failures.length === 0 }, null, 2));
console.log(JSON.stringify({ cases: rows.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
