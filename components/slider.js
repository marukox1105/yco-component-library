/* Slider · Figma 4993:6497 (component set 4993:6512). Config reference: COMPONENT-PAGES.md */
(() => {
  const PERCENTS = ["0", "25", "50", "75", "100"];

  function markup(s) {
    const n = Number(s.percent);
    const text = s.text ? `\n  <span class="ycoSlider_text">\n    <span class="ycoSlider_label">${YCO.esc(s.text)}</span>\n    <output class="ycoSlider_value">${n}%</output>\n  </span>` : "";
    return `<label class="ycoSlider">${text}
  <span class="ycoSlider_control">
    <span class="ycoSlider_track" aria-hidden="true"><span class="ycoSlider_fill" style="width: ${n}%"></span></span>
    <input class="ycoSlider_input" type="range" min="0" max="100" step="1" value="${n}"${s.text ? "" : ' aria-label="Slider"'} />
  </span>
</label>`;
  }

  // The slider has no intrinsic width, so the doc cells centre it in a full-width wrapper.
  const centre = (html) => `<div style="display:flex;justify-content:center;width:100%">${html}</div>`;
  const all = PERCENTS.map((p) => ({ label: `Percentage ${p}`, html: centre(markup({ percent: p, text: "Label" })) }));
  all.push({ label: "Percentage 25 / no text", html: centre(markup({ percent: "25", text: "" })) });

  YCO.page({
    id: "slider",
    group: "Forms",
    title: "Slider",
    figma: "4993:6497",
    intro: "Choose a value on a continuous range by dragging the handle or with the arrow keys. An optional row above shows the label and the current percentage. The fill follows the handle.",
    controls: [
      { key: "percent", label: "Percentage", type: "chips", options: PERCENTS, default: "25" },
      { key: "text", label: "Text row (label + value)", type: "toggle", default: true },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? centre(markup({ percent: s.percent, text: s.text ? "Label" : "" })) : markup({ percent: s.percent, text: s.text ? "Label" : "" })),
    mount: (el) => {
      const input = el.querySelector(".ycoSlider_input");
      if (!input) return;
      input.addEventListener("input", () => {
        el.querySelector(".ycoSlider_fill").style.width = `${input.value}%`;
        const out = el.querySelector(".ycoSlider_value");
        if (out) out.textContent = `${input.value}%`;
      });
    },
    react: (s) => `// Proposed API: yce-frontend has no Slider yet (common/slider-control wraps YCESlider with a different look: 3px rail, 10px handle)\nimport Slider from '@/components/common/slider';\n\n<Slider\n${s.text ? '  label="Label"\n' : '  ariaLabel="Slider"\n'}  min={0}\n  max={100}\n  value={value}\n  onChange={setValue}\n  showValue\n/>`,
    variants: all,
    notes: [
      "The control is a real range input: drag the handle or use the arrow, Home and End keys. Handle hover and focus are not drawn in Figma; hover tints the handle with --grey-solid-50 and focus adds the 3px --stroke-focus ring.",
      "Figma's handle drop shadow is black at 16%; the nearest token is --grey-neutral-light-100 (10%). The fill's inner shadow (8%) uses the same token.",
      "The fill is 8px with an inner shadow; its width is set inline from the value (the page script does it here, RD computes it in React).",
      "yce-frontend's slider-control (YCESlider) has a much thinner rail and a 10px handle: this Figma slider needs a restyle or a new component.",
      "Figma has no disabled state for the slider.",
    ],
  });
})();
