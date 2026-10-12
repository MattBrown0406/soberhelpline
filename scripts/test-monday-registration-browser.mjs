import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
const root = path.resolve('dist');
const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  let target = path.resolve(root, `.${pathname}`);
  if (!target.startsWith(root + '/') && target !== root) { res.writeHead(403).end(); return; }
  try { if ((await fs.stat(target)).isDirectory()) target = path.join(target, 'index.html'); }
  catch { target = path.join(root, 'index.html'); }
  const ext = path.extname(target);
  res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[ext] ?? 'application/octet-stream');
  try { res.end(await fs.readFile(target)); } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, channel: 'chromium', args: ['--no-sandbox'] });
let checks = 0;
try {
  for (const route of ['/monday-zoom-registration/', '/family-squares']) {
    for (const alreadyRegistered of [true, false]) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
      const page = await context.newPage(); let submits = 0;
      await page.route('**/*', async request => {
        const url = request.request().url();
        if (url.startsWith(origin)) return request.continue();
        if (url.includes('/functions/v1/public-register-monday-zoom')) {
          submits++;
          return request.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, alreadyRegistered, status: alreadyRegistered ? 'already_registered' : 'registered' }) });
        }
        if (url.includes('.supabase.co/')) return request.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return request.abort();
      });
      await page.goto(origin + route);
      await page.locator('#name').fill('Synthetic Test');
      await page.locator('#email').fill('synthetic@example.test');
      await page.locator('button[type="submit"]').click();
      if (alreadyRegistered) {
        await page.getByText('We look forward to seeing you Monday evening!', { exact: route !== '/monday-zoom-registration/' }).first().waitFor();
        assert.ok((await page.locator('body').innerText()).includes('You’re already registered.'));
      } else {
        await page.getByText(route === '/monday-zoom-registration/' ? "You're registered. Please check your email for the Zoom meeting link." : "You're Registered!", { exact: true }).first().waitFor();
      }
      assert.equal(submits, 1);
      checks++; console.log(`PASS browser ${route} ${alreadyRegistered ? 'already registered' : 'new registration'}`);
      await context.close();
    }
  }
  console.log(`PASS ${checks} real Chromium UI cases; all backend/provider traffic mocked or blocked.`);
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
