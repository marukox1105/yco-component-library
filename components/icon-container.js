/* Icon container · Figma 6638:143252. Config reference: COMPONENT-PAGES.md */
(() => {
  const TONES = ["neutral", "brand", "inverse", "destructive", "warning", "success", "information"];
  const STYLES = ["filled", "stroked"];
  const ICONS = {
    star: '<path d="m12 4 2.4 5 5.6.7-4.1 3.8 1.1 5.5L12 16.2 7 19l1.1-5.5L4 9.7 9.6 9 12 4Z"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 21h4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  };
  const svg = (name) => `<svg class="ycoIconContainer_icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
  const markup = (s) => `<span class="ycoIconContainer ycoIconContainer_tone_${s.tone} ycoIconContainer_style_${s.style}">${svg(s.icon)}</span>`;

  YCO.page({
    id: "icon-container",
    group: "Elements",
    title: "Icon container",
    figma: "6638:143252",
    intro: "A round 48px holder that gives an icon a tone: filled with a soft tint or drawn as an outline. Decorative by default; add a label on the wrapper if the icon carries meaning.",
    controls: [
      { key: "tone", label: "Tone", type: "chips", options: TONES, default: "neutral" },
      { key: "style", label: "Style", type: "chips", options: STYLES, default: "filled" },
      { key: "icon", label: "Icon", type: "chips", options: Object.keys(ICONS), default: "star" },
    ],
    surface: (s) => ({ inverse: s.tone === "inverse" }),
    render: markup,
    react: (s) => `// Proposed API: yce-frontend has no IconContainer yet\nimport IconContainer from '@/components/common/icon-container';\n\n<IconContainer tone="${s.tone}" appearance="${s.style}" icon={<${s.icon[0].toUpperCase() + s.icon.slice(1)}Icon />} />`,
    variants: TONES.flatMap((tone) => STYLES.map((style) => ({ label: `${YCO.label(tone)} / ${YCO.label(style)}`, html: markup({ tone, style, icon: "star" }), dark: tone === "inverse" }))),
    notes: [
      "Fill / Inverse weak exists only in the dark theme; the light CSS uses --fill-inverse-hover (white at 6%) as the nearest token. Ask the designer for the light value.",
      "Figma draws the icon at 17.6px inside a 24px box; the doc icons fill the 24px box. Pass any 24px icon.",
    ],
  });
})();
