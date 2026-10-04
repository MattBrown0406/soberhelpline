// Universal links: https://soberhelpline.com/app and /app/* open the Sober Helpline
// iOS app (Apple Team ID 4D2KRG86P2, bundle id com.soberhelplineapp).
//
// iOS (through Apple's CDN) reads https://soberhelpline.com/.well-known/apple-app-site-association.
// It must be served at exactly that path (no extension), as valid JSON, over HTTPS,
// with no redirect. This check fails the build when the file is missing, is not
// valid JSON, does not match the contract, or did not reach the build output.
//
// Run: node scripts/validate-app-site-association.mjs
// (part of `npm run build` and `npm run seo:validate`). After a build it also checks
// dist/.well-known/apple-app-site-association is a byte-for-byte copy.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

export const APP_SITE_ASSOCIATION_PATH = '.well-known/apple-app-site-association';

// The exact applinks section from the app ⇄ website contract (2026-10-03, §A).
export const EXPECTED_APPLINKS = {
  details: [
    {
      appIDs: ['4D2KRG86P2.com.soberhelplineapp'],
      components: [
        { '/': '/app' },
        { '/': '/app/*' },
      ],
    },
  ],
};

// Other top-level services Apple defines; allowed so they can be added later.
const KNOWN_SERVICES = new Set(['applinks', 'webcredentials', 'appclips', 'activitycontinuation']);
// Apple's limit for the uncompressed file.
const MAX_BYTES = 128 * 1024;

function checkFile(file, label) {
  const issues = [];
  let stat;
  try {
    stat = fs.lstatSync(file);
  } catch {
    return { issues: [`${label}: missing (${path.relative(process.cwd(), file)}).`], bytes: null };
  }
  if (!stat.isFile()) return { issues: [`${label}: is not a regular file.`], bytes: null };
  if (stat.size === 0) return { issues: [`${label}: is empty.`], bytes: null };
  if (stat.size > MAX_BYTES) issues.push(`${label}: is ${stat.size} bytes; Apple's limit is ${MAX_BYTES}.`);

  const bytes = fs.readFileSync(file);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) issues.push(`${label}: starts with a byte-order mark.`);

  let parsed;
  try {
    parsed = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    issues.push(`${label}: is not valid JSON (${error.message}).`);
    return { issues, bytes };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    issues.push(`${label}: top level must be a JSON object.`);
    return { issues, bytes };
  }
  for (const key of Object.keys(parsed)) {
    if (!KNOWN_SERVICES.has(key)) issues.push(`${label}: unknown top-level key "${key}".`);
  }
  if (!isDeepStrictEqual(parsed.applinks, EXPECTED_APPLINKS)) {
    issues.push(
      `${label}: "applinks" must be exactly ${JSON.stringify(EXPECTED_APPLINKS)} ` +
        `(found ${JSON.stringify(parsed.applinks ?? null)}).`,
    );
  }
  return { issues, bytes };
}

/**
 * Returns a list of problems (empty when everything is fine).
 * `distDir` is checked only when it exists (i.e. after `vite build`).
 */
export function validateAppSiteAssociation({ root = process.cwd(), distDir = path.join(root, 'dist') } = {}) {
  const source = checkFile(path.join(root, 'public', APP_SITE_ASSOCIATION_PATH), `public/${APP_SITE_ASSOCIATION_PATH}`);
  const issues = [...source.issues];

  if (fs.existsSync(distDir)) {
    const built = checkFile(path.join(distDir, APP_SITE_ASSOCIATION_PATH), `dist/${APP_SITE_ASSOCIATION_PATH}`);
    issues.push(...built.issues);
    if (source.bytes && built.bytes && !source.bytes.equals(built.bytes)) {
      issues.push(`dist/${APP_SITE_ASSOCIATION_PATH}: differs from public/${APP_SITE_ASSOCIATION_PATH}.`);
    }
    // A clean-URL HTML page with the same name could be served instead of the file.
    if (fs.existsSync(path.join(distDir, `${APP_SITE_ASSOCIATION_PATH}.html`))) {
      issues.push(`dist/${APP_SITE_ASSOCIATION_PATH}.html exists and could shadow the association file.`);
    }
  }
  return issues;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const issues = validateAppSiteAssociation();
  if (issues.length) {
    console.error('apple-app-site-association check failed:');
    for (const issue of issues) console.error(`  - ${issue}`);
    process.exit(1);
  }
  console.log(`apple-app-site-association OK (${APP_SITE_ASSOCIATION_PATH})`);
}
