/* Checkboxes · Figma 3832:41623 (Checkbox 3449:65713, Checkbox group 3449:65755). Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = ["unselected", "selected", "indeterminate"];
  const SIZES = ["large", "small"];
  const STATE_OPTS = [{ value: "default", label: "Default" }, { value: "hover", label: "Hover" }, { value: "press", label: "Pressed" }, { value: "focus", label: "Focused" }, { value: "disabled", label: "Disabled" }];
  const X_OCTAGON = '<svg class="ycoCheckboxes_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';
  const QUESTION = '<svg class="ycoCheckboxes_labelIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8M12 17h.01"/></svg>';
  const MARK = '<svg class="ycoCheckboxes_mark" viewBox="0 0 24 24" aria-hidden="true"><path class="ycoCheckboxes_check" d="m5 12.5 4.5 4.5L19 7.5"/><path class="ycoCheckboxes_dash" d="M6 12h12"/></svg>';

  /** One checkbox. o: type, size, valid (bool), state, label, icon, text, name. */
  function item(o, sc = "") {
    const cls = ["ycoCheckboxes_item", `ycoCheckboxes_size_${o.size}`, o.valid ? "" : "ycoCheckboxes_valid_false"].filter(Boolean).join(" ") + sc;
    const attrs = [`class="ycoCheckboxes_input"`, `type="checkbox"`, `name="${o.name || "option"}"`];
    if (o.type === "selected") attrs.push("checked");
    if (o.type === "indeterminate") attrs.push('aria-checked="mixed"');
    if (o.state === "disabled") attrs.push("disabled");
    if (!o.valid) attrs.push('aria-invalid="true"');
    if (!o.label) attrs.push('aria-label="Option"');
    return `<label class="${cls}">
  <input ${attrs.join(" ")} />
  <span class="ycoCheckboxes_box" aria-hidden="true">${MARK}</span>${o.label ? `\n  <span class="ycoCheckboxes_label">${o.text || "Label"}${o.icon && o.size === "small" ? QUESTION : ""}</span>` : ""}
</label>`;
  }

  /** The group: legend (label, required, optional, hint), error, list of five. */
  function group(s) {
    const valid = s.valid === "true";
    const list = [0, 1, 2, 3, 4].map((i) => item({ type: i === 0 ? "selected" : "unselected", size: s.size, valid, state: "default", label: true, icon: s.icon, name: "option" }));
    return `<fieldset class="ycoCheckboxes">
  <legend class="ycoCheckboxes_legend">
    <span class="ycoCheckboxes_labelRow">Label${s.required ? '<span class="ycoCheckboxes_required" aria-hidden="true">*</span>' : ""}${s.optional ? '<span class="ycoCheckboxes_optional">(optional)</span>' : ""}</span>${s.hint ? '\n    <span class="ycoCheckboxes_hint">Hint text</span>' : ""}
  </legend>${valid ? "" : `\n  <p class="ycoCheckboxes_error" role="alert">${X_OCTAGON}Error message</p>`}
  <div class="ycoCheckboxes_list">
${list.map((h) => h.replace(/^/gm, "    ")).join("\n")}
  </div>
</fieldset>`;
  }

  function markup(s, ctx) {
    if (s.layout === "group") return group(s);
    return item({ type: s.type, size: s.size, valid: s.valid === "true", state: s.state, label: s.label, icon: s.icon }, ctx.sc);
  }

  const all = [];
  SIZES.forEach((size) => ["true", "false"].forEach((valid) => {
    all.push({ label: `Checkbox group / ${YCO.label(size)} / ${valid === "true" ? "Valid" : "Invalid"}`, wide: true, html: group({ size, valid, required: true, optional: false, hint: true, icon: false }) });
  }));
  SIZES.forEach((size) => ["true", "false"].forEach((valid) => TYPES.forEach((type) => STATE_OPTS.forEach((st) => {
    all.push({ label: `${YCO.label(type)} / ${YCO.label(size)} / ${st.label} / ${valid === "true" ? "Valid" : "Invalid"}`, html: item({ type, size, valid: valid === "true", state: st.value, label: true }, YCO.stateClass(st.value)) });
  }))));

  YCO.page({
    id: "checkboxes",
    group: "Forms",
    title: "Checkboxes",
    figma: "3832:41623",
    statesCss: "components/checkboxes.states.css",
    intro: "Pick any number of options. A checkbox is a real input with a label; it can be selected, unselected or indeterminate. A checkbox group adds a legend with required or optional marks, a hint and an error message.",
    controls: [
      { key: "layout", label: "Layout", type: "chips", options: [{ value: "group", label: "Group" }, { value: "single", label: "Single" }], default: "group" },
      YCO.stateControl(STATE_OPTS),
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "selected" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "large" },
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "label", label: "Label", type: "toggle", default: true },
      { key: "icon", label: "Label icon (Small)", type: "toggle", default: false },
      { key: "required", label: "Required mark", type: "toggle", default: true },
      { key: "optional", label: "Optional mark", type: "toggle", default: false },
      { key: "hint", label: "Hint text", type: "toggle", default: false },
    ].map((c) => {
      if (c.key === "state" || c.key === "type" || c.key === "label") c.when = (s) => s.layout === "single";
      if (c.key === "required" || c.key === "optional" || c.key === "hint") c.when = (s) => s.layout === "group";
      return c;
    }),
    render: markup,
    mount: (el) => {
      // Indeterminate is a property, not an attribute: set it, and drop the mixed look once the user changes the box.
      el.querySelectorAll('input[aria-checked="mixed"]').forEach((i) => {
        i.indeterminate = true;
        i.addEventListener("change", () => i.removeAttribute("aria-checked"), { once: true });
      });
    },
    react: (s) => {
      if (s.layout === "group") {
        return `// Proposed API: yce-frontend has no Checkboxes yet\nimport { CheckboxGroup, Checkbox } from '@/components/common/checkboxes';\n\n<CheckboxGroup\n  legend="Label"${s.required ? "\n  required" : ""}${s.optional ? "\n  optional" : ""}${s.hint ? '\n  hint="Hint text"' : ""}${s.valid === "false" ? '\n  error="Error message"' : ""}\n  size="${s.size}"\n  value={selected}\n  onChange={setSelected}\n>\n  <Checkbox value="1" label="Label" />\n  <Checkbox value="2" label="Label" />\n</CheckboxGroup>`;
      }
      const p = [];
      if (s.label) p.push('  label="Label"');
      if (s.size === "small") p.push('  size="small"');
      if (s.type === "indeterminate") p.push("  indeterminate");
      else p.push("  checked={checked}");
      if (s.valid === "false") p.push("  invalid");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no Checkboxes yet\nimport { Checkbox } from '@/components/common/checkboxes';\n\n<Checkbox\n${p.join("\n")}\n  onChange={(e) => setChecked(e.target.checked)}\n/>`;
    },
    variants: all,
    notes: [
      "Figma has no token for the label icon colour or the Indeterminate hover look; both reuse the checked styling. The question icon is drawn at 12px as in Figma (Small only).",
      "The selected box uses --fill-brand-strong; Figma names it fill/selected, which only exists in the dark theme.",
      "Figma's Focus ring is 3px --stroke-focus (a 7px radius); the invalid focus ring uses --stroke-error-weak, which Figma does not draw explicitly.",
      "Indeterminate is aria-checked=\"mixed\" in the markup; RD sets input.indeterminate in script as well.",
    ],
  });
})();
