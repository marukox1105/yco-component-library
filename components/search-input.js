/* Search input · Figma 4865:151632. Config reference: COMPONENT-PAGES.md */
(() => {
  const SEARCH = '<svg class="ycoSearchInput_icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
  const CLEAR = '<button class="ycoSearchInput_clear" type="button" aria-label="Clear search"%DIS%><svg class="ycoSearchInput_clearIcon" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9"/></svg></button>';
  let uid = 0;

  function markup(s, ctx) {
    const id = ctx.id || "search-input";
    const disabled = s.state === "disabled";
    const isButton = s.type === "button";
    const cls = ["ycoSearchInput", `ycoSearchInput_size_${s.size}`, isButton ? "ycoSearchInput_type_button" : "", disabled ? "ycoSearchInput_disabled" : ""].filter(Boolean).join(" ");
    const attrs = `${s.placeholder ? ' placeholder="Search"' : ""}${s.filled ? ' value="Filled"' : ""}${disabled ? " disabled" : ""}`;
    return `<form class="${cls}" role="search" onsubmit="return false">
  <div class="ycoSearchInput_field">
    <div class="ycoSearchInput_state${ctx.sc}">
      ${SEARCH}
      <input class="ycoSearchInput_input" id="${id}" type="search" aria-label="Search"${attrs} />${s.rightIcon ? "\n      " + CLEAR.replace("%DIS%", disabled ? " disabled" : "") : ""}
    </div>
  </div>${isButton ? `
  <button class="ycoSearchInput_button" type="submit"${disabled ? " disabled" : ""}>Search</button>` : ""}
</form>`;
  }

  const cell = (s) => ({
    label: `${YCO.label(s.type)} / ${YCO.label(s.size)} / ${YCO.label(s.state)}${s.filled ? " / Filled" : ""}${s.rightIcon ? " / Right icon" : ""}`,
    html: markup({ placeholder: true, filled: false, rightIcon: false, ...s }, { sc: YCO.stateClass(s.state), id: `search-input-v${++uid}` }),
  });
  const all = [];
  ["default", "button"].forEach((type) => ["medium", "small"].forEach((size) =>
    ["default", "hover", "press", "focus", "disabled"].forEach((state) => all.push(cell({ type, size, state })))));
  // Boolean props: Filled and Right icon
  ["default", "button"].forEach((type) => ["medium", "small"].forEach((size) =>
    all.push(cell({ type, size, state: "default", filled: true, rightIcon: true }))));

  YCO.page({
    id: "search-input",
    group: "Forms",
    title: "Search input",
    figma: "4865:151632",
    needs: [],
    statesCss: "components/search-input.states.css",
    intro: "A pill-shaped search field with a leading magnifier, an optional clear button and, in the Button type, an attached Search button. Hover, press and focus come from real pointer and keyboard states.",
    controls: [
      YCO.stateControl(),
      { key: "type", label: "Type", type: "chips", options: ["default", "button"], default: "default" },
      { key: "size", label: "Size", type: "chips", options: ["medium", "small"], default: "medium" },
      { key: "placeholder", label: "Placeholder", type: "toggle", default: true },
      { key: "filled", label: "Filled", type: "toggle", default: false },
      { key: "rightIcon", label: "Right icon (clear)", type: "toggle", default: false },
    ],
    render: markup,
    mount: (el) => {
      // The clear icon empties the field and returns focus to it.
      const input = el.querySelector(".ycoSearchInput_input");
      const clear = el.querySelector(".ycoSearchInput_clear");
      if (input && clear) clear.addEventListener("click", () => { input.value = ""; input.focus(); });
    },
    react: (s) => {
      const p = [];
      if (s.type === "button") p.push('  type="button"');
      if (s.size === "small") p.push('  size="small"');
      if (s.placeholder) p.push('  placeholder="Search"');
      if (s.filled) p.push('  value="Filled"');
      if (s.rightIcon) p.push("  onClear={() => {}}");
      if (s.state === "disabled") p.push("  disabled");
      p.push("  onSearch={(query) => {}}");
      return `// Proposed API: yce-frontend has no SearchInput yet\nimport SearchInput from '@/components/common/search-input';\n\n<SearchInput\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "The clear icon's disc is --fill-overlay: Figma's --fill-overlay-weak (45% black) exists only in the dark theme of styles.css, so the disc is a little darker than in Figma. The cross is the fixed white palette token --grey-solid-0.",
      "The Search button's two drop shadows (Shadow/Raised) have no token; they are built with color-mix on --fill-overlay.",
      "Heading 5's 26px line height has no token; the button label uses 1.625rem.",
      "Figma draws the Right icon as a prop independent of the value; in the product it should only show while the field has text.",
      "Hover and Press in Figma tint only the field half of the Button type; the Search button itself shows no hover or press change, and none is drawn here.",
      "The focus ring is the 3px --stroke-focus outline over the field border, around the whole control for the Button type.",
    ],
  });
})();
