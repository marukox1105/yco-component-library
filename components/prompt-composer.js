/* Prompt composer · Figma 15742:21196. Config reference: COMPONENT-PAGES.md */
(() => {
  const PLUS = '<svg class="ycoPromptComposer_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const PLUS_S = '<svg class="ycoPromptComposer_iconSmall" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9"/></svg>';
  const ARROW = '<svg class="ycoPromptComposer_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  const DIAMOND = '<svg class="ycoPromptComposer_iconSmall" viewBox="0 0 16 16" aria-hidden="true"><path d="m8 2 6 6-6 6-6-6 6-6Z"/></svg>';
  const IMAGE = '<svg class="ycoPromptComposer_thumbIcon" viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="20" rx="3"/><circle cx="12" cy="13" r="2.2"/><path d="m5 24 7-7 5 5 4-4 6 6"/></svg>';
  const REMOVE = '<svg class="ycoPromptComposer_removeIcon" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9"/></svg>';
  const ADD = '<svg class="ycoPromptComposer_addIcon" viewBox="0 0 28 28" aria-hidden="true"><path d="M14 6v16M6 14h16"/></svg>';
  const WIDTHS = [120, 213, 81, 123, 165, 90]; // the six attachment widths Figma draws
  const SAMPLE = "Filled text";
  let uid = 0;

  function markup(s, ctx) {
    const id = ctx.id || "prompt-composer";
    const oneline = s.layout === "oneline";
    const home = s.layout === "home";
    const media = s.layout === "chatroom" && s.media;
    const filled = s.state === "filled";
    const fake = ctx.fake; // static caret for the variant grid
    const showPresets = s.presetOptions && !oneline;
    const placeholder = oneline || media ? "Placeholder" : "Placeholder";
    const cls = ["ycoPromptComposer", `ycoPromptComposer_layout_${s.layout}`, media ? "ycoPromptComposer_media" : "", media && s.showScrollbar ? "ycoPromptComposer_scrollbar" : "", media && s.showGradientMask ? "ycoPromptComposer_mask" : ""].filter(Boolean).join(" ");
    const textarea = `<textarea class="ycoPromptComposer_input" id="${id}" rows="1" aria-label="Message" placeholder="${placeholder}"${s.state === "disabled" ? " disabled" : ""}>${filled ? SAMPLE : ""}</textarea>`;
    const ghost = `<div class="ycoPromptComposer_ghost" aria-hidden="true">${filled ? `<span class="ycoPromptComposer_ghostText">${SAMPLE}</span><span class="ycoPromptComposer_caret"></span>` : `<span class="ycoPromptComposer_caret"></span><span class="ycoPromptComposer_ghostText ycoPromptComposer_ghostPlaceholder">${placeholder}</span>`}</div>`;
    const showGhost = fake && (s.state === "focus" || filled || media);
    const input = showGhost ? ghost : textarea;
    const send = `<button class="ycoPromptComposer_send" type="submit" aria-label="Send"${filled ? "" : " disabled"}>${ARROW}</button>`;
    const attach = `<button class="ycoPromptComposer_attach" type="button">${PLUS_S}<span class="ycoPromptComposer_label">Add Media</span></button>`;
    const presets = showPresets ? `
      <hr class="ycoPromptComposer_divider" />
      <div class="ycoPromptComposer_presets" role="group" aria-label="Preset options">
        ${Array.from({ length: 8 }, () => `<button class="ycoPromptComposer_chip" type="button">${DIAMOND}<span class="ycoPromptComposer_label">Label</span></button>`).join("\n        ")}
      </div>` : "";
    const attachments = media ? `
      <div class="ycoPromptComposer_attachments" role="list" aria-label="Attachments">
        ${WIDTHS.map((w) => `<div class="ycoPromptComposer_thumb" role="listitem" style="width:${w}px"><span role="img" aria-label="Attachment">${IMAGE}</span><button class="ycoPromptComposer_remove" type="button" aria-label="Remove attachment">${REMOVE}</button></div>`).join("\n        ")}
        <button class="ycoPromptComposer_addTile" type="button">${ADD}<span class="ycoPromptComposer_addLabel">Add Media</span></button>
      </div>` : "";
    const fieldCls = `ycoPromptComposer_field${filled ? " ycoPromptComposer_field_filled" : ""}${ctx.sc}`;
    const field = oneline
      ? `<div class="${fieldCls}">
      <button class="ycoPromptComposer_plus" type="button" aria-label="Add media">${PLUS}</button>
      <div class="ycoPromptComposer_inputRow">
        ${input}
        ${send}
      </div>
    </div>`
      : `<div class="${fieldCls}">${media ? "" : `
      ${attach}`}${attachments}
      <div class="ycoPromptComposer_inputRow">
        ${input}
        ${send}
      </div>${presets}
    </div>`;
    return `<div class="${cls}">
  <form class="ycoPromptComposer_box" onsubmit="return false">
    ${field}
  </form>${home ? "" : `
  <p class="ycoPromptComposer_disclaimer">Disclaimer text</p>`}
</div>`;
  }

  const base = { presetOptions: true, showGradientMask: false, showScrollbar: false, media: false };
  const cell = (label, s) => ({ label, wide: true, html: markup({ ...base, ...s }, { sc: YCO.stateClass(s.state), id: `prompt-composer-v${++uid}`, fake: true }) });
  const all = [
    cell("Oneline / Focus (focusX)", { layout: "oneline", state: "focus" }),
    cell("Oneline / Filled (filledX)", { layout: "oneline", state: "filled" }),
    cell("Chatroom / Photo", { layout: "chatroom", state: "focus", media: true }),
    cell("Chatroom / Photo + filled", { layout: "chatroom", state: "filled", media: true }),
    cell("Chatroom / Default", { layout: "chatroom", state: "default" }),
    cell("Chatroom / Focus", { layout: "chatroom", state: "focus" }),
    cell("Chatroom / Filled", { layout: "chatroom", state: "filled" }),
    cell("Home / Default", { layout: "home", state: "default" }),
    cell("Chatroom / Photo / Scrollbar", { layout: "chatroom", state: "focus", media: true, showScrollbar: true }),
    cell("Chatroom / Photo / Gradient mask", { layout: "chatroom", state: "focus", media: true, showGradientMask: true }),
    cell("Chatroom / Default / No preset options", { layout: "chatroom", state: "default", presetOptions: false }),
  ];

  // Live behaviour: the send button follows the text, Enter sends (Shift+Enter breaks the line),
  // attachments can be removed or added, a preset chip fills the field.
  function mount(el, s) {
    const root = el.querySelector(".ycoPromptComposer");
    if (!root) return;
    const input = root.querySelector(".ycoPromptComposer_input");
    const send = root.querySelector(".ycoPromptComposer_send");
    const form = root.querySelector(".ycoPromptComposer_box");
    const field = root.querySelector(".ycoPromptComposer_field");
    const sync = () => { send.disabled = !input.value.trim(); field.classList.toggle("ycoPromptComposer_field_filled", !!input.value); };
    input.addEventListener("input", sync);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (!send.disabled) form.requestSubmit(); } });
    form.addEventListener("submit", (e) => { e.preventDefault(); if (send.disabled) return; input.value = ""; sync(); input.focus(); });
    root.addEventListener("click", (e) => {
      const rm = e.target.closest(".ycoPromptComposer_remove");
      if (rm) { rm.closest(".ycoPromptComposer_thumb").remove(); input.focus(); return; }
      const add = e.target.closest(".ycoPromptComposer_addTile");
      if (add) {
        const t = document.createElement("div");
        t.className = "ycoPromptComposer_thumb"; t.setAttribute("role", "listitem");
        t.innerHTML = `<span role="img" aria-label="Attachment">${IMAGE}</span><button class="ycoPromptComposer_remove" type="button" aria-label="Remove attachment">${REMOVE}</button>`;
        add.before(t); add.scrollIntoView({ block: "nearest", inline: "nearest" });
        return;
      }
      const chip = e.target.closest(".ycoPromptComposer_chip");
      if (chip) { input.value = chip.textContent.trim(); sync(); input.focus(); }
    });
    sync();
    if (s.state === "focus") input.focus({ preventScroll: true });
  }

  YCO.page({
    id: "prompt-composer",
    group: "Forms",
    title: "Prompt composer",
    figma: "15742:21196",
    needs: [],
    statesCss: "components/prompt-composer.states.css",
    intro: "A message box for an AI chat: a growing text field, a send button that wakes up with the first character, an Add Media chip, an optional row of attachments and a row of preset options. It comes as a one-line pill, a chat-room box and a larger Home box.",
    controls: [
      { key: "layout", label: "Layout", type: "chips", options: [{ value: "oneline", label: "Oneline" }, { value: "chatroom", label: "Chatroom" }, { value: "home", label: "Home" }], default: "chatroom" },
      { key: "state", label: "State", type: "chips", options: ["default", "focus", "filled"], default: "default" },
      { key: "media", label: "Attachments (photo)", type: "toggle", default: false, when: (s) => s.layout === "chatroom" },
      { key: "presetOptions", label: "Preset options", type: "toggle", default: true, when: (s) => s.layout !== "oneline" },
      { key: "showScrollbar", label: "Show scrollbar", type: "toggle", default: false, when: (s) => s.layout === "chatroom" && s.media },
      { key: "showGradientMask", label: "Show gradient mask", type: "toggle", default: false, when: (s) => s.layout === "chatroom" && s.media },
    ],
    surface: { wide: true },
    render: markup,
    mount,
    react: (s) => {
      const p = [`  layout="${s.layout}"`];
      if (s.layout === "chatroom" && s.media) p.push("  attachments={files}\n  onRemoveAttachment={(file) => {}}");
      if (s.layout !== "oneline" && !s.presetOptions) p.push("  presetOptions={false}");
      else if (s.layout !== "oneline") p.push("  presetOptions={[{ label: 'Label' }]}");
      if (s.media && s.showScrollbar) p.push("  showScrollbar");
      if (s.media && s.showGradientMask) p.push("  showGradientMask");
      p.push('  placeholder="Placeholder"');
      p.push('  disclaimer="Disclaimer text"');
      p.push("  onSend={(text) => {}}");
      return `// Proposed API: yce-frontend has no PromptComposer yet (src/components/common/ui/prompt-field is the closest existing piece)\nimport PromptComposer from '@/components/common/prompt-composer';\n\n<PromptComposer\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "Figma's two properties (Property 1: focusX, filledX, photo, photo+filled, Default, focus, filled; Property 2: oneline, chatroom, Home) are combined here into Layout, State and Attachments. Figma only draws eight of the combinations; the others work but are not designed (Home focus / filled, oneline default).",
      "The Figma 'photo' variant has no unfocused version: it is drawn with the caret and placeholder, so Attachments + Default renders as in Figma's photo.",
      "Figma's chatroom filled variant keeps the send button grey; here the button is dark whenever there is text, as in the oneline filledX variant. The designer should confirm.",
      "Placeholder copy, 'Add Media' and 'Label' are the Figma strings; the disclaimer is replaced by 'Disclaimer text' and the attachment photos by neutral image placeholders (no Figma asset URLs).",
      "The 6px frame padding, the 20 / 24 / 26px radii and the 12px attachment radius have no token and are written in rem; micro text (12px / 16px) has no token either.",
      "The gradient mask is a left-edge mask-image fade instead of Figma's raw light-grey gradient, so it works on any background; the scrollbar option shows the browser's thin scrollbar.",
      "The caret in the variant grid is drawn for display only; the live preview uses the real caret (--text-brand) and the real focus, and State = Focus focuses the field.",
      "Figma's chatroom Default has no border and Focus / Filled add a 1px --stroke-strong border; here the border is always 1px (transparent until focused or filled) so the box does not jump.",
      "Figma's Home text area is a fixed 48px high, bottom-aligned; the field here grows with its content up to nine rem.",
    ],
  });
})();
