// Finds translucent surfaces in component pages: anything whose own background is only partly opaque (so whatever is
// behind it shows through) or that is faded with opacity. Rule: a surface that paints its own fill must have an opaque
// base colour under any translucent tint.
// Usage: node tools/audit-transparency.mjs [id ...]      (no ids = every page)   Add --json for machine output.
// A hit is reported once per page / theme / class. Hover and press layers are not scanned (they are meant to tint
// whatever the item sits on); `disabled` opacity is reported separately because it is a deliberate fade.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const json = args.includes('--json');
let ids = args.filter((a) => !a.startsWith('--'));
if (!ids.length) ids = fs.readdirSync('components').filter((f) => f.endsWith('.js')).map((f) => f.replace(/\.js$/, ''));
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
const report = {};

const scan = () => {
  const alpha = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return 1; const p = m[1].split(/[,/ ]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1; };
  const scope = document.querySelector('#enginePage');
  const hits = [];
  for (const el of scope.querySelectorAll('[data-role="surface"] *, .variant-stage *')) {
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const cls = [...el.classList].find((c) => /^yco/.test(c)) || el.tagName.toLowerCase();
    const a = alpha(cs.backgroundColor);
    if (a > 0 && a < 0.99) hits.push({ kind: 'background', cls, value: cs.backgroundColor, w: Math.round(r.width), h: Math.round(r.height) });
    for (const pseudo of ['::before', '::after']) {
      const ps = getComputedStyle(el, pseudo);
      if (ps.content === 'none' || ps.content === 'normal') continue;
      const pa = alpha(ps.backgroundColor);
      if (pa > 0 && pa < 0.99) hits.push({ kind: 'background' + pseudo, cls, value: ps.backgroundColor, w: Math.round(r.width), h: Math.round(r.height) });
    }
    if (parseFloat(cs.opacity) < 0.99) hits.push({ kind: el.disabled || el.getAttribute('aria-disabled') === 'true' ? 'opacity(disabled)' : 'opacity', cls, value: cs.opacity, w: Math.round(r.width), h: Math.round(r.height) });
  }
  return hits;
};

for (const id of ids) {
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${base}?nocache=${Date.now()}#${id}`);
    const ok = await page.waitForSelector('#enginePage [data-role="surface"]', { timeout: 4000 }).then(() => true, () => false);
    if (!ok) { report[`${id}/${theme}`] = [{ kind: 'ERROR', cls: 'did not render' }]; await ctx.close(); continue; }
    if (theme === 'dark') await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    await page.waitForTimeout(250);
    const hits = await page.evaluate(scan);
    const seen = new Map();
    for (const h of hits) { const k = `${h.kind}|${h.cls}|${h.value}`; if (!seen.has(k)) seen.set(k, { ...h, count: 0 }); seen.get(k).count++; }
    report[`${id}/${theme}`] = [...seen.values()];
    await ctx.close();
  }
}
await browser.close();
server.close();

if (json) { console.log(JSON.stringify(report, null, 1)); process.exit(0); }
let total = 0;
for (const [k, hits] of Object.entries(report)) {
  const real = hits.filter((h) => !String(h.kind).startsWith('opacity(disabled)'));
  if (!real.length) continue;
  total += real.length;
  console.log(`\n${k}`);
  for (const h of real) console.log(`  ${h.kind.padEnd(20)} ${h.cls.padEnd(34)} ${String(h.value).padEnd(26)} x${h.count}  ${h.w}x${h.h}`);
}
console.log(`\n${total} translucent surfaces in ${Object.keys(report).length} page/theme runs`);
process.exit(total ? 1 : 0);
