/* Tabs · Figma 4157:46485. Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoTabs";
  const ICON = `<svg class="${P}_icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>`;

  const tab = (o) => `<button class="${P}_tab${o.selected ? ` ${P}_tab_selected` : ""}${o.sc || ""}" type="button" role="tab" id="${o.id}" aria-selected="${!!o.selected}" tabindex="${o.selected ? 0 : -1}"${o.disabled ? " disabled" : ""}>${o.icon ? ICON : ""}<span>Label</span>${o.badge ? `<span class="${P}_badge">8</span>` : ""}</button>`;

  function tabs(s, ctx) {
    const n = Number(s.count);
    const list = Array.from({ length: n }, (_, i) => tab({
      id: `tabs-${i + 1}`,
      selected: i === 0,
      icon: s.type === "icons",
      badge: s.badge,
      disabled: s.disabledTab && i === n - 1,
    }));
    const row = `<div class="${P} ${P}_size_${s.size}${s.overflow ? ` ${P}_scroll` : ""}" role="tablist" aria-label="Tabs">
  ${list.join("\n  ")}
</div>`;
    // Doc-only wrapper: a 320px container so the row has to overflow. The copied HTML is just the row.
    return s.overflow && ctx.preview ? `<div style="width:20rem;max-width:100%">${row}</div>` : row;
  }

  // Pointer drag scrolls a row that overflows (touch scrolls natively).
  function dragScroll(list) {
    let x0 = 0, left0 = 0, down = false, moved = false;
    list.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") return; down = true; moved = false; x0 = e.clientX; left0 = list.scrollLeft; });
    window.addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moved = true; list.scrollLeft = left0 - dx; });
    window.addEventListener("pointerup", () => { down = false; });
    list.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  }

  // Arrow keys / Home / End move and select; clicks select. Disabled tabs are skipped.
  function mount(el) {
    el.querySelectorAll(`.${P}_scroll`).forEach(dragScroll);
    el.querySelectorAll('[role="tablist"]').forEach((list) => {
      const items = () => [...list.querySelectorAll('[role="tab"]')];
      const select = (t) => {
        items().forEach((b) => { const on = b === t; b.classList.toggle(`${P}_tab_selected`, on); b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
        t.focus();
      };
      list.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t && !t.disabled) select(t); });
      list.addEventListener("keydown", (e) => {
        const enabled = items().filter((b) => !b.disabled);
        const i = enabled.indexOf(document.activeElement);
        if (i < 0) return;
        let next;
        if (e.key === "ArrowRight") next = enabled[(i + 1) % enabled.length];
        else if (e.key === "ArrowLeft") next = enabled[(i - 1 + enabled.length) % enabled.length];
        else if (e.key === "Home") next = enabled[0];
        else if (e.key === "End") next = enabled[enabled.length - 1];
        if (next) { e.preventDefault(); select(next); }
      });
    });
  }

  const variants = [];
  ["text", "icons"].forEach((type) => ["large", "small"].forEach((size) => {
    variants.push({ label: `Tabs / ${YCO.label(type)} / ${YCO.label(size)}`, html: tabs({ type, size, count: 4, badge: false, disabledTab: false }), wide: true });
  }));
  ["large", "small"].forEach((size) => [false, true].forEach((selected) => ["default", "hover", "press", "focus", "disabled"].forEach((state) => {
    variants.push({ label: `Tab item / ${selected ? "Selected" : "Unselected"} / ${YCO.label(state)} / ${YCO.label(size)}`, html: `<div class="${P} ${P}_size_${size}" style="width:auto;box-shadow:none">${tab({ id: "x", selected, sc: YCO.stateClass(state), disabled: state === "disabled" })}</div>` });
  })));
  variants.push({ label: "Narrow container: the row scrolls", html: `<div style="width:20rem;max-width:100%">${tabs({ type: "text", size: "large", count: 5, badge: false, disabledTab: false, overflow: true }, {})}</div>`, wide: true });
  variants.push({ label: "Tab item / With icon and badge", html: `<div class="${P} ${P}_size_large" style="width:auto;box-shadow:none">${tab({ id: "y", selected: true, icon: true, badge: true })}</div>` });

  YCO.page({
    id: "tabs",
    group: "Navigation",
    title: "Tabs",
    figma: "4157:46485",
    statesCss: "components/tabs.states.css",
    intro: "A row of tabs that switches between views. The selected tab is underlined in brand colour. Click a tab or use the arrow keys, Home and End to change the selection; items can carry an icon and a count.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: ["text", "icons"], default: "text" },
      { key: "size", label: "Size", type: "chips", options: ["large", "small"], default: "large" },
      { key: "count", label: "Tabs", type: "chips", options: ["3", "4", "5"], default: "4" },
      { key: "badge", label: "Badge count", type: "toggle", default: false },
      { key: "disabledTab", label: "Last tab disabled", type: "toggle", default: false },
      { key: "overflow", label: "Narrow container: row scrolls", type: "toggle", default: false },
    ],
    surface: { wide: true },
    render: tabs,
    mount,
    react: (s) => `import Tabs from '@/components/common/tab-control/tabs';\n\n// props from src/components/common/tab-control/tabs/index.js\n<Tabs\n  tabs={[{ key: 'one', label: 'Label' }, { key: 'two', label: 'Label' }]}\n  currentTab={currentTab}\n  handleTabClick={(tab) => setCurrentTab(tab.key)}\n  withIndicator\n/>\n// Not exposed by yce-frontend yet: size="${s.size}", icon, badge count, disabled tab.`,
    variants,
    notes: [
      "The selected indicator sits over a 4px track (--stroke-weak) along the whole row, as Figma's Container border.",
      "Figma's Small, Unselected, Disabled tab item still uses the 16px label; this page uses 14px for every Small state.",
      "Figma wraps tabs onto further rows when they do not fit (flex-wrap); the wrapped rows are 48px tall there, here they stay 42px.",
      "Narrow container: when the tabs do not fit, collab-space's Gallery Tabs (approved in Storybook, its Overflowing story) keeps one row and lets it scroll by dragging, instead of wrapping as Figma does. The Overflow switch shows that in a 320px container.",
      "yce-frontend's Tabs animates an indicator over a drag-scroll row and takes no size, icon or badge props; confirm these are wanted.",
    ],
  });
})();
