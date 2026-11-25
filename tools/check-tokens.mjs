// Invariants for the interaction tints in styles.css. A press must never be lighter than the hover it follows:
// swapping the two names is how a "make hover more visible" request once turned the order around and made every
// implementation remember an exception. To make hover stronger, raise the level of --fill-hover (and --fill-press
// with it); do not swap them.
// Usage: node tools/check-tokens.mjs        (exit 1 and a list if an invariant is broken)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const from = process.env.PLAYWRIGHT_FROM || '/Users/marukoting/Claude/Projects/yco-collab-space';
const { chromium } = createRequire(path.join(from, 'package.json'))('playwright');
const css = fs.readFileSync('styles.css', 'utf8');
const PAIRS = [['--fill-hover', '--fill-press'], ['--fill-brand-hover', '--fill-brand-press'], ['--fill-inverse-hover', '--fill-inverse-press']];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<style>${css}</style><div id="t"></div>`);
let bad = 0;
for (const theme of ['light', 'dark']) {
  await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
  const alpha = await page.evaluate((names) => {
    const el = document.getElementById('t');
    return Object.fromEntries(names.map((n) => {
      el.style.backgroundColor = ''; el.style.backgroundColor = `var(${n})`;
      const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
      const p = m ? m[1].split(/[,/ ]+/).filter(Boolean) : [];
      return [n, p.length > 3 ? parseFloat(p[3]) : 1];
    }));
  }, PAIRS.flat());
  for (const [hover, press] of PAIRS) {
    const ok = alpha[press] >= alpha[hover];
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${theme.padEnd(5)} ${hover} ${Math.round(alpha[hover] * 100)}%  <  ${press} ${Math.round(alpha[press] * 100)}%`);
  }
}
await browser.close();
process.exit(bad ? 1 : 0);
