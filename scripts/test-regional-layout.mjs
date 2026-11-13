import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

// Run against `npm run preview -- --host 127.0.0.1 --port 4393` after a build.
// Never contacts a provider, submits a form, places a call, or sends telemetry.
const base = process.env.REGIONAL_TEST_BASE_URL || 'http://127.0.0.1:4393';
assert.equal(new URL(base).hostname, '127.0.0.1', 'Use an isolated local preview');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const states = ['Oregon', 'Washington', 'Idaho', 'California', 'Nevada', 'Arizona', 'Utah'];
const routes = ['/texas-family-support', '/new-mexico/albuquerque', '/start-here', '/family-consultation'];
let cases = 0;
try {
  for (const width of [320, 390, 640, 768, 1280]) {
    for (const route of routes) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      try {
        await context.route('**/*', request => {
          const allowed = request.request().method() === 'GET' && new URL(request.request().url()).origin === base;
          return allowed ? request.continue() : request.abort();
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base + route);
        await page.locator('#root h1').waitFor();
        await page.waitForFunction(() => document.fonts.status === 'loaded');
        assert.deepEqual(errors, [], `${route}: browser errors`);
        const geometry = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
        assert.ok(geometry.scrollWidth <= width + 1, `${route} at ${width}: horizontal overflow ${geometry.scrollWidth}`);
        assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://soberhelpline.com${route}`);
        const phones = await page.locator('a[href^="tel:"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
        assert.ok(phones.length > 0);
        assert.ok(phones.every(phone => /^tel:\+?\d+$/.test(phone)), 'Malformed phone destination');
        if (route === '/start-here' || route === '/family-consultation') {
          const nav = page.getByRole('navigation', { name: 'Western state family support resources' });
          assert.deepEqual(await nav.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href'))), states.map(state => `/${state.toLowerCase()}-family-support`));
          await nav.getByRole('link', { name: 'Oregon family support', exact: true }).focus();
          await page.keyboard.press('Enter');
          await page.getByRole('heading', { level: 1, name: /Family Support for Addiction in Oregon/ }).waitFor();
          assert.equal(new URL(page.url()).pathname, '/oregon-family-support');
          await page.goBack();
          await nav.getByRole('link', { name: 'Washington family support', exact: true }).click();
          await page.getByRole('heading', { level: 1, name: /Family Support for Addiction in Washington/ }).waitFor();
          assert.equal(new URL(page.url()).pathname, '/washington-family-support');
        } else {
          const button = page.getByRole('button', { name: 'Join Free Family Squares — Mondays, 7:00 PM Pacific', exact: true });
          const box = await button.boundingBox();
          assert.ok(box && box.x >= 0 && box.x + box.width <= width + 1 && box.height >= 44, 'Registration CTA must fit and remain tappable');
        }
        cases++;
      } finally { await context.close(); }
    }
  }
  const page = await browser.newPage();
  await page.route('**/*', request => request.request().method() === 'GET' && new URL(request.request().url()).origin === base ? request.continue() : request.abort());
  for (const route of ['/emotional-whiplash-addiction-families', '/blog/emotional-whiplash-addiction-families']) {
    await page.goto(base + route);
    await page.locator('#root h1').waitFor();
    assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://soberhelpline.com/blog/emotional-whiplash-addiction-families');
    cases++;
  }
  console.log(`PASS: ${cases} layout, regional navigation and intentional alias cases; external traffic blocked.`);
} finally { await browser.close(); }
