import { createServer } from "node:http";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const secretsDir = process.env.GSC_SECRETS_DIR || "/Users/matthewbrown/Secrets";
const tokenPath = process.env.GSC_TOKEN_PATH || path.join(secretsDir, "freedominterventions-gsc-token.json");
const reportsDir = process.env.GSC_REPORTS_DIR || "/Users/matthewbrown/Desktop/SH/SEO";
const defaultSiteUrl = "sc-domain:soberhelpline.com";
const scope = "https://www.googleapis.com/auth/webmasters.readonly";

const parseArgs = () => new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.replace(/^--/, "").split("=");
  return [key, value];
}));
const toDate = (date) => date.toISOString().slice(0, 10);
const subtractDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() - days);
  return next;
};
const pct = (value) => `${(Number(value || 0) * 100).toFixed(2)}%`;
const num = (value) => Number(value || 0).toLocaleString("en-US");
const round = (value, places = 1) => Number(value || 0).toFixed(places);

const findClientSecret = async () => {
  const configured = process.env.GSC_CLIENT_SECRET_PATH;
  if (configured && existsSync(configured)) return configured;
  const files = await readdir(secretsDir);
  const match = files.find((file) => /^client_secret_.*\.json$/i.test(file));
  if (!match) throw new Error(`No client_secret_*.json file found in ${secretsDir}`);
  return path.join(secretsDir, match);
};

const readClient = async () => {
  const raw = JSON.parse(await readFile(await findClientSecret(), "utf8"));
  const credentials = raw.installed || raw.web;
  if (!credentials?.client_id || !credentials?.client_secret) {
    throw new Error("OAuth client file is missing client_id or client_secret.");
  }
  return credentials;
};

const waitForOAuthCode = async (client, openBrowser = true) => {
  const server = createServer();
  let redirectUri;
  const codePromise = new Promise((resolve, reject) => {
    server.on("request", (req, res) => {
      try {
        const url = new URL(req.url || "/", redirectUri);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        if (error) {
          res.writeHead(400, { "content-type": "text/plain" });
          res.end(`Authorization failed: ${error}`);
          reject(new Error(error));
          return;
        }
        if (!code) {
          res.writeHead(404, { "content-type": "text/plain" });
          res.end("No OAuth code found.");
          return;
        }
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Search Console authorization complete. You can close this tab and return to Codex.");
        resolve(code);
      } catch (error) {
        reject(error);
      }
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", client.client_id);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("scope", scope);
  console.log("\nOpen this URL to authorize Search Console access:\n");
  console.log(authUrl.toString());
  console.log("");
  if (openBrowser && process.platform === "darwin") {
    const { spawn } = await import("node:child_process");
    spawn("open", [authUrl.toString()], { stdio: "ignore", detached: true }).unref();
  }
  try {
    const code = await codePromise;
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: client.client_id, client_secret: client.client_secret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
    });
    if (!response.ok) throw new Error(`OAuth token exchange failed: ${await response.text()}`);
    return response.json();
  } finally {
    server.close();
  }
};

const refreshToken = async (client, token) => {
  if (!token.refresh_token) return token;
  if (token.expiry_date && token.expiry_date - Date.now() > 120000) return token;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: client.client_id, client_secret: client.client_secret, refresh_token: token.refresh_token, grant_type: "refresh_token" }),
  });
  if (!response.ok) throw new Error(`OAuth refresh failed: ${await response.text()}`);
  const refreshed = await response.json();
  const next = { ...token, ...refreshed, refresh_token: token.refresh_token, expiry_date: refreshed.expires_in ? Date.now() + refreshed.expires_in * 1000 : token.expiry_date };
  await writeFile(tokenPath, JSON.stringify(next, null, 2), "utf8");
  return next;
};

const getAccessToken = async ({ reauth = false, openBrowser = true } = {}) => {
  const client = await readClient();
  if (!reauth && existsSync(tokenPath)) {
    const token = JSON.parse(await readFile(tokenPath, "utf8"));
    return (await refreshToken(client, token)).access_token;
  }
  const token = await waitForOAuthCode(client, openBrowser);
  const saved = { ...token, expiry_date: token.expires_in ? Date.now() + token.expires_in * 1000 : undefined };
  await mkdir(path.dirname(tokenPath), { recursive: true });
  await writeFile(tokenPath, JSON.stringify(saved, null, 2), "utf8");
  console.log(`Saved OAuth token to ${tokenPath}`);
  return saved.access_token;
};

const querySearchAnalytics = async (accessToken, siteUrl, requestBody) => {
  const response = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) throw new Error(`Search Console query failed: ${await response.text()}`);
  const data = await response.json();
  return data.rows || [];
};

const aggregateRows = (rows) => {
  const totals = rows.reduce((acc, row) => {
    acc.clicks += row.clicks || 0;
    acc.impressions += row.impressions || 0;
    acc.positionWeighted += (row.position || 0) * (row.impressions || 0);
    return acc;
  }, { clicks: 0, impressions: 0, positionWeighted: 0 });
  return { clicks: totals.clicks, impressions: totals.impressions, ctr: totals.impressions ? totals.clicks / totals.impressions : 0, position: totals.impressions ? totals.positionWeighted / totals.impressions : 0 };
};
const topRows = (rows, limit = 10) => rows.slice().sort((a, b) => (b.clicks || 0) - (a.clicks || 0) || (b.impressions || 0) - (a.impressions || 0)).slice(0, limit);
const opportunityRows = (rows, limit = 15) => rows.filter((row) => (row.impressions || 0) >= 5).slice().sort((a, b) => (b.impressions || 0) - (a.impressions || 0)).slice(0, limit);
const createReport = ({ pageRows, queryRows, queryPageRows }) => ({ total: aggregateRows(pageRows), topQueries: topRows(queryRows), topPages: topRows(pageRows), opportunities: opportunityRows(queryPageRows), noClickOpportunities: opportunityRows(queryPageRows.filter((row) => !row.clicks)) });

const cleanText = (value) => String(value || "").replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "'").replace(/\s+/g, " ").trim();
const wrapText = (text, maxChars = 92) => {
  const words = cleanText(text).split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
};
const escapePdf = (text) => cleanText(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const pdfText = (text, x, y, size = 10) => `BT /F1 ${size} Tf ${x} ${y} Td (${escapePdf(text)}) Tj ET\n`;

const writePdfReport = async (filePath, { siteUrl, startDate, endDate, result }) => {
  const pages = [];
  let content = "";
  let y = 750;
  const addPage = () => { pages.push(content); content = ""; y = 750; };
  const addLine = (text, size = 10, gap = 14) => { if (y < 55) addPage(); content += pdfText(text, 42, y, size); y -= gap; };
  const addWrapped = (text, size = 10, gap = 14, maxChars = 92) => { for (const line of wrapText(text, maxChars)) addLine(line, size, gap); };
  const addSection = (title) => { y -= 8; addLine(title, 14, 20); };
  const addRows = (rows, mapper) => {
    if (!rows.length) { addLine("No matching rows in this period.", 9, 14); return; }
    rows.forEach((row, index) => {
      const mapped = mapper(row);
      addWrapped(`${index + 1}. ${mapped.title}`, 10, 13, 86);
      if (mapped.detail) addWrapped(mapped.detail, 8, 11, 105);
      addWrapped(mapped.metrics, 9, 15, 96);
    });
  };
  addLine("GSC Weekly Report", 22, 26);
  addLine(`Property: ${siteUrl}`, 10, 14);
  addLine(`Date range: ${startDate} to ${endDate}`, 10, 22);
  addSection("Executive Read");
  addLine(`Organic search: ${num(result.total.clicks)} clicks | ${num(result.total.impressions)} impressions | ${pct(result.total.ctr)} CTR | avg position ${round(result.total.position)}`, 10, 16);
  addWrapped("The business question is whether non-branded search impressions are turning into clicks, calls, emails, or booked appointments.", 9, 13, 98);
  addSection("Top Queries By Clicks");
  addRows(result.topQueries, (row) => ({ title: row.keys?.[0] || "", metrics: `${num(row.clicks)} clicks | ${num(row.impressions)} impressions | ${pct(row.ctr)} CTR | avg position ${round(row.position)}` }));
  addSection("Top Pages By Clicks");
  addRows(result.topPages, (row) => ({ title: row.keys?.[0] || "", metrics: `${num(row.clicks)} clicks | ${num(row.impressions)} impressions | ${pct(row.ctr)} CTR | avg position ${round(row.position)}` }));
  addSection("High-Impression Opportunities");
  addRows(result.opportunities, (row) => ({ title: row.keys?.[0] || "", detail: row.keys?.[1] || "", metrics: `${num(row.clicks)} clicks | ${num(row.impressions)} impressions | ${pct(row.ctr)} CTR | avg position ${round(row.position)}` }));
  addSection("Zero-Click Opportunities");
  addRows(result.noClickOpportunities, (row) => ({ title: row.keys?.[0] || "", detail: row.keys?.[1] || "", metrics: `${num(row.impressions)} impressions | avg position ${round(row.position)}` }));
  addSection("Recommended Next Action");
  ["Rewrite titles, descriptions, H1s, and opening copy for pages with impressions, low CTR, and positions 1-15.", "For pages worse than position 15, add content depth and internal links before expecting quick CTR gains.", "Move high-intent pages toward calls, emails, or booked appointments with clearer CTAs."].forEach((item, index) => addWrapped(`${index + 1}. ${item}`, 9, 13, 98));
  if (content) addPage();

  const objects = [];
  const addObject = (body) => { objects.push(body); return objects.length; };
  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("PAGES_PLACEHOLDER");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];
  for (const pageContent of pages) {
    const contentId = addObject(`<< /Length ${Buffer.byteLength(pageContent, "latin1")} >>\nstream\n${pageContent}endstream`);
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  }
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf, "latin1")); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  await writeFile(filePath, Buffer.from(pdf, "latin1"));
};

const main = async () => {
  const args = parseArgs();
  const now = new Date();
  const endDate = args.get("end") || toDate(subtractDays(now, 2));
  const days = Number(args.get("days") || 7);
  const startDate = args.get("start") || toDate(subtractDays(new Date(`${endDate}T00:00:00Z`), days - 1));
  const siteUrl = args.get("site") || process.env.GSC_SITE_URL || defaultSiteUrl;
  const accessToken = await getAccessToken({ reauth: args.has("reauth"), openBrowser: !args.has("no-open") });
  const baseRequest = { startDate, endDate, rowLimit: Number(args.get("rowLimit") || 25000), searchType: "web" };
  const [queryRows, pageRows, queryPageRows] = await Promise.all([
    querySearchAnalytics(accessToken, siteUrl, { ...baseRequest, dimensions: ["query"] }),
    querySearchAnalytics(accessToken, siteUrl, { ...baseRequest, dimensions: ["page"] }),
    querySearchAnalytics(accessToken, siteUrl, { ...baseRequest, dimensions: ["query", "page"] }),
  ]);
  const result = createReport({ pageRows, queryRows, queryPageRows });
  await mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${endDate}-weekly-gsc-report.pdf`);
  const dataPath = path.join(reportsDir, `${endDate}-weekly-gsc-data.json`);
  await writePdfReport(reportPath, { siteUrl, startDate, endDate, result });
  await writeFile(dataPath, JSON.stringify({ siteUrl, startDate, endDate, generatedAt: new Date().toISOString(), ...result }, null, 2), "utf8");
  console.log(`Wrote ${reportPath}`);
  console.log(`Wrote ${dataPath}`);
};

main().catch((error) => { console.error(error.message); process.exit(1); });
