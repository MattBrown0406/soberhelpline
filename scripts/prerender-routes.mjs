import fs from 'node:fs/promises';
import path from 'node:path';
import { prerenderPages, SITE_URL, excludedSitemapRoutes, canonicalRouteAliases } from './seo-routes.mjs';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseTemplatePath = path.join(distDir, 'index.html');
const baseTemplate = await fs.readFile(baseTemplatePath, 'utf8');
const familyAnswersPath = path.join(root, 'src', 'data', 'familyAddictionAnswers.ts');
const blogPostsPath = path.join(root, 'src', 'data', 'blogPosts.ts');
const appPath = path.join(root, 'src', 'App.tsx');
const routeMetadataPath = path.join(root, 'src', 'data', 'routeMetadata.ts');
const pagesDir = path.join(root, 'src', 'pages');
const distAssetsDir = path.join(distDir, 'assets');

const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const decodeStringLiteral = (value = '') => value
  .replace(/\\"/g, '"')
  .replace(/\\'/g, "'")
  .replace(/\\n/g, ' ')
  .replace(/\\u2019/g, '\u2019')
  .replace(/\\u201c/g, '\u201c')
  .replace(/\\u201d/g, '\u201d');

const getStringField = (block, field) => {
  const match = block.match(new RegExp(`${field}\\s*[:=]\\s*"((?:\\\\.|[^"\\\\])*)"`))
    || block.match(new RegExp(`${field}\\s*[:=]\\s*'((?:\\\\.|[^'\\\\])*)'`));
  return match ? decodeStringLiteral(match[1]) : '';
};

const getIdentifierField = (block, field) => {
  const match = block.match(new RegExp(`${field}:\\s*([A-Za-z0-9_]+)`));
  return match ? match[1] : '';
};

const truncateDescription = (value) => {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim();
  return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
};

const fitSeoTitle = (value, maxLength = 60) => {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  const suffix = ' | Sober Helpline';
  if (cleaned.endsWith(suffix)) {
    const base = cleaned.slice(0, -suffix.length).trim();
    const maxBaseLength = maxLength - suffix.length;
    return `${base.slice(0, Math.max(1, maxBaseLength - 3)).trimEnd()}...${suffix}`;
  }
  return `${cleaned.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
};

const buildSeoTitle = (value) => {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim();
  const suffix = ' | Sober Helpline';
  return fitSeoTitle(cleaned.includes('Sober Helpline') ? cleaned : `${cleaned}${suffix}`);
};

const readDistAssets = async () => {
  try {
    return await fs.readdir(distAssetsDir);
  } catch {
    return [];
  }
};

const resolveBlogImageUrl = (assetFile, emittedAssets) => {
  if (!assetFile) return `${SITE_URL}/favicon.png`;

  const parsed = path.parse(assetFile);
  const emitted = emittedAssets.find((file) => file.startsWith(`${parsed.name}-`) && file.endsWith(parsed.ext))
    || emittedAssets.find((file) => file === `${parsed.name}${parsed.ext}`);

  return emitted ? `${SITE_URL}/assets/${emitted}` : `${SITE_URL}/favicon.png`;
};

const getBlogPostPages = async () => {
  let source = '';
  try {
    source = await fs.readFile(blogPostsPath, 'utf8');
  } catch {
    return [];
  }

  const emittedAssets = await readDistAssets();
  const assetImports = new Map(
    [...source.matchAll(/import\s+([A-Za-z0-9_]+)\s+from\s+["']@\/assets\/([^"']+)["']/g)]
      .map(([, identifier, assetFile]) => [identifier, assetFile])
  );

  const slugMatches = [...source.matchAll(/\bslug:\s*"((?:\\.|[^"\\])*)"/g)];

  return slugMatches.map((match, index) => {
    const slug = decodeStringLiteral(match[1]);
    const nextMatch = slugMatches[index + 1];
    const block = source.slice(match.index, nextMatch?.index ?? source.length);
    const title = getStringField(block, 'seoTitle') || getStringField(block, 'title');
    const description = truncateDescription(getStringField(block, 'metaDescription') || getStringField(block, 'excerpt'));
    const category = getStringField(block, 'category');
    const author = getStringField(block, 'author') || 'Matt Brown';
    const date = getStringField(block, 'date');
    const imageIdentifier = getIdentifierField(block, 'image');
    const image = resolveBlogImageUrl(assetImports.get(imageIdentifier), emittedAssets);
    const route = `/blog/${slug}`;
    const canonicalPath = canonicalRouteAliases.get(route);
    const canonical = `${SITE_URL}${canonicalPath ?? route}`;

    if (!slug || !title || !description) return null;

    return {
      route,
      canonicalPath,
      title: buildSeoTitle(title),
      description,
      image,
      ogType: 'article',
      publishedTime: date,
      modifiedTime: date,
      section: category,
      author,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image,
        author: {
          "@type": "Person",
          name: author,
          url: "https://freedominterventions.com/interventionist",
        },
        publisher: {
          "@type": "Organization",
          name: "Sober Helpline",
          url: SITE_URL,
        },
        datePublished: date,
        dateModified: date,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
        articleSection: category,
        isAccessibleForFree: true,
      },
      noscriptHtml: `<main><h1>${escapeHtml(title)}</h1><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="max-width:100%;height:auto;"><p>${escapeHtml(description)}</p><p><a href="${canonical}">Read this article on Sober Helpline</a></p><p><a href="https://soberhelpline.com/book-consultation">Book a consultation</a> <a href="https://soberhelpline.com/family-squares">Join Family Squares</a></p></main>`,
    };
  }).filter(Boolean);
};

const familyAnswersSource = await fs.readFile(familyAnswersPath, 'utf8');
const familyAnswerPages = [...familyAnswersSource.matchAll(/slug:\s*"([^"]+)"[\s\S]*?question:\s*"([^"]+)"[\s\S]*?shortAnswer:\s*\n?\s*"([^"]+)"/g)]
  .map(([, slug, question, shortAnswer]) => {
    const title = `${question} | Sober Helpline`;
    const description = shortAnswer;
    const escapedQuestion = escapeHtml(question);
    const escapedAnswer = escapeHtml(shortAnswer);

    return {
      route: `/family-addiction-answers/${slug}`,
      title,
      description,
      noscriptHtml: `<main><h1>${escapedQuestion}</h1><p>${escapedAnswer}</p><p><a href="https://soberhelpline.com/family-squares">Join Family Squares</a> <a href="https://soberhelpline.com/book-consultation">Book a private session</a> <a href="https://soberhelpline.com/intervention-help">Check intervention readiness</a></p></main>`,
    };
  });

const blogPostPages = await getBlogPostPages();

const titleCaseFromRoute = (route) => route
  .replace(/^\//, '')
  .split('/')
  .pop()
  ?.split('-')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ') || 'Sober Helpline';

const getRouteMetadataPages = async () => {
  let appSource = '';
  let metadataSource = '';

  try {
    appSource = await fs.readFile(appPath, 'utf8');
    metadataSource = await fs.readFile(routeMetadataPath, 'utf8');
  } catch {
    return [];
  }

  const componentFiles = new Map();

  for (const [, component, pageFile] of appSource.matchAll(/import\s+([A-Za-z0-9_]+)\s+from\s+["']\.\/pages\/([^"']+)["']/g)) {
    componentFiles.set(component, pageFile);
  }

  for (const [, component, pageFile] of appSource.matchAll(/const\s+([A-Za-z0-9_]+)\s*=\s*React\.lazy\(\(\)\s*=>\s*import\(["']\.\/pages\/([^"']+)["']\)\)/g)) {
    componentFiles.set(component, pageFile);
  }

  for (const [, alias, target] of appSource.matchAll(/const\s+([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+);/g)) {
    if (componentFiles.has(target)) {
      componentFiles.set(alias, componentFiles.get(target));
    }
  }

  const metadataByRoute = new Map();
  for (const [, route, block] of metadataSource.matchAll(/['"]([^'"]+)['"]:\s*\{([\s\S]*?)\n\s*\}/g)) {
    const title = getStringField(block, 'title');
    const description = getStringField(block, 'description');
    if (title && description) {
      metadataByRoute.set(route, { title, description });
    }
  }

  const pages = [];
  const seen = new Set();

  for (const [, route, component] of appSource.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<([A-Za-z0-9_]+)/g)) {
    if (!route.startsWith('/') || route.includes(':') || component === 'BlogArticle') continue;
    if (seen.has(route)) continue;
    seen.add(route);

    const pageFile = componentFiles.get(component);
    const pagePath = pageFile ? path.join(pagesDir, `${pageFile}.tsx`) : '';
    let pageSource = '';
    try {
      pageSource = pagePath ? await fs.readFile(pagePath, 'utf8') : '';
    } catch {
      pageSource = '';
    }

    const seoBlock = pageSource.match(/<SEOHead\b([\s\S]*?)(?:\/?>)/)?.[1] || '';
    const helmetTitle = pageSource.match(/<title>\s*([^<]+?)\s*<\/title>/)?.[1] || '';
    const h1 = pageSource.match(/<h1[^>]*>\s*([^<]+?)\s*<\/h1>/)?.[1] || '';
    const title = getStringField(seoBlock, 'title')
      || helmetTitle
      || metadataByRoute.get(route)?.title
      || `${titleCaseFromRoute(route)} | Sober Helpline`;
    const description = getStringField(seoBlock, 'description')
      || metadataByRoute.get(route)?.description
      || `Sober Helpline resources and family addiction support for ${titleCaseFromRoute(route)}.`;
    const heading = h1 || title.replace(/\s*\|\s*Sober Helpline\s*$/i, '');

    pages.push({
      route,
      canonicalPath: canonicalRouteAliases.get(route),
      noIndex: excludedSitemapRoutes.has(route) || route.startsWith('/subscription/'),
      title,
      description: truncateDescription(description),
      noscriptHtml: `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p><p><a href="${SITE_URL}${route === '/' ? '/' : route}">Open this Sober Helpline page</a></p></main>`,
    });
  }

  return pages;
};

const appRoutePages = await getRouteMetadataPages();
const appSourceForAliases = await fs.readFile(appPath, 'utf8');
const canonicalBlogPages = new Map(blogPostPages.map((page) => [page.route.replace(/^\/blog\//, ''), page]));
const legacyBlogAliasPages = [...appSourceForAliases.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<BlogArticle\s*\/>\}/g)]
  .map(([, route]) => {
    if (route.startsWith('/blog/') || route.includes(':')) return null;
    const canonicalPage = canonicalBlogPages.get(route.replace(/^\//, ''));
    return canonicalPage ? {
      ...canonicalPage,
      route,
      canonicalPath: canonicalPage.canonicalPath ?? canonicalPage.route,
    } : null;
  })
  .filter(Boolean);
const explicitPrerenderRoutes = new Set([...prerenderPages, ...blogPostPages, ...familyAnswerPages, ...legacyBlogAliasPages].map((page) => page.route));
const allPrerenderPages = [
  ...prerenderPages,
  ...appRoutePages.filter((page) => !explicitPrerenderRoutes.has(page.route)),
  ...blogPostPages,
  ...familyAnswerPages,
  ...legacyBlogAliasPages,
];

const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;

const socialImageTags = (page) => {
  const image = page.image || DEFAULT_SOCIAL_IMAGE;
  return `
    <meta property="og:image" content="${escapeHtml(image)}" data-rh="true">
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" data-rh="true">
    <meta property="og:image:width" content="1200" data-rh="true">
    <meta property="og:image:height" content="630" data-rh="true">
    <meta property="og:image:alt" content="${escapeHtml(page.title)}" data-rh="true">
    <meta name="twitter:image" content="${escapeHtml(image)}" data-rh="true">
    <meta name="twitter:image:alt" content="${escapeHtml(page.title)}" data-rh="true">`;
};

const articleTags = (page) => page.ogType === 'article' ? `
    ${page.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(page.publishedTime)}" data-rh="true">` : ''}
    ${page.modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(page.modifiedTime)}" data-rh="true">` : ''}
    ${page.author ? `<meta property="article:author" content="${escapeHtml(page.author)}" data-rh="true">` : ''}
    ${page.section ? `<meta property="article:section" content="${escapeHtml(page.section)}" data-rh="true">` : ''}` : '';

const jsonLdTags = (page) => page.jsonLd
  ? `\n    <script type="application/ld+json"${page.jsonLd['@type'] === 'Article' ? ' data-schema="article"' : ''}>${JSON.stringify(page.jsonLd).replaceAll('<', '\\u003c')}</script>`
  : '';

const replaceOrInsertHeadTag = (html, pattern, replacement) => pattern.test(html)
  ? html.replace(pattern, replacement)
  : html.replace('</head>', `    ${replacement}\n</head>`);

const HELMET_META_KEYS = new Set([
  'description', 'robots', 'ai:description', 'llm:description',
  'og:type', 'og:url', 'og:title', 'og:description', 'og:image', 'og:image:secure_url',
  'og:image:width', 'og:image:height', 'og:image:alt', 'og:site_name',
  'twitter:card', 'twitter:site', 'twitter:url', 'twitter:title', 'twitter:description',
  'twitter:image', 'twitter:image:alt', 'article:published_time', 'article:modified_time',
  'article:author', 'article:section',
]);
const markHelmetManagedTags = (html) => html
  .replace(/<title(?![^>]*\bdata-rh=)([^>]*)>/gi, '<title$1 data-rh="true">')
  .replace(/<meta\b([^>]*)>/gi, (tag, attributes) => {
    if (/\bdata-rh=/i.test(attributes)) return tag;
    const key = attributes.match(/\b(?:name|property)=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    return key && HELMET_META_KEYS.has(key) ? `<meta${attributes} data-rh="true">` : tag;
  })
  .replace(/<link\b([^>]*)>/gi, (tag, attributes) => {
    if (/\bdata-rh=/i.test(attributes)) return tag;
    const rel = attributes.match(/\brel=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    return rel && ['canonical', 'ai-context', 'ai-context-full'].includes(rel)
      ? `<link${attributes} data-rh="true">`
      : tag;
  });

for (const page of allPrerenderPages) {
  const canonicalRoute = page.canonicalPath ?? page.route;
  const canonicalUrl = `${SITE_URL}${canonicalRoute === '/' ? '/' : canonicalRoute}`;
  const robotsContent = page.noIndex ? 'noindex, nofollow' : 'index, follow';
  const renderedTitle = fitSeoTitle(page.title);
  const renderedDescription = truncateDescription(page.description);
  const renderedOgType = page.ogType ?? 'website';
  const targetDir = page.route === '/' ? distDir : path.join(distDir, page.route.replace(/^\//, ''));
  const targetPath = path.join(targetDir, 'index.html');
  const cleanUrlPath = page.route === '/' ? null : `${targetDir}.html`;

  try {
    const existingHtml = await fs.readFile(targetPath, 'utf8');
    if (existingHtml.includes('data-preserve-static-route="true"')) {
      let normalizedHtml = existingHtml.replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, '\n');
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<title[^>]*>[\s\S]*?<\/title>/i, `<title data-rh="true">${escapeHtml(renderedTitle)}</title>`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${escapeHtml(renderedDescription)}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robotsContent}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${renderedOgType}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(renderedTitle)}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(renderedDescription)}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(renderedTitle)}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(renderedDescription)}" data-rh="true">`);
      normalizedHtml = replaceOrInsertHeadTag(normalizedHtml, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" data-rh="true">`);
      normalizedHtml = markHelmetManagedTags(normalizedHtml);
      await fs.writeFile(targetPath, normalizedHtml);
      if (cleanUrlPath) {
        await fs.mkdir(path.dirname(cleanUrlPath), { recursive: true });
        await fs.writeFile(cleanUrlPath, normalizedHtml);
      }
      console.log(`Preserved static HTML shell for ${page.route} with canonical ${canonicalUrl}`);
      continue;
    }
  } catch {
    // No existing static page for this route; generate the normal crawlable shell.
  }

  let html = baseTemplate
    .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>(?![\s\S]*<link rel="canonical")/g, '')
    .replace(/\s*<meta property="og:image[^>]*>\n?/g, '')
    .replace(/\s*<meta name="twitter:image[^>]*>\n?/g, '')
    .replace(/<title[^>]*>[\s\S]*?<\/title>/, `<title data-rh="true">${escapeHtml(renderedTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="description")/, `<meta name="description" content="${escapeHtml(renderedDescription)}" data-rh="true">`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${robotsContent}" data-rh="true">`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${renderedOgType}" data-rh="true">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:url")/, `<meta property="og:url" content="${canonicalUrl}" data-rh="true">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:title")/, `<meta property="og:title" content="${escapeHtml(renderedTitle)}" data-rh="true">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:description")/, `<meta property="og:description" content="${escapeHtml(renderedDescription)}" data-rh="true">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:title")/, `<meta name="twitter:title" content="${escapeHtml(renderedTitle)}" data-rh="true">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:description")/, `<meta name="twitter:description" content="${escapeHtml(renderedDescription)}" data-rh="true">`)
    .replace('</head>', `    <link rel="canonical" href="${canonicalUrl}" data-rh="true">${socialImageTags(page)}${articleTags(page)}${jsonLdTags(page)}\n</head>`)
    .replace('</body>', `<noscript>${page.noscriptHtml}</noscript></body>`);
  html = markHelmetManagedTags(html);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, html);
  if (cleanUrlPath) {
    await fs.mkdir(path.dirname(cleanUrlPath), { recursive: true });
    await fs.writeFile(cleanUrlPath, html);
  }
  console.log(`Generated crawlable HTML shell for ${page.route}`);
}
