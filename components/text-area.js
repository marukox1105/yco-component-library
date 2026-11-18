/* Text area · Figma 3449:60808. Config reference: COMPONENT-PAGES.md */
(() => {
  const X_OCTAGON = '<svg class="ycoTextArea_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';
  const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus blandit euismod. Pellentesque et blandit nunc, ultricies aliquam lectus.";
  let uid = 0;

  function markup(s, ctx) {
    const id = ctx.id || "text-area";
    const disabled = s.state === "disabled";
    const valid = s.valid === "true" || disabled; // Figma's Disabled / Invalid is drawn like Disabled / Valid, without a message
    const cls = ["ycoTextArea", valid ? "" : "ycoTextArea_valid_false", disabled ? "ycoTextArea_disabled" : ""].filter(Boolean).join(" ");
    const showText = s.label || s.hint;
    const placeholder = s.content === "placeholder" ? ' placeholder="Placeholder"' : "";
    const describedBy = [s.hint ? `${id}-hint` : "", valid ? "" : `${id}-error`].filter(Boolean).join(" ");
    return `<div class="${cls}">
  ${showText ? `<div class="ycoTextArea_text">
    ${s.label ? `<div class="ycoTextArea_labelRow">
      <label for="${id}">Label</label>${s.required ? '\n      <span class="ycoTextArea_required" aria-hidden="true">*</span>' : ""}${s.optional ? '\n      <span class="ycoTextArea_optional">(optional)</span>' : ""}
    </div>` : ""}
    ${s.hint ? `<p class="ycoTextArea_hint" id="${id}-hint">Hint text</p>` : ""}
  </div>` : ""}
  ${valid ? "" : `<p class="ycoTextArea_error" id="${id}-error" role="alert">${X_OCTAGON}Error message</p>`}
  <div class="ycoTextArea_field">
    <textarea class="ycoTextArea_input${ctx.sc}" id="${id}"${placeholder}${s.required ? " required" : ""}${disabled ? " disabled" : ""}${valid ? "" : ' aria-invalid="true"'}${describedBy ? ` aria-describedby="${describedBy}"` : ""}>${s.content === "filled" ? LOREM : ""}</textarea>
  </div>
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const base = { label: true, hint: true, required: true, optional: false, content: "none" };
  const cell = (label, s, state) => ({ label, html: markup({ ...base, ...s, state }, { sc: YCO.stateClass(state), id: `text-area-v${++uid}` }) });
  const all = [];
  ["default", "hover", "press", "focus", "disabled"].forEach((state) => ["true", "false"].forEach((valid) => {
    all.push(cell(`${YCO.label(state)} / ${valid === "true" ? "Valid" : "Invalid"}`, { valid }, state));
  }));
  all.push(cell("Placeholder", { valid: "true", content: "placeholder" }, "default"));
  all.push(cell("Filled", { valid: "true", content: "filled" }, "default"));
  all.push(cell("Filled / Invalid", { valid: "false", content: "filled" }, "default"));
  all.push(cell("Optional, no hint", { valid: "true", required: false, optional: true, hint: false }, "default"));

  YCO.page({
    id: "text-area",
    group: "Forms",
    title: "Text area",
    figma: "3449:60808",
    needs: [],
    statesCss: "components/text-area.states.css",
    intro: "A multi-line field with an optional label, hint and error message. The label row can mark the field required or optional. Hover, press and focus come from real pointer and keyboard states.",
    controls: [
      YCO.stateControl(),
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "content", label: "Content", type: "chips", options: ["none", "placeholder", "filled"], default: "none" },
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
      if (s.content === "filled") p.push('  value="Lorem ipsum dolor sit amet…"');
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no TextArea yet\nimport TextArea from '@/components/common/text-area';\n\n<TextArea\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "Figma places the error message between the label text and the field (unlike a text input, where it sits below); the page follows Figma.",
      "A disabled field never shows the invalid look or message, as in Figma (Disabled / Invalid is drawn the same as Disabled / Valid).",
      "Figma draws the required asterisk in --text-weak, not red.",
      "Figma draws the value of a disabled field in --text-strong (only the label and asterisk are dimmed); the designer should confirm this is intended.",
      "The field is a fixed 160px tall (10rem) as in Figma, with resizing switched off; RD may prefer a min-height with vertical resize.",
      "The focus ring is the 3px --stroke-focus (--stroke-error-weak when invalid) outline outside the border, not an inset shadow.",
    ],
  });
})();
