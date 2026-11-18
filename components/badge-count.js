/* Badge count · Figma 3639:1148. Config reference: COMPONENT-PAGES.md */
(() => {
  const EMPHASIS = ["strong", "moderate", "weak"];
  const markup = (s) => `<span class="ycoBadgeCount ycoBadgeCount_emphasis_${s.emphasis}">${s.count || "8"}</span>`;

  YCO.page({
    id: "badge-count",
    group: "Elements",
    title: "Badge count",
    figma: "3639:1148",
    intro: "A number in a pill, for unread or pending counts. Strong is a solid red pill, Moderate a tinted red one, Weak a neutral one. Format large counts yourself (99+).",
    controls: [
      { key: "emphasis", label: "Emphasis", type: "chips", options: EMPHASIS, default: "strong" },
      { key: "count", label: "Count", type: "text", default: "8" },
    ],
    render: markup,
    react: (s) => `// Proposed API: yce-frontend has no BadgeCount yet\nimport BadgeCount from '@/components/common/badge-count';\n\n<BadgeCount emphasis="${s.emphasis}" count={${Number.isNaN(Number(s.count)) ? `"${s.count}"` : s.count || 8}} />`,
    variants: EMPHASIS.map((emphasis) => ({ label: YCO.label(emphasis), html: markup({ emphasis, count: "8" }) })),
    notes: [
      "Strong draws its number in --background-base (white in light, near-black in dark), as Figma does; the dark theme therefore shows a dark number on a light red.",
      "The pill is 24px tall with 8px side padding, so a one-digit count is a circle and longer counts stretch it.",
    ],
  });
})();
