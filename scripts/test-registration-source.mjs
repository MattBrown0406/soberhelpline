import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks++; };
const sourceModule = ts.transpileModule(readFileSync('src/lib/registrationSource.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { registrationSource } = await import(`data:text/javascript;base64,${Buffer.from(sourceModule).toString('base64')}`);
for (const [value, expected] of [['kiosk','kiosk'], ['automatic','automatic'], ['website','unknown'], [null,'unknown'], [undefined,'unknown'], ['other','unknown']]) {
  check(registrationSource({registration_source:value}) === expected, `source ${value}`);
}
const server = await createServer({mode:'test', server:{host:'127.0.0.1', port:4188, strictPort:true}});

await server.listen();
let browser;
try {
  browser = await chromium.launch({headless:true});
  const page = await browser.newPage();
  const today = new Date();
  today.setDate(today.getDate() + (today.getDay() <= 1 ? 1-today.getDay() : 8-today.getDay()));
  const meetingDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const rows = Array.from({length:501}, (_,i) => ({id:`fixture-${i}`, name:`Synthetic ${i}`, email:'same@example.invalid', phone:'', question:'', request_follow_up:false, consent_email_list:false, created_at:'2026-01-01T00:00:00Z', meeting_date:meetingDate, registration_source:i === 500 ? 'kiosk' : 'website'}));
  const offsets = [];
  let fail = false;
  let kioskPayload;
  const externalBodies = [];
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    // All nonlocal requests are mocked, including analytics and mutations.
    if (url.pathname.endsWith('/public-register-monday-zoom')) {
      kioskPayload = route.request().postDataJSON();
      return route.fulfill({json:{success:true}});
    }
    externalBodies.push(route.request().postData() || '');
    if (url.pathname.endsWith('/zoom_meeting_registrations')) {
      if (fail) return route.fulfill({status:500,json:{message:'synthetic read failure'}});
      const offset = Number(url.searchParams.get('offset') || 0);
      offsets.push(offset);
      return route.fulfill({json:rows.slice(offset,offset+500)});
    }
    return route.fulfill({json:[]});
  });
  await page.goto('http://127.0.0.1:4188/e2e/source-harness.html');
  await page.getByRole('status').filter({hasText:'501 of 501'}).waitFor();
  check(offsets.includes(500), 'second page fetched');
  check(await page.getByLabel('Registration source: Kiosk', {exact:true}).count() === 1, 'kiosk survives duplicate email and pagination');
  await page.getByLabel('Registration source', {exact:true}).selectOption('kiosk');
  await page.getByRole('status').filter({hasText:'1 of 501'}).waitFor();
  check(await page.getByLabel('Registration source: Unknown', {exact:true}).count() === 0, 'filter excludes unknown');
  await page.getByLabel('Registration source', {exact:true}).selectOption('unknown');
  await page.getByRole('status').filter({hasText:'500 of 501'}).waitFor();
  check(await page.getByLabel('Registration source: Kiosk', {exact:true}).count() === 0, 'unknown excludes kiosk');
  await page.getByLabel('Registration source', {exact:true}).selectOption('automatic');
  await page.getByText('No registration records match this source filter.').waitFor();
  checks++;
  fail = true;
  await page.reload();
  await page.getByRole('alert').filter({hasText:'Registrations could not be loaded'}).waitFor();
  check(await page.getByRole('status').filter({hasText:'records match'}).count() === 0, 'no misleading totals on failure');
  fail = false;
  await page.getByRole('button', {name:'Retry registrations'}).click();
  await page.getByRole('status').filter({hasText:'501 of 501'}).waitFor();
  checks++;
  const kiosk = readFileSync('src/pages/FamilySquaresKiosk.tsx','utf8');
  const api = readFileSync('supabase/functions/public-register-monday-zoom/index.ts','utf8');
  check(kiosk.includes('pagePath: "/family-squares-kiosk"'), 'kiosk attribution payload retained');
  check(api.includes('registration_source: registrationSource') && api.includes('attribution?.pagePath === "/family-squares-kiosk"'), 'existing insert source contract retained');
  check(!api.includes('.upsert('), 'no duplicate-email source overwrite introduced');
  await page.goto('http://127.0.0.1:4188/e2e/source-harness.html?kiosk');
  await page.locator('#kiosk-name').fill('Sentinel Kiosk Test');
  await page.locator('#kiosk-email').fill('sentinel-kiosk@example.com');
  await page.locator('button[type="submit"]').click();
  await page.waitForFunction(() => !document.querySelector('#kiosk-name'));
  check(kioskPayload?.attribution.pagePath === '/family-squares-kiosk', 'browser POST includes kiosk source');
  check(kioskPayload?.consent_email_list === false && kioskPayload?.request_follow_up === false && kioskPayload?.phone === '', 'consent and phone contract unchanged');
  const body = await page.locator('body').innerText();
  check(!body.includes('Sentinel Kiosk Test') && !body.includes('sentinel-kiosk@example.com'), 'success screen clears PII');
  const stored = await page.evaluate(() => JSON.stringify(localStorage));
  check(!stored.includes('sentinel-kiosk') && !stored.includes('Sentinel Kiosk'), 'no PII in local storage');
  check(!externalBodies.join('').includes('sentinel-kiosk'), 'no PII in telemetry');
  console.log(JSON.stringify({passed:checks, failed:0, browser:'Chromium', fixtures:501, productionRequests:0}));
} finally {
  await browser?.close();
  await server.close();
}
