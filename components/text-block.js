/* Text block · Figma 8119:52164. Config reference: COMPONENT-PAGES.md */
(() => {
  const BODY = "Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Etiam finibus blan dit euismod.";
  // Figma's icon is a rotated rounded square outline.
  const ICON = '<span class="ycoTextBlock_icon"><svg class="ycoTextBlock_iconSvg" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 3.6a2 2 0 0 1 2.8 0l7 7a2 2 0 0 1 0 2.8l-7 7a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1 0-2.8l7-7Z"/></svg></span>';

  function markup(s) {
    const centre = s.align === "centre";
    const hasText = s.heading || s.secondary;
    return `<div class="ycoTextBlock${centre ? " ycoTextBlock_align_centre" : ""}">
  ${s.icon ? ICON : ""}
  ${hasText ? `<div class="ycoTextBlock_text">
    ${s.heading ? '<h3 class="ycoTextBlock_heading">Heading</h3>' : ""}
    ${s.secondary ? `<p class="ycoTextBlock_body">${BODY}</p>` : ""}
  </div>` : ""}
  ${s.link ? '<a class="ycoTextBlock_link" href="#">Label</a>' : ""}
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const all = { icon: true, heading: true, secondary: true, link: true };

  YCO.page({
    id: "text-block",
    group: "Content display",
    title: "Text block",
    figma: "8119:52164",
    intro: "A short block of text: an optional icon, a heading, a line of secondary text and a text link, aligned left or centred.",
    controls: [
      { key: "align", label: "Align", type: "chips", options: ["left", "centre"], default: "left" },
      { key: "icon", label: "Icon", type: "toggle", default: true },
      { key: "heading", label: "Heading", type: "toggle", default: true },
      { key: "secondary", label: "Secondary text", type: "toggle", default: true },
      { key: "link", label: "Text link", type: "toggle", default: true },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? `<div style="width:100%;max-width:22.75rem;margin:0 auto;background:var(--background-base)">${markup(s)}</div>` : markup(s)),
    react: (s) => {
      const p = [];
      if (s.align === "centre") p.push('  align="centre"');
      if (s.icon) p.push("  icon={<Icon name=\"diamond\" />}");
      if (s.heading) p.push('  heading="Heading"');
      if (s.secondary) p.push('  text="Lorem ipsum dolor sit amet, consec tetur adipiscing elit."');
      if (s.link) p.push('  link={{ label: "Label", href: "#" }}');
      return `// Proposed API: yce-frontend has no TextBlock yet\nimport TextBlock from '@/components/common/text-block';\n\n<TextBlock\n${p.join("\n")}\n/>`;
    },
    variants: () => {
      const cell = (label, s) => ({ label, html: `<div style="width:100%;max-width:22.75rem">${markup(s)}</div>` });
      return [
        cell("Align Left / all parts", { ...all, align: "left" }),
        cell("Align Centre / all parts", { ...all, align: "centre" }),
        cell("Left / no icon", { ...all, align: "left", icon: false }),
        cell("Left / no link", { ...all, align: "left", link: false }),
        cell("Left / heading only", { icon: false, heading: true, secondary: false, link: false, align: "left" }),
        cell("Centre / no icon, no link", { ...all, align: "centre", icon: false, link: false }),
        cell("Left / secondary text only", { icon: false, heading: false, secondary: true, link: false, align: "left" }),
        cell("Left / link only", { icon: false, heading: false, secondary: false, link: true, align: "left" }),
      ];
    },
    notes: [
      "Heading is drawn at 24/32 semibold, which has no font-size / line-height token (Heading 3); 1.5rem / 2rem are used. The link is 18/26 semibold (1.625rem line height has no token).",
      "The Figma Centre variant always shows its heading; here the Heading toggle applies to both alignments. The icon is a placeholder outline drawn for this page (Figma shows a diamond icon).",
      "Text link hover and press fills are proposed (--fill-brand-hover and --fill-brand-press); Figma draws only the default link.",
    ],
  });
})();
