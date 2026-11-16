import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

// Run against a built preview. No API writes, analytics, or third-party reads.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4317';
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
const routes = ['/', '/nevada/las-vegas', '/emotional-whiplash-addiction-families', '/blog/emotional-whiplash-addiction-families'];
let checked = 0;
try {
  for (const route of routes) {
    for (const width of [320, 390, 639, 640, 768, 1024, 1280, 1536]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      try {
        await context.route('**/*', request => request.request().method() === 'GET' && new URL(request.request().url()).origin === new URL(base).origin ? request.continue() : request.abort());
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        console.log(`CHECK ${route} ${width}`);
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => document.querySelector('link[rel=canonical]') && document.querySelector('h1'));
        await page.waitForTimeout(300);
        const result = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          h1: [...document.querySelectorAll('h1')].filter(el => el.getClientRects().length).map(el => el.textContent.trim()),
          title: document.title,
          canonical: document.querySelector('link[rel=canonical]')?.href,
          schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
          ctaOverflow: [...document.querySelectorAll('button, a')].filter(el => el.getClientRects().length && !el.classList.contains('sr-only') && !el.closest('[aria-hidden="true"]') && getComputedStyle(el).display !== 'inline').filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.textContent.trim()),
        }));
        assert.deepEqual(errors, [], `${route} ${width}: runtime`);
        assert.ok(result.width <= width + 1, `${route} ${width}: page overflow ${result.width}`);
        assert.deepEqual(result.ctaOverflow, [], `${route} ${width}: CTA label overflow`);
        assert.equal(result.h1.length, 1, `${route} ${width}: visible H1`);
        assert.ok(result.title && result.schemas.length, `${route}: head/schema`);
        const canonicalRoute = route.includes('emotional-whiplash') ? '/blog/emotional-whiplash-addiction-families' : route;
        assert.equal(result.canonical, 'https://soberhelpline.com' + canonicalRoute);
        checked++;
      } finally { await context.close(); }
    }
  }
  console.log(`PASS ${checked} route/viewport cases; intentional canonical alias preserved`);
} finally { await browser.close(); }
