import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL, excludedSitemapRoutes, canonicalRouteAliases } from './seo-routes.mjs';

const root = process.cwd();
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const distDir = path.join(root, 'dist');
const xml = fs.readFileSync(sitemapPath, 'utf8');
const appSource = fs.readFileSync(path.join(root, 'src', 'App.tsx'), 'utf8');
const blogSource = fs.readFileSync(path.join(root, 'src', 'data', 'blogPosts.ts'), 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'));
const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
const issues = [];

const extractAll = (html, regex) => [...html.matchAll(regex)].map((m) => m[1]?.trim() ?? '');
const decodeHtml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');
const htmlPathForRoute = (route) => route === '/'
  ? path.join(distDir, 'index.html')
  : path.join(distDir, route.replace(/^\//, ''), 'index.html');

if (urls.length !== new Set(urls).size) issues.push(`Sitemap contains ${urls.length - new Set(urls).size} duplicate URLs.`);
if (urls.length !== lastmods.length) issues.push(`Sitemap has ${urls.length} URLs but ${lastmods.length} lastmod values.`);
if (urls.some((url) => !url.startsWith(`${SITE_URL}/`))) issues.push('Sitemap contains a non-canonical host or non-HTTPS URL.');
if (lastmods.some((date) => !/^\d{4}-\d{2}-\d{2}$/.test(date))) issues.push('Sitemap contains an invalid lastmod date.');
const today = new Date().toISOString().slice(0, 10);
if (lastmods.some((date) => date > today)) issues.push('Sitemap contains a future lastmod date.');

const titleMap = new Map();
const descriptionMap = new Map();
for (const url of urls) {
  const route = new URL(url).pathname;
  const file = htmlPathForRoute(route);
  if (!fs.existsSync(file)) {
    issues.push(`Missing prerendered HTML for sitemap route ${route}.`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const titles = extractAll(html, /<title[^>]*>([\s\S]*?)<\/title>/g);
  const descriptions = extractAll(html, /<meta name="description" content="([^"]*)"[^>]*>/g);
  const canonicals = extractAll(html, /<link rel="canonical" href="([^"]*)"[^>]*>/g);
  const ogUrls = extractAll(html, /<meta property="og:url" content="([^"]*)"[^>]*>/g);
  const robots = extractAll(html, /<meta name="robots" content="([^"]*)"[^>]*>/g);
  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).map((value) => value.replace(/<[^>]+>/g, '').trim());

  if (titles.length !== 1 || !titles[0]) issues.push(`${route}: expected one non-empty title, found ${titles.length}.`);
  if (descriptions.length !== 1 || !descriptions[0]) issues.push(`${route}: expected one non-empty description, found ${descriptions.length}.`);
  if (canonicals.length !== 1 || canonicals[0] !== url) issues.push(`${route}: canonical mismatch (${canonicals.join(', ') || 'missing'}).`);
  if (ogUrls.length !== 1 || ogUrls[0] !== url) issues.push(`${route}: og:url mismatch (${ogUrls.join(', ') || 'missing'}).`);
  if (robots.length !== 1 || robots[0].toLowerCase().includes('noindex')) issues.push(`${route}: sitemap page is noindex or lacks one robots directive.`);
  if (h1s.length < 1 || !h1s[0]) issues.push(`${route}: prerendered shell lacks a non-empty H1.`);
  if (titles[0] && decodeHtml(titles[0]).length > 60) issues.push(`${route}: title exceeds 60 characters.`);
  if (descriptions[0] && decodeHtml(descriptions[0]).length > 160) issues.push(`${route}: description exceeds 160 characters.`);
  if (html.includes('{seoData.') || html.includes('{routeMetadata.')) issues.push(`${route}: unresolved metadata expression in prerendered HTML.`);

  if (titles[0]) titleMap.set(titles[0], [...(titleMap.get(titles[0]) || []), route]);
  if (descriptions[0]) descriptionMap.set(descriptions[0], [...(descriptionMap.get(descriptions[0]) || []), route]);

  const schemaTypes = [];
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const value = JSON.parse(raw);
      const entries = Array.isArray(value) ? value : [value];
      for (const entry of entries) if (entry && typeof entry === 'object' && entry['@type']) schemaTypes.push(entry['@type']);
    } catch (error) { issues.push(`${route}: invalid JSON-LD (${error.message}).`); }
  }
  if (route.startsWith('/blog/') && !schemaTypes.includes('Article')) issues.push(`${route}: prerendered blog page lacks Article JSON-LD.`);
}

for (const [title, routes] of titleMap) {
  if (routes.length > 1) issues.push(`Duplicate title on ${routes.join(', ')}: ${title}`);
}
for (const [description, routes] of descriptionMap) {
  if (routes.length > 1) issues.push(`Duplicate description on ${routes.join(', ')}: ${description}`);
}

const sitemapRoutes = new Set(urls.map((url) => new URL(url).pathname));
for (const route of excludedSitemapRoutes) {
  if (sitemapRoutes.has(route)) issues.push(`Excluded route remains in sitemap: ${route}`);
  if (canonicalRouteAliases.has(route)) continue;
  const file = htmlPathForRoute(route);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const robots = extractAll(html, /<meta name="robots" content="([^"]*)"[^>]*>/g);
  if (robots.length !== 1 || !robots[0].toLowerCase().includes('noindex')) {
    issues.push(`${route}: excluded route is not prerendered with noindex.`);
  }
}

for (const [route, primary] of canonicalRouteAliases) {
  if (sitemapRoutes.has(route)) issues.push(`Canonical alias remains in sitemap: ${route}`);
  const file = htmlPathForRoute(route);
  if (!fs.existsSync(file)) {
    issues.push(`Canonical alias lacks prerendered HTML: ${route}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const canonicals = extractAll(html, /<link rel="canonical" href="([^"]*)"[^>]*>/g);
  const titles = extractAll(html, /<title[^>]*>([\s\S]*?)<\/title>/g);
  const descriptions = extractAll(html, /<meta name="description" content="([^"]*)"[^>]*>/g);
  const robots = extractAll(html, /<meta name="robots" content="([^"]*)"[^>]*>/g);
  const ogUrls = extractAll(html, /<meta property="og:url" content="([^"]*)"[^>]*>/g);
  const expected = `${SITE_URL}${primary}`;
  if (canonicals.length !== 1 || canonicals[0] !== expected) {
    issues.push(`${route}: expected canonical ${expected}, found ${canonicals.join(', ') || 'missing'}.`);
  }
  if (titles.length !== 1 || !titles[0]) issues.push(`${route}: canonical alias lacks one non-empty title.`);
  if (descriptions.length !== 1 || !descriptions[0]) issues.push(`${route}: canonical alias lacks one non-empty description.`);
  if (robots.length !== 1 || robots[0].toLowerCase().includes('noindex')) issues.push(`${route}: canonical alias has an invalid robots directive.`);
  if (ogUrls.length !== 1 || ogUrls[0] !== expected) issues.push(`${route}: canonical alias og:url mismatch.`);
}

const blogSlugs = new Set([...blogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]));
const brokenBlogTargets = [...blogSource.matchAll(/(?:https:\/\/soberhelpline\.com)?\/blog\/([a-z0-9-]+)/g)]
  .map((match) => match[1])
  .filter((slug) => !blogSlugs.has(slug));
if (brokenBlogTargets.length) issues.push(`Blog content contains unresolved internal article targets: ${[...new Set(brokenBlogTargets)].join(', ')}`);

const legacyBlogAliases = [...appSource.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<BlogArticle\s*\/>\}/g)]
  .map((match) => match[1])
  .filter((route) => !route.startsWith('/blog/') && !route.includes(':'));
for (const route of legacyBlogAliases) {
  if (sitemapRoutes.has(route)) issues.push(`Legacy article alias remains in sitemap: ${route}`);
  const file = htmlPathForRoute(route);
  if (!fs.existsSync(file)) {
    issues.push(`Legacy article alias lacks prerendered HTML: ${route}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const canonicals = extractAll(html, /<link rel="canonical" href="([^"]*)"[^>]*>/g);
  const intermediate = `/blog${route}`;
  const expected = `${SITE_URL}${canonicalRouteAliases.get(intermediate) ?? intermediate}`;
  if (canonicals.length !== 1 || canonicals[0] !== expected) issues.push(`${route}: legacy article alias canonical mismatch.`);
  if (html.includes('{seoData.')) issues.push(`${route}: legacy article alias has unresolved metadata.`);
}

const result = {
  sitemapUrls: urls.length,
  uniqueLastmodDates: new Set(lastmods).size,
  titleCount: titleMap.size,
  descriptionCount: descriptionMap.size,
  excludedRoutesChecked: excludedSitemapRoutes.size,
  canonicalAliasesChecked: canonicalRouteAliases.size,
  legacyBlogAliasesChecked: legacyBlogAliases.length,
  issues,
};
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
