# Building a component page

Every page after Buttons and Toast is one config handed to `YCO.page()`, drawn by `engine.js`.
A page is **two or three files** and touches nothing else:

| File | Role |
|---|---|
| `components/<id>.css` | **Single source of truth** for the component. Plain CSS with CSS-Modules class names. The same file goes verbatim into `yce-frontend` as a CSS Module. |
| `components/<id>.js` | The page config (controls, `render`, `react`, `variants`, `notes`). |
| `components/<id>.states.css` | Optional, **doc-only**: shows Hover / Press / Focus without a pointer. Never exported. |

`<id>` is the sidebar id in `nav.js` (`text-input`, `badge-dot`, …). The stub `components/<id>.js` and its
`<script>` tag already exist; overwrite the stub. **Do not edit** `engine.js`, `nav.js`, `index.html`, `script.js`,
`styles.css` or another component's files. If the engine lacks something you need, say so instead of patching it.

Reference pages to copy from: `components/badge-dot.*` (small, no states) and `components/text-input.*`
(states, valid / invalid, optional parts, forced-state CSS).

## Reading Figma

File `JXNIQPJT9I9qFrgtiaCn4i`. `nav.js` has each component's Figma **page** node. Get the component set inside it
with `get_metadata` (the frame named like the component whose children are `State=…, Size=…` symbols), then
`get_design_context` on that set. It returns React + Tailwind: **read it for values, never copy it.**
`var(--spacing\/8,8px)` means our token `--spacing-8`; `var(--fill\/hover,…)` means `--fill-hover`.
Read every variant, not just the default. Page screenshots (`get_screenshot`) are for comparing, not for shipping.

## CSS rules (`node tools/check-components.mjs <id>` enforces them)

1. Root class `yco<PascalId>` (`text-input` → `ycoTextInput`). Every other class starts with the root:
   `ycoTextInput_field`, modifiers `ycoTextInput_size_large`, `ycoTextInput_valid_false`. Never `size_*`, `tone_*`,
   `variant_*`: those are Button's, and the doc site is one global namespace.
2. Only `var(--token)` values defined in the **light** `:root` of `styles.css`. No raw colours, no invented tokens.
   If Figma uses a value with no token, use the nearest token and record the gap in `notes`.
   If a token exists only in the dark block, say so in `notes`; do not edit `styles.css`.
3. Real `:hover`, `:active`, `:focus-visible`, `:disabled`. Forced preview states live only in `<id>.states.css`
   as `.is-hover`, `.is-press`, `.is-focus`.
4. No fixed copy in the CSS; it must work for any label length. Sizes from Figma, written with spacing / radius tokens
   where one matches, `rem` otherwise.
5. Keep the file header comment (what it is, Figma node, states covered).

## The config

```js
YCO.page({
  id: "text-input",              // same as the file name and the sidebar id
  group: "Forms",                // eyebrow above the title
  title: "Text input",
  figma: "3449:60714",           // component set node, shown in the footer
  intro: "One or two sentences: what it is for.",
  needs: ["button"],             // only when the preview embeds .ycoButton; loads button.module.css
  statesCss: "components/text-input.states.css",   // optional
  controls: [                    // one per Figma property
    YCO.stateControl(),          // Default / Hover / Press / Focus / Disabled; pass an array to shorten it
    { key: "size", label: "Size", type: "chips", options: ["large", "medium", "small"], default: "medium" },
    { key: "label", label: "Label", type: "toggle", default: true },
    { key: "text", label: "Text", type: "text", default: "Label" },
    { key: "x", label: "…", type: "toggle", when: (s) => s.label },   // shown only when the condition holds
  ],
  surface: { inverse: false, wide: false, start: false, minHeight: 0 }, // or (s) => ({...}); wide = full width
  render: (s, ctx) => `<div class="ycoTextInput${ctx.sc}">…</div>`,    // returns HTML
  react: (s) => `…`,             // returns the usage snippet
  variants: [{ label: "Default / Valid", html: "…", wide: false, dark: false }],  // EVERY Figma variant
  mount: (el, s) => {},          // optional: wire behaviour the preview needs (open / close, selection)
  notes: ["Token gaps, Figma quirks, things RD must confirm."],
});
```

- `render(s, ctx)`: `s` holds the control values (chips are strings, toggles booleans). `ctx.preview` is true for the live
  preview and false for the copied HTML; `ctx.sc` is `" is-hover"` / `" is-press"` / `" is-focus"` in the preview and `""`
  in the copied code. Put `ctx.sc` on the element that carries the state styling. The same function feeds the preview, the
  HTML tab and the variant grid, so write the markup you would want an engineer to copy: semantic elements, real `label`s,
  ARIA, indented.
- `variants` must cover **every** variant Figma draws (the state × type × size matrix), so a reviewer can compare the page
  against Figma without touching a control.
- `react(s)`: check whether `perfect-corp/yce-frontend` (branch `collab-main`, `src/components/common/`, via
  `gh api repos/perfect-corp/yce-frontend/contents/<path>?ref=collab-main`) already has the component; if so use its real
  import path and props. If not, start the snippet with `// Proposed API: yce-frontend has no <Name> yet`.
- Copy in the HTML is placeholder English ("Label", "Heading"). Do not invent product copy.

## Checking your page

Several people may be building pages at once, so do not use a shared browser pane. Use the headless checker; it starts its
own server on a free port:

```sh
node tools/check-components.mjs <id>             # class names, tokens, raw colours
node tools/check-page.mjs <id> <outDir>          # renders desktop, dark and 375px; clicks every control; writes PNGs
```

`check-page` exits non-zero and lists problems: console errors, an empty preview or code tab, horizontal scrolling, a
missing variant grid. Read the PNGs it writes and compare them with `get_screenshot` of the Figma component set
(download with `curl -fsSL -o <file> <url>`). Confirm every variant in the grid matches Figma, dark theme is legible,
and nothing overflows at 375 px. Then list what you could not verify.
