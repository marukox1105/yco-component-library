# YCO Component Library

Static component documentation for YCO web components.

The first component page covers Buttons and is built from YCO semantic tokens read through Figma MCP.

## Architecture — one CSS file per component, shared with the app

Each component's styles live in **one plain-CSS file that is the single source of truth**, used by **both** sides with **no translation and no build step**:

- **Here (doc site)** — loaded via `<link>` for the live preview.
- **In `yce-frontend`** — imported by the component wrapper as a **CSS Module** (scoped class names, no global leak).

The file is plain CSS using CSS-Modules class names (`.ycoButton`, `.variant_primary`, `.tone_brand`, `.size_medium`). Plain CSS is valid **both** as a linked stylesheet (here) **and** as a CSS Module (there), so the *same file works in both places verbatim* — no `.scss`→`.css` conversion, no class-name remap, no CI. Design tokens (`--fill-*`, `--spacing-*`, …) are already global in both repos, so the component CSS only references `var(--…)`.

### Button files

| File | Role |
|---|---|
| `button.module.css` | **Single source of truth** for the button. Edit this to change the button everywhere. Plain, lint-clean CSS. |
| `styles.css` | Design tokens (`:root`) + doc-site chrome (sidebar, playground, code panel). **No component styles.** |
| `preview-states.css` | **Doc-only.** Maps the playground's `.is-hover` / `.is-press` / `.is-focus` to the real `:hover` / `:active` / `:focus-visible` look so the "State" control can show them without a pointer. Not exported. |

### To change the button

1. Edit `button.module.css` (plain CSS; tokens come from `styles.css` `:root`). Refresh to preview.
2. Copy `button.module.css` **verbatim** into `yce-frontend` at `src/components/common/button-wrapper/button.module.css` (overwrite). It must stay **byte-identical** between the two repos — it is a copy, never a transform.
3. Every `<ButtonWrapper variant tone size>` in the app updates at once (they all share the wrapper's one CSS Module).

> In `yce-frontend` the wrapper does `import variantStyles from './button.module.css'` and applies `variantStyles.ycoButton` / `variantStyles[\`tone_${tone}\`]` etc. — scoped by CSS Modules, so nothing leaks into the global namespace. The legacy `.button` string API stays in the wrapper's own `index.module.scss`.

### Adding another component

Same pattern: one `*.module.css` per component (plain CSS, CSS-Modules class names), `<link>`'d here for preview and imported as a CSS Module in `yce-frontend`. Toast is next.

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
