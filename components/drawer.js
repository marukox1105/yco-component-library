/* Drawer · Figma 5358:7210 (set 5358:7442). Config reference: COMPONENT-PAGES.md */
(() => {
  const SLOTS = [1, 2, 3, 4, 5];
  const CLOSE = '<svg class="ycoDrawer_closeGlyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const defaults = { device: "desktop", size: "small", slot1: true, slot2: true, slot3: true, slot4: false, slot5: false, scrollbar: false };

  function overlay(s, ctx) {
    const hook = (name) => (ctx.preview ? ` data-yco-${name}` : "");
    const mobile = s.device === "mobile";
    const slots = SLOTS.filter((n) => s[`slot${n}`]).map(() => '      <div class="ycoDrawer_slot">Slot</div>').join("\n");
    const mark = ctx.preview ? " data-yco-close" : "";
    return `<div class="ycoDrawer_overlay${mobile ? " ycoDrawer_overlay_device_mobile" : ""}"${hook("overlay")}>
  <aside class="ycoDrawer ycoDrawer_size_${s.size}${mobile ? " ycoDrawer_device_mobile" : ""}" role="dialog" aria-modal="true" aria-labelledby="drawer-heading" tabindex="-1"${hook("dialog")}>
    <header class="ycoDrawer_header">
      <h2 class="ycoDrawer_heading" id="drawer-heading">Heading</h2>
      <button class="ycoDrawer_close" type="button" aria-label="Close"${mark}>${CLOSE}</button>
    </header>
    <div class="ycoDrawer_content">
${slots ? slots + "\n" : ""}${s.scrollbar ? '      <span class="ycoDrawer_scrollbar" aria-hidden="true"></span>\n' : ""}    </div>
    <footer class="ycoDrawer_footer">
      <div class="ycoDrawer_actions">
        <button class="ycoButton tone_brand variant_primary size_medium" type="button"${mark}>Label</button>
        <button class="ycoButton tone_brand variant_secondary size_medium" type="button"${mark}>Label</button>
        <button class="ycoButton tone_brand variant_tertiary size_medium" type="button"${mark}>Label</button>
      </div>
    </footer>
  </aside>
</div>`;
  }

  const cls = (s) => (s.device === "mobile" ? " ycoDrawer_stage_device_mobile" : "");
  const stage = (s, ctx) => `<div class="ycoDrawer_stage${cls(s)}">
${overlay(s, ctx)}
  <button class="ycoButton tone_brand variant_secondary size_medium ycoDrawer_stageOpen" type="button" data-yco-open hidden>Open drawer</button>
</div>`;
  const variantStage = (s) => `<div class="ycoDrawer_stage ycoDrawer_stage_variant${cls(s)}">${overlay({ ...defaults, ...s }, { preview: false })}</div>`;

  let off = null;
  YCO.page({
    id: "drawer",
    group: "Surfaces",
    title: "Drawer",
    figma: "5358:7442",
    needs: ["button"],
    statesCss: "components/drawer.states.css",
    intro: "A full-height panel that slides in from the right over a blurred scrim: a heading with a close button, scrolling content made of slots, and a footer button group. Small is 400 wide, Large 600; on a phone it fills the width less a 64px gutter and the buttons stack.",
    controls: [
      { key: "device", label: "Device", type: "chips", options: ["desktop", "mobile"], default: "desktop" },
      { key: "size", label: "Size", type: "chips", options: ["small", "large"], default: "small" },
      ...SLOTS.map((n) => ({ key: `slot${n}`, label: `Slot ${n}`, type: "toggle", default: n <= 3 })),
      { key: "scrollbar", label: "Scrollbar", type: "toggle", default: false },
    ],
    surface: { wide: true, minHeight: 600 },
    render: (s, ctx) => (ctx.preview ? stage(s, ctx) : overlay(s, ctx)),
    mount: (el) => {
      if (off) off();
      const st = el.querySelector(".ycoDrawer_stage");
      if (!st) return;
      const ov = st.querySelector("[data-yco-overlay]");
      const open = st.querySelector("[data-yco-open]");
      const dlg = st.querySelector("[data-yco-dialog]");
      const close = () => { ov.hidden = true; open.hidden = false; open.focus({ preventScroll: true }); };
      const show = () => { ov.hidden = false; open.hidden = true; dlg.focus({ preventScroll: true }); };
      st.addEventListener("click", (e) => {
        if (e.target.closest("[data-yco-open]")) show();
        else if (e.target.closest("[data-yco-close]") || e.target === ov) close();
      });
      st.addEventListener("keydown", (e) => {
        if (e.key !== "Tab" || ov.hidden) return;
        const stops = [...dlg.querySelectorAll("button:not([disabled])")];
        const i = stops.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); stops[stops.length - 1].focus(); }
        else if (!e.shiftKey && i === stops.length - 1) { e.preventDefault(); stops[0].focus(); }
      });
      const onKey = (e) => {
        if (!st.isConnected) return off && off();
        if (e.key === "Escape" && !ov.hidden && st.contains(document.activeElement)) close();
      };
      document.addEventListener("keydown", onKey);
      off = () => { document.removeEventListener("keydown", onKey); off = null; };
    },
    react: (s) => {
      const p = [];
      if (s.size !== "small") p.push('  size="large"');
      const n = SLOTS.filter((k) => s[`slot${k}`]).length;
      return `// Proposed API: yce-frontend has no Drawer yet (its Modal shell and bottom sheet are the nearest)\nimport Drawer from '@/components/common/drawer';\n\n<Drawer\n  opened={opened}\n  onClose={onClose}\n  heading="Heading"\n${p.length ? p.join("\n") + "\n" : ""}  actions={[\n    { label: "Label", variant: "primary" },\n    { label: "Label", variant: "secondary" },\n    { label: "Label", variant: "tertiary" },\n  ]}\n>\n  {/* ${n} content block${n === 1 ? "" : "s"}; the panel scrolls when they overflow */}\n</Drawer>`;
    },
    variants: () => [
      { label: "Desktop / Small", wide: true, html: variantStage({ size: "small" }) },
      { label: "Desktop / Large", wide: true, html: variantStage({ size: "large" }) },
      { label: "Mobile / Small", wide: true, html: variantStage({ device: "mobile", size: "small" }) },
      { label: "Mobile / Large", wide: true, html: variantStage({ device: "mobile", size: "large" }) },
      { label: "Desktop / Small / 5 slots, scrollbar", wide: true, html: variantStage({ slot4: true, slot5: true, scrollbar: true }) },
    ],
    notes: [
      "Scrim uses --fill-overlay (black 60%); Figma's --fill-overlay-weak (black 45%) exists only in the dark theme here. Figma also blurs the page behind it by 8px, which is kept.",
      "Panel ground uses --background-raised (Figma: --background-overlay, dark theme only). Shadow: Figma's Shadow/Overlay has no token; --shadow is the nearest.",
      "Heading is 24/32 (Heading 3) written in rem: no matching font-size token. The 64px mobile gutter is written as 4rem (no --spacing-64).",
      "Figma draws Mobile / Large the same as Mobile / Small (the panel fills the width less the gutter).",
      "Slot copy and the scrollbar hint are Figma placeholders. The content area scrolls on its own; the header and footer stay put.",
      "The overlay is position:fixed in the product; drawer.states.css only re-anchors it inside the preview. Slide-in motion is not drawn in Figma and is left to RD.",
    ],
  });
})();
