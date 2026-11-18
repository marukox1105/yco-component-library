/* Scrollbar · Figma 13491:405. Config reference: COMPONENT-PAGES.md */
(() => {
  const ORIENTATIONS = ["horizontal", "vertical"];
  const rows = (n) => Array.from({ length: n }, (_, i) => `<li>Item ${i + 1}</li>`).join("");

  const thumb = (o) => `<span class="ycoScrollbar ycoScrollbar_orientation_${o}" role="presentation"></span>`;
  // The demo area scrolls for real; the width / height here are for the doc preview only.
  const area = (o) => o === "vertical"
    ? `<div class="ycoScrollbar_area" style="width:16rem;height:9.375rem" tabindex="0" role="region" aria-label="Scrollable list"><ul style="margin:0;padding:0 var(--spacing-16) 0 0;list-style:none">${rows(14)}</ul></div>`
    : `<div class="ycoScrollbar_area" style="width:16rem;white-space:nowrap" tabindex="0" role="region" aria-label="Scrollable row"><div style="width:48rem;padding-bottom:var(--spacing-8)">${Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`).join(" · ")}</div></div>`;

  YCO.page({
    id: "scrollbar",
    group: "Elements",
    title: "Scrollbar",
    figma: "13491:405",
    intro: "A slim 6px rounded scrollbar thumb, horizontal or vertical. Add the area class to any overflow container to restyle its native scrollbar; the thumb element is for static drawings.",
    controls: [{ key: "orientation", label: "Orientation", type: "chips", options: ORIENTATIONS, default: "vertical" }],
    surface: { minHeight: 220 },
    render: (s, ctx) => (ctx.preview
      ? `<div style="display:flex;gap:var(--spacing-32);align-items:center;flex-wrap:wrap;justify-content:center">${area(s.orientation)}<div>${thumb(s.orientation)}</div></div>`
      : `<!-- Native scrollbar of any overflow container -->\n<div class="ycoScrollbar_area" tabindex="0" role="region" aria-label="Scrollable list">\n  …\n</div>\n\n<!-- The thumb as drawn in Figma -->\n${thumb(s.orientation)}`),
    react: (s) => `// Proposed API: yce-frontend has no Scrollbar yet\nimport styles from './Scrollbar.module.css';\n\n// Restyle the native scrollbar of a scroll container\n<div className={styles.ycoScrollbar_area} tabIndex={0} role="region" aria-label="Scrollable list">\n  {children}\n</div>\n\n// Or draw the thumb alone\n<span className={\`\${styles.ycoScrollbar} \${styles.ycoScrollbar_orientation_${s.orientation}}\`} role="presentation" />`,
    variants: ORIENTATIONS.map((o) => ({ label: `Scrollbar / ${YCO.label(o)}`, html: thumb(o) })),
    notes: [
      "Figma only draws the thumb (150 x 6px, radius 8, --stroke-weak); there is no track, hover or drag state. The native scrollbar has a transparent track and darkens the thumb to --stroke-strong on hover, which is an addition for RD to confirm.",
      "Custom ::-webkit-scrollbar rules make the bar always visible in Chrome, Edge and Safari. Firefox gets a thin bar in the same colours.",
      "The 150px length is the drawing only; a real thumb's length is set by the browser from the content size.",
    ],
  });
})();
