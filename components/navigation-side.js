/* Navigation side · Figma 5635:96897. Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoNavigationSide";
  const ICONS = {
    home: '<path d="M4 11 12 4l8 7v9H4z"/>',
    agent: '<rect x="4" y="6" width="16" height="12" rx="3"/><path d="M9 11v2M15 11v2M12 3v3"/>',
    photo: '<path d="m4 20 10-10M12 6l4 4"/><path d="M18 3v4M16 5h4"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M8 15v4"/>',
    video: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="m4 8 3-4h4L8 8"/>',
    image: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m4 16 5-5 4 4 2-2 5 5"/>',
    portrait: '<circle cx="10" cy="8" r="4"/><path d="M3 20c0-3 3-5 7-5M18 14v6M15 17h6"/>',
    layers: '<path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/>',
    play: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    api: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10v4M7 12h2M12 10v4M12 14M16 10h-1v4h1"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    wand: '<path d="m4 20 10-10M12 6l4 4"/><path d="M18 3v4M16 5h4M20 12v3M18.5 13.5h3"/>',
    diamond: '<path d="M12 3 21 12l-9 9-9-9 9-9Z"/>',
  };
  const svg = (n, cls = "") => `<svg class="${P}_icon${cls ? ` ${P}_icon_${cls}` : ""}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

  // Placeholder menu: names are generic, icons stand in for the Figma set.
  const MENU = [
    { icon: "home", label: "Label" },
    { icon: "agent", label: "Label", badge: true },
    { icon: "photo", label: "Label" },
    { icon: "sliders", label: "Label" },
    { icon: "video", label: "Label" },
    { icon: "image", label: "Label" },
    { icon: "portrait", label: "Label" },
    { icon: "layers", label: "Label" },
    { icon: "image", label: "Label" },
  ];
  const TEMPLATES = [{ icon: "play", label: "Label" }, { icon: "image", label: "Label" }];
  const LINKS = [{ icon: "api", label: "Label", external: true }, { icon: "diamond", label: "Label", external: true }];

  const NEW = `<span class="${P}_new">NEW</span>`;
  function listItem(it, sel, o = {}) {
    return `<li><a class="${P}_item${o.sc || ""}" href="#"${sel ? ' aria-current="page"' : ""}${o.disabled ? ' aria-disabled="true"' : ""}>${svg(it.icon)}<span class="${P}_label">${it.label}</span>${it.badge && o.badge !== false ? NEW : ""}${it.external && o.external !== false ? svg("external", "small") : ""}${o.more ? `<button class="${P}_more" type="button" aria-label="More">${svg("more")}</button>` : ""}</a></li>`;
  }
  function railItem(it, sel, o = {}) {
    return `<li><a class="${P}_railItem${o.sc || ""}" href="#"${sel ? ' aria-current="page"' : ""}${o.disabled ? ' aria-disabled="true"' : ""}><span class="${P}_railIcon">${svg(it.icon)}</span><span>${it.label}</span>${it.badge && o.badge !== false ? NEW : ""}</a></li>`;
  }

  function sidebar(s, ctx) {
    const rail = s.layout === "rail" || s.layout === "tool";
    const width = rail ? "rail" : s.layout === "medium" ? "medium" : "wide";
    const render = rail ? railItem : listItem;
    const o = { badge: s.badge, external: s.external, more: s.more, sc: "" };
    const list = (items, firstSel) => `<ul class="${P}_list">\n      ${items.map((it, i) => render(it, firstSel === i, o)).join("\n      ")}\n    </ul>`;
    const btn = s.layout === "tool" || !s.button ? "" : rail
      ? `<button class="${P}_button ${P}_button_icon" type="button" aria-label="Start editing">${svg("wand")}</button>`
      : `<button class="${P}_button" type="button">${svg("wand")}<span>Start Editing</span></button>`;
    const links = rail ? "" : `\n    <hr class="${P}_divider" />\n    ${list(LINKS, -1)}`;
    const tmpl = rail && s.layout === "tool" ? "" : `\n    <hr class="${P}_divider" />\n    ${list(TEMPLATES, -1)}`;
    const side = `<nav class="${P} ${P}_width_${width}" aria-label="Side navigation">
    ${btn}
    ${list(MENU, s.layout === "tool" ? 2 : 1)}${tmpl}${links}
  </nav>`;
    if (!s.flyout || s.flyout === "none") return side;
    return `<div style="display:flex;align-items:flex-start;width:max-content">${side}${flyout(s.flyout)}</div>`;
  }

  const FLYOUT = { photo: [3, 2, 2, 3], basic: [4, 3], video: [3, 3], portrait: [4, 4, 2], genai: [3, 3] };
  function flyout(kind) {
    const secs = FLYOUT[kind] || FLYOUT.photo;
    return `<div class="${P}_flyout" role="region" aria-label="Side menu">
    <h2 class="${P}_flyoutTitle">Heading</h2>
    ${secs.map((n, si) => `<section class="${P}_section">
      <h3 class="${P}_sectionTitle">Section</h3>
      <div class="${P}_tiles">
        ${Array.from({ length: n }, (_, i) => `<button class="${P}_tile" type="button"><span class="${P}_thumb">${si === 0 && i === 0 ? `<span class="${P}_hot">HOT</span>` : ""}</span><span>Label</span></button>`).join("\n        ")}
      </div>
    </section>`).join("\n    ")}
  </div>`;
  }

  // Keyboard and click behaviour: select an item, Up / Down move between items.
  function mount(el) {
    const nav = el.querySelector(`.${P}`);
    if (!nav) return;
    const items = () => [...nav.querySelectorAll(`.${P}_item, .${P}_railItem`)].filter((a) => a.getAttribute("aria-disabled") !== "true");
    nav.addEventListener("click", (e) => {
      const a = e.target.closest(`.${P}_item, .${P}_railItem`);
      if (!a || e.target.closest(`.${P}_more`)) return;
      e.preventDefault();
      if (a.getAttribute("aria-disabled") === "true") return;
      items().forEach((x) => (x === a ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current")));
    });
    nav.addEventListener("keydown", (e) => {
      const list = items();
      const i = list.indexOf(document.activeElement);
      if (i < 0) return;
      const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (d) { e.preventDefault(); list[(i + d + list.length) % list.length].focus(); }
    });
  }

  // ----- Variants -----
  const variants = [];
  [["wide", "Desktop (300)"], ["medium", "992 (240)"], ["rail", "769 (112, icon rail)"], ["wide", "Mobile (300)"], ["tool", "Tool page (112)"]].forEach(([layout, label]) => {
    variants.push({ label: `Navigation side / ${label}`, html: `<div style="min-height:34rem">${sidebar({ layout, button: true, badge: true, external: true, more: false, flyout: "none" })}</div>` });
  });
  ["photo", "basic", "video", "portrait", "genai"].forEach((f) => {
    variants.push({ label: `Side menu / ${f === "genai" ? "Gen AI" : YCO.label(f)}`, html: flyout(f) });
  });
  const stateRows = [["default", false], ["hover", false], ["press", false], ["default", true], ["hover", true], ["press", true], ["disabled", false]];
  const lbl = (state, sel) => `${sel ? "Active" : "Default"} / ${YCO.label(state)}`.replace("Active / Default", "Active").replace("Default / Default", "Default");
  stateRows.forEach(([state, sel]) => {
    const it = { icon: "home", label: "Label" };
    variants.push({ label: `Menu list / List / ${lbl(state, sel)}`, html: `<ul class="${P}_list" style="width:14.6875rem">${listItem(it, sel, { sc: YCO.stateClass(state), disabled: state === "disabled" })}</ul>` });
  });
  stateRows.forEach(([state, sel]) => {
    const it = { icon: "home", label: "Menu Title" };
    variants.push({ label: `Menu list / Icon / ${lbl(state, sel)}`, html: `<ul class="${P}_list">${railItem(it, sel, { sc: YCO.stateClass(state), disabled: state === "disabled" })}</ul>` });
  });
  variants.push({ label: "Menu list / List / With NEW badge, external mark, more", html: `<ul class="${P}_list" style="width:14.6875rem">${listItem({ icon: "home", label: "Label", badge: true, external: true }, false, { more: true })}</ul>` });
  variants.push({ label: "Menu list / Icon / With NEW badge", html: `<ul class="${P}_list">${railItem({ icon: "home", label: "Menu Title", badge: true }, false)}</ul>` });

  const row = (sel, state) => `<button class="${P}_row${YCO.stateClass(state)}" type="button"${sel ? ' aria-current="page"' : ""}>${svg("diamond")}<span>Label</span></button>`;
  const W = (h) => `<div style="width:20rem">${h}</div>`;
  [["Default", row(false, "default")], ["Hover", row(false, "hover")], ["Press", row(false, "press")], ["Selected", row(true, "default")], ["Focus", row(false, "focus")]].forEach(([n, h]) => variants.push({ label: `Side item / ${n}`, html: W(h) }));
  variants.push(
    { label: "Side item / Header", html: W(`<div class="${P}_header">Header</div>`) },
    { label: "Side item / Divider", html: W(`<hr class="${P}_rule" />`) },
    { label: "Side item / Divider full", html: W(`<hr class="${P}_rule ${P}_rule_full" />`) },
    { label: "Side item / Slot", html: W(`<div class="${P}_slot">Swap with another component</div>`) },
    { label: "Side item / Photo", html: W(`<div class="${P}_card ${P}_card_photo"><div class="${P}_cardImage"></div><div class="${P}_cardCaption">Caption</div></div>`) },
    { label: "Side item / Alert", html: W(`<div class="${P}_card"><p class="${P}_cardTitle">Heading</p><p class="${P}_cardText">Lorem ipsum dolor sit amet, consec tetur adipiscing elit.</p></div>`) },
    { label: "Side item / Card", html: W(`<div class="${P}_card ${P}_card_icon"><span class="${P}_circle">${svg("diamond")}</span><span class="${P}_cardTitle">Heading</span></div>`) },
    { label: "Side item / Blue icon card", html: W(`<div class="${P}_card ${P}_card_brand">${svg("diamond", "large")}<span class="${P}_cardTitle">Heading</span></div>`) },
    { label: "Side item / Button", html: W(`<div style="padding:.75rem 1.5rem"><button class="${P}_button" type="button">Label</button></div>`) },
    { label: "Side item / Search", html: W(`<div class="${P}_search">${svg("search")}<span>Search</span></div>`) },
    { label: "Side item / Avatar", html: W(`<div class="${P}_user"><span class="${P}_avatar"></span><span class="${P}_userText"><span>Name</span><span class="${P}_cardText">name@example.com</span></span><button class="${P}_more" type="button" aria-label="More">${svg("more")}</button></div>`) },
  );

  YCO.page({
    id: "navigation-side",
    group: "Navigation",
    title: "Navigation side",
    figma: "5635:96897",
    statesCss: "components/navigation-side.states.css",
    intro: "The editor's side navigation: a primary button, the main menu, templates and external links. It narrows to 240px, then to a 112px icon rail, and can open a side-menu flyout. Click an item to select it; Up and Down move between items.",
    controls: [
      { key: "layout", label: "Devices", type: "chips", options: [{ value: "wide", label: "Desktop (300)" }, { value: "medium", label: "992 (240)" }, { value: "rail", label: "769 (112)" }, { value: "tool", label: "Tool page (112)" }], default: "wide" },
      { key: "button", label: "Start button", type: "toggle", default: true, when: (s) => s.layout !== "tool" },
      { key: "badge", label: "NEW badge", type: "toggle", default: true },
      { key: "external", label: "External-link mark", type: "toggle", default: true, when: (s) => s.layout === "wide" || s.layout === "medium" },
      { key: "more", label: "More button", type: "toggle", default: false, when: (s) => s.layout === "wide" || s.layout === "medium" },
      { key: "flyout", label: "Side menu", type: "chips", options: [{ value: "none", label: "None" }, "photo", { value: "basic", label: "Basic editing" }, "video", "portrait", { value: "genai", label: "Gen AI" }], default: "none" },
    ],
    surface: { wide: true, start: true, minHeight: 560 },
    render: (s, ctx) => {
      const out = sidebar(s, ctx);
      return ctx.preview ? `<div style="width:100%;overflow-x:auto">${out}</div>` : out;
    },
    mount,
    react: (s) => `// Proposed API: yce-frontend has no NavigationSide yet\nimport NavigationSide from '@/components/common/navigation-side';\n\n<NavigationSide\n  layout="${s.layout}"\n  items={menuItems}        // { icon, label, href, badge?, external? }\n  activeKey={activeKey}\n${s.button && s.layout !== "tool" ? "  action={{ label: 'Start Editing', onClick }}\n" : ""}${s.flyout !== "none" ? `  flyout="${s.flyout}"\n` : ""}/>`,
    variants,
    notes: [
      "The NEW badge is pink (fill/badge) in Figma; there is no such token, so --fill-error-strong is used.",
      "Figma's Desktop and Mobile sidebars (300) and its 992 sidebar differ only in width and padding; Mobile is shown with the Desktop markup. The Mobile drawer with Navigation_tool_mobile_New (pricing / download / logout) is not covered here.",
      "Menu icons are generic placeholder glyphs and labels are 'Label'. Flyout thumbnails are plain tiles, not the product photos; flyout section counts follow the Figma frames loosely.",
      "The older 'Navigation side item' rows (320px) were read from the Figma screenshot only: left bar, fills and spacing are approximated from tokens. Designer to confirm whether they are still used.",
      "Press / Hover on the 12px rail label and the 'More' button have no Figma state; the More button only gets a hover fill.",
      "The preview scrolls sideways when the flyout is open beside the sidebar in a narrow pane.",
    ],
  });
})();
