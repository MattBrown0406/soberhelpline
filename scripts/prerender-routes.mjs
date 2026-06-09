import fs from 'node:fs/promises';
import path from 'node:path';
import { prerenderPages, SITE_URL, excludedSitemapRoutes } from './seo-routes.mjs';

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
  const match = block.match(new RegExp(`${field}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
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
    const canonical = `${SITE_URL}/blog/${slug}`;

    if (!slug || !title || !description) return null;

    return {
      route: `/blog/${slug}`,
      title: title.includes('Sober Helpline') ? title : `${title} | Sober Helpline`,
      description,
      image,
      ogType: 'article',
      publishedTime: date,
      modifiedTime: date,
      section: category,
      author,
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
    if (!route.startsWith('/') || route.includes(':') || excludedSitemapRoutes.has(route) || route.startsWith('/subscription/')) continue;
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
      title,
      description: truncateDescription(description),
      noscriptHtml: `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p><p><a href="${SITE_URL}${route === '/' ? '/' : route}">Open this Sober Helpline page</a></p></main>`,
    });
  }

  return pages;
};

const appRoutePages = await getRouteMetadataPages();
const explicitPrerenderRoutes = new Set([...prerenderPages, ...blogPostPages, ...familyAnswerPages].map((page) => page.route));
const allPrerenderPages = [
  ...prerenderPages,
  ...appRoutePages.filter((page) => !explicitPrerenderRoutes.has(page.route)),
  ...blogPostPages,
  ...familyAnswerPages,
];

const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;

const socialImageTags = (page) => {
  const image = page.image || DEFAULT_SOCIAL_IMAGE;
  return `
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:secure_url" content="${escapeHtml(image)}">
    <meta property="og:image:alt" content="${escapeHtml(page.title)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    <meta name="twitter:image:alt" content="${escapeHtml(page.title)}">`;
};

const articleTags = (page) => page.ogType === 'article' ? `
    <meta property="og:type" content="article">
    ${page.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(page.publishedTime)}">` : ''}
    ${page.modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(page.modifiedTime)}">` : ''}
    ${page.author ? `<meta property="article:author" content="${escapeHtml(page.author)}">` : ''}
    ${page.section ? `<meta property="article:section" content="${escapeHtml(page.section)}">` : ''}` : '';

for (const page of allPrerenderPages) {
  const canonicalUrl = `${SITE_URL}${page.route === '/' ? '/' : page.route}`;
  const targetDir = page.route === '/' ? distDir : path.join(distDir, page.route.replace(/^\//, ''));
  const targetPath = path.join(targetDir, 'index.html');
  const cleanUrlPath = page.route === '/' ? null : `${targetDir}.html`;

  try {
    const existingHtml = await fs.readFile(targetPath, 'utf8');
    if (existingHtml.includes('data-preserve-static-route="true"')) {
      const normalizedHtml = existingHtml
        .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>(?![\s\S]*<link rel="canonical")/g, '')
        .replace('</head>', `    <link rel="canonical" href="${canonicalUrl}">\n</head>`);
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
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="description")/, `<meta name="description" content="${escapeHtml(page.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:url")/, `<meta property="og:url" content="${canonicalUrl}">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:title")/, `<meta property="og:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:description")/, `<meta property="og:description" content="${escapeHtml(page.description)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:title")/, `<meta name="twitter:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:description")/, `<meta name="twitter:description" content="${escapeHtml(page.description)}">`)
    .replace('</head>', `    <link rel="canonical" href="${canonicalUrl}">${socialImageTags(page)}${articleTags(page)}\n</head>`)
    .replace('</body>', `<noscript>${page.noscriptHtml}</noscript></body>`);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, html);
  if (cleanUrlPath) {
    await fs.mkdir(path.dirname(cleanUrlPath), { recursive: true });
    await fs.writeFile(cleanUrlPath, html);
  }
  console.log(`Generated crawlable HTML shell for ${page.route}`);
}
