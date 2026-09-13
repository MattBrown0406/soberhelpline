import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Offline only. No browser storage, network calls, tracking pixels or event emission.
// Exact documented domain only: arbitrary subdomains are deliberately not trusted.
export function isChatGPTReferrer(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password &&
      ['chatgpt.com', 'www.chatgpt.com'].includes(url.hostname.toLowerCase().replace(/\.$/, ''));
  } catch { return false; }
}
export function classifyChatGPT({ source = '', referrer = '' } = {}) {
  // An explicit source takes precedence; do not overwrite paid/email attribution.
  if (source.trim()) return source.trim().toLowerCase() === 'chatgpt.com' ? 'chatgpt' : 'other';
  return isChatGPTReferrer(referrer) ? 'chatgpt' : 'other';
}
export function ga4Request(startDate, endDate) {
  if (![startDate, endDate].every(d => /^\d{4}-\d{2}-\d{2}$/.test(d)) || startDate > endDate) throw Error('Use an ordered YYYY-MM-DD window');
  return {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }, { name: 'landingPage' }],
    metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'keyEvents' }],
    dimensionFilter: { filter: { fieldName: 'sessionSource', stringFilter: { matchType: 'EXACT', value: 'chatgpt.com', caseSensitive: false } } },
    limit: '10000', offset: '0', keepEmptyRows: false
  };
}
// Input must be an already-consented aggregate export, never raw visits or form records.
// Only approved public landing paths leave this function; all other strings are discarded.
export function summarize(rows, { approvedPaths = [], consent = false } = {}) {
  if (consent !== true) return { status: 'not_processed_without_confirmed_consent', landings: [] };
  const totals = new Map();
  for (const row of rows) {
    if (classifyChatGPT(row) !== 'chatgpt') continue;
    let path;
    try { path = new URL(row.landingPage, 'https://report.invalid').pathname; } catch { continue; }
    if (!approvedPaths.includes(path)) continue;
    const sessions = Number(row.sessions);
    if (!Number.isSafeInteger(sessions) || sessions < 0) throw Error('Invalid aggregate sessions');
    totals.set(path, (totals.get(path) || 0) + sessions);
  }
  return { status: 'aggregate_export_only', landings: [...totals].sort(([a], [b]) => a.localeCompare(b)).map(([landingPage, sessions]) => ({ landingPage, sessions })) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [command, a, b] = process.argv.slice(2);
  if (command === 'request') console.log(JSON.stringify(ga4Request(a, b), null, 2));
  else if (command === 'summarize') {
    const { rows, approvedPaths, consent } = JSON.parse(readFileSync(a, 'utf8'));
    console.log(JSON.stringify(summarize(rows, { approvedPaths, consent }), null, 2));
  } else throw Error('Usage: node scripts/chatgpt-referrals.mjs request START END | summarize AGGREGATE.json');
}
