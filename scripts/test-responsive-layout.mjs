import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

// Built-route coverage, including aliases not present in the sitemap. Read-only:
// block third-party traffic and all non-GET requests; never submit real forms.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4322';
const widths = (process.env.TEST_WIDTHS || '320,390,1280').split(',').map(Number);
const dist = path.resolve('dist');
async function discover(dir) {
  const routes = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) routes.push(...await discover(file));
    else if (entry.name === 'index.html') routes.push('/' + path.relative(dist, dir).split(path.sep).join('/'));
  }
  return routes;
}
const routes = process.env.TEST_ROUTES ? JSON.parse(await fs.readFile(process.env.TEST_ROUTES, 'utf8')) : await discover(dist);
const jobs = [...new Set(routes)].sort().flatMap(route => widths.map(width => ({ route, width })));
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
const results = [];
let next = 0;
let writeQueue = Promise.resolve();
try {
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < jobs.length) {
      const { route, width } = jobs[next++];
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      try {
        await context.route('**/*', request => request.request().method() === 'GET' && new URL(request.request().url()).origin === new URL(base).origin ? request.continue() : request.abort());
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const response = await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => (document.querySelector('#root')?.childElementCount || 0) > 0);
        await page.evaluate(async () => {
          await document.fonts.ready;
          document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
          await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
        });
        await page.waitForTimeout(1200);
        // Related content can mount after the initial route settles. Decode the
        // final image set too, rather than mistaking a late lazy image for failure.
        await page.evaluate(async () => {
          await document.fonts.ready;
          document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
          await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
        });
        const metrics = await page.evaluate(() => {
          const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden' && !element.closest('[aria-hidden="true"],.sr-only');
          return {
            pageWidth: document.documentElement.scrollWidth,
            fontStatus: document.fonts.status,
            unsettledImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
            verticalLabels: [...document.querySelectorAll('button,a.inline-flex')].filter(visible).flatMap(element => {
              const box = element.getBoundingClientRect();
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
              const failures = [];
              let node;
              while ((node = walker.nextNode())) {
                if (!node.textContent.trim() || !visible(node.parentElement)) continue;
                const range = document.createRange();
                range.selectNodeContents(node);
                if ([...range.getClientRects()].some(rect => rect.top < box.top - 1 || rect.bottom > box.bottom + 1)) failures.push(node.textContent.trim());
              }
              return failures;
            }),
            controls: [...document.querySelectorAll('button,a')].filter(visible).filter(element => getComputedStyle(element).display !== 'inline').filter(element => element.scrollWidth > element.clientWidth + 2).map(element => element.textContent.trim()),
          };
        });
        assert.equal(response.status(), 200);
        assert.deepEqual(errors, []);
        assert.equal(metrics.fontStatus, 'loaded');
        assert.deepEqual(metrics.unsettledImages, []);
        assert.ok(metrics.pageWidth <= width + 1, `page width ${metrics.pageWidth} > ${width}`);
        assert.deepEqual(metrics.controls, [], 'control label overflow');
        assert.deepEqual(metrics.verticalLabels, [], 'vertical label overflow');
        results.push({ route, width, pass: true, ...metrics });
      } catch (error) {
        results.push({ route, width, pass: false, error: String(error) });
      } finally {
        await context.close();
        console.log(`${results.length}/${jobs.length} ${route} ${width}`);
        if (process.env.TEST_OUTPUT) {
          writeQueue = writeQueue.then(() => fs.writeFile(process.env.TEST_OUTPUT, JSON.stringify(results, null, 2)));
          await writeQueue;
        }
      }
    }
  }));
} finally {
  await browser.close();
}
const failures = results.filter(result => !result.pass);
console.log(JSON.stringify({ routes: new Set(results.map(result => result.route)).size, cases: results.length, failures }, null, 2));
assert.equal(results.length, jobs.length);
assert.equal(failures.length, 0, 'responsive layout regressions');
