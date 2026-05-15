import fs from 'node:fs/promises';
import path from 'node:path';
import { prerenderPages, SITE_URL } from './seo-routes.mjs';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseTemplatePath = path.join(distDir, 'index.html');
const baseTemplate = await fs.readFile(baseTemplatePath, 'utf8');
const familyAnswersPath = path.join(root, 'src', 'data', 'familyAddictionAnswers.ts');
const blogPostsPath = path.join(root, 'src', 'data', 'blogPosts.ts');
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
const allPrerenderPages = [...prerenderPages, ...blogPostPages, ...familyAnswerPages];

const socialImageTags = (page) => page.image ? `
    <meta property="og:image" content="${escapeHtml(page.image)}">
    <meta property="og:image:secure_url" content="${escapeHtml(page.image)}">
    <meta property="og:image:alt" content="${escapeHtml(page.title)}">
    <meta name="twitter:image" content="${escapeHtml(page.image)}">
    <meta name="twitter:image:alt" content="${escapeHtml(page.title)}">` : '';

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
    .replace(/\s*<meta property="og:image[^>]*>\n?/g, '')
    .replace(/\s*<meta name="twitter:image[^>]*>\n?/g, '')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="description")/, `<meta name="description" content="${escapeHtml(page.description)}">`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>(?![\s\S]*<link rel="canonical")/, `<link rel="canonical" href="${canonicalUrl}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:url")/, `<meta property="og:url" content="${canonicalUrl}">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:title")/, `<meta property="og:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta property="og:description")/, `<meta property="og:description" content="${escapeHtml(page.description)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:title")/, `<meta name="twitter:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>(?![\s\S]*<meta name="twitter:description")/, `<meta name="twitter:description" content="${escapeHtml(page.description)}">`)
    .replace('</head>', `${socialImageTags(page)}${articleTags(page)}\n</head>`)
    .replace('</body>', `<noscript>${page.noscriptHtml}</noscript></body>`);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, html);
  console.log(`Generated crawlable HTML shell for ${page.route}`);
}
