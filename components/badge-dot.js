/* Badge dot · Figma 6412:85981. Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = ["online", "busy", "away", "offline", "notification"];
  const SIZES = ["small", "medium", "large"];
  const GLYPH = {
    online: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    busy: '<path d="M6 12h12"/>',
    away: '<circle cx="12" cy="12" r="0.1"/><path d="M12 6v6l4 2"/>',
    offline: '<path d="m7 7 10 10M17 7 7 17"/>',
  };
  // Small dots and Notification have no glyph in Figma.
  const glyph = (s) => (s.size === "small" || s.type === "notification" ? "" : `<svg class="ycoBadgeDot_glyph" viewBox="0 0 24 24" aria-hidden="true">${GLYPH[s.type]}</svg>`);
  const dot = (s) => `<span class="ycoBadgeDot ycoBadgeDot_size_${s.size} ycoBadgeDot_type_${s.type}" role="img" aria-label="${s.type}">${glyph(s)}</span>`;

  YCO.page({
    id: "badge-dot",
    group: "Elements",
    title: "Badge dot",
    figma: "6412:85981",
    intro: "A small status dot for avatars and list items: online, busy, away, offline, or an unread notification. Medium and Large carry a glyph; Small and Notification are plain dots.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "online" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "large" },
    ],
    // The dots are 8-16px, so the live preview is shown 4x; the code and the variant grid stay at real size.
    render: (s, ctx) => (ctx.preview ? `<span style="display:inline-block;transform:scale(4)">${dot(s)}</span>` : dot(s)),
    react: (s) => `// Proposed API: yce-frontend has no BadgeDot yet\nimport BadgeDot from '@/components/common/badge-dot';\n\n<BadgeDot type="${s.type}" size="${s.size}" />`,
    variants: () => SIZES.flatMap((size) => TYPES.map((type) => ({ label: `${YCO.label(type)} / ${YCO.label(size)}`, html: dot({ size, type }) }))),
    notes: [
      "Away uses --fill-warning-strong (a dark amber); Figma draws it as a brighter yellow that has no token yet.",
      "Offline uses --fill-disabled; Figma's grey is slightly lighter.",
    ],
  });
})();
