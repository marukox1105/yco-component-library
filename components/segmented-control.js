/* Segmented control · Figma 6373:78550. Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoSegmentedControl";
  const ICON = `<svg class="${P}_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 21 12l-9 9-9-9 9-9Z"/></svg>`;
  let uid = 0;

  function control(s, ctx) {
    const n = Number(s.count);
    const name = `seg-${++uid}`;
    const items = Array.from({ length: n }, (_, i) => `<label class="${P}_item">
    <input class="${P}_input" type="radio" name="${name}" value="${i + 1}"${i === 0 ? " checked" : ""} />
    <span class="${P}_face${i === 0 && ctx ? ctx.sc : ""}">${s.type === "icons" ? ICON : ""}<span class="${P}_label">Label</span></span>
  </label>`);
    return `<div class="${P} ${P}_size_${s.size}" role="radiogroup" aria-label="Segmented control">
  ${items.join("\n  ")}
</div>`;
  }

  // One item for the Selected / Unselected x state grid (a group of one, so the face keeps its look).
  const item = (selected, state, size) => {
    const name = `seg-${++uid}`;
    return `<div class="${P} ${P}_size_${size}" role="radiogroup" aria-label="Segmented control"><label class="${P}_item"><input class="${P}_input" type="radio" name="${name}"${selected ? " checked" : ""} /><span class="${P}_face${YCO.stateClass(state)}"><span class="${P}_label">Label</span></span></label></div>`;
  };

  const variants = [];
  [["text", "medium"], ["icons", "medium"], ["text", "small"], ["icons", "small"]].forEach(([type, size]) => {
    variants.push({ label: `${YCO.label(type)} / ${YCO.label(size)}`, html: control({ type, size, count: 5 }, { sc: "" }), wide: true });
  });
  ["medium", "small"].forEach((size) => [false, true].forEach((selected) => ["default", "hover", "press", "focus"].forEach((state) => {
    variants.push({ label: `Item / ${selected ? "Selected" : "Unselected"} / ${YCO.label(state)} / ${YCO.label(size)}`, html: item(selected, state, size) });
  })));

  YCO.page({
    id: "segmented-control",
    group: "Navigation",
    title: "Segmented control",
    figma: "6373:78550",
    statesCss: "components/segmented-control.states.css",
    intro: "A compact switch between two to five mutually exclusive views. It is a radio group: click an item, or use the arrow keys, to select it.",
    controls: [
      YCO.stateControl(["default", "hover", "press", "focus"]),
      { key: "type", label: "Type", type: "chips", options: ["text", "icons"], default: "text" },
      { key: "size", label: "Size", type: "chips", options: ["medium", "small"], default: "medium" },
      { key: "count", label: "Items", type: "chips", options: ["2", "3", "4", "5"], default: "5" },
    ],
    render: control,
    react: (s) => `import { SegmentedControl } from '@/components/common/tab-control/segmented-control';\n\n// props from src/components/common/tab-control/segmented-control/index.js\n<SegmentedControl\n  tabs={[{ key: 'one', label: 'Label' }, { key: 'two', label: 'Label' }]}\n  currentTab={currentTab}\n  setCurrentTab={setCurrentTab}\n/>\n// Not exposed by yce-frontend: size="${s.size}", ${s.type === "icons" ? "icon per item" : "icons"}.`,
    variants,
    notes: [
      "The raised selected pill uses --background-raised and two soft shadows built from --grey-light-100 / --grey-light-50; Figma's Shadow/Raised and 'background/overlay' have no matching token.",
      "The State control applies to the first item only (it carries the forced look); the grid lists every Selected / Unselected x state.",
      "Unselected items get a rounded hover fill; Figma draws a square one. Figma has no Disabled state.",
      "yce-frontend already has a SegmentedControl with its own variants (black, blue_separated, blue_underline); the Figma look here is the 'Text / Icons x Medium / Small' set. Confirm the mapping.",
    ],
  });
})();
