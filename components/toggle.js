/* Toggle · Figma 3834:44518 (component set 3553:142452). Config reference: COMPONENT-PAGES.md */
(() => {
  const SIZES = ["medium", "small"];
  const STATES = ["default", "hover", "press", "focus", "disabled"];

  function markup(s, ctx) {
    const disabled = s.state === "disabled";
    const cls = ["ycoToggle", `ycoToggle_size_${s.size}`].join(" ") + (ctx.sc || "");
    return `<label class="${cls}">
  <input class="ycoToggle_input" type="checkbox" role="switch" name="toggle"${s.selected ? " checked" : ""}${disabled ? " disabled" : ""}${s.label ? "" : ' aria-label="Toggle"'} />
  <span class="ycoToggle_track" aria-hidden="true"><span class="ycoToggle_thumb"></span></span>${s.label ? '\n  <span class="ycoToggle_label">Label</span>' : ""}
</label>`;
  }

  const all = [];
  SIZES.forEach((size) => [false, true].forEach((selected) => STATES.forEach((state) => {
    all.push({ label: `${YCO.label(selected ? "selected" : "unselected")} / ${YCO.label(size)} / ${YCO.label(state)}`, html: markup({ size, selected, state, label: true }, { sc: YCO.stateClass(state) }) });
  })));

  YCO.page({
    id: "toggle",
    group: "Forms",
    title: "Toggle",
    figma: "3834:44518",
    statesCss: "components/toggle.states.css",
    intro: "A switch for an on / off setting that applies at once. It is a real checkbox with role switch: click it, or focus it and press Space. The label is optional.",
    controls: [
      YCO.stateControl(),
      { key: "selected", label: "Selected", type: "toggle", default: false },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "medium" },
      { key: "label", label: "Label", type: "toggle", default: true },
    ],
    render: markup,
    react: (s) => {
      const p = [];
      if (s.size === "small") p.push('  size="small"');
      if (s.label) p.push('  label="Label"');
      p.push("  checked={checked}");
      p.push("  onChange={(e) => setChecked(e.target.checked)}");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no Toggle yet (selection-control/switch-button is an Off / On pair with side labels)\nimport Toggle from '@/components/common/toggle';\n\n<Toggle\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "The selected track uses --fill-brand-strong; Figma names it fill/selected, which only exists in the dark theme.",
      "Figma's thumb and inner track shadows are black at 4% and 8%; the nearest tokens are --grey-neutral-light-50 and -100 (4% and 10%).",
      "The Focus ring is drawn with an outline around the track only, not the label, as in Figma (3px --stroke-focus).",
      "Figma draws the disabled thumb and the Press look from fill/press, which is nearly invisible (4%); kept as drawn.",
    ],
  });
})();
