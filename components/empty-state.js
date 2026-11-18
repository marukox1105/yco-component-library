/* Empty state · Figma 4865:151544. Config reference: COMPONENT-PAGES.md */
(() => {
  const ICON = '<svg class="ycoEmptyState_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z"/></svg>';
  const DESC = "Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Lorem ipsum dolor sit amet, consec tetur adipiscing elit.";
  const btn = (variant) => `<button class="ycoButton tone_brand variant_${variant} size_medium" type="button"><span class="label">Label</span></button>`;

  function markup(s) {
    const buttons = [s.primary && btn("primary"), s.secondary && btn("secondary"), s.tertiary && btn("tertiary")].filter(Boolean);
    return `<div class="ycoEmptyState">${s.icon ? `
  <div class="ycoEmptyState_iconWrap">${ICON}</div>` : ""}
  <div class="ycoEmptyState_text">
    <h3 class="ycoEmptyState_heading">${s.heading}</h3>
    <p class="ycoEmptyState_description">${s.description}</p>
  </div>${buttons.length ? `
  <div class="ycoEmptyState_actions">
    ${buttons.join("\n    ")}
  </div>` : ""}
</div>`;
  }

  const full = { icon: true, primary: true, secondary: true, tertiary: true, heading: "Heading", description: DESC };
  YCO.page({
    id: "empty-state",
    group: "Feedback",
    title: "Empty state",
    figma: "4865:151544",
    needs: ["button"],
    intro: "What a list, gallery or panel shows when there is nothing in it yet: an optional icon, a heading, a short explanation and up to three actions.",
    controls: [
      { key: "icon", label: "Icon", type: "toggle", default: true },
      { key: "primary", label: "Primary button", type: "toggle", default: true },
      { key: "secondary", label: "Secondary button", type: "toggle", default: true },
      { key: "tertiary", label: "Tertiary button", type: "toggle", default: true },
      { key: "heading", label: "Heading", type: "text", default: "Heading" },
      { key: "description", label: "Description", type: "text", default: DESC },
    ],
    surface: { start: true },
    render: (s) => markup(s),
    react: (s) => {
      const p = [`  heading="${s.heading}"`, `  description="${s.description}"`];
      if (s.icon) p.push("  icon={<Icon />}");
      const a = [];
      if (s.primary) a.push('{ label: "Label", variant: "primary", onClick }');
      if (s.secondary) a.push('{ label: "Label", variant: "secondary", onClick }');
      if (s.tertiary) a.push('{ label: "Label", variant: "tertiary", onClick }');
      if (a.length) p.push(`  actions={[\n    ${a.join(",\n    ")},\n  ]}`);
      return `// Proposed API: yce-frontend has no EmptyState yet\nimport EmptyState from '@/components/common/empty-state';\n\n<EmptyState\n${p.join("\n")}\n/>`;
    },
    variants: [
      { label: "Icon on", html: markup(full), wide: true },
      { label: "Icon off", html: markup({ ...full, icon: false }), wide: true },
      { label: "Icon on / Primary only", html: markup({ ...full, secondary: false, tertiary: false }) },
      { label: "Icon on / No buttons", html: markup({ ...full, primary: false, secondary: false, tertiary: false }) },
    ],
    notes: [
      "Figma has one Icon switch and three button switches (primary, secondary, tertiary, all medium and brand); it draws only the all-on set with and without the icon. The last two cells show the button switches off.",
      "The heading is 24px / 32px semibold (Heading 3), which has no token in styles.css; written in rem. The container radius uses --spacing-48 as Figma does.",
      "The icon is a diamond placeholder, as in Figma; the product supplies the real icon.",
      "The tertiary label is underlined by the shared Button (its own rule); the Figma empty-state frame draws it without. The component is 536px wide in Figma; here it fills its container up to 536px.",
    ],
  });
})();
