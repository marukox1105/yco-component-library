/* Slot · Figma 5367:8049. Config reference: COMPONENT-PAGES.md */
(() => {
  const HEIGHTS = [{ value: "hug", label: "Hug text" }, { value: "tall", label: "Tall" }];
  const markup = (s) => `<div class="ycoSlot ycoSlot_height_${s.height}">${s.text || "Swap with another component"}</div>`;

  YCO.page({
    id: "slot",
    group: "Elements",
    title: "Slot",
    figma: "5367:8049",
    intro: "A dashed placeholder that marks where another component can be dropped in a layout. It is a design and documentation aid, not something to ship.",
    controls: [
      { key: "height", label: "Height", type: "chips", options: HEIGHTS, default: "hug" },
      { key: "text", label: "Text", type: "text", default: "Swap with another component" },
    ],
    surface: { wide: true },
    render: markup,
    react: (s) => `// Proposed API: yce-frontend has no Slot yet\nimport Slot from '@/components/common/slot';\n\n<Slot${s.height === "tall" ? ' height="tall"' : ""}>${s.text || "Swap with another component"}</Slot>`,
    variants: HEIGHTS.map((h) => ({ label: `Slot / ${h.label}`, html: markup({ height: h.value, text: "Swap with another component" }), wide: true })),
    notes: [
      "Figma has one Slot component with no variants (364 x 21px, hugging its text). Its docs frame uses it at 364 x 69px, drawn here as Tall; Hug text is the component as built.",
      "The dashed outline is 4px dashes in --stroke-strong; the browser's dashed border is the nearest match.",
      "Line height is 1.5 (21px at 14px); there is no matching token, so it is written in rem.",
    ],
  });
})();
