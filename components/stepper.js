/* Stepper · Figma 3965:36404 (component set 3619:22570). Config reference: COMPONENT-PAGES.md */
(() => {
  const STATE_OPTS = [{ value: "default", label: "Default" }, { value: "hover", label: "Hover" }, { value: "press", label: "Press" }, { value: "focus", label: "Focus" }, { value: "disabled", label: "Disabled" }];
  const X_OCTAGON = '<svg class="ycoStepper_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';
  const MINUS = '<svg class="ycoStepper_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
  const PLUS = '<svg class="ycoStepper_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  function markup(s, ctx) {
    const disabled = s.state === "disabled";
    const valid = s.valid === "true" || disabled; // Figma's Disabled / Invalid is drawn like Disabled / Valid
    const cls = ["ycoStepper", valid ? "" : "ycoStepper_valid_false", disabled ? "ycoStepper_disabled" : ""].filter(Boolean).join(" ") + (ctx.sc || "");
    const showText = s.label;
    const dis = disabled ? " disabled" : "";
    return `<div class="${cls}">
  ${showText ? `<div class="ycoStepper_text">
    <span class="ycoStepper_labelRow">Label${s.required ? '<span class="ycoStepper_required" aria-hidden="true">*</span>' : ""}${s.optional ? '<span class="ycoStepper_optional">(optional)</span>' : ""}</span>${s.hint ? '\n    <span class="ycoStepper_hint">Hint text</span>' : ""}
  </div>` : ""}
  ${valid ? "" : `<p class="ycoStepper_error" role="alert">${X_OCTAGON}Error message</p>`}
  <div class="ycoStepper_field${disabled ? " ycoStepper_field_disabled" : ""}" role="group"${showText ? ' aria-label="Label"' : ' aria-label="Quantity"'}>
    <button class="ycoStepper_button" type="button" data-step="-1" aria-label="Decrease"${dis}>${MINUS}</button>
    <input class="ycoStepper_input" type="number" value="1" min="0" max="99" aria-label="Value"${dis}${valid ? "" : ' aria-invalid="true"'} />
    <button class="ycoStepper_button" type="button" data-step="1" aria-label="Increase"${dis}>${PLUS}</button>
  </div>
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const all = [];
  ["true", "false"].forEach((valid) => STATE_OPTS.forEach((st) => {
    all.push({ label: `${st.label} / ${valid === "true" ? "Valid" : "Invalid"}`, html: markup({ state: st.value, valid, label: true, required: true, optional: false, hint: false }, { sc: YCO.stateClass(st.value) }) });
  }));

  YCO.page({
    id: "stepper",
    group: "Forms",
    title: "Stepper",
    figma: "3965:36404",
    statesCss: "components/stepper.states.css",
    intro: "A small number field for whole values: type a number or use the minus and plus buttons. It has an optional label with required or optional marks, a hint and an error message.",
    controls: [
      YCO.stateControl(STATE_OPTS),
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "label", label: "Label", type: "toggle", default: true },
      { key: "required", label: "Required mark", type: "toggle", default: true, when: (s) => s.label },
      { key: "optional", label: "Optional mark", type: "toggle", default: false, when: (s) => s.label },
      { key: "hint", label: "Hint text", type: "toggle", default: false, when: (s) => s.label },
    ],
    render: markup,
    mount: (el) => {
      // The buttons step the real number input; min / max come from the input.
      el.querySelectorAll(".ycoStepper_button").forEach((b) => b.addEventListener("click", () => {
        const input = b.parentElement.querySelector(".ycoStepper_input");
        if (b.dataset.step === "1") input.stepUp(); else input.stepDown();
      }));
    },
    react: (s) => {
      const p = [];
      if (s.label) p.push('  label="Label"');
      if (s.required && s.label) p.push("  required");
      if (s.optional && s.label) p.push("  optional");
      if (s.hint && s.label) p.push('  hint="Hint text"');
      if (s.valid === "false") p.push('  error="Error message"');
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no Stepper yet\nimport Stepper from '@/components/common/stepper';\n\n<Stepper\n${p.join("\n")}\n  value={value}\n  min={0}\n  max={99}\n  onChange={setValue}\n/>`;
    },
    variants: all,
    notes: [
      "A disabled stepper never shows the invalid look or message, as in Figma (Disabled / Invalid is the same as Disabled / Valid, 70px tall without an error).",
      "Hover and Press tint the number cell only (the Figma State layer); the buttons stay white. Figma gives the buttons no state of their own.",
      "Figma's field shadow (two layers, 8% and 4% black) uses --grey-neutral-light-100 and -50; the invalid field has a slightly larger shadow, drawn here too.",
      "Min, max and step are not in Figma: the preview uses 0 to 99, step 1.",
    ],
  });
})();
