/* Progress indicator · Figma 4157:47199 (component set 3694:2033). Config reference: COMPONENT-PAGES.md */
(() => {
  const TOTAL = 5;
  const ARROW = '<svg class="ycoProgressIndicator_backIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  function markup(s) {
    const n = Number(s.step);
    const title = `Step ${n} of ${TOTAL}`;
    const segs = Array.from({ length: TOTAL }, (_, i) => `    <span class="ycoProgressIndicator_step${i < n ? " ycoProgressIndicator_step_done" : ""}"></span>`).join("\n");
    return `<div class="ycoProgressIndicator" data-step="${n}">
  <div class="ycoProgressIndicator_row">
    <p class="ycoProgressIndicator_title">${title}</p>
    <div class="ycoProgressIndicator_steps" role="progressbar" aria-label="Progress" aria-valuemin="1" aria-valuemax="${TOTAL}" aria-valuenow="${n}" aria-valuetext="${title}">
${segs}
    </div>
  </div>
  <button class="ycoProgressIndicator_back" type="button">${ARROW}Back</button>
</div>`;
  }

  YCO.page({
    id: "progress-indicator",
    group: "Forms",
    title: "Progress indicator",
    figma: "4157:47199",
    intro: "Shows where the user is in a multi-step flow: a \"Step n of 5\" title, one segment per step (filled up to the current step) and a Back link. In the preview the Back link steps back.",
    controls: [{ key: "step", label: "Step", type: "chips", options: ["1", "2", "3", "4", "5"], default: "1" }],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? `<div style="display:flex;justify-content:center;width:100%">${markup(s)}</div>` : markup(s)),
    mount: (el) => {
      // Preview only: Back moves the indicator one step back (the real handler belongs to the flow). onclick, not addEventListener: the surface element is reused on every redraw.
      el.onclick = (e) => {
        if (!e.target.closest(".ycoProgressIndicator_back")) return;
        const root = el.querySelector(".ycoProgressIndicator");
        root.parentElement.innerHTML = markup({ step: Math.max(1, Number(root.dataset.step) - 1) });
      };
    },
    react: (s) => `// Proposed API: yce-frontend has no ProgressIndicator yet\nimport ProgressIndicator from '@/components/common/progress-indicator';\n\n<ProgressIndicator\n  step={${s.step}}\n  totalSteps={5}\n  onBack={goBack}\n/>`,
    variants: ["1", "2", "3", "4", "5"].map((n) => ({ label: `Step ${n}`, wide: true, html: markup({ step: n }) })),
    notes: [
      "Figma has no token for the 26px line height of the 18px title (--line-height-heading-5 is missing from the light tokens); 1.625rem is used.",
      "The empty segments use --stroke-weak with the 8% inner shadow (nearest token --grey-neutral-light-100); filled segments use --fill-brand-strong (Figma's fill/selected only exists in the dark theme).",
      "The Back link is a plain text button, drawn here without the Text link page: Figma shows it at 18px semibold in --text-brand with a 20px arrow. Hover underline and the focus ring are not in Figma.",
      "Figma fixes the total at five steps; the markup renders any total from the data.",
    ],
  });
})();
