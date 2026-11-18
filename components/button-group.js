/* Button group · Figma 3506:64616. Config reference: COMPONENT-PAGES.md */
(() => {
  const LAYOUTS = ["horizontal", "vertical"];
  const ORDERS = ["default", "reverse"];
  const SIZES = ["large", "medium", "small", "tiny"];

  function markup(s) {
    const items = [];
    if (s.primary) items.push(["primary", "Label"]);
    if (s.secondary) items.push(["secondary", "Label"]);
    if (s.tertiary) items.push(["tertiary", "Label"]);
    if (s.order === "reverse") items.reverse(); // Figma's Reverse puts the text button first
    return `<div class="ycoButtonGroup ycoButtonGroup_layout_${s.layout} ycoButtonGroup_size_${s.size}" role="group" aria-label="Actions">
${items.map(([type, text]) => `  <button class="ycoButtonGroup_button ycoButtonGroup_type_${type}" type="button">${text}</button>`).join("\n")}
</div>`;
  }

  const variants = [];
  LAYOUTS.forEach((layout) => SIZES.forEach((size) => ORDERS.forEach((order) => {
    variants.push({ label: `${YCO.label(layout)} / ${YCO.label(order)} / ${YCO.label(size)}`, html: markup({ layout, order, size, primary: true, secondary: true, tertiary: true }), wide: layout === "horizontal" });
  })));

  YCO.page({
    id: "button-group",
    group: "Elements",
    title: "Button group",
    figma: "3506:64616",
    intro: "A set of related actions: a primary, a secondary and a text button laid out in a row or a stack. Reverse order puts the text button first; each of the three can be left out.",
    controls: [
      { key: "layout", label: "Layout", type: "chips", options: LAYOUTS, default: "horizontal" },
      { key: "order", label: "Order", type: "chips", options: ORDERS, default: "default" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "large" },
      { key: "primary", label: "Primary button", type: "toggle", default: true },
      { key: "secondary", label: "Secondary button", type: "toggle", default: true },
      { key: "tertiary", label: "Text button", type: "toggle", default: true },
    ],
    surface: (s) => ({ wide: s.layout === "vertical", minHeight: 160 }),
    render: markup,
    react: (s) => {
      const p = [`  layout="${s.layout}"`, `  order="${s.order}"`, `  size="${s.size}"`];
      const kids = [];
      if (s.primary) kids.push('  <ButtonGroup.Primary onClick={onPrimary}>Label</ButtonGroup.Primary>');
      if (s.secondary) kids.push('  <ButtonGroup.Secondary onClick={onSecondary}>Label</ButtonGroup.Secondary>');
      if (s.tertiary) kids.push('  <ButtonGroup.Tertiary onClick={onTertiary}>Label</ButtonGroup.Tertiary>');
      return `// Proposed API: yce-frontend has no ButtonGroup yet\nimport ButtonGroup from '@/components/common/button-group';\n\n<ButtonGroup\n${p.join("\n")}\n>\n${kids.join("\n")}\n</ButtonGroup>`;
    },
    variants,
    notes: [
      "Figma draws only the default look of each button; hover, press, focus and disabled here follow Button icon (a --fill-hover / --fill-press tint, a 3px --stroke-focus ring). Confirm with the designer.",
      "The 18px Medium label has a 26px line in Figma; there is no --line-height-heading-5 token, so --line-height-small (24px) is used. Button height is fixed, so nothing moves.",
      "A vertical Large group is 64px per button in Figma, 8px taller than the horizontal Large (56px). Kept as drawn.",
      "Large and Medium use 28px / 20px of inline padding (24 / 16 plus the 4px label container).",
      "Sizes follow Button's names: Tiny 32 / Small 36 / Medium 42 / Large 56. Figma draws only 56, 42 and 32, and calls the 32px one Small, so that variant is Tiny here. Small (36px, 16px label) was added to match Button and is not in Figma: confirm with the designer.",
    ],
  });
})();
