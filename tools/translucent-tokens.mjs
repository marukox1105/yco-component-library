// Reports the alpha of every colour token in styles.css (lowest of the light and dark theme).
// Usage: node tools/translucent-tokens.mjs        -> JSON { alpha: { '--token': lowestAlpha } }
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const from = process.env.PLAYWRIGHT_FROM || '/Users/marukoting/Claude/Projects/yco-collab-space';
const { chromium } = createRequire(path.join(from, 'package.json'))('playwright');
const css = fs.readFileSync('styles.css', 'utf8');
const lightRoot = css.slice(0, css.indexOf(':root[data-theme="dark"]'));
const names = [...new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)].map((m) => m[1]))]
  .filter((n) => /^--(fill|background|stroke|icon|text)-/.test(n) && lightRoot.includes(n + ':'));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<style>${css}</style><div id="t"></div>`);
const result = {};
for (const theme of ['light', 'dark']) {
  await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
  result[theme] = await page.evaluate((list) => {
    const el = document.getElementById('t');
    const out = [];
    for (const n of list) {
      el.style.backgroundColor = '';
      el.style.backgroundColor = `var(${n})`;
      const c = getComputedStyle(el).backgroundColor;
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) continue;
      const p = m[1].split(/[,/ ]+/).filter(Boolean);
      const a = p.length > 3 ? parseFloat(p[3]) : 1;
      out.push([n, Math.round(a * 100) / 100]);
    }
    return out;
  }, names);
}
await browser.close();
const alpha = {};
for (const theme of ['light', 'dark']) for (const [n, a] of result[theme]) alpha[n] = Math.min(alpha[n] ?? 1, a);
console.log(JSON.stringify({ alpha }, null, 1)); // lowest alpha of each translucent token across the two themes
