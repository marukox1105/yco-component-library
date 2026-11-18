/* Tooltip · Figma 4136:45743 (set 3550:142326). Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = [
    { value: "top_left", label: "Top left" }, { value: "top_centre", label: "Top centre" }, { value: "top_right", label: "Top right" },
    { value: "bottom_left", label: "Bottom left" }, { value: "bottom_centre", label: "Bottom centre" }, { value: "bottom_right", label: "Bottom right" },
    { value: "left", label: "Left" }, { value: "right", label: "Right" },
  ];
  const SIZES = ["tiny", "small", "large"];
  const X = '<svg class="ycoTooltip_dismissGlyph" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7"/></svg>';
  const defaults = { type: "top_left", size: "small", heading: true, dismissible: true, show: true, text: "Tooltip text" };

  const alignOf = (type) => (type === "left" || type.endsWith("_left") ? "start" : type === "right" || type.endsWith("_right") ? "end" : "center");

  function tooltip(s, ctx, uid) {
    const o = { ...defaults, ...s };
    const large = o.size === "large";
    const hook = ctx.preview ? " data-yco-dismiss" : "";
    const dismiss = o.dismissible ? `<button class="ycoTooltip_dismiss" type="button" aria-label="Dismiss"${hook}>${X}</button>` : "";
    const body = large
      ? `${o.heading ? '\n    <p class="ycoTooltip_heading">Heading</p>' : ""}\n    <p class="ycoTooltip_text">${YCO.esc(o.text)}</p>${dismiss ? "\n    " + dismiss : ""}\n  `
      : `\n    <span class="ycoTooltip_text">${YCO.esc(o.text)}</span>${dismiss ? "\n    " + dismiss : ""}\n  `;
    return `<div class="ycoTooltip_anchor">
  <button class="ycoTooltip_trigger" type="button" aria-describedby="${uid}">Trigger</button>
  <div class="ycoTooltip ycoTooltip_size_${o.size} ycoTooltip_placement_${o.type}${o.show ? " ycoTooltip_open" : ""}" role="tooltip" id="${uid}">${body}</div>
</div>`;
  }

  /** Doc-only wrapper: room around the trigger so the bubble fits, aligned the way the bubble extends. */
  const stage = (s, html, extra = "") => {
    const o = { ...defaults, ...s };
    const horiz = o.type === "left" || o.type === "right";
    return `<div class="ycoTooltip_stage ycoTooltip_stage_${alignOf(o.type)} ycoTooltip_stage_size_${o.size} ycoTooltip_stage_${horiz ? "h" : "v"}${extra}">${html}</div>`;
  };

  let off = null;
  const label = YCO.label;
  const typeLabel = (t) => TYPES.find((x) => x.value === t).label;

  YCO.page({
    id: "tooltip",
    group: "Surfaces",
    title: "Tooltip",
    figma: "3550:142326",
    statesCss: "components/tooltip.states.css",
    intro: "A dark bubble with an arrow that explains its trigger. Three sizes (Tiny and Small hold one line, Large a heading and body), eight placements, and an optional dismiss button. It appears on hover and keyboard focus of the trigger; Escape or the dismiss button closes it.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "top_left" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "small" },
      { key: "heading", label: "Heading", type: "toggle", default: true, when: (s) => s.size === "large" },
      { key: "dismissible", label: "Dismissible", type: "toggle", default: true },
      { key: "text", label: "Text", type: "text", default: "Tooltip text" },
      { key: "show", label: "Always show", type: "toggle", default: true },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? stage(s, tooltip(s, ctx, "tooltip-demo"), " ycoTooltip_stage_preview") : tooltip(s, ctx, "tooltip-demo")),
    mount: (el) => {
      if (off) off();
      const st = el.querySelector(".ycoTooltip_stage");
      if (!st) return;
      const tip = st.querySelector(".ycoTooltip");
      const anchor = st.querySelector(".ycoTooltip_anchor");
      const hide = () => tip.classList.add("ycoTooltip_hidden");
      const unhide = () => tip.classList.remove("ycoTooltip_hidden");
      st.addEventListener("click", (e) => { if (e.target.closest("[data-yco-dismiss]")) { hide(); st.querySelector(".ycoTooltip_trigger").focus({ preventScroll: true }); } });
      anchor.addEventListener("pointerenter", unhide);
      anchor.addEventListener("focusin", (e) => { if (e.target.classList.contains("ycoTooltip_trigger")) unhide(); });
      const onKey = (e) => {
        if (!st.isConnected) return off && off();
        if (e.key === "Escape" && st.contains(document.activeElement)) hide();
      };
      document.addEventListener("keydown", onKey);
      off = () => { document.removeEventListener("keydown", onKey); off = null; };
    },
    react: (s) => {
      const side = s.type.startsWith("bottom") ? "bottom" : "top";
      const tiny = s.size === "tiny" && !s.type.match(/^(left|right)$/) && !s.type.endsWith("left") && !s.type.endsWith("right");
      const p = [`  label="${s.text}"`];
      const extra = [];
      if (s.type !== "top_centre") extra.push(`  placement="${s.type.replace("_", "-")}"`);
      if (s.size !== "tiny") extra.push(`  size="${s.size}"`);
      if (s.size === "large" && s.heading) extra.push('  heading="Heading"');
      if (s.dismissible) extra.push("  dismissible");
      return `// yce-frontend has Tooltip (Tiny, side top | bottom, centred) at components/common/ui/tooltip.\n// placement, size, heading and dismissible below are a proposed extension for the other Figma variants.\nimport Tooltip from '@/components/common/ui/tooltip';\n\n<Tooltip\n${[...p, ...extra].join("\n")}\n${tiny ? `  side="${side}"\n` : ""}>\n  <button type="button">Trigger</button>\n</Tooltip>`;
    },
    variants: () => {
      const v = [];
      SIZES.forEach((size) => TYPES.forEach(({ value, label: tl }) => {
        const wide = size === "large" || value === "left" || value === "right";
        v.push({ label: `${tl} / ${label(size)}`, wide, html: stage({ type: value, size }, tooltip({ type: value, size, text: size === "tiny" ? "like" : size === "small" ? "Tooltip text" : "Tooltip text, wrapping onto a second line when the body is long enough to fill the bubble." }, { preview: false }, `tip-${size}-${value}`)) });
      }));
      return v;
    },
    notes: [
      "Types follow Figma: Top / Bottom put the bubble above / below the trigger (arrow on its bottom / top edge); Left / Right name the edge the arrow sits on, so Left places the bubble to the trigger's right. The designer should confirm that naming.",
      "No tokens for the 12px / 16px Micro text style (written in rem), the 4px bubble radius (--spacing-4 used) or Large's dimmed body (--text-inverse-strong at 78% opacity; Figma's --text-inverse-weak is dark-theme only here).",
      "Shadow: Figma's Shadow/Overlay has no token; --shadow is the nearest and is heavier. Figma also draws a 1px border behind the arrow, not reproduced.",
      "The dismiss button sits inside a role=tooltip bubble, as in Figma; tooltips with interactive content are an accessibility risk (WCAG 1.4.13) and RD should decide whether Large becomes a popover.",
      "Tiny and Small size to their text (Figma: 51 and 141 wide for a short label); Large is 324 wide. Collision flipping at the viewport edge is left to the product's positioning hook.",
    ],
  });
})();
