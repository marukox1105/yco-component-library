// Smoke-tests the interactive parts of engine pages in headless Chrome.
// Usage: node tools/check-interactions.mjs <id> [id ...]
// For each page: clicks every trigger in the live preview (buttons, tabs, switches, comboboxes, summaries, inputs,
// anything with aria-expanded / aria-haspopup), presses ArrowDown, Enter, Escape and Tab on the first one, and reports
// page errors plus triggers that did nothing (no DOM, attribute or value change). It cannot judge visuals; it catches
// dead and crashing controls. A "dead" click can be legitimate (a disabled-looking item, a link), so read the sample.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ids = process.argv.slice(2);
if (!ids.length) { console.error('usage: node tools/check-interactions.mjs <id> [id ...]'); process.exit(2); }
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
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();
const results = [];
const sel = '#enginePage [data-role="surface"]';
const triggerSel = [
  'button:not([disabled])', '[role="tab"]', '[role="switch"]', '[role="combobox"]', 'summary', 'input:not([disabled])',
  'select', '[aria-haspopup]', '[aria-expanded]', '[role="option"]', '[role="menuitem"]',
].map((s) => `${sel} ${s}`).join(', ');

for (const id of ids) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(`${base}?nocache=${Date.now()}#${id}`);
  await page.waitForSelector(sel, { timeout: 4000 }).catch(() => errors.push('did not render'));
  const snapshot = () => page.$eval(sel, (s) => s.innerHTML + '|' + [...s.querySelectorAll('*')].map((e) => [...e.attributes].map((a) => a.name + '=' + a.value).join(',')).join(';') + '|' + [...s.querySelectorAll('input,select,textarea')].map((i) => i.value + i.checked).join(','));
  const handles = await page.$$(triggerSel);
  let clicked = 0;
  const dead = [];
  for (const h of handles.slice(0, 40)) {
    const desc = await h.evaluate((e) => (e.getAttribute('aria-label') || e.textContent || e.className || e.tagName).toString().trim().replace(/\s+/g, ' ').slice(0, 28)).catch(() => '?');
    const before = await snapshot().catch(() => '');
    await h.click({ timeout: 1500 }).catch(() => {});
    clicked++;
    const after = await snapshot().catch(() => '');
    if (before && before === after) dead.push(desc);
    await page.keyboard.press('Escape').catch(() => {});
  }
  if (handles[0]) {
    await handles[0].focus().catch(() => {});
    for (const k of ['ArrowDown', 'ArrowDown', 'Enter', 'ArrowRight', 'Home', 'End', 'Escape', 'Tab', 'Tab']) await page.keyboard.press(k).catch(() => {});
  }
  results.push({ id, triggers: handles.length, clicked, deadClicks: dead.length, deadSample: dead.slice(0, 6), errors: [...new Set(errors)] });
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(results, null, 1));
process.exit(results.some((r) => r.errors.length) ? 1 : 0);
