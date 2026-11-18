/* Text link · Figma 4783:91903. Config reference: COMPONENT-PAGES.md */
(() => {
  const TONES = [
    { value: "default", label: "Default" },
    { value: "neutral-strong", label: "Neutral strong" },
    { value: "neutral-weak", label: "Neutral weak" },
    { value: "destructive", label: "Destructive" },
    { value: "inverse-strong", label: "Inverse strong" },
    { value: "inverse-weak", label: "Inverse weak" },
  ];
  const SIZES = ["small", "tiny"];
  const WEIGHTS = ["bold", "regular"];
  const STATES = ["default", "hover", "press", "focus", "disabled"];
  const ARROW = '<svg class="ycoTextLink_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const PLUS = '<svg class="ycoTextLink_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const inverse = (tone) => tone.startsWith("inverse");

  function markup(s, ctx) {
    const disabled = s.state === "disabled";
    const cls = ["ycoTextLink", `ycoTextLink_tone_${s.tone}`, `ycoTextLink_size_${s.size}`, `ycoTextLink_weight_${s.weight}`, `ycoTextLink_underline_${s.underline ? "true" : "false"}`].join(" ");
    const attrs = disabled ? ' aria-disabled="true"' : ' href="#"';
    return `<a class="${cls}${ctx.sc}"${attrs}>${s.iconLeft ? PLUS : ""}${s.text || "Label"}${s.iconRight ? ARROW : ""}</a>`;
  }

  // One cell per Tone x State x Underline; each lists the four Size x Weight links.
  const variants = [];
  TONES.forEach((t) => STATES.forEach((state) => [true, false].forEach((underline) => {
    const links = SIZES.flatMap((size) => WEIGHTS.map((weight) => markup({ tone: t.value, state, size, weight, underline, text: "Label" }, { sc: YCO.stateClass(state) })));
    variants.push({
      label: `${t.label} / ${YCO.label(state)} / Underline ${underline ? "true" : "false"}`,
      html: `<div style="display:flex;flex-wrap:wrap;gap:var(--spacing-12) var(--spacing-24);align-items:center;justify-content:center">${links.join("")}</div>`,
      dark: inverse(t.value),
    });
  })));

  YCO.page({
    id: "text-link",
    group: "Elements",
    title: "Text link",
    figma: "4783:91903",
    statesCss: "components/text-link.states.css",
    intro: "An inline or standalone link in six tones, two sizes and two weights, with an optional icon either side. Hover and press flip the underline; focus draws a ring.",
    controls: [
      YCO.stateControl(),
      { key: "tone", label: "Tone", type: "chips", options: TONES, default: "default" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "small" },
      { key: "weight", label: "Weight", type: "chips", options: WEIGHTS, default: "bold" },
      { key: "underline", label: "Underline", type: "toggle", default: true },
      { key: "iconLeft", label: "Icon left", type: "toggle", default: false },
      { key: "iconRight", label: "Icon right", type: "toggle", default: false },
      { key: "text", label: "Text", type: "text", default: "Label" },
    ],
    surface: (s) => ({ inverse: inverse(s.tone), minHeight: 120 }),
    render: markup,
    react: (s) => {
      const p = [`  href="/path"`, `  tone="${s.tone}"`, `  size="${s.size}"`, `  weight="${s.weight}"`];
      if (!s.underline) p.push("  underline={false}");
      if (s.iconLeft) p.push("  iconLeft={<PlusIcon />}");
      if (s.iconRight) p.push("  iconRight={<ArrowRightIcon />}");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no TextLink yet\nimport TextLink from '@/components/common/text-link';\n\n<TextLink\n${p.join("\n")}\n>\n  ${s.text || "Label"}\n</TextLink>`;
    },
    variants,
    notes: [
      "Text / Inverse weak exists only in the dark theme; the light CSS uses --icon-inverse (white at 60%) as the nearest value. Ask the designer for a light text token.",
      "Small + Bold is 18px on a 26px line in Figma (Small + Regular is 16 / 24, Tiny is 14 / 20). There is no 26px line-height token, so it is written in rem.",
      "A disabled link has no href and carries aria-disabled; it keeps the underline setting of its variant but never flips on hover.",
      "Figma draws the icon colour as part of the instance; here both icons follow the text colour.",
      "The focus ring is 2px, 2px outside the text box, radius 4px, in --stroke-focus.",
    ],
  });
})();
