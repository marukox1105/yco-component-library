// Adds an opaque base colour under translucent fills in components/*.css.
//
//   background: var(--fill-weak);
// becomes
//   background-color: var(--fill-base);
//   background-image: linear-gradient(var(--fill-weak), var(--fill-weak));
//
// so whatever sits behind the component (an overlapping avatar, the checkered preview, a coloured page) never shows
// through a tint. Only tokens with alpha < 0.9 are touched (translucent-tokens.mjs lists them). Not touched: scrims
// (--fill-overlay*), hover / press / focus rules of elements that have no fill of their own (they are meant to tint the
// parent), ::before / ::after rules (state layers; reported), and *.states.css (doc-only).
// A hover / press rule IS converted when its element's resting fill was converted, otherwise hovering would drop the base.
// Usage: node tools/add-base-fill.mjs [--write] [id ...]     (default: dry run; prints what would change)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const write = process.argv.includes('--write');
let ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!ids.length) ids = fs.readdirSync('components').filter((f) => f.endsWith('.css') && !f.endsWith('.states.css')).map((f) => f.replace(/\.css$/, ''));

const alpha = JSON.parse(execFileSync('node', ['tools/translucent-tokens.mjs'], { encoding: 'utf8' })).alpha;
const TINT = new Set(Object.entries(alpha).filter(([n, a]) => a < 0.9 && /^--(fill|background)-/.test(n) && !/overlay/.test(n)).map(([n]) => n));
const SURFACE = new Set(Object.entries(alpha).filter(([n, a]) => a >= 0.99 && /^--(fill|background)-/.test(n) && n !== '--fill-base').map(([n]) => n));
// The base under a tint is the surface the element sits on: --yco-base (set by the nearest element with an opaque
// background, below), falling back to the page colour.
const BASE_EXPR = 'var(--yco-base, var(--fill-base))';
const STATE = /:(hover|active|focus-visible|focus-within|focus)\b|\.is-(hover|press|focus)\b/;
const PSEUDO = /::?(before|after)\b/;
const stripState = (sel) => sel.replace(/:(hover|active|focus-visible|focus-within|focus)\b/g, '').replace(/\.is-(hover|press|focus)\b/g, '').replace(/:not\(\)/g, '').replace(/\s+/g, ' ').trim();

// innermost { } blocks with their selector text and offsets
function blocks(src) {
  const out = [];
  const re = /([^{}]*)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const selStart = m.index;
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!selector || selector.startsWith('@')) continue;
    out.push({ selector, body: m[2], bodyStart: m.index + m[1].length + 1, bodyEnd: m.index + m[0].length - 1, selStart });
  }
  return out;
}
const DECL = /(^|[;{\s])(background|background-color)\s*:\s*var\((--[a-z0-9-]+)\)\s*;/g;
const hasImage = (body) => /background-image\s*:/.test(body) || /background\s*:[^;]*(gradient|url)\(/.test(body);

const summary = [];
for (const id of ids) {
  const file = path.join('components', `${id}.css`);
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, 'utf8');
  const list = blocks(src);
  const converted = new Set(); // normalised selectors of converted resting rules
  const edits = [];            // {start, end, text}
  const skipped = [];

  const convert = (b, onlyIf) => {
    const sels = b.selector.split(',').map((x) => x.trim());
    let any = false;
    b.body.replace(DECL, (all, pre, prop, token, offset) => {
      if (!TINT.has(token)) return all;
      if (hasImage(b.body)) { skipped.push(`${b.selector}: has another background-image`); return all; }
      if (onlyIf && !onlyIf(sels)) return all;
      const start = b.bodyStart + offset + pre.length;
      const end = b.bodyStart + offset + all.length;
      const indent = (src.slice(0, start).match(/[ \t]*$/) || [''])[0];
      edits.push({ start, end, text: `background-color: ${BASE_EXPR};\n${indent}background-image: linear-gradient(var(${token}), var(${token}));` });
      any = true;
      return all;
    });
    return any;
  };

  // pass 1: resting rules
  for (const b of list) {
    const sels = b.selector.split(',').map((x) => x.trim());
    const anyState = sels.some((s) => STATE.test(s));
    const anyPseudo = sels.some((s) => PSEUDO.test(s));
    if (anyState || anyPseudo) {
      if (anyPseudo && !anyState && DECL.test(b.body)) { DECL.lastIndex = 0; if (b.body.replace(DECL, (a, p, pr, t) => (TINT.has(t) ? '#' : a)).includes('#')) skipped.push(`${b.selector}: pseudo-element fill left as is (review)`); }
      DECL.lastIndex = 0;
      continue;
    }
    DECL.lastIndex = 0;
    if (convert(b)) sels.forEach((s) => converted.add(stripState(s)));
    DECL.lastIndex = 0;
  }
  // pass 2: hover / press / focus rules of elements whose resting fill was converted
  for (const b of list) {
    const sels = b.selector.split(',').map((x) => x.trim());
    if (!sels.every((s) => STATE.test(s)) || sels.some((s) => PSEUDO.test(s))) continue;
    DECL.lastIndex = 0;
    convert(b, (ss) => ss.every((s) => converted.has(stripState(s))));
    DECL.lastIndex = 0;
  }

  // pass 3: an element with an opaque background tells its descendants what they sit on
  for (const b of list) {
    const sels = b.selector.split(',').map((x) => x.trim());
    if (sels.some((x) => STATE.test(x) || PSEUDO.test(x)) || /--yco-base\s*:/.test(b.body)) continue;
    DECL.lastIndex = 0;
    b.body.replace(DECL, (all, pre, prop, token, offset) => {
      if (!SURFACE.has(token)) return all;
      const at = b.bodyStart + offset + all.length;
      const indent = (src.slice(0, b.bodyStart + offset + pre.length).match(/[ \t]*$/) || [''])[0];
      if (!edits.some((e) => e.start === at && e.text.startsWith(`\n${indent}--yco-base`))) edits.push({ start: at, end: at, text: `\n${indent}--yco-base: var(${token});` });
      return all;
    });
    DECL.lastIndex = 0;
  }

  // migrate the first version of this tool's output (a fixed --fill-base)
  const OLD = /background-color: var\(--fill-base\);(\s*)background-image: linear-gradient\(/g;
  if (edits.length) {
    let out = src;
    for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
    out = out.replace(OLD, `background-color: ${BASE_EXPR};$1background-image: linear-gradient(`);
    if (write) fs.writeFileSync(file, out);
  } else if (OLD.test(src)) {
    OLD.lastIndex = 0;
    if (write) fs.writeFileSync(file, src.replace(OLD, `background-color: ${BASE_EXPR};$1background-image: linear-gradient(`));
    edits.push({ migrated: true });
  }
  summary.push({ id, converted: edits.length, skipped });
}
let total = 0;
for (const s of summary) {
  total += s.converted;
  if (s.converted || s.skipped.length) console.log(`${s.id.padEnd(22)} ${String(s.converted).padStart(3)} fill(s)${s.skipped.length ? '\n   review: ' + [...new Set(s.skipped)].join('\n   review: ') : ''}`);
}
console.log(`\n${total} declarations ${write ? 'rewritten' : 'would be rewritten (dry run; pass --write)'} across ${summary.filter((s) => s.converted).length} files`);
