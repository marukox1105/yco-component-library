// Usage: node build-catalog.mjs <yco-collab-space checkout or snapshot> <out components-data.js> [source commit]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const [SRC_ARG, OUT, COMMIT] = process.argv.slice(2);
const SRC = path.resolve(SRC_ARG);
const yaml = createRequire(path.join(SRC, 'package.json'))('yaml');

// Figma "All components" page (8703:121838): group -> component. `sb` lists Storybook component ids.
// conf: 'figma'   = the component's contract records a Figma node for it (figma.status: mapped)
//       'inferred'= no recorded Figma node; paired by name/role, needs the designer/PM to confirm
//       'none'    = Figma has it, Storybook has no component
const F = (name, sb = [], conf = sb.length ? 'figma' : 'none', note = '') => ({ name, sb, conf, note });
const FIGMA_GROUPS = [
  ['Elements', [
    F('Button', ['button']), F('Button group', ['button-group']),
    F('Button icon', [], 'none', 'Icon-only is a Button option; icon-action-buttons is a different (like / dislike / edit / download) component'),
    F('Icon container', ['icon-container']), F('Text link', ['text-link']),
    F('Avatar / labelled / dropdown / stack', ['avatar']),
    F('Tag group / Badge'), F('Badge count', ['badge-count']), F('Badge dot', ['badge-dot']), F('Slot'),
    F('Scrollbar', ['scrollbar'], 'figma', 'Own Figma page, not on the All components board'),
  ]],
  ['Forms', [
    F('Text input'), F('Text area', ['text-area']),
    F('Select', ['dropdown-select'], 'inferred', 'Contract records Figma node 5967:27085; confirm it is the Select / Dropdown menu page'), F('Search input', ['search-input']),
    F('Autocomplete', ['autocomplete']), F('Combobox', ['combobox']), F('Date picker', ['date-picker']),
    F('File upload', ['upload-media-block', 'upload-prompt'], 'inferred', 'Closest Storybook components; neither records a Figma node'),
    F('Slider', ['yce-slider'], 'inferred'), F('Progress indicator / Bar', ['progress-indicator']),
    F('Checkbox group'), F('Radio button group', ['radio-buttons']), F('Stepper', ['stepper']),
    F('Toggle', ['toggle-switch'], 'inferred'), F('Prompt Composer', ['prompt-field'], 'inferred', 'Own Figma page'),
  ]],
  ['Feedback', [
    F('Alert', ['yce-toast'], 'inferred', 'This library’s Toast page is built from Figma Alert tones; not yet verified'),
    F('Alert global', ['notice-banner'], 'inferred'),
    F('Empty state', ['empty-state']), F('Empty Image', ['empty-image']),
    F('Loading bar'),
  ]],
  ['Navigation', [
    F('Navigation header', ['navigation-header']), F('Footer', ['footer']),
    F('Tabs', ['gallery-tabs'], 'inferred', 'Storybook title is “UI/Tabs” but the folder is gallery-tabs'),
    F('Pagination', ['pagination']), F('Segmented control', ['segmented-control'], 'inferred'),
    F('Breadcrumbs', ['breadcrumbs']),
    F('Navigation side', ['category-rail'], 'inferred', 'Storybook title is “UI/Navigation Side” but the folder is category-rail'),
  ]],
  ['Surfaces', [
    F('Modal', ['modal', 'confirm-dialog'], 'inferred', 'Modal follows Figma’s sizes (Small / Large / Huge) but its contract records no Figma node; Confirm Dialog is its Small preset (local commit cee9027, not yet on YouCamWeb main)'),
    F('Drawer', ['bottom-sheet'], 'inferred'), F('Card', ['card']), F('Tooltip', ['tooltip'], 'inferred'),
    F('Dropdown menu / list', ['menu-select'], 'inferred'),
  ]],
  ['Content display', [
    F('Table', ['data-table']), F('Summary list', ['summary-list']), F('Accordion', ['accordion']),
    F('Text'), F('Text block', ['text-block']), F('Divider', ['divider']),
  ]],
  ['Marketing', [
    F('Hero', ['hero']), F('Testimonial', ['testimonial']), F('Rating', ['rating']),
  ]],
];

// Storybook components with no Figma counterpart, grouped by what they are for.
const NOT_IN_FIGMA = [
  ['Shared utilities (RD ports)', ['ratio','scroll-to-top-button','drag-scroll-wrapper','image-wrapper','hidden-file-input','option-chips','ui-icons','field-frame','media-counts','icon-action-buttons']],
  ['Layout shells', ['tool-layout','tool-page-layout','result-page-shell']],
  ['Credits & pricing', ['credit-badge','credit-controls','pricing-overlay']],
  ['Gallery & selection', ['gallery-cell','gallery-grid','gallery-picker','selection-toolbar','cell-actions','media-preview-modal']],
  ['Upload & trim', ['upload-strip','upload-video-trim-modal','video-trim-modal']],
  ['Video features', ['video-history','video-info-dialog','video-results-surface','video-timeline','loading-preview']],
  ['Editor / canvas features', ['background-canvas','background-panel','eraser-panel','interaction-tools-bar','react-scene']],
];

// Figma thumbnails live in assets/figma/<slug>.png (exported through the Figma MCP, node ids below for re-export).
const THUMB_SLUGS = {
  'Avatar / labelled / dropdown / stack': ['avatar', 'avatar-labelled', 'avatar-dropdown', 'avatar-stack'],
  'Tag group / Badge': ['tag-group', 'badge'],
  'Progress indicator / Bar': ['progress-indicator', 'bar'],
  'Radio button group': ['radio-group'],
  'Dropdown menu / list': ['dropdown-menu', 'dropdown-menu-list'],
};
const OUT_DIR = path.dirname(path.resolve(OUT));
const thumbsFor = (name) => (THUMB_SLUGS[name] || [name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')]).map((slug) => {
  const file = path.join(OUT_DIR, 'assets/figma', slug + '.png');
  if (!fs.existsSync(file)) throw new Error('missing thumbnail ' + file);
  const b = fs.readFileSync(file);
  return { src: 'assets/figma/' + slug + '.png', w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
});
FIGMA_GROUPS.forEach(([, items]) => items.forEach((i) => { i.thumbs = thumbsFor(i.name); }));

const ui = path.join(SRC, 'platform/ui');
const comps = {};
for (const id of fs.readdirSync(ui).sort()) {
  const dir = path.join(ui, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  const ymlPath = path.join(SRC, 'design-library/components', id, 'component.yaml');
  const y = fs.existsSync(ymlPath) ? yaml.parse(fs.readFileSync(ymlPath, 'utf8')) : {};
  const stories = fs.readdirSync(dir).filter(f => /\.stories\.jsx?$/.test(f)).map(f => {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    return {
      title: (t.match(/^\s*title:\s*['"]([^'"]+)['"]/m) || [])[1] || null,
      count: [...t.matchAll(/^export const (\w+)\s*=/gm)].length,
    };
  });
  let description = '';
  const rp = path.join(dir, 'README.md');
  if (fs.existsSync(rp)) {
    const paras = fs.readFileSync(rp, 'utf8').split(/\n\s*\n/).map(s => s.trim())
      .filter(s => s && !/^(#|```|\||-|\d+\.)/.test(s));
    description = (paras[0] || '').replace(/\s+/g, ' ').replace(/`/g, '').slice(0, 280);
  }
  const f = y.figma || {};
  comps[id] = {
    id,
    name: y.displayName || id,
    classification: y.classification || null,
    figmaStatus: f.status || 'pending',
    figmaNode: f.componentSetNodeId || f.componentNodeId || null,
    portability: y.rd?.portability || null,
    props: (y.publicApi?.props || []).map(p => p.name + (p.required ? '*' : '')),
    states: y.publicApi?.states || [],
    stories,
    description,
  };
}

// sanity: every component placed exactly once
const placed = new Map();
const place = (id, where) => { if (!comps[id]) throw new Error('unknown id ' + id + ' in ' + where); if (placed.has(id) && !where.startsWith('Forms') && !where.startsWith('Surfaces')) {} placed.set(id, (placed.get(id) || []).concat(where)); };
FIGMA_GROUPS.forEach(([g, items]) => items.forEach(i => i.sb.forEach(id => place(id, g))));
NOT_IN_FIGMA.forEach(([g, ids]) => ids.forEach(id => place(id, 'NIF ' + g)));
const missing = Object.keys(comps).filter(id => !placed.has(id));
const dup = [...placed].filter(([, w]) => w.length > 1);
if (missing.length) console.error('UNPLACED:', missing.join(', '));
if (dup.length) console.error('DUPLICATE:', dup.map(([i, w]) => i + ' -> ' + w.join(' & ')).join('; '));

const sourceCommit = COMMIT || execSync('git rev-parse --short HEAD', { cwd: SRC }).toString().trim();
const catalog = {
  generatedAt: '2026-11-18',
  source: { repo: 'YouCamWeb/yco-collab-space', commit: sourceCommit, storybookRoot: 'platform/ui/<component>/' },
  figma: { fileKey: 'JXNIQPJT9I9qFrgtiaCn4i', board: '8703:121838' },
  groups: FIGMA_GROUPS.map(([name, items]) => ({ name, items })),
  notInFigma: NOT_IN_FIGMA.map(([name, ids]) => ({ name, ids })),
  components: comps,
};
fs.writeFileSync(OUT, '// Generated from the Storybook source (platform/ui + design-library/components). Do not edit by hand.\nwindow.YCO_CATALOG = ' + JSON.stringify(catalog, null, 1) + ';\n');
console.log('components', Object.keys(comps).length, 'placed', placed.size, 'missing', missing.length, 'dup', dup.length);
const mapped = Object.values(comps).filter(c => c.figmaStatus === 'mapped').length;
console.log('figma-mapped contracts', mapped);
