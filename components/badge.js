/* Badge · Figma 3508:66832. Config reference: COMPONENT-PAGES.md */
(() => {
  const TONES = ["error", "warning", "success", "information", "neutral", "brand"];
  const SIZES = ["medium", "small"];
  const ICONS = {
    error: '<path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/>',
    warning: '<path d="M10.3 4.2 2.7 17.5a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9.5v4M12 17h.01"/>',
    success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    information: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    neutral: '<path d="m12 4 2.4 5 5.6.7-4.1 3.8 1.1 5.5L12 16.2 7 19l1.1-5.5L4 9.7 9.6 9 12 4Z"/>',
    brand: '<path d="m12 4 2.4 5 5.6.7-4.1 3.8 1.1 5.5L12 16.2 7 19l1.1-5.5L4 9.7 9.6 9 12 4Z"/>',
  };

  const markup = (s) => `<span class="ycoBadge ycoBadge_tone_${s.tone} ycoBadge_size_${s.size}">${s.icon ? `<svg class="ycoBadge_icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.tone]}</svg>` : ""}${s.dot ? '<span class="ycoBadge_dotSlot" aria-hidden="true"><span class="ycoBadge_dot"></span></span>' : ""}<span class="ycoBadge_label">${s.text || "Label"}</span></span>`;

  YCO.page({
    id: "badge",
    group: "Elements",
    title: "Badge",
    figma: "3508:66832",
    intro: "A small status label in six tones with an optional icon and dot. It names a state (failed, pending, new); it is not clickable.",
    controls: [
      { key: "tone", label: "Tone", type: "chips", options: TONES, default: "error" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "medium" },
      { key: "icon", label: "Icon", type: "toggle", default: true },
      { key: "dot", label: "Badge dot", type: "toggle", default: false },
      { key: "text", label: "Text", type: "text", default: "Label" },
    ],
    render: markup,
    react: (s) => {
      const p = [`  tone="${s.tone}"`, `  size="${s.size}"`];
      if (!s.icon) p.push("  icon={false}");
      if (s.dot) p.push("  dot");
      return `// Proposed API: yce-frontend has no Badge yet\nimport Badge from '@/components/common/badge';\n\n<Badge\n${p.join("\n")}\n>\n  ${s.text || "Label"}\n</Badge>`;
    },
    variants: SIZES.flatMap((size) => TONES.map((tone) => ({ label: `${YCO.label(tone)} / ${YCO.label(size)}`, html: markup({ tone, size, icon: true, dot: false, text: "Label" }) }))).concat(
      SIZES.map((size) => ({ label: `With badge dot / ${YCO.label(size)}`, html: markup({ tone: "success", size, icon: true, dot: true, text: "Label" }) })),
    ),
    notes: [
      "Neutral and Brand use Figma's placeholder icon; the doc page draws a star. Pass any 20px icon (16px for Small).",
      "The Badge dot slot defaults to Badge dot's Online type in Figma (a 12px dot with a ring); it is drawn here as a plain 12px --fill-success-strong dot. Confirm the intended types with the designer.",
      "Warning text uses --text-warning, which Figma's yellow update changed from a dark amber to #ef9b00 in the light theme; that is a lower contrast on white, so check it with the designer.",
    ],
  });
})();
