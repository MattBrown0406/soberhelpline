// Run after npm run build. BASE_DIST permits a read-only failing-baseline check.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { chromium } from '@playwright/test';

const ids = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31];
const dist = path.resolve(process.env.BASE_DIST || 'dist');
for (const id of ids) assert(fs.existsSync(path.join(dist, `blog/${id}/index.html`)), `Missing numeric article shell: /blog/${id}`);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  try {
    assert.equal(req.method, 'GET');
    let file = path.resolve(dist, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    assert(file.startsWith(dist + '/'));
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    assert(fs.realpathSync(file).startsWith(fs.realpathSync(dist) + '/'));
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(fs.readFileSync(file));
  } catch { res.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
let checked = 0;
try {
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  for (const width of [320, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    await context.route('**/*', route => {
      const request = route.request();
      return request.method() === 'GET' && new URL(request.url()).origin === origin ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    for (const id of ids) {
      const route = `/blog/${id}`;
      const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, route);
      const raw = await response.text();
      const rawHead = await page.evaluate(html => {
        const d = new DOMParser().parseFromString(html, 'text/html');
        return { canonical: [...d.querySelectorAll('link[rel=canonical]')].map(e => e.getAttribute('href')), title: d.title, description: d.querySelector('meta[name=description]')?.content };
      }, raw);
      await page.waitForFunction(() => document.querySelector('article h1')?.getClientRects().length && document.querySelector('article')?.textContent.length > 200);
      const settled = await page.evaluate(() => ({ canonical: [...document.querySelectorAll('link[rel=canonical]')].map(e => e.getAttribute('href')), title: document.title, description: document.querySelector('meta[name=description]')?.content, overflow: document.documentElement.scrollWidth > innerWidth + 2 }));
      assert.equal(rawHead.canonical.length, 1, route);
      assert.match(rawHead.canonical[0], /^https:\/\/soberhelpline\.com\/blog\/[^/]+$/);
      assert.notEqual(rawHead.canonical[0], 'https://soberhelpline.com' + route, route);
      assert.deepEqual(settled.canonical, rawHead.canonical, route);
      assert.equal(settled.title, rawHead.title, route);
      assert.equal(settled.description, rawHead.description, route);
      assert.equal(settled.overflow, false, route);
      if (id === 0) assert.equal(settled.canonical[0], 'https://soberhelpline.com/blog/cycle-of-addiction');
      // Existing image-prefix priority is intentional preservation, not a new ID routing rule.
      if (id === 1 || id === 12) assert.equal(settled.canonical[0], 'https://soberhelpline.com/blog/12-step-vs-non-12-step-addiction-treatment');
      checked++;
    }
    await context.close();
  }
  console.log(JSON.stringify({ routes: ids.length, checked, rawHydratedHeadAligned: true, numericSelfCanonical: false }));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
