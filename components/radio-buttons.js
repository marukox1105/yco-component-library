/* Radio buttons · Figma 3832:40131 (Radio button 3449:61137, Radio button group 3449:65285). Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = ["unselected", "selected"];
  const SIZES = ["large", "small"];
  const STATE_OPTS = [{ value: "default", label: "Default" }, { value: "hover", label: "Hover" }, { value: "press", label: "Press" }, { value: "focus", label: "Focus" }, { value: "disabled", label: "Disabled" }];
  const X_OCTAGON = '<svg class="ycoRadioButtons_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';
  let uid = 0;

  /** One radio button. o: type, size, valid (bool), state, name, value. */
  function item(o, sc = "") {
    const cls = ["ycoRadioButtons_item", `ycoRadioButtons_size_${o.size}`, o.valid ? "" : "ycoRadioButtons_valid_false"].filter(Boolean).join(" ") + sc;
    const attrs = ['class="ycoRadioButtons_input"', 'type="radio"', `name="${o.name}"`, `value="${o.value || "1"}"`];
    if (o.type === "selected") attrs.push("checked");
    if (o.state === "disabled") attrs.push("disabled");
    if (!o.valid) attrs.push('aria-invalid="true"');
    return `<label class="${cls}">
  <input ${attrs.join(" ")} />
  <span class="ycoRadioButtons_circle" aria-hidden="true"><span class="ycoRadioButtons_dot"></span></span>
  <span class="ycoRadioButtons_label">Label</span>
</label>`;
  }

  /** The group: legend (label, required, optional, hint), error, list of five. */
  function group(s, name = "option") {
    const valid = s.valid === "true";
    const list = [1, 2, 3, 4, 5].map((i) => item({ type: i === 1 ? "selected" : "unselected", size: s.size, valid, state: "default", name, value: String(i) }));
    return `<fieldset class="ycoRadioButtons" role="radiogroup">
  <legend class="ycoRadioButtons_legend">
    <span class="ycoRadioButtons_labelRow">Label${s.required ? '<span class="ycoRadioButtons_required" aria-hidden="true">*</span>' : ""}${s.optional ? '<span class="ycoRadioButtons_optional">(optional)</span>' : ""}</span>${s.hint ? '\n    <span class="ycoRadioButtons_hint">Hint text</span>' : ""}
  </legend>${valid ? "" : `\n  <p class="ycoRadioButtons_error" role="alert">${X_OCTAGON}Error message</p>`}
  <div class="ycoRadioButtons_list">
${list.map((h) => h.replace(/^/gm, "    ")).join("\n")}
  </div>
</fieldset>`;
  }

  function markup(s, ctx) {
    if (s.layout === "group") return group(s);
    return item({ type: s.type, size: s.size, valid: s.valid === "true", state: s.state, name: "option" }, ctx.sc);
  }

  const all = [];
  SIZES.forEach((size) => ["true", "false"].forEach((valid) => {
    all.push({ label: `Radio button group / ${YCO.label(size)} / ${valid === "true" ? "Valid" : "Invalid"}`, wide: true, html: group({ size, valid, required: true, optional: false, hint: true }, `grp${++uid}`) });
  }));
  SIZES.forEach((size) => ["true", "false"].forEach((valid) => TYPES.forEach((type) => STATE_OPTS.forEach((st) => {
    all.push({ label: `${YCO.label(type)} / ${YCO.label(size)} / ${st.label} / ${valid === "true" ? "Valid" : "Invalid"}`, html: item({ type, size, valid: valid === "true", state: st.value, name: `single${++uid}` }, YCO.stateClass(st.value)) });
  }))));

  YCO.page({
    id: "radio-buttons",
    group: "Forms",
    title: "Radio buttons",
    figma: "3832:40131",
    statesCss: "components/radio-buttons.states.css",
    intro: "Pick exactly one option from a short list. A radio button is a real input with a label; arrow keys move the choice inside a group. A radio button group adds a legend with required or optional marks, a hint and an error message.",
    controls: [
      { key: "layout", label: "Layout", type: "chips", options: [{ value: "group", label: "Group" }, { value: "single", label: "Single" }], default: "group" },
      Object.assign(YCO.stateControl(STATE_OPTS), { when: (s) => s.layout === "single" }),
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "selected", when: (s) => s.layout === "single" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "large" },
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "required", label: "Required mark", type: "toggle", default: true, when: (s) => s.layout === "group" },
      { key: "optional", label: "Optional mark", type: "toggle", default: false, when: (s) => s.layout === "group" },
      { key: "hint", label: "Hint text", type: "toggle", default: false, when: (s) => s.layout === "group" },
    ],
    render: markup,
    react: (s) => {
      if (s.layout === "group") {
        return `// Proposed API: yce-frontend has no RadioButtons yet\nimport { RadioGroup, Radio } from '@/components/common/radio-buttons';\n\n<RadioGroup\n  legend="Label"${s.required ? "\n  required" : ""}${s.optional ? "\n  optional" : ""}${s.hint ? '\n  hint="Hint text"' : ""}${s.valid === "false" ? '\n  error="Error message"' : ""}\n  size="${s.size}"\n  value={selected}\n  onChange={setSelected}\n>\n  <Radio value="1" label="Label" />\n  <Radio value="2" label="Label" />\n</RadioGroup>`;
      }
      const p = ['  label="Label"', '  value="1"'];
      if (s.size === "small") p.push('  size="small"');
      p.push(s.type === "selected" ? "  checked" : "  checked={false}");
      if (s.valid === "false") p.push("  invalid");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no RadioButtons yet\nimport { Radio } from '@/components/common/radio-buttons';\n\n<Radio\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "The selected circle uses --fill-brand-strong; Figma names it fill/selected, which only exists in the dark theme. The inner dot is 8px, centred (Figma's exported dot sits slightly off centre).",
      "Figma's Large and Small radio buttons share the same 24px circle; Small only changes the label to 14/20.",
      "The invalid focus ring uses --stroke-error-weak; Figma does not draw an explicit invalid Focus variant colour.",
    ],
  });
})();
