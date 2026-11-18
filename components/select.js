/* Select · Figma 3449:61082. Config reference: COMPONENT-PAGES.md */
(() => {
  const X_OCTAGON = '<svg class="ycoSelect_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';
  const DOWN = '<svg class="ycoSelect_chevron ycoSelect_chevronDown" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const UP = '<svg class="ycoSelect_chevron ycoSelect_chevronUp" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';
  const DIAMOND = '<svg class="ycoSelect_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 9-9 9-9-9 9-9Z"/></svg>';
  const OPTIONS = 5;
  const ACTIVE = 3; // Figma shows the 4th item hovered
  let uid = 0;

  function markup(s, ctx) {
    const id = ctx.id || "select";
    const disabled = s.state === "disabled";
    const valid = s.valid === "true" || disabled; // Figma's Disabled / Invalid has no message
    const open = s.open === "true";
    const cls = ["ycoSelect", `ycoSelect_size_${s.size}`, valid ? "" : "ycoSelect_valid_false", disabled ? "ycoSelect_disabled" : ""].filter(Boolean).join(" ");
    const showText = s.label || s.hint;
    const describedBy = [s.hint ? `${id}-hint` : "", valid ? "" : `${id}-error`].filter(Boolean).join(" ");
    const value = s.content === "value" ? '<span class="ycoSelect_value">Option 2</span>'
      : s.content === "placeholder" ? '<span class="ycoSelect_value ycoSelect_value_placeholder">Select</span>' : "";
    const items = Array.from({ length: OPTIONS }, (_, i) => {
      const icon = s.icon === true || s.icon === "true" || (s.icon === "active" && i === ACTIVE) ? DIAMOND : "";
      const active = ctx.showActive && i === ACTIVE;
      return `    <li class="ycoSelect_option${active ? " ycoSelect_option_active" : ""}" role="option" id="${id}-option-${i + 1}"${s.content === "value" && i === 1 ? ' aria-selected="true"' : ' aria-selected="false"'}>${icon}<span class="ycoSelect_optionLabel">Option ${i + 1}</span></li>`;
    }).join("\n");
    return `<div class="${cls}">
  ${showText ? `<div class="ycoSelect_text">
    ${s.label ? `<div class="ycoSelect_labelRow">
      <label id="${id}-label" for="${id}">Label</label>${s.required ? '\n      <span class="ycoSelect_required" aria-hidden="true">*</span>' : ""}${s.optional ? '\n      <span class="ycoSelect_optional">(optional)</span>' : ""}
    </div>` : ""}
    ${s.hint ? `<p class="ycoSelect_hint" id="${id}-hint">Hint text</p>` : ""}
  </div>` : ""}
  <div class="ycoSelect_control">
    <div class="ycoSelect_field">
      <button class="ycoSelect_button${ctx.sc}" id="${id}" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="${open}" aria-controls="${id}-list"${s.label ? ` aria-labelledby="${id}-label ${id}"` : ""}${s.required ? ' aria-required="true"' : ""}${disabled ? " disabled" : ""}${valid ? "" : ' aria-invalid="true"'}${describedBy ? ` aria-describedby="${describedBy}"` : ""}>
        ${value}${DOWN}${UP}
      </button>
    </div>
  </div>
  ${valid ? "" : `<p class="ycoSelect_error" id="${id}-error" role="alert">${X_OCTAGON}Error message</p>`}
  <ul class="ycoSelect_menu" id="${id}-list" role="listbox"${s.label ? ` aria-labelledby="${id}-label"` : ""}${open ? "" : " hidden"}>
${items}
  </ul>
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const base = { label: true, hint: true, required: true, optional: false, content: "none", icon: "active" };
  const cell = (s) => {
    const open = s.open === "true";
    const html = markup({ ...base, ...s }, { sc: YCO.stateClass(s.state), id: `select-v${++uid}`, showActive: open });
    // The open list floats over the page; give the cell room for it.
    const room = open ? (s.size === "small" ? 60 : 66) + 4 + 258 + (s.valid === "false" && s.state !== "disabled" ? 36 : 0) : 0;
    return { label: `${s.open === "true" ? "Open" : "Closed"} / ${YCO.label(s.state)} / ${s.valid === "true" ? "Valid" : "Invalid"} / ${YCO.label(s.size)}`, html: open ? `<div style="width:100%;min-height:${room + 36}px">${html}</div>` : html };
  };
  const all = [];
  ["false", "true"].forEach((open) => ["medium", "small"].forEach((size) => ["true", "false"].forEach((valid) =>
    ["default", "hover", "press", "focus", "disabled"].forEach((state) => all.push(cell({ open, size, valid, state }))))));
  all.push(cell({ open: "false", size: "medium", valid: "true", state: "default", content: "placeholder" }));
  all.push(cell({ open: "false", size: "medium", valid: "true", state: "default", content: "value" }));

  // Live behaviour: open / close, choose with pointer or keyboard, close on outside click and Escape.
  let off = null;
  function mount(el, s) {
    if (off) off();
    const root = el.querySelector(".ycoSelect");
    if (!root || s.state === "disabled") { off = null; return; }
    const button = root.querySelector(".ycoSelect_button");
    const menu = root.querySelector(".ycoSelect_menu");
    const options = [...menu.querySelectorAll(".ycoSelect_option")];
    let active = Math.max(0, options.findIndex((o) => o.getAttribute("aria-selected") === "true"));
    const setActive = (i) => {
      active = (i + options.length) % options.length;
      options.forEach((o, n) => o.classList.toggle("ycoSelect_option_active", n === active));
      button.setAttribute("aria-activedescendant", options[active].id);
    };
    const setOpen = (v) => {
      button.setAttribute("aria-expanded", String(v));
      menu.hidden = !v;
      if (v) setActive(active); else { options.forEach((o) => o.classList.remove("ycoSelect_option_active")); button.removeAttribute("aria-activedescendant"); }
    };
    const choose = (i) => {
      options.forEach((o, n) => o.setAttribute("aria-selected", String(n === i)));
      let value = button.querySelector(".ycoSelect_value");
      if (!value) { value = document.createElement("span"); button.prepend(value); }
      value.className = "ycoSelect_value";
      value.textContent = options[i].querySelector(".ycoSelect_optionLabel").textContent;
      setOpen(false);
      button.focus();
    };
    const isOpen = () => button.getAttribute("aria-expanded") === "true";
    button.addEventListener("click", () => setOpen(!isOpen()));
    button.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!isOpen()) setOpen(true); else setActive(active + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Home" && isOpen()) { e.preventDefault(); setActive(0); }
      else if (e.key === "End" && isOpen()) { e.preventDefault(); setActive(options.length - 1); }
      else if ((e.key === "Enter" || e.key === " ") && isOpen()) { e.preventDefault(); choose(active); }
      else if (e.key === "Escape" && isOpen()) { e.preventDefault(); setOpen(false); }
      else if (e.key === "Tab" && isOpen()) setOpen(false);
    });
    menu.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus on the button
    menu.addEventListener("click", (e) => { const o = e.target.closest(".ycoSelect_option"); if (o) choose(options.indexOf(o)); });
    const outside = (e) => { if (!root.isConnected) return off && off(); if (!root.contains(e.target) && isOpen()) setOpen(false); };
    document.addEventListener("click", outside);
    off = () => { document.removeEventListener("click", outside); off = null; };
  }

  YCO.page({
    id: "select",
    group: "Forms",
    title: "Select",
    figma: "3449:61082",
    needs: [],
    statesCss: "components/select.states.css",
    intro: "A single-choice field that opens a list of options under it. Click or press Enter, Space or the arrow keys to open it, pick with the pointer or the arrow keys, close with Escape or by clicking outside.",
    controls: [
      YCO.stateControl(),
      { key: "open", label: "Open", type: "chips", options: [{ value: "false", label: "Closed" }, { value: "true", label: "Open" }], default: "false" },
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "size", label: "Size", type: "chips", options: ["medium", "small"], default: "medium" },
      { key: "content", label: "Content", type: "chips", options: ["none", "placeholder", "value"], default: "placeholder" },
      { key: "icon", label: "Item icons", type: "toggle", default: false },
      { key: "label", label: "Label", type: "toggle", default: true },
      { key: "required", label: "Required mark", type: "toggle", default: true, when: (s) => s.label },
      { key: "optional", label: "Optional mark", type: "toggle", default: false, when: (s) => s.label },
      { key: "hint", label: "Hint text", type: "toggle", default: true },
    ],
    surface: (s) => ({ start: true, minHeight: s.open === "true" ? 420 : 0 }),
    render: (s, ctx) => markup(s, { ...ctx, showActive: ctx.preview && s.open === "true" }),
    mount,
    react: (s) => {
      const p = [];
      if (s.label) p.push('  label="Label"');
      if (s.required && s.label) p.push("  required");
      if (s.optional && s.label) p.push("  optional");
      if (s.hint) p.push('  hint="Hint text"');
      if (s.valid === "false") p.push('  error="Error message"');
      if (s.size === "small") p.push('  size="small"');
      if (s.content === "placeholder") p.push('  placeholder="Select"');
      if (s.content === "value") p.push('  value="option-2"');
      p.push("  options={[\n    { value: 'option-1', label: 'Option 1' },\n    { value: 'option-2', label: 'Option 2' },\n  ]}");
      p.push("  onChange={(value) => {}}");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no Select yet (src/components/common/dropdown-select is the closest existing piece)\nimport Select from '@/components/common/select';\n\n<Select\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "The open list uses --background-raised: Figma's --background-overlay exists only in the dark theme of styles.css.",
      "The list shadow (Figma Shadow/Overlay: 0 8 24 -4, 16% black) has no token: it is built with color-mix on --fill-overlay; the existing --shadow is much larger.",
      "In the Open variants Figma shows the 4th item hovered and carrying an icon; the variant grid copies that, the live preview highlights the keyboard / pointer item and the icon is a control.",
      "Disabled / Invalid is drawn like Disabled / Valid, without a message. Open + Disabled is a Figma variant; the list is shown but the button cannot toggle it.",
      "The list opens 4px under the whole component (below the error message); Figma's anchor is ambiguous (its constraint is the bottom of the component), so the designer should confirm the gap.",
      "The list is not scrollable in Figma (always five items); RD needs a max-height and scrolling for longer lists.",
    ],
  });
})();
