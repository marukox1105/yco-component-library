// Prints the size of every variant cell's first element on a page, so it can be compared with Figma's frame sizes.
// Usage: node tools/measure-variants.mjs <id> [selector]     (selector defaults to the first element in each variant stage)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const id = process.argv[2];
const selector = process.argv[3] || ':scope > *';
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
await page.goto(`http://127.0.0.1:${server.address().port}/?nocache=${Date.now()}#${id}`);
await page.waitForSelector('#enginePage .variant-cell');
const rows = await page.$$eval('#enginePage .variant-cell', (cells, sel) => cells.map((c) => {
  const stage = c.querySelector('.variant-stage');
  let el = stage.querySelector(sel.replace(':scope > *', '[class*="yco"]'));
  if (sel !== ':scope > *') el = stage.querySelector(sel);
  const r = el ? el.getBoundingClientRect() : null;
  return `${c.querySelector('figcaption').textContent.padEnd(64)} ${r ? Math.round(r.width * 10) / 10 + ' x ' + Math.round(r.height * 10) / 10 : '(none)'}`;
}), selector);
console.log(rows.join('\n'));
await browser.close();
server.close();
