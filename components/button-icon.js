/* Button icon · Figma 6174:62119. Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = ["primary", "secondary", "tertiary"];
  const TONES = ["brand", "neutral", "inverse", "destructive"];
  const SIZES = ["large", "medium", "small", "tiny"];
  const SHAPES = ["square", "circle"];
  const STATES = ["default", "hover", "press", "focus", "disabled"];
  const STAR = '<svg class="ycoButtonIcon_glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 2.4 5 5.6.7-4.1 3.8 1.1 5.5L12 16.2 7 19l1.1-5.5L4 9.7 9.6 9 12 4Z"/></svg>';

  function markup(s, ctx) {
    const cls = ["ycoButtonIcon", `ycoButtonIcon_type_${s.type}`, `ycoButtonIcon_tone_${s.tone}`, `ycoButtonIcon_size_${s.size}`, `ycoButtonIcon_shape_${s.shape}`].join(" ");
    const label = "Label" + (s.dot ? ", new activity" : "") + (s.count ? ", 8 new" : "");
    return `<button class="${cls}${ctx.sc}" type="button" aria-label="${label}"${s.state === "disabled" ? " disabled" : ""}>
  <span class="ycoButtonIcon_icon">${STAR}</span>${s.dot ? '\n  <span class="ycoButtonIcon_dot" aria-hidden="true"></span>' : ""}${s.count ? '\n  <span class="ycoButtonIcon_count" aria-hidden="true">8</span>' : ""}
</button>`;
  }

  // One cell per Type x Tone x State; each cell lists the 4 sizes (columns) in both shapes (rows).
  const variants = [];
  TONES.forEach((tone) => TYPES.forEach((type) => STATES.forEach((state) => {
    const cells = SHAPES.flatMap((shape) => SIZES.map((size) => markup({ type, tone, size, shape, state, dot: false, count: false }, { sc: YCO.stateClass(state) })));
    variants.push({
      label: `${YCO.label(type)} / ${YCO.label(tone)} / ${YCO.label(state)}`,
      html: `<div style="display:grid;grid-template-columns:repeat(4,auto);gap:var(--spacing-12) var(--spacing-8);align-items:center;justify-items:center">${cells.join("")}</div>`,
      dark: tone === "inverse",
    });
  })));

  // The two optional badges, on every size and shape (primary brand and secondary neutral shown).
  [["badge dot", { dot: true, count: false }], ["badge count", { dot: false, count: true }]].forEach(([name, opt]) => [["primary", "brand"], ["secondary", "neutral"]].forEach(([type, tone]) => {
    const cells = SHAPES.flatMap((shape) => SIZES.map((size) => markup({ type, tone, size, shape, state: "default", ...opt }, { sc: "" })));
    variants.push({ label: `${YCO.label(type)} / ${YCO.label(tone)} / With ${name}`, html: `<div style="display:grid;grid-template-columns:repeat(4,auto);gap:var(--spacing-24) var(--spacing-32);align-items:center;justify-items:center;justify-content:center;padding:var(--spacing-8) var(--spacing-24) var(--spacing-8) var(--spacing-8)">${cells.join("")}</div>`, wide: true });
  }));

  YCO.page({
    id: "button-icon",
    group: "Elements",
    title: "Button icon",
    figma: "6174:62119",
    statesCss: "components/button-icon.states.css",
    intro: "An icon-only button in three weights (primary, secondary, tertiary) and four tones, square or circular, with an optional notification dot or count. Always give it an accessible name.",
    controls: [
      YCO.stateControl(),
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "primary" },
      { key: "tone", label: "Tone", type: "chips", options: TONES, default: "brand" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "medium" },
      { key: "shape", label: "Shape", type: "chips", options: SHAPES, default: "square" },
      { key: "dot", label: "Badge dot", type: "toggle", default: false },
      { key: "count", label: "Badge count", type: "toggle", default: false },
    ],
    surface: (s) => ({ inverse: s.tone === "inverse", minHeight: 160 }),
    render: markup,
    react: (s) => {
      const p = [`  aria-label="Label"`, `  type="${s.type}"`, `  tone="${s.tone}"`, `  size="${s.size}"`, `  shape="${s.shape}"`];
      if (s.dot) p.push("  badgeDot");
      if (s.count) p.push("  badgeCount={8}");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no ButtonIcon yet\nimport ButtonIcon from '@/components/common/button-icon';\n\n<ButtonIcon\n${p.join("\n")}\n  icon={<StarIcon />}\n/>`;
    },
    variants,
    notes: [
      "Large uses a 9.33px corner radius in Figma (56 / 42 x 8); there is no token, so the CSS writes it in rem.",
      "The badge count's drop shadow is 8% / 4% black in Figma; the CSS uses the nearest neutral tokens (10% / 4%). The dot is a plain --fill-error-strong circle with no ring.",
      "Large scales its dot, count, border and count text (16px) from Medium by 4/3; Figma draws 16.33px with a 23.33px line, which have no token.",
      "Primary Neutral and every Inverse Secondary or Tertiary tint hover and press with --fill-inverse-hover / --fill-inverse-press, as Figma does.",
      "Figma draws a 24px glyph box with a 17.6px drawn icon; the doc icon is a placeholder star and takes the full box. RD should pass its own 24px (32px Large, 20px Small and Tiny) icon.",
    ],
  });
})();
