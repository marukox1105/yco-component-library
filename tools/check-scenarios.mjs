// Scenario tests for the interactive component pages: real pointer and keyboard input, asserting visible results.
// Usage: node tools/check-scenarios.mjs            (all scenarios)   |   node tools/check-scenarios.mjs combobox date-picker
// Each scenario drives the live preview of one page the way a person would and checks what changes.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

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
const S = '#enginePage [data-role="surface"]';
const vis = (page, sel) => page.locator(`${S} ${sel}`).first().isVisible().catch(() => false);
const attr = (page, sel, a) => page.locator(`${S} ${sel}`).first().getAttribute(a).catch(() => null);

const scenarios = {
  async select(page) {
    await page.click(`${S} [role="combobox"]`);
    const opened = await vis(page, '[role="listbox"]');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    const text = await page.locator(`${S} .ycoSelect_value`).first().textContent().catch(() => '');
    return { opened, chosen: text, closedAfter: !(await vis(page, '[role="listbox"]')) };
  },
  async combobox(page) {
    await page.click(`${S} input`);
    const opened = await vis(page, '[role="listbox"]');
    const options = await page.locator(`${S} [role="option"]`).count();
    await page.locator(`${S} [role="option"]`).nth(1).click().catch(() => {});
    const value = await page.locator(`${S} input`).first().inputValue().catch(() => '');
    return { opened, options, value };
  },
  async autocomplete(page) {
    await page.click(`${S} input`);
    await page.keyboard.type('Opt');
    const opened = await vis(page, '[role="listbox"]');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    const value = await page.locator(`${S} input`).first().inputValue().catch(() => '');
    return { opened, value };
  },
  async 'date-picker'(page) {
    await page.locator(`${S} button[aria-label="Choose date"]`).first().click();
    const opened = await vis(page, '[role="dialog"]');
    await page.locator(`${S} [role="dialog"] button`).filter({ hasText: /^15$/ }).first().click();
    const value = await page.locator(`${S} input`).first().inputValue().catch(() => '');
    await page.keyboard.press('Escape');
    return { calendarOpened: opened, pickedValue: value };
  },
  async pagination(page) {
    const before = await page.locator(`${S} [aria-current="page"]`).first().textContent().catch(() => null);
    await page.locator(`${S} button, ${S} a`).filter({ hasText: /^3$/ }).first().click().catch(() => {});
    const after = await page.locator(`${S} [aria-current="page"]`).first().textContent().catch(() => null);
    return { before, after };
  },
  async tabs(page) {
    const tabs = page.locator(`${S} [role="tab"]`);
    await tabs.nth(1).click();
    const sel = await tabs.nth(1).getAttribute('aria-selected');
    await tabs.nth(1).press('ArrowRight');
    const moved = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-selected'));
    return { secondSelected: sel, afterArrow: moved };
  },
  async 'dropdown-menu'(page) {
    const trigger = page.locator(`${S} [aria-haspopup]`).first();
    const openAtStart = await vis(page, '[role="menu"]');
    await trigger.click();
    const closedByTrigger = !(await vis(page, '[role="menu"]'));
    await trigger.click();
    const reopened = await vis(page, '[role="menu"]');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    return { openAtStart, closedByTrigger, reopened, closedAfterEscape: !(await vis(page, '[role="menu"]')) };
  },
  async modal(page) {
    const openAtStart = await vis(page, '[role="dialog"]');
    await page.locator(`${S} [role="dialog"] button[aria-label="Close"]`).first().click();
    const closed = !(await vis(page, '[role="dialog"]'));
    await page.locator(`${S} button`).filter({ hasText: /Open modal/ }).first().click();
    const reopened = await vis(page, '[role="dialog"]');
    await page.keyboard.press('Escape');
    return { openAtStart, closedByClose: closed, reopened, closedByEscape: !(await vis(page, '[role="dialog"]')) };
  },
  async drawer(page) {
    const openAtStart = await vis(page, '[role="dialog"]');
    await page.locator(`${S} [role="dialog"] button[aria-label="Close"]`).first().click();
    const closed = !(await vis(page, '[role="dialog"]'));
    await page.locator(`${S} button`).filter({ hasText: /Open drawer/ }).first().click();
    const reopened = await vis(page, '[role="dialog"]');
    await page.keyboard.press('Escape');
    return { openAtStart, closedByClose: closed, reopened, closedByEscape: !(await vis(page, '[role="dialog"]')) };
  },
  async tooltip(page) {
    const trigger = page.locator(`${S} button`).filter({ hasText: /trigger/i }).first();
    await trigger.hover();
    const shown = await vis(page, '[role="tooltip"]');
    return { shownOnHover: shown };
  },
  async 'segmented-control'(page) {
    const radios = page.locator(`${S} input[type="radio"]`);
    const n = await radios.count();
    await page.locator(`${S} label`).nth(1).click().catch(() => {});
    const second = await radios.nth(1).isChecked().catch(() => null);
    return { radios: n, secondChecked: second };
  },
  async checkboxes(page) {
    const box = page.locator(`${S} input[type="checkbox"]`).first();
    const before = await box.isChecked();
    await page.locator(`${S} label`).first().click();
    return { toggled: (await box.isChecked()) !== before };
  },
  async 'radio-buttons'(page) {
    const radios = page.locator(`${S} input[type="radio"]`);
    await page.locator(`${S} label`).nth(1).click().catch(() => {});
    return { secondChecked: await radios.nth(1).isChecked().catch(() => null) };
  },
  async toggle(page) {
    const t = page.locator(`${S} input[type="checkbox"], ${S} [role="switch"]`).first();
    const before = await t.evaluate((e) => e.checked ?? e.getAttribute('aria-checked'));
    await page.locator(`${S} label`).first().click().catch(async () => t.click());
    return { before, after: await t.evaluate((e) => e.checked ?? e.getAttribute('aria-checked')) };
  },
  async accordion(page) {
    const first = page.locator(`${S} details, ${S} [aria-expanded]`).first();
    const before = await first.evaluate((e) => e.open ?? e.getAttribute('aria-expanded'));
    await page.locator(`${S} summary, ${S} button[aria-expanded]`).first().click();
    return { before, after: await first.evaluate((e) => e.open ?? e.getAttribute('aria-expanded')) };
  },
  async 'prompt-composer'(page) {
    const ta = page.locator(`${S} textarea, ${S} [contenteditable="true"], ${S} input[type="text"]`).first();
    await ta.click();
    await page.keyboard.type('hello');
    const send = page.locator(`${S} button[aria-label*="end" i]`).first();
    return { typed: await ta.evaluate((e) => e.value ?? e.textContent), sendEnabled: (await send.count()) ? await send.isEnabled() : 'no send button found' };
  },
  async 'navigation-side'(page) {
    const item = page.locator(`${S} a, ${S} button`).nth(2);
    await item.hover();
    return { ok: true };
  },
  async stepper(page) {
    const input = page.locator(`${S} input`).first();
    const before = await input.inputValue();
    await page.locator(`${S} button[aria-label*="ncrease" i], ${S} button[aria-label*="dd" i], ${S} button`).last().click().catch(() => {});
    return { before, after: await input.inputValue() };
  },
  async slider(page) {
    const input = page.locator(`${S} input[type="range"]`).first();
    const before = await input.inputValue();
    await input.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    return { before, after: await input.inputValue() };
  },
};

const want = process.argv.slice(2);
const run = want.length ? want : Object.keys(scenarios);
const browser = await chromium.launch();
const out = {};
for (const id of run) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  try {
    await page.goto(`${base}?nocache=${Date.now()}#${id}`);
    await page.waitForSelector(S, { timeout: 4000 });
    out[id] = { ...(await scenarios[id](page)), ...(errors.length ? { errors } : {}) };
  } catch (e) { out[id] = { FAILED: e.message.split('\n')[0].slice(0, 160), ...(errors.length ? { errors } : {}) }; }
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(out, null, 1));
