/* Dropdown menu · Figma 3834:44802 (menu 3834:49709, list 5967:27085, list item 3557:142467). Config reference: COMPONENT-PAGES.md */
(() => {
  const svg = (cls, body) => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  const DIAMOND = '<path d="M12.7 3.7l7.6 7.6a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0l-7.6-7.6a1 1 0 0 1 0-1.4l7.6-7.6a1 1 0 0 1 1.4 0Z"/>';
  const ICON = svg("ycoDropdownMenu_itemIcon", DIAMOND);
  const CHEVRON = svg("ycoDropdownMenu_chevron", '<path d="m6 9 6 6 6-6"/>');
  const DOTS = svg("ycoDropdownMenu_triggerGlyph", '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>');
  const PERSON = '<svg class="ycoDropdownMenu_avatarGlyph" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5"/></svg>';
  const CHECK = svg("ycoDropdownMenu_checkGlyph", '<path d="m5 12.5 4.5 4.5L19 7.5"/>');

  const TRIGGERS = [{ value: "button", label: "Button" }, { value: "icon", label: "Button icon" }, { value: "avatar", label: "Avatar" }, { value: "nav", label: "Avatar side navigation" }];
  const ALIGNS = [{ value: "bottom_left", label: "Bottom left" }, { value: "bottom_right", label: "Bottom right" }, { value: "top_left", label: "Top left" }, { value: "top_right", label: "Top right" }];
  const cx = (...a) => a.filter(Boolean).join(" ");
  const avatar = (small) => `<span class="${cx("ycoDropdownMenu_avatar", small && "ycoDropdownMenu_avatar_small")}" role="img" aria-label="Avatar">${PERSON}</span>`;

  /* ---------- list items ---------- */
  function item(o) {
    const size = o.size || "small";
    const sc = o.sc || "";
    const cls = cx("ycoDropdownMenu_item", `ycoDropdownMenu_item_size_${size}`, o.selected && !o.checkbox && !o.toggle && "ycoDropdownMenu_item_selected", o.checkbox && o.selected && "ycoDropdownMenu_item_checked", sc.trim());
    const attrs = [];
    if (o.checkbox || o.toggle) attrs.push(`role="menuitemcheckbox"`, `aria-checked="${o.selected ? "true" : "false"}"`);
    else { attrs.push(`role="menuitem"`); if (o.selected) attrs.push('aria-current="true"'); }
    if (o.disabled) attrs.push('aria-disabled="true"');
    const open = `<button class="${cls}" type="button" ${attrs.join(" ")} tabindex="-1">`;
    if (o.checkbox) return `${open}\n    <span class="ycoDropdownMenu_itemContent"><span class="ycoDropdownMenu_check">${CHECK}</span><span class="ycoDropdownMenu_checkLabel">Label</span></span>\n  </button>`;
    if (o.avatar) return `${open}\n    <span class="ycoDropdownMenu_itemContent"><span class="ycoDropdownMenu_itemAvatar">${avatar(false)}<span class="ycoDropdownMenu_name"><span class="ycoDropdownMenu_nameMain">Name</span><span class="ycoDropdownMenu_nameMeta">name@example.com</span></span></span></span>\n  </button>`;
    const text = `<span class="ycoDropdownMenu_itemText"><span class="ycoDropdownMenu_itemLabel">Label</span>${o.secondary ? '<span class="ycoDropdownMenu_itemSecondary">Secondary text</span>' : ""}</span>`;
    const parts = [o.icon === false ? "" : ICON, text, o.toggle ? '<span class="ycoDropdownMenu_switch" aria-hidden="true"><span class="ycoDropdownMenu_switchKnob"></span></span>' : "", o.badge ? `<span class="ycoDropdownMenu_badge">${svg("ycoDropdownMenu_badgeGlyph", DIAMOND)}Label</span>` : "", o.count ? '<span class="ycoDropdownMenu_badge">8</span>' : ""].filter(Boolean);
    return `${open}\n    <span class="ycoDropdownMenu_itemContent">${parts.join("")}</span>\n  </button>`;
  }
  const heading = () => '<div class="ycoDropdownMenu_heading" role="presentation">Heading</div>';
  const divider = () => '<div class="ycoDropdownMenu_divider" role="separator"><span class="ycoDropdownMenu_dividerLine"></span></div>';

  /* ---------- trigger ---------- */
  function trigger(s, uid, open) {
    const aria = `type="button" id="${uid}-trigger" aria-haspopup="menu" aria-expanded="${open ? "true" : "false"}" aria-controls="${uid}-menu"`;
    const size = s.size;
    if (s.trigger === "icon") return `<button class="ycoDropdownMenu_trigger ycoDropdownMenu_trigger_icon ycoDropdownMenu_size_${size}" ${aria} aria-label="Menu">${DOTS}</button>`;
    if (s.trigger === "avatar") return `<button class="ycoDropdownMenu_trigger ycoDropdownMenu_trigger_avatar ycoDropdownMenu_size_${size}" ${aria}>\n    <span class="ycoDropdownMenu_triggerBody">${avatar(size === "small")}<span class="ycoDropdownMenu_name"><span class="ycoDropdownMenu_nameMain">Name</span></span></span>\n    ${CHEVRON}\n  </button>`;
    if (s.trigger === "nav") return `<button class="ycoDropdownMenu_trigger ycoDropdownMenu_trigger_nav ycoDropdownMenu_size_${size}" ${aria}>\n    <span class="ycoDropdownMenu_triggerBody">${avatar(size === "small")}<span class="ycoDropdownMenu_name"><span class="ycoDropdownMenu_nameMain">Name</span>${size === "medium" ? '<span class="ycoDropdownMenu_nameMeta">name@example.com</span>' : ""}</span></span>\n    ${DOTS}\n  </button>`;
    return `<button class="ycoButton tone_brand variant_secondary size_${size}" ${aria}>\n    <span class="label">Label</span>\n    ${CHEVRON}\n  </button>`;
  }

  /* ---------- list ---------- */
  function listHtml(s, uid, open) {
    const size = s.itemSize;
    const o = { size };
    const rows = [];
    if (s.header) rows.push(item({ ...o, avatar: true }), divider());
    if (s.heading) rows.push(heading());
    rows.push(item({ ...o, icon: s.icons, secondary: s.secondary }));
    rows.push(item({ ...o, icon: s.icons, badge: s.badge, selected: s.selected }));
    rows.push(item({ ...o, icon: s.icons, count: s.count }));
    rows.push(item({ ...o, icon: s.icons, toggle: s.toggle }));
    rows.push(item({ ...o, icon: s.icons, disabled: s.disabled }));
    if (s.checkboxes) rows.push(divider(), item({ ...o, checkbox: true, selected: true }), item({ ...o, checkbox: true }));
    return `<div class="ycoDropdownMenu_list ycoDropdownMenu_list_${s.align}" role="menu" id="${uid}-menu" aria-labelledby="${uid}-trigger"${open ? "" : " hidden"}>\n  ${rows.join("\n  ")}\n</div>`;
  }

  const defaults = { trigger: "button", size: "medium", align: "bottom_left", open: true, itemSize: "small", header: true, heading: false, icons: true, secondary: false, badge: false, count: false, toggle: false, selected: false, disabled: false, checkboxes: false };
  const menu = (s, uid) => {
    const o = { ...defaults, ...s };
    return `<div class="ycoDropdownMenu">\n  ${trigger(o, uid, o.open)}\n  ${listHtml(o, uid, o.open)}\n</div>`;
  };

  const stage = (s, html, extra = "") => {
    const [v, h] = s.align.split("_");
    return `<div class="ycoDropdownMenu_stage ycoDropdownMenu_stage_${h === "right" ? "right" : "leftx"} ${v === "top" ? "ycoDropdownMenu_stage_top" : ""} ${extra}">${html}</div>`;
  };

  let off = null;
  const label = YCO.label;
  const STATES = ["default", "hover", "press", "focus", "selected"];

  /* a column of one list item type across the five states */
  const column = (title, mk) => `<div class="ycoDropdownMenu_itemsCol" aria-label="${title}">${STATES.map((st) => mk(st)).join("")}</div>`;
  const stateItem = (st, o) => item({ ...o, selected: st === "selected", sc: YCO.stateClass(st) });
  const itemsCell = (cols) => `<div class="ycoDropdownMenu_itemsDemo">${cols.join("")}</div>`;

  YCO.page({
    id: "dropdown-menu",
    group: "Surfaces",
    title: "Dropdown menu",
    figma: "3834:44802",
    needs: ["button"],
    statesCss: "components/dropdown-menu.states.css",
    intro: "A trigger that opens a 280 wide list of actions. Triggers: a Button, an icon button, an avatar, or the side-navigation avatar row. The list holds items (default, secondary text, checkbox, avatar), headings and dividers, each with hover, press, focus and selected states; it opens below or above, aligned left or right.",
    controls: [
      { key: "trigger", label: "Trigger", type: "chips", options: TRIGGERS, default: "button" },
      { key: "size", label: "Trigger size", type: "chips", options: ["medium", "small"], default: "medium" },
      { key: "align", label: "Align", type: "chips", options: ALIGNS, default: "bottom_left" },
      { key: "open", label: "Open", type: "toggle", default: true },
      { key: "itemSize", label: "Item size", type: "chips", options: ["small", "tiny"], default: "small" },
      { key: "header", label: "Avatar item + divider", type: "toggle", default: true },
      { key: "heading", label: "Heading row", type: "toggle", default: false },
      { key: "icons", label: "Item icons", type: "toggle", default: true },
      { key: "secondary", label: "Secondary text (item 1)", type: "toggle", default: false },
      { key: "badge", label: "Badge (item 2)", type: "toggle", default: false },
      { key: "count", label: "Badge count (item 3)", type: "toggle", default: false },
      { key: "toggle", label: "Toggle (item 4)", type: "toggle", default: false },
      { key: "selected", label: "Selected (item 2)", type: "toggle", default: false },
      { key: "disabled", label: "Disabled (item 5)", type: "toggle", default: false },
      { key: "checkboxes", label: "Checkbox items", type: "toggle", default: false },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? stage(s, menu(s, "ddm"), "ycoDropdownMenu_stage_bottom_pad") : menu(s, "ddm")),
    mount: (el) => {
      if (off) off();
      const root = el.querySelector(".ycoDropdownMenu");
      if (!root) return;
      const trig = root.querySelector("[aria-haspopup]");
      const list = root.querySelector('[role="menu"]');
      const items = () => [...list.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])')];
      const setOpen = (v, focus) => {
        list.hidden = !v;
        trig.setAttribute("aria-expanded", String(v));
        const all = items();
        if (v && focus === "first") all[0] && all[0].focus();
        if (v && focus === "last") all[all.length - 1] && all[all.length - 1].focus();
        if (!v && focus === "trigger") trig.focus();
      };
      trig.addEventListener("click", () => setOpen(list.hidden, null));
      trig.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true, e.key === "ArrowDown" ? "first" : "last"); }
      });
      list.addEventListener("keydown", (e) => {
        const all = items();
        const i = all.indexOf(document.activeElement);
        const go = (n) => { e.preventDefault(); all[(n + all.length) % all.length].focus(); };
        if (e.key === "ArrowDown") go(i + 1);
        else if (e.key === "ArrowUp") go(i < 0 ? -1 : i - 1);
        else if (e.key === "Home") go(0);
        else if (e.key === "End") go(all.length - 1);
        else if (e.key === "Escape") { e.preventDefault(); setOpen(false, "trigger"); }
        else if (e.key === "Tab") setOpen(false, null);
      });
      list.addEventListener("click", (e) => {
        const it = e.target.closest('[role^="menuitem"]');
        if (!it || it.getAttribute("aria-disabled") === "true") return;
        if (it.getAttribute("role") === "menuitemcheckbox") {
          const on = it.getAttribute("aria-checked") !== "true";
          it.setAttribute("aria-checked", String(on));
          if (it.querySelector(".ycoDropdownMenu_check")) it.classList.toggle("ycoDropdownMenu_item_checked", on);
          return;
        }
        list.querySelectorAll('[role="menuitem"]').forEach((x) => { x.classList.remove("ycoDropdownMenu_item_selected"); x.removeAttribute("aria-current"); });
        it.classList.add("ycoDropdownMenu_item_selected");
        it.setAttribute("aria-current", "true");
        setOpen(false, "trigger");
      });
      // Only clicks on the preview surface count as "outside"; the control pane must not close the menu.
      const outside = (e) => { if (!root.isConnected) return off && off(); if (!list.hidden && e.target.isConnected && el.contains(e.target) && !root.contains(e.target)) setOpen(false, null); };
      document.addEventListener("click", outside);
      off = () => { document.removeEventListener("click", outside); off = null; };
    },
    react: (s) => {
      const p = [];
      p.push(`  trigger="${s.trigger}"`);
      if (s.size !== "medium") p.push(`  size="${s.size}"`);
      if (s.align !== "bottom_left") p.push(`  align="${s.align.replace("_", "-")}"`);
      const rows = [];
      if (s.header) rows.push("    { type: 'avatar', label: 'Name', secondary: 'name@example.com' },", "    { type: 'divider' },");
      if (s.heading) rows.push("    { type: 'heading', label: 'Heading' },");
      rows.push(`    { label: 'Label'${s.secondary ? ", secondary: 'Secondary text'" : ""} },`);
      rows.push(`    { label: 'Label'${s.badge ? ", badge: 'Label'" : ""}${s.selected ? ", selected: true" : ""} },`);
      rows.push(`    { label: 'Label'${s.count ? ", count: 8" : ""} },`);
      rows.push(`    { label: 'Label'${s.toggle ? ", toggle: true" : ""} },`);
      rows.push(`    { label: 'Label'${s.disabled ? ", disabled: true" : ""} },`);
      if (s.checkboxes) rows.push("    { type: 'divider' },", "    { type: 'checkbox', label: 'Label', checked: true },", "    { type: 'checkbox', label: 'Label' },");
      return `// Proposed API: yce-frontend has no DropdownMenu yet\nimport DropdownMenu from '@/components/common/dropdown-menu';\n\n<DropdownMenu\n${p.join("\n")}\n  itemSize="${s.itemSize}"\n  onSelect={(item) => {}}\n  items={[\n${rows.join("\n")}\n  ]}\n/>`;
    },
    variants: () => {
      const v = [];
      const closed = (trigger, size, align = "bottom_left") => menu({ trigger, size, align, open: false }, `c-${trigger}-${size}`);
      // Triggers, closed
      TRIGGERS.forEach(({ value, label: tl }) => ["medium", "small"].forEach((size) => {
        v.push({ label: `Trigger: ${tl} / ${label(size)} / Closed`, wide: value === "nav", html: `<div class="ycoDropdownMenu_stage ycoDropdownMenu_stage_tight">${closed(value, size)}</div>` });
      }));
      // Open menus
      ALIGNS.forEach(({ value, label: al }) => {
        const s = { trigger: "button", size: "medium", align: value, open: true };
        v.push({ label: `Trigger: Button / Medium / Open / ${al}`, wide: true, html: stage(s, menu(s, `o-${value}`), "ycoDropdownMenu_stage_bottom_pad") });
      });
      [["icon", "medium"], ["avatar", "small"], ["nav", "medium"]].forEach(([t, size]) => {
        const s = { trigger: t, size, align: "bottom_left", open: true };
        v.push({ label: `Trigger: ${TRIGGERS.find((x) => x.value === t).label} / ${label(size)} / Open / Bottom left`, wide: true, html: stage(s, menu(s, `o-${t}`), "ycoDropdownMenu_stage_bottom_pad") });
      });
      // List items, states default / hover / press / focus / selected
      v.push({ label: "List item: Default / Small and Tiny (default, hover, press, focus, selected)", wide: true, html: itemsCell([column("Small", (st) => stateItem(st, { size: "small" })), column("Tiny", (st) => stateItem(st, { size: "tiny" }))]) });
      v.push({ label: "List item: Secondary text / Small (default, hover, press, focus, selected)", wide: true, html: itemsCell([column("Secondary text", (st) => stateItem(st, { size: "small", secondary: true }))]) });
      v.push({ label: "List item: Checkbox / Small (default, hover, press, focus, selected)", wide: true, html: itemsCell([column("Checkbox", (st) => item({ size: "small", checkbox: true, selected: st === "selected", sc: YCO.stateClass(st) }))]) });
      v.push({ label: "List item: Avatar / Small (default, hover, press, focus, selected) and Tiny (default)", wide: true, html: itemsCell([column("Avatar small", (st) => stateItem(st, { size: "small", avatar: true })), `<div class="ycoDropdownMenu_itemsCol">${item({ size: "tiny", avatar: true })}</div>`]) });
      v.push({ label: "List item: with toggle, badge, badge count / Small and Tiny", wide: true, html: itemsCell([`<div class="ycoDropdownMenu_itemsCol">${item({ size: "small", toggle: true })}${item({ size: "small", badge: true })}${item({ size: "small", count: true })}</div>`, `<div class="ycoDropdownMenu_itemsCol">${item({ size: "tiny", toggle: true })}${item({ size: "tiny", badge: true })}${item({ size: "tiny", count: true })}</div>`]) });
      v.push({ label: "List item: Heading and Divider / Small", wide: true, html: itemsCell([`<div class="ycoDropdownMenu_itemsCol">${heading()}${divider()}</div>`]) });
      return v;
    },
    notes: [
      "Variant grid draws every trigger at both sizes (closed), the Button trigger open at all four aligns, the other triggers open at Bottom left, and every list item type and state. Align and Open are controls; Figma's full 64-cell trigger matrix differs only by those two.",
      "Panel ground uses --background-raised (Figma: --background-overlay, dark theme only here). Shadow: Figma's Shadow/Overlay has no token; --shadow is the nearest and is heavier. Heading text is 12/16 (Micro) written in rem.",
      "Selected is Figma's brand-weak fill with a 4px --stroke-selected bar on the left (drawn inset so content does not shift); a checked Checkbox item keeps the fill without the bar. Focus is a 2px --stroke-focus inset frame.",
      "Disabled items (aria-disabled, --text-disabled) are not drawn in Figma; they are an addition so a menu can show an unavailable action. RD should confirm the look.",
      "The Button icon trigger's glyph is not specified in Figma (drawn as three dots, as in the side-navigation row). Avatars and badge icons are CSS placeholders; Figma's Medium trigger heights (60 / 68) are kept with min-height. Figma draws Open=True Button trigger 48 tall; it is kept at 42.",
      "Keyboard: ArrowDown / ArrowUp open and move, Home / End jump, Escape closes and returns to the trigger, Tab or an outside click closes. Choosing a default item selects it and closes; checkbox and toggle items stay open.",
    ],
  });
})();
