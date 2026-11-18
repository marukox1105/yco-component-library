/* Autocomplete · Figma 7895:213246. Config reference: COMPONENT-PAGES.md */
(() => {
  const SEARCH = '<svg class="ycoAutocomplete_icon ycoAutocomplete_searchIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
  const CLEAR = '<svg class="ycoAutocomplete_clearIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  const TAG_X = '<svg class="ycoAutocomplete_tagIcon" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4 4 12"/></svg>';
  const ERROR = '<svg class="ycoAutocomplete_errorIcon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="m5.8 5.8 4.4 4.4M10.2 5.8 5.8 10.2"/></svg>';
  const DIAMOND = '<svg class="ycoAutocomplete_optionIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 9-9 9-9-9 9-9Z"/></svg>';
  const CHECK = '<span class="ycoAutocomplete_check" aria-hidden="true"><svg class="ycoAutocomplete_checkIcon" viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7"/></svg></span>';
  const COUNT = 5;
  const ACTIVE = 3; // Figma shows the 4th single-choice item hovered
  const PICKED = [2, 3]; // and the 3rd and 4th multiple-choice items checked
  let uid = 0;

  const tag = (label, disabled) => `<span class="ycoAutocomplete_tag"><span class="ycoAutocomplete_tagLabel">${label}</span><button class="ycoAutocomplete_tagRemove" type="button" aria-label="Remove ${label}"${disabled ? " disabled" : ""}>${TAG_X}</button></span>`;

  function markup(s, ctx) {
    const id = ctx.id || "autocomplete";
    const multiple = s.type === "multiple";
    const disabled = s.state === "disabled";
    const valid = s.valid === "true" || disabled;
    const open = s.open === "true";
    const picked = multiple && (s.filled || open) ? PICKED : [];
    const cls = ["ycoAutocomplete", `ycoAutocomplete_type_${s.type}`, `ycoAutocomplete_size_${s.size}`, valid ? "" : "ycoAutocomplete_valid_false", disabled ? "ycoAutocomplete_disabled" : ""].filter(Boolean).join(" ");
    const describedBy = [s.hint ? `${id}-hint` : "", valid ? "" : `${id}-error`].filter(Boolean).join(" ");
    const tags = multiple && s.filled ? PICKED.map((i) => tag(`Option ${i + 1}`, disabled)).join("") : "";
    const value = !multiple && s.filled ? ' value="Option 2"' : "";
    const placeholder = s.placeholder && !(multiple && s.filled) ? ' placeholder="Placeholder"' : "";
    const input = `<input class="ycoAutocomplete_input" id="${id}" type="text" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="${open}" aria-controls="${id}-list" aria-labelledby="${id}-label"${s.required ? ' aria-required="true"' : ""} autocomplete="off"${placeholder}${value}${disabled ? " disabled" : ""}${valid ? "" : ' aria-invalid="true"'}${describedBy ? ` aria-describedby="${describedBy}"` : ""} />`;
    const items = Array.from({ length: COUNT }, (_, i) => {
      const sel = picked.includes(i) || (!multiple && s.filled && i === 1);
      const active = !multiple && ctx.showActive && i === ACTIVE;
      const icon = !multiple && (s.icon === true || (s.icon === "active" && i === ACTIVE)) ? DIAMOND : "";
      return `    <li class="ycoAutocomplete_option${active ? " ycoAutocomplete_option_active" : ""}" role="option" id="${id}-option-${i + 1}" aria-selected="${sel}">${multiple ? CHECK : icon}<span class="ycoAutocomplete_optionLabel">Option ${i + 1}</span></li>`;
    }).join("\n");
    return `<div class="${cls}">
  <div class="ycoAutocomplete_text">
    <div class="ycoAutocomplete_labelRow">
      <label id="${id}-label" for="${id}">Label</label>${s.required ? '\n      <span class="ycoAutocomplete_required" aria-hidden="true">*</span>' : ""}${s.optional ? '\n      <span class="ycoAutocomplete_optional">(optional)</span>' : ""}
    </div>${s.hint ? `\n    <p class="ycoAutocomplete_hint" id="${id}-hint">Start typing to search</p>` : ""}
  </div>
  <div class="ycoAutocomplete_control">
    <div class="ycoAutocomplete_field">
      <div class="ycoAutocomplete_state${ctx.sc}">
        ${SEARCH}
        ${multiple ? `<div class="ycoAutocomplete_tags">
          ${tags}${input}
        </div>` : input}
        <button class="ycoAutocomplete_clear" type="button" aria-label="Clear"${s.filled ? "" : " hidden"}${disabled ? " disabled" : ""}>${CLEAR}</button>
      </div>
    </div>
  </div>
  ${valid ? "" : `<p class="ycoAutocomplete_error" id="${id}-error" role="alert">${ERROR}Error message</p>`}
  <ul class="ycoAutocomplete_menu" id="${id}-list" role="listbox" aria-labelledby="${id}-label"${multiple ? ' aria-multiselectable="true"' : ""}${open ? "" : " hidden"}>
${items}
  </ul>
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const base = { hint: true, required: true, optional: false, filled: false, placeholder: false, icon: "active" };
  const cell = (s) => {
    const open = s.open === "true";
    const html = markup({ ...base, ...s }, { sc: YCO.stateClass(s.state), id: `autocomplete-v${++uid}`, showActive: open });
    const room = open ? (s.size === "small" ? 36 : 48) + 28 + 4 + 258 + (s.valid === "false" && s.state !== "disabled" ? 32 : 0) : 0;
    return { label: `${YCO.label(s.type)} / ${open ? "Open" : "Closed"} / ${YCO.label(s.state)} / ${s.valid === "true" ? "Valid" : "Invalid"} / ${YCO.label(s.size)}`, html: open ? `<div style="width:100%;min-height:${room + 24}px">${html}</div>` : html };
  };
  const all = [];
  ["single", "multiple"].forEach((type) => ["false", "true"].forEach((open) => ["large", "small"].forEach((size) => ["true", "false"].forEach((valid) =>
    ["default", "hover", "press", "focus", "disabled"].forEach((state) => all.push(cell({ type, open, size, valid, state })))))));
  // Boolean props: Filled and Placeholder
  all.push(cell({ type: "single", open: "false", size: "large", valid: "true", state: "default", placeholder: true }));
  all.push(cell({ type: "single", open: "false", size: "large", valid: "true", state: "default", filled: true }));
  all.push(cell({ type: "multiple", open: "false", size: "large", valid: "true", state: "default", placeholder: true }));
  all.push(cell({ type: "multiple", open: "false", size: "large", valid: "true", state: "default", filled: true }));

  // Live behaviour: typing filters the list, arrows / Enter / Escape / pointer choose, Multiple keeps the list open and adds tags.
  let off = null;
  function mount(el, s) {
    if (off) off();
    const root = el.querySelector(".ycoAutocomplete");
    if (!root || s.state === "disabled") { off = null; return; }
    const multiple = s.type === "multiple";
    const input = root.querySelector(".ycoAutocomplete_input");
    const menu = root.querySelector(".ycoAutocomplete_menu");
    const clear = root.querySelector(".ycoAutocomplete_clear");
    const tags = root.querySelector(".ycoAutocomplete_tags");
    const options = [...menu.querySelectorAll(".ycoAutocomplete_option")];
    const label = (o) => o.querySelector(".ycoAutocomplete_optionLabel").textContent;
    const isOpen = () => !menu.hidden;
    const visible = () => options.filter((o) => !o.hidden);
    let active = -1;
    let typed = false;

    const setActive = (n) => {
      const list = visible();
      options.forEach((o) => o.classList.remove("ycoAutocomplete_option_active"));
      if (!list.length) { active = -1; input.removeAttribute("aria-activedescendant"); return; }
      active = (n + list.length) % list.length;
      list[active].classList.add("ycoAutocomplete_option_active");
      input.setAttribute("aria-activedescendant", list[active].id);
    };
    const filter = () => {
      const q = typed ? input.value.trim().toLowerCase() : "";
      options.forEach((o) => { o.hidden = !!q && !label(o).toLowerCase().includes(q); });
    };
    const setOpen = (v) => {
      menu.hidden = !v;
      input.setAttribute("aria-expanded", String(v));
      if (!v) { options.forEach((o) => o.classList.remove("ycoAutocomplete_option_active")); input.removeAttribute("aria-activedescendant"); active = -1; }
    };
    const open = () => { filter(); if (visible().length) { setOpen(true); if (active < 0) setActive(0); } else setOpen(false); };
    const syncTags = () => {
      tags.querySelectorAll(".ycoAutocomplete_tag").forEach((t) => t.remove());
      options.filter((o) => o.getAttribute("aria-selected") === "true").forEach((o) => {
        tags.insertBefore(Object.assign(document.createElement("span"), { innerHTML: tag(label(o)) }).firstChild, input);
      });
      const has = tags.querySelector(".ycoAutocomplete_tag");
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

    input.addEventListener("focus", open);
    input.addEventListener("click", open);
    input.addEventListener("input", () => { typed = true; clear.hidden = !input.value && !(multiple && tags.querySelector(".ycoAutocomplete_tag")); filter(); active = -1; open(); });
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
    menu.addEventListener("click", (e) => { const o = e.target.closest(".ycoAutocomplete_option"); if (o) choose(o); });
    clear.addEventListener("click", () => {
      input.value = ""; typed = false;
      options.forEach((o) => o.setAttribute("aria-selected", "false"));
      if (multiple) syncTags(); else clear.hidden = true;
      filter(); input.focus();
    });
    if (multiple) tags.addEventListener("click", (e) => {
      const b = e.target.closest(".ycoAutocomplete_tagRemove");
      if (!b) return;
      const name = b.closest(".ycoAutocomplete_tag").querySelector(".ycoAutocomplete_tagLabel").textContent;
      options.filter((o) => label(o) === name).forEach((o) => o.setAttribute("aria-selected", "false"));
      syncTags(); input.focus();
    });
    const outside = (e) => { if (!root.isConnected) return off && off(); if (!root.contains(e.target) && isOpen()) setOpen(false); };
    document.addEventListener("click", outside);
    off = () => { document.removeEventListener("click", outside); off = null; };
  }

  YCO.page({
    id: "autocomplete",
    group: "Forms",
    title: "Autocomplete",
    figma: "7895:213246",
    needs: [],
    statesCss: "components/autocomplete.states.css",
    intro: "A text field that suggests options while you type. Single picks one option and writes it into the field; Multiple keeps the list open, checks options and shows them as removable tags.",
    controls: [
      YCO.stateControl(),
      { key: "type", label: "Type", type: "chips", options: ["single", "multiple"], default: "single" },
      { key: "open", label: "Open", type: "chips", options: [{ value: "false", label: "Closed" }, { value: "true", label: "Open" }], default: "false" },
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "size", label: "Size", type: "chips", options: ["large", "small"], default: "large" },
      { key: "placeholder", label: "Placeholder", type: "toggle", default: true },
      { key: "filled", label: "Filled", type: "toggle", default: false },
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
      if (s.hint) p.push('  hint="Start typing to search"');
      if (s.valid === "false") p.push('  error="Error message"');
      if (s.type === "multiple") p.push("  multiple");
      if (s.size === "small") p.push('  size="small"');
      if (s.placeholder) p.push('  placeholder="Placeholder"');
      p.push("  options={[\n    { value: 'option-1', label: 'Option 1' },\n    { value: 'option-2', label: 'Option 2' },\n  ]}");
      p.push(s.type === "multiple" ? "  value={[]}\n  onChange={(values) => {}}" : "  value=\"option-2\"\n  onChange={(value) => {}}");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no Autocomplete yet\nimport Autocomplete from '@/components/common/autocomplete';\n\n<Autocomplete\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "The open list uses --background-raised: Figma's --background-overlay exists only in the dark theme of styles.css. Its shadow (Shadow/Overlay, 0 8 24 -4) has no token and is built with color-mix on --fill-overlay.",
      "Micro text (12px / 16px) has no token; the hint and the error message use 0.75rem / 1rem.",
      "Figma places the open list 24px (valid) or 32px (invalid) below the component; the page anchors it 4px under the whole component, below the error message.",
      "Figma's Open variants show the 4th single item hovered with an icon and the 3rd and 4th multiple items checked; the variant grid copies that. The live preview behaves normally: typing filters, arrows move, Enter picks.",
      "In Figma the Small size keeps 16px value text in a 36px field with 8px side padding; the Multiple list labels are 14px, the Single ones 16px.",
      "Focus uses the inset 3px --stroke-brand-weak ring (red-tinted when invalid), as in the Text input; the error icon is a 16px circle-x drawn here.",
      "Disabled / Invalid hides the error message, as in the other Forms. Multiple with tags grows taller than 48px when it wraps.",
    ],
  });
})();
