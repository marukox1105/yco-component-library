/* Divider · Figma 3981:37904. Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = ["weak", "strong"];
  const rule = (type) => `<hr class="ycoDivider ycoDivider_type_${type}" />`;
  // The rule is 1px, so the preview and the grid give it room and a little text to separate.
  const room = (inner) => `<div style="width:100%;min-width:12rem;padding:var(--spacing-48) var(--spacing-0)">${inner}</div>`;
  const inContext = (type) => `<div style="width:100%;min-width:12rem;display:flex;flex-direction:column;gap:var(--spacing-16);font:var(--font-size-small)/var(--line-height-small) var(--font-family-body);color:var(--text-strong)"><span>Label</span>${rule(type)}<span>Label</span></div>`;

  YCO.page({
    id: "divider",
    group: "Content display",
    title: "Divider",
    figma: "3981:37904",
    intro: "A 1px horizontal rule that separates content. Weak is the default; Strong is for a clearer break.",
    controls: [{ key: "type", label: "Type", type: "chips", options: TYPES, default: "weak" }],
    surface: { wide: true, minHeight: 200 },
    render: (s, ctx) => (ctx.preview ? `<div style="width:100%;padding:var(--spacing-56) var(--spacing-24);background:var(--background-base)">${rule(s.type)}</div>` : rule(s.type)),
    react: (s) => `// Proposed API: yce-frontend has no Divider yet\nimport Divider from '@/components/common/divider';\n\n<Divider${s.type === "strong" ? ' type="strong"' : ""} />`,
    variants: () => [
      ...TYPES.map((type) => ({ label: YCO.label(type), wide: true, html: room(rule(type)) })),
      ...TYPES.map((type) => ({ label: `${YCO.label(type)} between content`, wide: true, html: room(inContext(type)) })),
    ],
    notes: [
      "Figma draws only the horizontal Weak and Strong rules. A vertical or labelled divider is not in the design, so none is built here.",
      "Weak uses --stroke-weak and Strong uses --stroke-strong, the same tokens Figma binds.",
    ],
  });
})();
