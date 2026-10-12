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
  for (const route of ['/monday-zoom-registration/', '/family-squares', '/zoom.html', '/family-squares-kiosk']) {
    for (const alreadyRegistered of [true, false]) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
      const page = await context.newPage(); let submits = 0;
      await page.clock.setFixedTime(new Date('2026-11-03T04:30:00Z')); // Monday 20:30 PST
      let submittedDate;
      await page.route('**/*', async request => {
        const url = request.request().url();
        if (url.startsWith(origin)) return request.continue();
        if (url.includes('/functions/v1/public-register-monday-zoom')) {
          submits++;
          submittedDate = request.request().postDataJSON().meeting_date;
          return request.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, alreadyRegistered, status: alreadyRegistered ? 'already_registered' : 'registered' }) });
        }
        if (url.includes('.supabase.co/')) return request.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return request.abort();
      });
      await page.goto(origin + route);
      await page.locator(route.includes('kiosk') ? '#kiosk-name' : '#name').fill('Synthetic Test');
      await page.locator(route.includes('kiosk') ? '#kiosk-email' : '#email').fill('synthetic@example.test');
      await page.locator('button[type="submit"]').click();
      if (alreadyRegistered) {
        await page.getByText('We look forward to seeing you Monday evening!', { exact: false }).first().waitFor();
        assert.ok((await page.locator('body').innerText()).includes('You’re already registered.'));
      } else {
        await page.getByText(route.includes('kiosk') ? "You're registered!" : route !== '/family-squares' ? "You're registered. Please check your email for the Zoom meeting link." : "You're Registered!", { exact: true }).first().waitFor();
      }
      assert.equal(submits, 1);
      assert.equal(submittedDate, "2026-11-09", "Monday 20:30 Pacific rolls to next week");
      checks++; console.log(`PASS browser ${route} ${alreadyRegistered ? 'already registered' : 'new registration'}`);
      await context.close();
    }
  }
  console.log(`PASS ${checks} real Chromium UI cases; all backend/provider traffic mocked or blocked.`);
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
