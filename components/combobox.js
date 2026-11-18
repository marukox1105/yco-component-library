/* Combobox · Figma 6736:182931. Config reference: COMPONENT-PAGES.md */
(() => {
  const DOWN = '<svg class="ycoCombobox_chevron ycoCombobox_chevronDown" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const UP = '<svg class="ycoCombobox_chevron ycoCombobox_chevronUp" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';
  const CLEAR = '<svg class="ycoCombobox_clearIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  const TAG_X = '<svg class="ycoCombobox_tagIcon" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4 4 12"/></svg>';
  const ERROR = '<svg class="ycoCombobox_errorIcon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="m5.8 5.8 4.4 4.4M10.2 5.8 5.8 10.2"/></svg>';
  const DIAMOND = '<svg class="ycoCombobox_optionIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 9-9 9-9-9 9-9Z"/></svg>';
  const CHECK = '<span class="ycoCombobox_check" aria-hidden="true"><svg class="ycoCombobox_checkIcon" viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7"/></svg></span>';
  const COUNT = 5;
  const ACTIVE = 3; // Figma shows the 4th single-choice item hovered
  const PICKED = [2, 3]; // and the 3rd and 4th multiple-choice items checked
  let uid = 0;

  const tag = (label, disabled) => `<span class="ycoCombobox_tag"><span class="ycoCombobox_tagLabel">${label}</span><button class="ycoCombobox_tagRemove" type="button" aria-label="Remove ${label}"${disabled ? " disabled" : ""}>${TAG_X}</button></span>`;

  function markup(s, ctx) {
    const id = ctx.id || "combobox";
    const multiple = s.type === "multiple";
    const disabled = s.state === "disabled";
    const valid = s.valid === "true" || disabled;
    const open = s.open === "true";
    const picked = multiple && (s.filled || open) ? PICKED : [];
    const cls = ["ycoCombobox", `ycoCombobox_type_${s.type}`, `ycoCombobox_size_${s.size}`, valid ? "" : "ycoCombobox_valid_false", disabled ? "ycoCombobox_disabled" : ""].filter(Boolean).join(" ");
    const describedBy = [s.hint ? `${id}-hint` : "", valid ? "" : `${id}-error`].filter(Boolean).join(" ");
    const tags = multiple && s.filled ? PICKED.map((i) => tag(`Option ${i + 1}`, disabled)).join("") : "";
    const value = !multiple && s.filled ? ' value="Option 2"' : "";
    const placeholder = s.placeholder && !(multiple && s.filled) ? ' placeholder="Placeholder"' : "";
    const input = `<input class="ycoCombobox_input" id="${id}" type="text" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="${open}" aria-controls="${id}-list" aria-labelledby="${id}-label"${s.required ? ' aria-required="true"' : ""} autocomplete="off"${placeholder}${value}${disabled ? " disabled" : ""}${valid ? "" : ' aria-invalid="true"'}${describedBy ? ` aria-describedby="${describedBy}"` : ""} />`;
    const items = Array.from({ length: COUNT }, (_, i) => {
      const sel = picked.includes(i) || (!multiple && s.filled && i === 1);
      const active = !multiple && ctx.showActive && i === ACTIVE;
      const icon = !multiple && (s.icon === true || (s.icon === "active" && i === ACTIVE)) ? DIAMOND : "";
      return `    <li class="ycoCombobox_option${active ? " ycoCombobox_option_active" : ""}" role="option" id="${id}-option-${i + 1}" aria-selected="${sel}">${multiple ? CHECK : icon}<span class="ycoCombobox_optionLabel">Option ${i + 1}</span></li>`;
    }).join("\n");
    return `<div class="${cls}">
  <div class="ycoCombobox_text">
    <div class="ycoCombobox_labelRow">
      <label id="${id}-label" for="${id}">Label</label>${s.required ? '\n      <span class="ycoCombobox_required" aria-hidden="true">*</span>' : ""}${s.optional ? '\n      <span class="ycoCombobox_optional">(optional)</span>' : ""}
    </div>${s.hint ? `\n    <p class="ycoCombobox_hint" id="${id}-hint">Start typing to filter results</p>` : ""}
  </div>
  <div class="ycoCombobox_control">
    <div class="ycoCombobox_field">
      <div class="ycoCombobox_state${ctx.sc}">
        ${multiple ? `<div class="ycoCombobox_tags">
          ${tags}${input}
        </div>` : input}
        <button class="ycoCombobox_clear" type="button" aria-label="Clear"${disabled ? " disabled" : ""}>${CLEAR}</button>
        <span class="ycoCombobox_divider" aria-hidden="true"></span>
        <button class="ycoCombobox_toggle" type="button" tabindex="-1" aria-label="Show options" aria-expanded="${open}" aria-controls="${id}-list"${disabled ? " disabled" : ""}>${DOWN}${UP}</button>
      </div>
    </div>
  </div>
  ${valid ? "" : `<p class="ycoCombobox_error" id="${id}-error" role="alert">${ERROR}Error message</p>`}
  <ul class="ycoCombobox_menu" id="${id}-list" role="listbox" aria-labelledby="${id}-label"${multiple ? ' aria-multiselectable="true"' : ""}${open ? "" : " hidden"}>
${items}
  </ul>
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const base = { hint: true, required: true, optional: false, filled: true, placeholder: false, icon: "active" };
  const cell = (s) => {
    const open = s.open === "true";
    const html = markup({ ...base, ...s }, { sc: YCO.stateClass(s.state), id: `combobox-v${++uid}`, showActive: open });
    const room = open ? (s.size === "small" ? 36 : 48) + 28 + 4 + 258 + (s.valid === "false" && s.state !== "disabled" ? 32 : 0) : 0;
    return { label: `${YCO.label(s.type)} / ${open ? "Open" : "Closed"} / ${YCO.label(s.state)} / ${s.valid === "true" ? "Valid" : "Invalid"} / ${YCO.label(s.size)}`, html: open ? `<div style="width:100%;min-height:${room + 24}px">${html}</div>` : html };
  };
  const all = [];
  ["single", "multiple"].forEach((type) => ["false", "true"].forEach((open) => ["large", "small"].forEach((size) => ["true", "false"].forEach((valid) =>
    ["default", "hover", "press", "focus", "disabled"].forEach((state) => all.push(cell({ type, open, size, valid, state })))))));
  // Boolean props: Placeholder (Filled is on in every Figma variant above)
  all.push(cell({ type: "single", open: "false", size: "large", valid: "true", state: "default", placeholder: true, filled: false }));
  all.push(cell({ type: "multiple", open: "false", size: "large", valid: "true", state: "default", placeholder: true, filled: false }));

  // Live behaviour: typing filters the list, arrows / Enter / Escape / pointer choose, Multiple keeps the list open and adds tags.
  let off = null;
  function mount(el, s) {
    if (off) off();
    const root = el.querySelector(".ycoCombobox");
    if (!root || s.state === "disabled") { off = null; return; }
    const multiple = s.type === "multiple";
    const input = root.querySelector(".ycoCombobox_input");
    const menu = root.querySelector(".ycoCombobox_menu");
    const clear = root.querySelector(".ycoCombobox_clear");
    const tags = root.querySelector(".ycoCombobox_tags");
    const options = [...menu.querySelectorAll(".ycoCombobox_option")];
    const label = (o) => o.querySelector(".ycoCombobox_optionLabel").textContent;
    const isOpen = () => !menu.hidden;
    const visible = () => options.filter((o) => !o.hidden);
    let active = -1;
    let typed = false;

    const setActive = (n) => {
      const list = visible();
      options.forEach((o) => o.classList.remove("ycoCombobox_option_active"));
      if (!list.length) { active = -1; input.removeAttribute("aria-activedescendant"); return; }
      active = (n + list.length) % list.length;
      list[active].classList.add("ycoCombobox_option_active");
      input.setAttribute("aria-activedescendant", list[active].id);
    };
    const filter = () => {
      const q = typed ? input.value.trim().toLowerCase() : "";
      options.forEach((o) => { o.hidden = !!q && !label(o).toLowerCase().includes(q); });
    };
    const toggle = root.querySelector(".ycoCombobox_toggle");
    const setOpen = (v) => {
      menu.hidden = !v;
      toggle.setAttribute("aria-expanded", String(v));
      input.setAttribute("aria-expanded", String(v));
      if (!v) { options.forEach((o) => o.classList.remove("ycoCombobox_option_active")); input.removeAttribute("aria-activedescendant"); active = -1; }
    };
    const open = () => { filter(); if (visible().length) { setOpen(true); if (active < 0) setActive(0); } else setOpen(false); };
    const syncTags = () => {
      tags.querySelectorAll(".ycoCombobox_tag").forEach((t) => t.remove());
      options.filter((o) => o.getAttribute("aria-selected") === "true").forEach((o) => {
        tags.insertBefore(Object.assign(document.createElement("span"), { innerHTML: tag(label(o)) }).firstChild, input);
      });
      const has = tags.querySelector(".ycoCombobox_tag");
      clear.hidden = !has && !input.value;
      if (has) input.removeAttribute("placeholder"); else if (s.placeholder) input.setAttribute("placeholder", "Placeholder");
    };
    const choose = (o) => {
      if (multiple) {
        o.setAttribute("aria-selected", String(o.getAttribute("aria-selected") !== "true"));
        input.value = ""; typed = false;
        syncTags(); filter(); input.focus();
      } else {
        options.forEach((x) => x.setAttribute("aria-selected", String(x === o)));
        input.value = label(o); typed = false;
        clear.hidden = false;
        setOpen(false);
      }
    };

    clear.hidden = !input.value && !(multiple && tags.querySelector(".ycoCombobox_tag"));
    input.addEventListener("focus", open);
    input.addEventListener("click", open);
    toggle.addEventListener("click", () => { if (isOpen()) setOpen(false); else { typed = false; input.focus(); open(); } });
    input.addEventListener("input", () => { typed = true; clear.hidden = !input.value && !(multiple && tags.querySelector(".ycoCombobox_tag")); filter(); active = -1; open(); });
    input.addEventListener("keydown", (e) => {
      const list = visible();
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!isOpen()) open(); else setActive(active + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Enter" && isOpen() && active >= 0) { e.preventDefault(); choose(list[active]); }
      else if (e.key === "Escape" && isOpen()) { e.preventDefault(); setOpen(false); }
      else if (e.key === "Tab") setOpen(false);
      else if (e.key === "Backspace" && multiple && !input.value) {
        const picked = options.filter((o) => o.getAttribute("aria-selected") === "true");
        if (picked.length) { picked[picked.length - 1].setAttribute("aria-selected", "false"); syncTags(); }
      }
    });
    menu.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus in the input
    menu.addEventListener("click", (e) => { const o = e.target.closest(".ycoCombobox_option"); if (o) choose(o); });
    clear.addEventListener("click", () => {
      input.value = ""; typed = false;
      options.forEach((o) => o.setAttribute("aria-selected", "false"));
      if (multiple) syncTags(); else clear.hidden = true;
      filter(); input.focus();
    });
    if (multiple) tags.addEventListener("click", (e) => {
      const b = e.target.closest(".ycoCombobox_tagRemove");
      if (!b) return;
      const name = b.closest(".ycoCombobox_tag").querySelector(".ycoCombobox_tagLabel").textContent;
      options.filter((o) => label(o) === name).forEach((o) => o.setAttribute("aria-selected", "false"));
      syncTags(); input.focus();
    });
    const outside = (e) => { if (!root.isConnected) return off && off(); if (!root.contains(e.target) && isOpen()) setOpen(false); };
    document.addEventListener("click", outside);
    off = () => { document.removeEventListener("click", outside); off = null; };
  }

  YCO.page({
    id: "combobox",
    group: "Forms",
    title: "Combobox",
    figma: "7895:213246",
    needs: [],
    statesCss: "components/combobox.states.css",
    intro: "A field with a chevron that opens a list of options and filters it as you type. Single picks one option and writes it into the field; Multiple keeps the list open, checks options and shows them as removable tags. An open list looks focused.",
    controls: [
      YCO.stateControl(),
      { key: "type", label: "Type", type: "chips", options: ["single", "multiple"], default: "single" },
      { key: "open", label: "Open", type: "chips", options: [{ value: "false", label: "Closed" }, { value: "true", label: "Open" }], default: "false" },
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "size", label: "Size", type: "chips", options: ["large", "small"], default: "large" },
      { key: "placeholder", label: "Placeholder", type: "toggle", default: false },
      { key: "filled", label: "Filled", type: "toggle", default: true },
      { key: "hint", label: "Hint text", type: "toggle", default: true },
      { key: "required", label: "Required mark", type: "toggle", default: true },
      { key: "optional", label: "Optional mark", type: "toggle", default: false },
      { key: "icon", label: "Item icons (single)", type: "toggle", default: false, when: (s) => s.type === "single" },
    ],
    surface: (s) => ({ start: true, minHeight: s.open === "true" ? 440 : 0 }),
    render: (s, ctx) => markup(s, { ...ctx, showActive: ctx.preview && s.open === "true" }),
    mount,
    react: (s) => {
      const p = ['  label="Label"'];
      if (s.required) p.push("  required");
      if (s.optional) p.push("  optional");
      if (s.hint) p.push('  hint="Start typing to filter results"');
      if (s.valid === "false") p.push('  error="Error message"');
      if (s.type === "multiple") p.push("  multiple");
      if (s.size === "small") p.push('  size="small"');
      if (s.placeholder) p.push('  placeholder="Placeholder"');
      p.push("  options={[\n    { value: 'option-1', label: 'Option 1' },\n    { value: 'option-2', label: 'Option 2' },\n  ]}");
      p.push(s.type === "multiple" ? "  value={[]}\n  onChange={(values) => {}}" : "  value=\"option-2\"\n  onChange={(value) => {}}");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no Combobox yet\nimport Combobox from '@/components/common/combobox';\n\n<Combobox\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "The open list uses --background-raised: Figma's --background-overlay exists only in the dark theme of styles.css. Its shadow (Shadow/Overlay, 0 8 24 -4) has no token and is built with color-mix on --fill-overlay.",
      "Micro text (12px / 16px) has no token; the hint and the error message use 0.75rem / 1rem.",
      "Figma draws the clear (X) icon in every variant, with or without a value; the variant grid copies that, the live preview hides it while the field is empty.",
      "Figma opens the list 8px under the component; an Open Default field already carries the selected border and the 3px inner ring.",
      "Figma's Open variants show the 4th single item hovered with an icon and the 3rd and 4th multiple items checked; the variant grid copies that. The live preview behaves normally: typing filters, arrows move, Enter picks, the chevron toggles.",
      "Small keeps 16px value text in a 36px field with 12px side padding, a 16px clear icon and 24px-high tags with 14px text; Multiple list labels are 14px, Single ones 16px. Large tag sizes are not drawn in Figma separately; the Large 32px tag is assumed.",
      "Disabled / Invalid hides the error message, as in the other Forms. Multiple with tags grows taller than 48px when it wraps.",
    ],
  });
})();
