# YCO Component Library

Static component documentation for YCO web components.

The first component page covers Buttons and is built from YCO semantic tokens read through Figma MCP.

## Architecture — one CSS file per component, shared with the app

Each component's styles live in **one plain-CSS file that is the single source of truth**, used by **both** sides with **no translation and no build step**:

- **Here (doc site)** — loaded via `<link>` for the live preview.
- **In `yce-frontend`** — imported by the `Button` component as a **CSS Module** (scoped class names, no global leak).

The file is plain CSS using CSS-Modules class names (`.ycoButton`, `.variant_primary`, `.tone_brand`, `.size_medium`). Plain CSS is valid **both** as a linked stylesheet (here) **and** as a CSS Module (there), so the *same file works in both places verbatim* — no `.scss`→`.css` conversion, no class-name remap, no CI. Design tokens (`--fill-*`, `--spacing-*`, …) are already global in both repos, so the component CSS only references `var(--…)`.

### Button files

| File | Role |
|---|---|
| `button.module.css` | **Single source of truth** for the button. Edit this to change the button everywhere. Plain, lint-clean CSS. |
| `styles.css` | Design tokens (`:root`) + doc-site chrome (sidebar, playground, code panel). **No component styles.** |
| `preview-states.css` | **Doc-only.** Maps the playground's `.is-hover` / `.is-press` / `.is-focus` to the real `:hover` / `:active` / `:focus-visible` look so the "State" control can show them without a pointer. Not exported. |

### To change the button

1. Edit `button.module.css` (plain CSS; tokens come from `styles.css` `:root`). Refresh to preview.
2. Copy `button.module.css` **verbatim** into `yce-frontend` at `src/components/common/button/Button.module.css` (overwrite). It must stay **byte-identical** between the two repos — it is a copy, never a transform.
3. Every `<Button variant tone size>` in the app updates at once (they all share the component's one CSS Module).

> In `yce-frontend` the component does `import styles from './Button.module.css'` and applies `styles.ycoButton` / `styles[\`tone_${tone}\`]` etc. — scoped by CSS Modules, so nothing leaks into the global namespace. The legacy hover/touch class-string API lives in a separate `button-wrapper` component and is not described here.

### Adding another component

Same pattern: one `*.module.css` per component (plain CSS, CSS-Modules class names), `<link>`'d here for preview and imported as a CSS Module in `yce-frontend`. Toast is next.

## Component pages — real components, one page each

The sidebar lists every component on Figma's component board, grouped the way the board groups them (55 pages). A page is built, not screenshotted: a plain-CSS file (`components/<id>.css`, the single source shared with `yce-frontend`) plus a small config (`components/<id>.js`) that the playground engine (`engine.js`) draws as a live preview, controls, HTML / React / CSS code, and a grid of every Figma variant. Pages carry a *Notes* box for token gaps and Figma quirks.

`COMPONENT-PAGES.md` is the contract for adding or changing one. Checks (all run their own headless Chrome, so they work in parallel):

| Command | What it checks |
|---|---|
| `node tools/check-components.mjs [id]` | CSS: class prefix, tokens defined in the light theme, no raw colours |
| `node tools/check-page.mjs <id> <outDir>` | Renders desktop / dark / 375px, clicks every control, writes screenshots, flags console errors, overflow, empty previews |
| `node tools/check-scenarios.mjs [id ...]` | Real pointer and keyboard scenarios for the interactive pages (open, choose, close, switch) |
| `node tools/audit-transparency.mjs [id]` | Lists elements whose own fill is translucent (nothing opaque under it) or faded with `opacity` |
| `node tools/add-base-fill.mjs [--write] [id]` | Adds the opaque base under translucent fills (see `COMPONENT-PAGES.md`, CSS rule 5) |
| `node tools/check-interactions.mjs <id> ...` | Broad click / key smoke test; its "dead click" count is a hint only (hidden inputs and closed menus read as dead) |

Playwright comes from a checkout of `yco-collab-space` (`PLAYWRIGHT_FROM`, default in the scripts).

## Overview page — Storybook catalogue grouped by Figma

`#overview` lists every component in the `yco-collab-space` Storybook (`platform/ui/**`), laid out the way Figma's *All components* board groups them (Elements, Forms, Feedback, Navigation, Surfaces, Content display, Marketing). Each Figma component shows its Storybook counterpart and a match label:

| Label | Meaning |
|---|---|
| In Figma | The Storybook component's contract (`design-library/components/<id>/component.yaml`) records a Figma node. |
| Confirm pairing | Paired by name or role; the contract records no Figma node (or one that may be a different page). Needs Designer/PM confirmation. |
| No Storybook component | Figma has it, Storybook does not. |

Storybook components with no Figma counterpart are listed separately under *Storybook only*, plus a short housekeeping list (story titles that do not match their folder, non-component stories).

`components-data.js` is **generated**; do not edit it. To refresh it from a checkout of `yco-collab-space` (needs its `node_modules` for the `yaml` package):

```sh
NODE_PATH=<checkout>/node_modules node tools/build-catalog.mjs <checkout> components-data.js
```

Each Figma row shows a thumbnail from `assets/figma/<name>.png`: 1x PNG exports of the instances on Figma's *All components* board (file `JXNIQPJT9I9qFrgtiaCn4i`, page `8703:121838`), taken with the Figma MCP `get_screenshot`. They are static; re-export one when its Figma component changes. The generator fails if a Figma row has no matching file. Storybook-only components have no thumbnail because they have no Figma source.

The Figma-group membership and the pairings live in `tools/build-catalog.mjs` (`FIGMA_GROUPS`, `NOT_IN_FIGMA`). Edit them there when a pairing is confirmed. No component CSS is copied for these components; only `button.module.css` is vendored.

## Preview Locally

Open `index.html` directly in a browser, or run a local static server:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

```txt
http://127.0.0.1:4173
```

## Deploy

This project is a static site. It can be deployed to Vercel, Netlify, GitHub Pages, or any static hosting service.

Recommended flow:

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Use the default static site settings.

## Figma Source

Primary Figma file:

```txt
https://www.figma.com/design/Za5iAGSMMCYziwU9UzCQFx/-Stitch-YCO_web_components
```

Use Figma Desktop MCP to read exact component values when updating tokens, dimensions, and variants.
