import fs from 'node:fs/promises';
import path from 'node:path';
import { prerenderPages, SITE_URL } from './seo-routes.mjs';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseTemplatePath = path.join(distDir, 'index.html');
const baseTemplate = await fs.readFile(baseTemplatePath, 'utf8');

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

for (const page of prerenderPages) {
  const canonicalUrl = `${SITE_URL}${page.route === '/' ? '/' : page.route}`;
  const targetDir = page.route === '/' ? distDir : path.join(distDir, page.route.replace(/^\//, ''));
  const targetPath = path.join(targetDir, 'index.html');

  try {
    const existingHtml = await fs.readFile(targetPath, 'utf8');
    if (existingHtml.includes('data-preserve-static-route="true"')) {
      console.log(`Preserved static HTML shell for ${page.route}`);
      continue;
    }
  } catch {
    // No existing static page for this route; generate the normal crawlable shell.
  }

  let html = baseTemplate
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="description")/, `<meta name="description" content="${escapeHtml(page.description)}">`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>(?![\s\S]*<link rel="canonical")/, `<link rel="canonical" href="${canonicalUrl}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:url")/, `<meta property="og:url" content="${canonicalUrl}">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:title")/, `<meta property="og:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:description")/, `<meta property="og:description" content="${escapeHtml(page.description)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:title")/, `<meta name="twitter:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:description")/, `<meta name="twitter:description" content="${escapeHtml(page.description)}">`)
    .replace('</body>', `<noscript>${page.noscriptHtml}</noscript></body>`);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, html);
  console.log(`Generated crawlable HTML shell for ${page.route}`);
}
