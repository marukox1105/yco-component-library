// Lints components/*.css, the single-source stylesheets of the engine pages.
// Usage: node tools/check-components.mjs [slug ...]   (no args = every components/*.css)
//
// Rules (each one is a bug we would otherwise ship into yce-frontend):
//  1. Every class selector starts with the file's root prefix: text-input.css -> ycoTextInput,
//     ycoTextInput_size_large, ... The doc site loads one page's CSS at a time, but the names must still
//     never collide with Button's global .size_* / .tone_* / .variant_*.
//  2. Only var(--token) values that styles.css defines in the light :root. Never invent a token.
//  3. No raw colours (#hex, rgb(), hsl()) outside var(--...) fallbacks in a comment.
//  4. No @import and no url() to other hosts.
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('components');
// Only the light :root counts: a token that exists only in :root[data-theme="dark"] is undefined in the default theme.
const css = fs.readFileSync('styles.css', 'utf8');
const lightRoot = css.slice(0, css.indexOf(':root[data-theme="dark"]'));
const tokens = new Set([...lightRoot.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)].map((m) => m[1]));
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(dir).filter((f) => f.endsWith('.css') && !f.endsWith('.states.css')).map((f) => f.replace(/\.css$/, ''));
const pascal = (s) => s.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
let bad = 0;

for (const slug of slugs) {
  for (const file of [`${slug}.css`, `${slug}.states.css`]) {
    const p = path.join(dir, file);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const prefix = 'yco' + pascal(slug);
    const errs = [];
    // class selectors only appear before '{'; strip declaration blocks and at-rule params first
    const selectors = [...src.matchAll(/([^{}]+)\{/g)].map((m) => m[1]).filter((s) => !s.trim().startsWith('@'));
    const classes = new Set(selectors.flatMap((s) => [...s.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1])));
    for (const c of classes) if (!c.startsWith(prefix) && !/^is-(hover|press|focus)$/.test(c)) errs.push(`class .${c} must start with ${prefix}`);
    for (const m of src.matchAll(/var\((--[a-z0-9-]+)/gi)) if (!tokens.has(m[1]) && !/^--yco-/.test(m[1]) && !errs.includes(`unknown token ${m[1]}`)) errs.push(`unknown token ${m[1]}`);
    if (/#[0-9a-f]{3,8}\b/i.test(src.replace(/url\([^)]*\)/g, ''))) errs.push('raw hex colour');
    if (/\b(rgb|rgba|hsl|hsla)\(/i.test(src)) errs.push('raw rgb()/hsl() colour');
    if (/@import|url\(\s*['"]?https?:/i.test(src)) errs.push('@import or remote url()');
    if (errs.length) { bad++; console.log(`FAIL ${file}\n  - ${[...new Set(errs)].join('\n  - ')}`); } else console.log(`ok   ${file}`);
  }
}
process.exit(bad ? 1 : 0);
