/* Text · Figma 5371:9961. Config reference: COMPONENT-PAGES.md */
(() => {
  // type -> element, label, default copy. Heading levels map to real h1-h4; the rest are paragraphs.
  const TYPES = [
    { id: "h1", tag: "h1", label: "H1", copy: "Heading 1" },
    { id: "h2", tag: "h2", label: "H2", copy: "Heading 2" },
    { id: "h3", tag: "h3", label: "H3", copy: "Heading 3" },
    { id: "h4", tag: "h4", label: "H4", copy: "Heading 4" },
    { id: "h5", tag: "h5", label: "Heading 5", copy: "Heading 5" },
    { id: "small", tag: "p", label: "Small", copy: "Small" },
    { id: "tiny", tag: "p", label: "Tiny", copy: "Tiny" },
    { id: "micro", tag: "p", label: "Micro", copy: "Micro" },
    { id: "uppercase", tag: "p", label: "Uppercase", copy: "Uppercase" },
  ];
  const find = (id) => TYPES.find((t) => t.id === id);

  function markup({ type, weight, text }) {
    const t = find(type);
    const w = weight === "default" ? "" : ` ycoText_weight_${weight}`;
    return `<${t.tag} class="ycoText ycoText_type_${t.id}${w}">${YCO.esc(text || t.copy)}</${t.tag}>`;
  }

  YCO.page({
    id: "text",
    group: "Content display",
    title: "Text",
    figma: "5371:9961",
    intro: "The typographic styles: four heading levels, Heading 5, three body sizes and an uppercase label. Pick a level and, if needed, override its weight.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: TYPES.map((t) => ({ value: t.id, label: t.label })), default: "h1" },
      { key: "weight", label: "Weight", type: "chips", options: [{ value: "default", label: "Default" }, { value: "regular", label: "Regular" }, { value: "strong", label: "Strong" }], default: "default" },
      { key: "text", label: "Text", type: "text", default: "Heading 1" },
    ],
    surface: { wide: true, minHeight: 160 },
    render: (s, ctx) => (ctx.preview ? `<div style="width:100%;padding:var(--spacing-24);background:var(--background-base)">${markup(s)}</div>` : markup(s)),
    react: (s) => {
      const t = find(s.type);
      return `// Proposed API: yce-frontend has no Text yet\nimport Text from '@/components/common/text';\n\n<Text type="${t.id}"${s.weight !== "default" ? ` weight="${s.weight}"` : ""}>\n  ${s.text || t.copy}\n</Text>`;
    },
    variants: () => [
      ...TYPES.map((t) => ({ label: t.label, wide: true, html: markup({ type: t.id, weight: "default", text: "" }) })),
      { label: "H3 / Regular weight", wide: true, html: markup({ type: "h3", weight: "regular", text: "" }) },
      { label: "Small / Strong weight", wide: true, html: markup({ type: "small", weight: "strong", text: "" }) },
    ],
    notes: [
      "Figma's Type8 and Type9 are named here Heading 5 (18/26, semibold) and Micro (12/16).",
      "Token gaps: Heading 1 (40/48, -0.5px), Heading 2 (32/40), Heading 3 (24/32) and Micro (12/16) sizes and line heights, and Heading 5's 26px line height, are not in styles.css; rem values are used. Letter spacing 2px on Uppercase and -0.5px on H1 are literal.",
      "Weight is not a Figma property (each type has one weight). The Weight control is an addition: Default keeps the Figma weight. Uppercase is colored --text-weak as in Figma; every other type is --text-strong.",
      "Heading types use --font-family-heading and the rest --font-family-body; both resolve to Roboto here.",
    ],
  });
})();
