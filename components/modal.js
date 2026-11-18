/* Modal / Overlay · Figma 4109:43377 (set 3504:64418). Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = [{ value: "modal", label: "Modal" }, { value: "progress", label: "Progress indicator" }, { value: "picker", label: "Photo picker" }];
  const SIZES = ["small", "large", "huge"];
  const SLOTS = [1, 2, 3, 4, 5];

  const DIAMOND = '<svg class="ycoModal_iconGlyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.7 3.7l7.6 7.6a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0l-7.6-7.6a1 1 0 0 1 0-1.4l7.6-7.6a1 1 0 0 1 1.4 0Z"/></svg>';
  const CLOSE = '<svg class="ycoModal_closeGlyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const PICTURE = '<svg class="ycoModal_imageGlyph" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>';

  const btn = (tone, variant, label) => `<button class="ycoButton tone_${tone} variant_${variant} size_medium" type="button"{{c}}>${label}</button>`;

  /** The panel (and its scrim). ctx.preview adds the hooks mount() listens to. */
  function overlay(s, ctx) {
    const hook = (name) => (ctx.preview ? ` data-yco-${name}` : "");
    const mobile = s.device === "mobile";
    const dev = mobile ? " ycoModal_overlay_device_mobile" : "";

    if (s.type === "progress") {
      const pct = Math.max(0, Math.min(100, parseInt(s.percent, 10) || 0));
      return `<div class="ycoModal_overlay${dev}"${hook("overlay")} role="status">
  <div class="ycoModal_progress">
    <div class="ycoModal_progressText">
      <p class="ycoModal_progressTitle">Title</p>
      <p class="ycoModal_progressCaption">Caption</p>
    </div>
    <div class="ycoModal_progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
      <span class="ycoModal_progressTrack"></span>
      <span class="ycoModal_progressFill" style="width: ${pct}%"></span>
      <span class="ycoModal_progressValue">${pct}%</span>
    </div>
  </div>
</div>`;
    }
    if (s.type === "picker") {
      return `<div class="ycoModal_overlay${dev}"${hook("overlay")}>
  <div class="ycoModal_picker" role="img" aria-label="Native file picker">
    <div class="ycoModal_pickerBar"></div>
    <div class="ycoModal_pickerSide"></div>
    <div class="ycoModal_pickerMain"><span class="ycoModal_pickerThumb"></span><span class="ycoModal_pickerThumb"></span><span class="ycoModal_pickerThumb"></span></div>
    <div class="ycoModal_pickerFoot"></div>
  </div>
</div>`;
    }

    const destructive = s.tone === "destructive";
    const cls = ["ycoModal", `ycoModal_size_${s.size}`, destructive ? "ycoModal_tone_destructive" : "", mobile ? "ycoModal_device_mobile" : ""].filter(Boolean).join(" ");
    const slots = SLOTS.filter((n) => s[`slot${n}`]).map((n, i) => `    <div class="ycoModal_slot${i === 0 ? " ycoModal_slot_first" : ""}">Slot</div>`).join("\n");
    const hasHeader = s.icon || s.heading || s.secondary;
    const buttons = destructive
      ? btn("destructive", "primary", "Label") + "\n    " + btn("neutral", "secondary", "Label")
      : btn("neutral", "secondary", "Label") + "\n    " + btn("brand", "primary", "Label");
    const labelled = s.heading ? ' aria-labelledby="modal-heading"' : ' aria-label="Modal"';
    return `<div class="ycoModal_overlay${dev}"${hook("overlay")}>
  <div class="${cls}" role="dialog" aria-modal="true"${labelled} tabindex="-1"${hook("dialog")}>
    <div class="ycoModal_content">
${s.image ? `      <div class="ycoModal_image" role="img" aria-label="Image">${PICTURE}</div>\n` : ""}${hasHeader ? `      <div class="ycoModal_header">
${s.icon ? `        <span class="ycoModal_icon">${DIAMOND}</span>\n` : ""}${s.heading || s.secondary ? `        <div class="ycoModal_text">
${s.heading ? '          <h2 class="ycoModal_heading" id="modal-heading">Heading</h2>\n' : ""}${s.secondary ? '          <p class="ycoModal_secondary">Secondary text</p>\n' : ""}        </div>\n` : ""}      </div>\n` : ""}${slots ? slots.replace(/^ {4}/gm, "      ") + "\n" : ""}    </div>
${s.buttons ? `    <div class="ycoModal_actions">
    ${buttons.replace(/\{\{c\}\}/g, ctx.preview ? " data-yco-close" : "")}
    </div>\n` : ""}${s.dismissible ? `    <button class="ycoModal_close" type="button" aria-label="Close"${hook("close")}>${CLOSE}</button>\n` : ""}${s.scrollbar ? '    <span class="ycoModal_scrollbar" aria-hidden="true"></span>\n' : ""}  </div>
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const defaults = { type: "modal", device: "desktop", size: "small", tone: "default", icon: true, image: false, heading: true, secondary: true, slot1: true, slot2: false, slot3: false, slot4: false, slot5: false, buttons: true, dismissible: true, scrollbar: false, percent: "100" };

  /** Preview: the scrim is drawn inside a stage, and a trigger brings the modal back after it is closed. */
  const stage = (s, ctx) => `<div class="ycoModal_stage${s.device === "mobile" ? " ycoModal_stage_device_mobile" : ""}">
${overlay(s, ctx)}
  <button class="ycoButton tone_brand variant_secondary size_medium ycoModal_stageOpen" type="button" data-yco-open hidden>Open modal</button>
</div>`;

  const variantStage = (s) => `<div class="ycoModal_stage ycoModal_stage_variant${s.device === "mobile" ? " ycoModal_stage_device_mobile" : ""}">${overlay({ ...defaults, ...s }, { preview: false })}</div>`;

  let off = null;
  const label = YCO.label;

  YCO.page({
    id: "modal",
    group: "Surfaces",
    title: "Modal / Overlay",
    figma: "3504:64418",
    needs: ["button"],
    statesCss: "components/modal.states.css",
    intro: "A dialog over a dimmed scrim: optional icon, heading, secondary text, image and slots, with a button group and a close button. Sizes Small, Large and Huge, a Destructive tone, a stacked mobile layout, and the Progress Indicator and Photo picker overlays.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "modal" },
      { key: "device", label: "Device", type: "chips", options: ["desktop", "mobile"], default: "desktop", when: (s) => s.type === "modal" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "small", when: (s) => s.type === "modal" },
      { key: "tone", label: "Tone", type: "chips", options: ["default", "destructive"], default: "default", when: (s) => s.type === "modal" },
      { key: "percent", label: "Progress %", type: "text", default: "100", when: (s) => s.type === "progress" },
      { key: "icon", label: "Icon", type: "toggle", default: true, when: (s) => s.type === "modal" },
      { key: "image", label: "Image", type: "toggle", default: false, when: (s) => s.type === "modal" },
      { key: "heading", label: "Heading", type: "toggle", default: true, when: (s) => s.type === "modal" },
      { key: "secondary", label: "Secondary text", type: "toggle", default: true, when: (s) => s.type === "modal" },
      ...SLOTS.map((n) => ({ key: `slot${n}`, label: `Slot ${n}`, type: "toggle", default: n === 1, when: (s) => s.type === "modal" })),
      { key: "buttons", label: "Button group", type: "toggle", default: true, when: (s) => s.type === "modal" },
      { key: "dismissible", label: "Dismissible (close button)", type: "toggle", default: true, when: (s) => s.type === "modal" },
      { key: "scrollbar", label: "Scrollbar", type: "toggle", default: false, when: (s) => s.type === "modal" },
    ],
    surface: { wide: true, minHeight: 600 },
    render: (s, ctx) => (ctx.preview ? stage(s, ctx) : overlay(s, ctx)),
    mount: (el) => {
      if (off) off();
      const st = el.querySelector(".ycoModal_stage");
      if (!st) return;
      const ov = st.querySelector("[data-yco-overlay]");
      const open = st.querySelector("[data-yco-open]");
      const dlg = st.querySelector("[data-yco-dialog]");
      const close = () => { ov.hidden = true; open.hidden = false; open.focus({ preventScroll: true }); };
      const show = () => { ov.hidden = false; open.hidden = true; (dlg || ov).focus({ preventScroll: true }); };
      st.addEventListener("click", (e) => {
        if (e.target.closest("[data-yco-open]")) show();
        else if (e.target.closest("[data-yco-close]") || (e.target === ov && dlg)) close();
      });
      const onKey = (e) => {
        if (!st.isConnected) return off && off();
        if (e.key === "Escape" && !ov.hidden && st.contains(document.activeElement)) close();
      };
      // Keep Tab inside the open dialog.
      st.addEventListener("keydown", (e) => {
        if (e.key !== "Tab" || ov.hidden || !dlg) return;
        const stops = [...dlg.querySelectorAll("button:not([disabled])")];
        if (!stops.length) return;
        const i = stops.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); stops[stops.length - 1].focus(); }
        else if (!e.shiftKey && i === stops.length - 1) { e.preventDefault(); stops[0].focus(); }
      });
      document.addEventListener("keydown", onKey);
      off = () => { document.removeEventListener("keydown", onKey); off = null; };
    },
    react: (s) => {
      if (s.type !== "modal") return `// Proposed API: yce-frontend has no ${s.type === "progress" ? "ProgressOverlay" : "PhotoPicker"} yet\n// Progress is a scrim with a title, a caption and a bar; the photo picker is the browser's native file dialog.\nimport ProgressOverlay from '@/components/common/ui/progress-overlay';\n\n<ProgressOverlay title="Title" caption="Caption" percent={${parseInt(s.percent, 10) || 0}} />`;
      const p = [];
      if (s.size !== "small") p.push(`  size="${s.size}"`);
      if (s.tone !== "default") p.push(`  tone="${s.tone}"`);
      if (s.device === "mobile") p.push('  device="mobile" // or switch on the 768px breakpoint');
      if (s.icon) p.push("  icon={<DiamondIcon />}");
      if (s.image) p.push("  image={<img src={src} alt=\"\" />}");
      if (s.heading) p.push('  heading="Heading"');
      if (s.secondary) p.push('  description="Secondary text"');
      if (!s.dismissible) p.push("  dismissible={false}");
      if (s.buttons) p.push(s.tone === "destructive" ? '  actions={[\n    { label: "Label", tone: "destructive", onClick: onConfirm },\n    { label: "Label", variant: "secondary", onClick: onClose },\n  ]}' : '  actions={[\n    { label: "Label", variant: "secondary", onClick: onClose },\n    { label: "Label", tone: "brand", onClick: onConfirm },\n  ]}');
      const slots = SLOTS.filter((n) => s[`slot${n}`]).length;
      return `// yce-frontend has the Modal shell (opened, handleClose, ariaLabelledBy, children).\n// size, tone, icon, image, heading, actions and slots are a proposed API on top of it.\nimport Modal from '@/components/common/ui/modal';\n\n<Modal\n  opened={opened}\n  handleClose={onClose}\n${p.join("\n")}\n>${slots ? `\n  {/* ${slots} slot${slots > 1 ? "s" : ""}: any content between the text and the buttons */}\n` : ""}</Modal>`;
    },
    variants: () => {
      const v = [];
      [["default", "Default"], ["destructive", "Destructive"]].forEach(([tone, t]) => SIZES.forEach((size) => {
        if (tone === "destructive" && size === "huge") return; // Figma draws Destructive in Small and Large only
        v.push({ label: `Modal / ${t} / ${label(size)}`, wide: true, html: variantStage({ tone, size }) });
      }));
      v.push({ label: "Progress indicator / Large", wide: true, html: variantStage({ type: "progress" }) });
      v.push({ label: "Photo picker / Large", wide: true, html: variantStage({ type: "picker" }) });
      ["default", "destructive"].forEach((tone) => ["small", "large"].forEach((size) => {
        v.push({ label: `Modal / ${label(tone)} / ${label(size)} / Mobile`, wide: true, html: variantStage({ tone, size, device: "mobile" }) });
      }));
      v.push({ label: "Modal / Default / Small / With image", wide: true, html: variantStage({ image: true }) });
      v.push({ label: "Modal / Default / Small / 5 slots, scrollbar", wide: true, html: variantStage({ slot2: true, slot3: true, slot4: true, slot5: true, scrollbar: true }) });
      return v;
    },
    notes: [
      "Panel ground uses --background-raised: Figma's --background-overlay exists only in the dark theme here (same value in light).",
      "Shadow: Figma's Shadow/Overlay (0 8 24 -4, black 16%) has no token; --shadow is the nearest and is heavier.",
      "Heading is 24/32 (Heading 3) and the Huge panel's 40px side padding are written in rem: no --font-size-heading-3 or --spacing token pair matches the first, and --spacing-40 is used for the second.",
      "Figma draws Destructive / Small 420 wide while Default / Small is 500; the page reproduces both. The designer should confirm whether the 420 is intended.",
      "Progress indicator: the bar gradient (cyan to green) is approximated with --fill-brand-strong to --fill-success-strong; Figma's green is lighter and has no token. The text is 30 / 16 / 14 px on the scrim.",
      "Photo picker: Figma shows a screenshot of the browser's native file dialog, not a designed component. It is drawn here as blocks only; RD uses the native input.",
      "Mobile (Figma 428 wide): padding 16 / 24, max width 420, buttons stack full width. The same breakpoint applies to every size; Figma draws Small and Large identically on mobile.",
      "The overlay is position:fixed in the product; modal.states.css only re-anchors it inside the preview. The Scrollbar toggle draws Figma's 4px hint; real content scrolls inside the overlay.",
    ],
  });
})();
