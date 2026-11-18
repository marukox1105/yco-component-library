// Prints an outline of one page's live preview: every interactive element with its role, label and visibility.
// Usage: node tools/dump-preview.mjs <id>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const id = process.argv[2];
const from = process.env.PLAYWRIGHT_FROM || '/Users/marukoting/Claude/Projects/yco-collab-space';
const { chromium } = createRequire(path.join(from, 'package.json'))('playwright');
const root = path.resolve('.');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(root, 'index.html');
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  res.end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/?nocache=${Date.now()}#${id}`);
await page.waitForSelector('#enginePage [data-role="surface"]');
const rows = await page.$$eval('#enginePage [data-role="surface"] :is(button, a, input, select, textarea, summary, [role], [aria-haspopup], [aria-expanded], [tabindex])', (els) => els.slice(0, 60).map((e) => {
  const r = e.getBoundingClientRect();
  const cs = getComputedStyle(e);
  return `${e.tagName.toLowerCase()}${e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : ''} ${(e.getAttribute('aria-label') || e.textContent || e.className || '').toString().trim().replace(/\s+/g, ' ').slice(0, 30)} | exp=${e.getAttribute('aria-expanded')} hidden=${e.hidden} vis=${r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'} pe=${cs.pointerEvents} ${Math.round(r.width)}x${Math.round(r.height)}`;
}));
console.log(rows.join('\n'));
await browser.close();
server.close();
