/* Text input · Figma 3449:60714. Config reference: COMPONENT-PAGES.md */
(() => {
  const X_OCTAGON = '<svg class="ycoTextInput_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';

  function markup(s, ctx) {
    const disabled = s.state === "disabled";
    const valid = s.valid === "true" || disabled; // Figma's Disabled variant has no invalid look and no message
    const cls = ["ycoTextInput", valid ? "" : "ycoTextInput_valid_false", disabled ? "ycoTextInput_disabled" : ""].filter(Boolean).join(" ");
    const showText = s.label || s.hint;
    const value = s.content === "value" ? ' value="Value"' : "";
    const placeholder = s.content === "placeholder" ? ' placeholder="Placeholder"' : "";
    return `<div class="${cls}">
  ${showText ? `<div class="ycoTextInput_text">
    ${s.label ? `<div class="ycoTextInput_labelRow">
      <label for="text-input">Label</label>${s.required ? '\n      <span class="ycoTextInput_required" aria-hidden="true">*</span>' : ""}${s.optional ? '\n      <span class="ycoTextInput_optional">(optional)</span>' : ""}
    </div>` : ""}
    ${s.hint ? '<p class="ycoTextInput_hint" id="text-input-hint">Hint text</p>' : ""}
  </div>` : ""}
  <div class="ycoTextInput_field">
    <input class="ycoTextInput_input${ctx.sc}" id="text-input" type="text"${value}${placeholder}${disabled ? " disabled" : ""}${valid ? "" : ' aria-invalid="true"'} />
  </div>
  ${valid ? "" : `<p class="ycoTextInput_error" role="alert">${X_OCTAGON}Error message</p>`}
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const all = [];
  ["default", "hover", "press", "focus", "disabled"].forEach((state) => ["true", "false"].forEach((valid) => {
    all.push({ label: `${YCO.label(state)} / ${valid === "true" ? "Valid" : "Invalid"}`, html: markup({ state, valid, label: true, hint: true, required: true, optional: false, content: "none" }, { sc: YCO.stateClass(state) }) });
  }));

  YCO.page({
    id: "text-input",
    group: "Forms",
    title: "Text input",
    figma: "3449:60714",
    needs: [],
    statesCss: "components/text-input.states.css",
    intro: "A single-line field with an optional label, hint and error message. The label row can mark the field required or optional. Hover, press and focus come from real pointer and keyboard states.",
    controls: [
      YCO.stateControl(),
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "content", label: "Content", type: "chips", options: ["none", "placeholder", "value"], default: "none" },
      { key: "label", label: "Label", type: "toggle", default: true },
      { key: "required", label: "Required mark", type: "toggle", default: true, when: (s) => s.label },
      { key: "optional", label: "Optional mark", type: "toggle", default: false, when: (s) => s.label },
      { key: "hint", label: "Hint text", type: "toggle", default: true },
    ],
    render: markup,
    react: (s) => {
      const p = [];
      if (s.label) p.push('  label="Label"');
      if (s.required && s.label) p.push("  required");
      if (s.optional && s.label) p.push("  optional");
      if (s.hint) p.push('  hint="Hint text"');
      if (s.valid === "false") p.push('  error="Error message"');
      if (s.content === "placeholder") p.push('  placeholder="Placeholder"');
      if (s.content === "value") p.push('  value="Value"');
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no TextInput yet\nimport TextInput from '@/components/common/text-input';\n\n<TextInput\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "A disabled field never shows the invalid look or message, as in Figma (Disabled / Invalid is drawn the same as Disabled / Valid).",
      "Focus uses --stroke-selected and --stroke-brand-weak, which only existed in the dark theme: this pass added their light values to styles.css.",
    ],
  });
})();
