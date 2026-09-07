import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const source = await fs.readFile(new URL('../src/data/nextStepGuides.ts', import.meta.url), 'utf8');
const compiled = ts.transpile(source, { module: ts.ModuleKind.ES2022 });
const { nextStepPaths } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const base = process.env.NEXT_STEP_BASE_URL || 'http://127.0.0.1:4313';
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
    const page = await context.newPage();
    const requests = [], errors = [];
    page.on('request', r => requests.push(r.url()));
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/next-step`);
    await page.getByRole('heading', { name: 'What would help right now?' }).waitFor();
    assert.equal(await page.locator('a[href="tel:911"]').count(), 1);
    assert.equal(await page.locator('a[href="sms:988"]').count(), 1);
    for (const path of nextStepPaths) {
      for (const choice of path.choices) {
        await page.getByRole('button', { name: path.title, exact: false }).click();
        assert.equal(await page.locator('#guide-heading').evaluate(e => e === document.activeElement), true);
        assert.equal(await page.getByRole('button', { name: 'Read my guide' }).isDisabled(), true);
        await page.getByRole('radio', { name: choice.label, exact: true }).focus();
        await page.keyboard.press('Space');
        if (path.id === 'concern') {
          assert.ok((await page.getByRole('alert').innerText()).includes(choice.action));
          assert.equal(await page.getByRole('alert').locator('a[href="tel:911"]').count(), 1);
          assert.equal(await page.getByRole('alert').locator('a[href="tel:988"]').count(), 1);
        }
        await page.getByRole('button', { name: 'Read my guide' }).click();
        const article = page.getByRole('article');
        assert.ok((await article.innerText()).includes(choice.action));
        assert.equal(await page.locator('#guide-heading').innerText(), path.heading);
        assert.equal(await page.locator('#guide-heading').evaluate(e => e === document.activeElement), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const downloading = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download text guide' }).click();
        const download = await downloading;
        const text = await fs.readFile(await download.path(), 'utf8');
        for (const part of [path.heading, choice.action, ...path.steps, path.script, 'https://soberhelpline.com/contact']) assert.ok(text.includes(part));
        assert.equal(download.suggestedFilename(), 'my-next-step-guide.txt');
        assert.equal(await page.getByRole('link', { name: 'See contact options' }).getAttribute('href'), '/contact');
        await page.getByRole('button', { name: 'Back', exact: true }).click();
        assert.equal(await page.getByRole('radio', { name: choice.label, exact: true }).isChecked(), true);
        assert.equal(await page.getByRole('article').count(), 0);
        await page.getByRole('button', { name: 'Back', exact: true }).click();
        await page.getByRole('button', { name: 'Reset choices' }).click();
        results.push({ width, path: path.id, choice: choice.label, passed: true });
      }
    }
    await page.getByRole('button', { name: 'Understanding options', exact: false }).click();
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: 'Reset choices' }).click();
    await page.getByRole('button', { name: 'Preparing a family conversation', exact: false }).click();
    assert.equal(await page.locator('input:checked').count(), 0);
    await page.reload();
    await page.getByRole('heading', { name: 'What would help right now?' }).waitFor();
    assert.equal(page.url(), `${base}/next-step`);
    assert.deepEqual(await page.evaluate(() => [Object.keys(localStorage), Object.keys(sessionStorage), document.cookie]), [[], [], '']);
    assert.equal(requests.filter(u => !u.startsWith(base) && !u.startsWith('blob:')).length, 0);
    assert.deepEqual(requests.filter(u => /siteBootstrap|supabase|clarity|analytics|adsbygoogle/i.test(u)), []);
    assert.deepEqual(errors, []);
    await page.getByRole('button', { name: 'Understanding options', exact: false }).click();
    await page.goto(`${base}/privacy`);
    await page.goBack();
    await page.getByRole('heading', { name: 'What would help right now?' }).waitFor();
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base);
  const entry = page.getByRole('link', { name: 'Make a private next-step plan' });
  await entry.waitFor();
  await page.evaluate(() => { window.oldDocumentMarker = true; document.addEventListener('click', () => { window.oldListenerRan = true; }); });
  await entry.click();
  await page.getByRole('heading', { name: 'What would help right now?' }).waitFor();
  assert.equal(await page.evaluate(() => window.oldDocumentMarker), undefined);
  const lateRequests = [];
  page.on('request', r => lateRequests.push(r.url()));
  await page.getByRole('button', { name: 'Understanding options', exact: false }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Read my guide' }).click();
  await page.waitForTimeout(1200);
  assert.deepEqual(lateRequests, []);
  assert.equal(await page.evaluate(() => window.oldListenerRan), undefined);
  // Exercise a future accidental React Router SPA hop via a temporary existing Link.
  await page.goto(base);
  await page.locator('a[href="/family-squares"]').first().waitFor();
  await page.locator('a[href="/family-squares"]').first().evaluate(el => el.setAttribute('id', 'spa-probe'));
  await page.evaluate(() => { window.oldDocumentMarker = true; history.pushState({}, '', '/next-step'); window.dispatchEvent(new PopStateEvent('popstate', { state: {} })); });
  await page.getByRole('heading', { name: 'What would help right now?' }).waitFor();
  assert.equal(await page.evaluate(() => window.oldDocumentMarker), undefined);
  await context.close();
  console.log(JSON.stringify({ passed: true, combinations: results.length, results, gates: ['mobile/desktop', 'all choices', 'urgent selection immediate', 'download contents', 'keyboard/focus', 'back/change/reset', 'reload/history', 'storage/network isolation', 'homepage hard navigation', 'SPA fallback hard navigation'] }, null, 2));
} finally { await browser.close(); }
