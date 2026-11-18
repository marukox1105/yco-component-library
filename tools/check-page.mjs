// Headless check of one engine page, independent of any browser pane or running server.
// Usage: node tools/check-page.mjs <id> [outDir]
// Serves this folder on a free port, opens #<id> at desktop / dark / 375px, clicks every control option once,
// and reports console errors, horizontal overflow, empty previews and the variant count.
// Screenshots go to outDir (default: $TMPDIR/yco-check-<id>); Read them to compare with Figma.
// Needs playwright: set PLAYWRIGHT_FROM to a checkout whose node_modules has it (default below).
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const id = process.argv[2];
if (!id) { console.error('usage: node tools/check-page.mjs <id> [outDir]'); process.exit(2); }
const out = path.resolve(process.argv[3] || path.join(os.tmpdir(), `yco-check-${id}`));
fs.mkdirSync(out, { recursive: true });
const from = process.env.PLAYWRIGHT_FROM || '/Users/marukoting/Claude/Projects/yco-collab-space';
const { chromium } = createRequire(path.join(from, 'package.json'))('playwright');

const root = path.resolve('.');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/plain' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(p.endsWith('/') ? 200 : 404, { 'content-type': 'text/html' }); return res.end(p.endsWith('/') || p === root ? fs.readFileSync(path.join(root, 'index.html')) : 'not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  res.end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
const report = { id, problems: [], runs: [] };
const runs = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, theme: 'light' },
  { name: 'dark', viewport: { width: 1440, height: 900 }, theme: 'dark' },
  { name: 'mobile', viewport: { width: 375, height: 812 }, theme: 'light' },
];
for (const r of runs) {
  const ctx = await browser.newContext({ viewport: r.viewport, isMobile: r.name === 'mobile' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (q) => errors.push('request failed: ' + q.url()));
  await page.goto(`${base}?nocache=${Date.now()}#${id}`);
  const rendered = await page.waitForSelector('#enginePage:not([hidden]) [data-role="surface"]', { timeout: 4000 }).then(() => true, () => false);
  if (!rendered) {
    report.problems.push(`${r.name}: page #${id} did not render (is it registered? does components/${id}.js run?)${errors.length ? ' errors: ' + errors.join(' | ') : ''}`);
    await ctx.close();
    continue;
  }
  if (r.theme === 'dark') await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(300);
  const info = { name: r.name, controlsClicked: 0 };
  // click every option of every chip control once, then every toggle both ways
  const keys = await page.$$eval('#enginePage [data-ctl]', (els) => [...new Set(els.map((e) => e.dataset.ctl))]);
  for (const key of keys) {
    const values = await page.$$eval(`#enginePage button[data-ctl="${key}"]`, (els) => els.map((e) => e.dataset.value));
    for (const v of values) {
      await page.click(`#enginePage button[data-ctl="${key}"][data-value="${v}"]`, { timeout: 2000 }).catch(() => {});
      info.controlsClicked++;
      const empty = await page.$eval('#enginePage [data-role="surface"]', (s) => s.innerHTML.trim().length === 0).catch(() => true);
      if (empty) report.problems.push(`${r.name}: preview is empty with ${key}=${v}`);
    }
    const box = await page.$(`#enginePage input[type="checkbox"][data-ctl="${key}"]`);
    if (box) { await box.click({ timeout: 2000 }).catch(() => {}); await box.click({ timeout: 2000 }).catch(() => {}); info.controlsClicked += 2; }
  }
  // reset to defaults by reloading, so the screenshot shows the default state
  await page.goto(`${base}?nocache=${Date.now()}#${id}`);
  await page.waitForSelector('#enginePage:not([hidden]) [data-role="surface"]', { timeout: 5000 }).catch(() => {});
  if (r.theme === 'dark') await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(300);
  for (const tab of ['react', 'css']) {
    await page.click(`#enginePage [data-engine-tab="${tab}"]`, { timeout: 2000 }).catch(() => {});
    const len = await page.$eval('#enginePage [data-role="code"]', (c) => (c.dataset.raw || c.textContent).length).catch(() => 0);
    if (!len) report.problems.push(`${r.name}: ${tab} tab is empty`);
  }
  await page.click('#enginePage [data-engine-tab="html"]', { timeout: 2000 }).catch(() => {});
  Object.assign(info, await page.evaluate(() => ({
    variants: document.querySelectorAll('#enginePage .variant-cell').length,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    wideInside: [...document.querySelectorAll('#enginePage .preview-surface, #enginePage .variant-stage')].filter((e) => e.scrollWidth > e.clientWidth + 1).length,
    title: document.title,
  })));
  if (info.overflowX) report.problems.push(`${r.name}: page scrolls horizontally`);
  if (!info.variants) report.problems.push(`${r.name}: no variant grid (every Figma variant should be listed)`);
  if (errors.length) report.problems.push(`${r.name}: console errors: ${[...new Set(errors)].join(' | ')}`);
  const shot = path.join(out, `${id}-${r.name}.png`);
  await page.locator('#enginePage').screenshot({ path: shot, animations: 'disabled' }).catch(async () => page.screenshot({ path: shot, fullPage: true }));
  info.screenshot = shot;
  report.runs.push(info);
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(report, null, 2));
process.exit(report.problems.length ? 1 : 0);
