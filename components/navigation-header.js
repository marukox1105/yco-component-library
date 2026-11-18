/* Navigation header · Figma 6143:45465. Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoNavigationHeader";
  const DEVICES = [{ value: "desktop", label: "Desktop (1200+)" }, { value: "tablet", label: "Tablet (769-1199)" }, { value: "mobile", label: "Mobile (768-)" }];
  const USERS = [{ value: "non-login", label: "Non login" }, "free", "plus", "pro"];
  const PAGES = ["home", "product", "lobby", "feature-room"];
  const MENU_PAGES = [{ value: "home-all", label: "Home (all users)" }, { value: "home-non-login", label: "Home (non login)" }, "product", { value: "use-case", label: "Use case" }, "api"];
  const ICON = {
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    back: '<path d="m15 6-6 6 6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    wand: '<path d="m4 20 10-10M12 6l4 4"/><path d="M18 3v4M16 5h4M20 12v3M18.5 13.5h3"/>',
    download: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    home: '<path d="M4 11 12 4l8 7v9H4z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    layers: '<path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/>',
  };
  const svg = (name, cls = "") => `<svg class="${P}_icon${cls ? ` ${P}_icon_${cls.split(" ").join(` ${P}_icon_`)}` : ""}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;
  const crown = `<svg class="${P}_icon ${P}_icon_fill" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z"/></svg>`;
  const coin = `<svg class="${P}_coin" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="13" stroke="none"/><path d="M17 9.5a5.5 5.5 0 1 0 0 7" fill="none"/></svg>`;

  const MIN = { desktop: "75rem", tablet: "48rem", mobile: "23.4375rem" }; // preview only: the header shrinks with its container
  const wordmark = `<span class="${P}_wordmark">Wordmark</span>`;
  const logo = (symbolOnly) => `<a class="${P}_logo" href="#" aria-label="Home"><span class="${P}_logoMark" aria-hidden="true">Logo</span>${symbolOnly ? "" : wordmark}</a>`;
  const link = (label, icon) => `<button class="${P}_link" type="button"><span>${label}</span>${icon || ""}</button>`;

  const nav = (s) => `<nav class="${P}_nav" aria-label="Main">
      ${link("Product", svg("chevronDown"))}
      ${link("Use Case", svg("chevronDown"))}
      ${s.holiday ? "" : link("Pricing")}
      ${link("API", svg("external", "small"))}
      ${s.contest ? link("Contest") : ""}
      ${s.holiday ? `<button class="${P}_gold ${P}_pricing" type="button"><span>Pricing</span><span class="${P}_discount">30%off</span></button>` : ""}
    </nav>`;

  // Right-hand items per page and user type (Figma variants).
  function items(s) {
    const { page, user } = s;
    const gold = user === "plus" ? "upgrade" : "subscribe";
    if (page === "home") return { "non-login": ["start-sec", "login"], free: ["subscribe", "avatar"], plus: ["upgrade", "avatar"], pro: ["avatar"] }[user];
    if (page === "product") return user === "non-login" ? ["start-sec", "login"] : ["start", "avatar"];
    if (page === "lobby") return user === "non-login" ? ["download", "subscribe", "login"] : user === "pro" ? ["download", "avatar"] : ["download", gold, "avatar"];
    return user === "non-login" ? ["subscribe", "login"] : user === "pro" ? ["credit", "download", "avatar"] : ["credit", "download", gold, "avatar"];
  }

  function item(kind, s) {
    const mobile = s.device === "mobile";
    const tablet = s.device === "tablet";
    const BTN = (tone, variant) => `ycoButton tone_${tone} variant_${variant} size_small ${P}_btn`;
    switch (kind) {
      case "start-sec":
      case "start": {
        const sec = kind === "start-sec";
        if (mobile || tablet) return `<button class="${P}_iconBtn" type="button" aria-label="Start editing">${svg("wand", "large")}</button>`;
        return `<button class="${BTN(sec ? "neutral" : "brand", sec ? "secondary" : "primary")}" type="button">${svg("wand")}<span>Start Editing</span></button>`;
      }
      case "login":
        return `<button class="${BTN("brand", "primary")}" type="button"><span>${mobile || tablet ? "Sign Up" : "Log In / Sign Up"}</span></button>`;
      case "download":
        if (mobile) return `<button class="${P}_iconBtn ${P}_iconBtn_brand" type="button" aria-label="Download">${svg("download")}</button>`;
        return `<button class="${BTN("brand", "primary")}" type="button">${svg("download")}<span>Download</span></button>`;
      case "subscribe":
      case "upgrade": {
        const name = kind === "upgrade" ? "Upgrade" : "Subscribe";
        if (mobile) return `<button class="${P}_iconBtn ${P}_iconBtn_gold" type="button" aria-label="${name}">${crown}</button>`;
        return `<button class="${P}_gold" type="button">${crown}<span>${name}</span>${s.holiday && kind === "subscribe" ? `<span class="${P}_discount">30%off</span>` : ""}</button>`;
      }
      case "credit":
        return `<div class="${P}_credit">${coin}<span class="${P}_creditValue">50</span><button class="${P}_add" type="button" aria-label="Add credits">${svg("plus")}</button></div>`;
      case "avatar":
        return `<button class="${P}_avatar" type="button" aria-label="Account"><svg class="${P}_icon" style="width:1.4rem;height:1.4rem" viewBox="0 0 24 24" aria-hidden="true">${ICON.user}</svg></button>`;
      default:
        return "";
    }
  }

  const drawerPanel = (menu) => {
    const top = `<div class="${P}_drawerTop"><button class="${P}_iconBtn ${P}_iconBtn_plain" type="button" data-nh-close aria-label="Close menu">${svg("close", "large")}</button>${logo(false)}</div>`;
    if (menu === "home-all") {
      const rows = [["home", "Label", true], ["grid", "Label"], ["layers", "Label"], ["grid", "Label"], ["layers", "Label"], ["home", "Label"]];
      return `${top}<div class="${P}_drawerList">${rows.map(([i, l, sel]) => `<button class="${P}_drawerItem${sel ? ` ${P}_drawerItem_selected` : ""}" type="button"${sel ? ' aria-current="page"' : ""}>${svg(i)}<span>${l}</span></button>`).join("\n")}</div>`;
    }
    if (menu === "home-non-login") {
      return `${top}<button class="ycoButton tone_brand variant_secondary size_small ${P}_drawerCta" type="button" style="width:calc(100% - 2rem)"><span>Log in / Sign up</span></button>
${["Label", "Label", "Label"].map((l) => `<button class="${P}_drawerRow" type="button"><span>${l}</span>${svg("chevronRight")}</button>`).join("\n")}
<button class="${P}_drawerRow" type="button" style="border:0"><span>Pricing</span></button>`;
    }
    const title = { product: "Product", "use-case": "Use Case", api: "API" }[menu];
    const back = `${top}<button class="${P}_drawerBack" type="button">${svg("back", "large")}<span>${title}</span></button>`;
    if (menu === "api") {
      return `${back}<div class="${P}_drawerGroup">${["Link", "Link", "Link", "Link", "Link"].map((l) => `<button class="${P}_drawerLink" type="button">${l}</button>`).join("\n")}</div>`;
    }
    const group = (n) => `<div class="${P}_drawerGroup"><h3 class="${P}_drawerHeading">Group heading</h3>
${["Link", "Link", "Link", "Link"].map((l, i) => `<button class="${P}_drawerLink" type="button">${l}${i === 0 && n === 1 ? ` <span class="${P}_hot">HOT</span>` : ""}</button>`).join("\n")}
<button class="${P}_drawerLink" type="button" style="font-size:.75rem;text-decoration:underline">All Tools</button></div>`;
    return `${back}${group(1)}${group(2)}`;
  };

  function header(s) {
    const mobile = s.device === "mobile";
    const symbolOnly = s.device !== "desktop";
    const showNav = !mobile && s.nav;
    const showName = s.featureName && !mobile;
    return `<header class="${P} ${P}_device_${s.device}">
  <div class="${P}_left">
    ${mobile ? `<button class="${P}_iconBtn ${P}_iconBtn_plain" type="button" data-nh-menu aria-expanded="false" aria-controls="nh-drawer" aria-label="Menu">${svg("menu", "large")}</button>` : ""}
    ${logo(symbolOnly)}
    ${showNav ? nav(s) : ""}
  </div>
  ${showName ? `<div class="${P}_featureName"><span>Feature name</span>${svg("info")}</div>` : ""}
  <div class="${P}_actions">
    ${items(s).map((k) => item(k, s)).join("\n    ")}
  </div>
</header>`;
  }

  // The nav appears on Home (non login) and on the Product page, as in Figma.
  const resolve = (s) => ({ ...s, nav: s.page === "product" || (s.page === "home" && s.user === "non-login") });

  function markup(s, ctx) {
    const r = resolve(s);
    let out = header(r).replace(/\n\s*\n/g, "\n");
    if (r.device === "mobile") {
      out += `\n<div class="${P}_drawer" id="nh-drawer" role="dialog" aria-label="Menu"${s.menuOpen ? "" : " hidden"}>\n${drawerPanel(s.menuPage)}\n</div>`;
    }
    return ctx.preview ? `<div style="width:100%;overflow-x:auto"><div style="min-width:${MIN[r.device]}">${out}</div></div>` : out;
  }

  function mount(el) {
    const btn = el.querySelector("[data-nh-menu]");
    const drawer = el.querySelector("#nh-drawer");
    if (!btn || !drawer) return;
    const set = (open) => { drawer.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
    set(!drawer.hidden);
    btn.addEventListener("click", () => set(drawer.hidden));
    drawer.querySelectorAll("[data-nh-close]").forEach((b) => b.addEventListener("click", () => set(false)));
  }

  // ----- Variants: the Figma matrix (user type x device x holiday x page) -----
  const combos = (user) => {
    const base = [["desktop", false], ["desktop", true], ["tablet", false], ["tablet", true], ["mobile", false]];
    return user === "pro" ? [...base, ["mobile", true]] : base;
  };
  const variants = [];
  PAGES.forEach((page) => USERS.forEach((u) => {
    const user = typeof u === "object" ? u.value : u;
    combos(user).forEach(([device, holiday]) => {
      const html = header(resolve({ page, user, device, holiday }));
      variants.push({ label: `${YCO.label(page)} / ${YCO.label(user)} / ${YCO.label(device)} / Holiday ${holiday ? "on" : "off"}`, html: `<div style="width:100%;max-width:${device === "mobile" ? "23.4375rem" : "none"};overflow-x:auto">${html}</div>`, wide: true });
    });
  }));
  MENU_PAGES.forEach((m) => {
    const v = typeof m === "object" ? m.value : m;
    variants.push({ label: `Mobile side menu / ${typeof m === "object" ? m.label : YCO.label(m)}`, html: `<div class="${P}_drawer">${drawerPanel(v)}</div>` });
  });
  const menuItem = (selected, state) => `<button class="${P}_menuItem${selected ? ` ${P}_menuItem_selected` : ""}${YCO.stateClass(state)}" type="button"${state === "disabled" ? " disabled" : ""}>${svg("home")}<span>Label</span><span class="${P}_menuBadge">8</span></button>`;
  [false, true].forEach((sel) => ["default", "hover", "press", "focus", "disabled"].forEach((state) => {
    variants.push({ label: `Menu item / ${sel ? "Selected" : "Unselected"} / ${YCO.label(state)}`, html: menuItem(sel, state) });
  }));

  YCO.page({
    id: "navigation-header",
    group: "Navigation",
    title: "Navigation header",
    figma: "6143:45465",
    needs: ["button"],
    statesCss: "components/navigation-header.states.css",
    intro: "The site header: logo, optional main navigation, and the account actions for each user type and page. It has Desktop, Tablet and Mobile layouts; on mobile the menu opens a side panel.",
    controls: [
      { key: "device", label: "Device", type: "chips", options: DEVICES, default: "desktop" },
      { key: "user", label: "User type", type: "chips", options: USERS, default: "non-login" },
      { key: "page", label: "Page", type: "chips", options: PAGES, default: "home" },
      { key: "holiday", label: "Holiday pricing", type: "toggle", default: false },
      { key: "contest", label: "Show Contest link", type: "toggle", default: false, when: (s) => s.device !== "mobile" && (s.page === "product" || (s.page === "home" && s.user === "non-login")) },
      { key: "featureName", label: "Feature name + info", type: "toggle", default: false, when: (s) => s.device !== "mobile" },
      { key: "menuOpen", label: "Side menu open", type: "toggle", default: false, when: (s) => s.device === "mobile" },
      { key: "menuPage", label: "Side menu page", type: "chips", options: MENU_PAGES, default: "home-all", when: (s) => s.device === "mobile" },
    ],
    surface: { wide: true, start: true },
    render: markup,
    mount,
    react: (s) => {
      const p = [`  device="${s.device}"`, `  userType="${s.user}"`, `  page="${s.page}"`];
      if (s.holiday) p.push("  holidayPricing");
      if (s.contest) p.push("  showContest");
      if (s.featureName) p.push('  featureName="Feature name"');
      return `// yce-frontend has headers/index.js (@/components/common/headers): it reads user, page and device from the store and takes no props.\n// Proposed API for the doc-site contract, if the header is split into a presentational component:\nimport NavigationHeader from '@/components/common/headers/navigation-header';\n\n<NavigationHeader\n${p.join("\n")}\n/>`;
    },
    variants,
    notes: [
      "Subscribe, Upgrade, the holiday Pricing pill and the coin are a gold gradient in Figma. No gold gradient token exists, so they use --amber-dark-1000 with strong text (white on that gold is below AA). Designer to add a gold fill token.",
      "The CTAs are the shared Button (small, 36px) with the header's 40px height applied by the header; Figma uses a 40px Button. Confirm whether Button needs a 40px size.",
      "Right-hand items for Plus and for Product / Lobby / Feature room are read from the Figma screenshots (Upgrade replaces Subscribe for Plus; Download and the credit pill appear on Lobby and Feature room). Confirm with the designer that no variant is missing.",
      "Mobile holiday pricing is only drawn for Pro; the other mobile user types have no holiday variant, and the mobile Pricing item sits in the side menu.",
      "The logo is a neutral placeholder; use the production logo asset. The page does not set a fixed side menu height (Figma frame is 375x838).",
      "The doc preview forces the layout with the Device control; in the product the layout follows the breakpoints (Desktop 1200+, Tablet 769-1199, Mobile 768-).",
    ],
  });
})();
