import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:4473';
const output = process.env.TEST_OUTPUT || '/tmp/sh-contextual-article-links.json';
const cases = [
  ['/blog/alcohol-blackouts-explained-family-guide', '/blog/dopamine-and-addiction-brain-science-families', 'how alcohol affects the brain', 'Dopamine'],
  ['/family-support', '/blog/first-al-anon-meeting-what-to-expect', 'What to expect at your first Al-Anon meeting', 'Al-Anon'],
  ['/intervention-help', '/blog/what-to-expect-during-an-intervention', 'what to expect during an intervention', 'Intervention'],
];
const browser = await chromium.launch({ headless: true });
const rows = [];
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    let blocked = 0;
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === origin && route.request().method() === 'GET') return route.continue();
      blocked++;
      return route.abort();
    });
    const page = await context.newPage();
    for (const [source, target, label, heading] of cases) {
      await page.goto(origin + source);
      const link = page.getByRole('link', { name: label, exact: true });
      await link.waitFor();
      assert.equal(await page.locator(`a[href="${target}"]`).count(), 1);
      assert.equal(await link.getAttribute('href'), target);
      assert.ok(!(await page.locator('body').innerText()).includes('[how alcohol affects the brain]'));
      await link.focus();
      assert.equal(await link.evaluate(el => el === document.activeElement), true);
      const geometry = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      const linkGeometry = await link.evaluate(el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right }; });
      assert.ok(linkGeometry.left >= 0 && linkGeometry.right <= width + 1, `${source}: link overflow ${JSON.stringify(linkGeometry)}`);
      const popup = await link.getAttribute('target') === '_blank';
      const destinationPromise = popup ? context.waitForEvent('page') : Promise.resolve(page);
      if (width === 390) await link.press('Enter'); else await link.click();
      const destination = await destinationPromise;
      await destination.waitForURL(origin + target);
      await destination.getByRole('heading', { level: 1 }).filter({ hasText: heading }).waitFor();
      assert.ok(!(await destination.locator('body').innerText()).includes('Post not found'));
      assert.equal(await destination.locator('link[rel="canonical"]').getAttribute('href'), 'https://soberhelpline.com' + target);
      rows.push({ width, source, target, label, h1: await destination.locator('h1').allTextContents(), title: await destination.title(), geometry, activation: width === 390 ? 'keyboard Enter' : 'click', blockedExternalRequests: blocked });
      if (popup) await destination.close();
    }
    await context.close();
  }
  assert.equal(rows.length, 6);
  await fs.writeFile(output, JSON.stringify({ passed: true, rows }, null, 2));
  console.log(`PASS: ${rows.length} mobile/desktop navigation cases; external/API requests aborted`);
} finally { await browser.close(); }
