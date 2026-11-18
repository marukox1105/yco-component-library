/* YCO component playground engine.
   A component page is one config object passed to YCO.page(): controls, a render()
   function that returns the component's HTML, and a react() function that returns
   the usage snippet. The engine draws the page (preview, code tabs, controls,
   variant grid) with the same markup and classes the Buttons page uses.
   See COMPONENT-PAGES.md for the config reference. */
(() => {
  "use strict";

  const pages = new Map();
  const values = new Map(); // page id -> current control values
  const host = document.querySelector("#enginePage");
  const root = document.documentElement;
  const buttonLink = document.querySelector('link[href*="button.module.css"]');
  const cssText = new Map();

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const label = (v) => String(v).replace(/[-_]/g, " ").replace(/^./, (c) => c.toUpperCase());
  const optionOf = (o) => (typeof o === "object" ? o : { value: o, label: label(o) });

  /** Forced-state control used by most components. Pass the states the Figma component has. */
  const STATES = ["default", "hover", "press", "focus", "disabled"];
  function stateControl(options = STATES) {
    return { key: "state", label: "State", type: "chips", options, default: "default" };
  }
  /** is-hover / is-press / is-focus: only added to the live preview, never to the copied code. */
  const stateClass = (state) => (["hover", "press", "focus"].includes(state) ? ` is-${state}` : "");

  function register(cfg) {
    if (!cfg || !cfg.id) throw new Error("YCO.page needs an id");
    cfg.controls = cfg.controls || [];
    cfg.css = cfg.css || `components/${cfg.id}.css`;
    pages.set(cfg.id, cfg);
  }

  function initial(cfg) {
    const v = {};
    cfg.controls.forEach((c) => { v[c.key] = c.default !== undefined ? c.default : c.type === "toggle" ? false : ""; });
    return v;
  }
  const current = (cfg) => { if (!values.has(cfg.id)) values.set(cfg.id, initial(cfg)); return values.get(cfg.id); };

  /* ---------- markup ---------- */
  function previewHtml(cfg, s) {
    return cfg.render(s, { preview: true, sc: stateClass(s.state), s });
  }
  function codeHtml(cfg, s) {
    return cfg.render(s, { preview: false, sc: "", s });
  }

  function controlHtml(cfg, c, s) {
    if (c.when && !c.when(s)) return "";
    if (c.type === "toggle") {
      return `<label class="check-control"><input type="checkbox" data-ctl="${c.key}" ${s[c.key] ? "checked" : ""} /><span>${esc(c.label)}</span></label>`;
    }
    if (c.type === "text") {
      return `<div class="control-group"><label class="control-label" for="ctl-${c.key}">${esc(c.label)}</label><input type="text" id="ctl-${c.key}" data-ctl="${c.key}" value="${esc(s[c.key])}" /></div>`;
    }
    const opts = (typeof c.options === "function" ? c.options(s) : c.options).map(optionOf);
    return `<div class="control-group"><span class="control-label">${esc(c.label)}</span>
      <div class="choice-chips" role="radiogroup" aria-label="${esc(c.label)}">${opts.map((o) =>
        `<button type="button" data-ctl="${c.key}" data-value="${esc(o.value)}" class="${String(s[c.key]) === String(o.value) ? "is-active" : ""}">${esc(o.label)}</button>`).join("")}</div></div>`;
  }

  function surfaceOf(cfg, s) {
    const x = typeof cfg.surface === "function" ? cfg.surface(s) : cfg.surface || {};
    return x;
  }

  function variantsHtml(cfg) {
    const list = typeof cfg.variants === "function" ? cfg.variants() : cfg.variants;
    if (!list || !list.length) return "";
    return `<section class="preview-pane yco-variants" aria-label="All variants">
      <div class="section-heading"><div><p class="eyebrow">Figma variants</p><h3>All variants</h3></div></div>
      <div class="variants-grid">${list.map((v) => `<figure class="variant-cell${v.wide ? " is-wide" : ""}${v.dark ? " is-dark" : ""}">
        <div class="variant-stage">${v.html}</div><figcaption>${esc(v.label)}</figcaption></figure>`).join("")}</div></section>`;
  }

  function build(cfg) {
    const s = current(cfg);
    const hasReact = typeof cfg.react === "function";
    host.dataset.engine = cfg.id;
    host.innerHTML = `
      <header class="page-header">
        <div>
          <p class="eyebrow">${esc(cfg.group || "Components")}</p>
          <h2>${esc(cfg.title)}</h2>
          <p class="intro">${esc(cfg.intro || "")}</p>
        </div>
        <div class="header-actions" role="group" aria-label="Theme">
          <button class="theme-button ${root.dataset.theme === "dark" ? "" : "is-active"}" type="button" data-engine-theme="light" aria-label="Use light theme">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"></path></svg>
            <span class="visually-hidden">Light</span>
          </button>
          <button class="theme-button ${root.dataset.theme === "dark" ? "is-active" : ""}" type="button" data-engine-theme="dark" aria-label="Use dark theme">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.4A7.2 7.2 0 0 1 9.6 4a8.2 8.2 0 1 0 10.4 10.4Z"></path></svg>
            <span class="visually-hidden">Dark</span>
          </button>
        </div>
      </header>
      <section class="workspace" aria-label="${esc(cfg.title)} playground">
        <div class="preview-pane">
          <div class="section-heading">
            <div><p class="eyebrow">Playground</p><h3>${esc(cfg.title)} Preview</h3></div>
            <span class="status-pill" data-role="status"></span>
          </div>
          <div class="preview-surface" data-role="surface"></div>
          <div class="inline-code-panel">
            <div class="section-heading"><div><p class="eyebrow">Implementation</p><h3>Code</h3></div></div>
            <div class="code-tabs" role="tablist" aria-label="Code format">
              <button class="is-active" type="button" data-engine-tab="html">HTML</button>
              ${hasReact ? '<button type="button" data-engine-tab="react">React</button>' : ""}
              <button type="button" data-engine-tab="css">CSS</button>
            </div>
            <div class="code-frame">
              <button class="copy-button" type="button" data-engine-copy>Copy</button>
              <pre><code data-role="code"></code></pre>
            </div>
          </div>
        </div>
        <form class="control-pane" aria-label="${esc(cfg.title)} controls" data-role="controls" onsubmit="return false"></form>
      </section>
      ${variantsHtml(cfg)}
      ${(cfg.notes || []).length ? `<aside class="yco-notes" aria-label="Notes"><p class="eyebrow">Notes</p><ul>${cfg.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></aside>` : ""}
      <p class="yco-source">${cfg.figma ? `Figma <code>${esc(cfg.figma)}</code> · ` : ""}Styles: <code>${esc(cfg.css)}</code> (single source, same file in <code>yce-frontend</code>)</p>`;
    host.dataset.tab = "html";
    update(cfg);
  }

  function update(cfg, { controls = true } = {}) {
    const s = current(cfg);
    const surf = surfaceOf(cfg, s);
    const surface = host.querySelector('[data-role="surface"]');
    surface.className = ["preview-surface", surf.inverse ? "is-inverse-preview" : "", surf.wide ? "is-wide" : "", surf.start ? "is-start" : ""].filter(Boolean).join(" ");
    surface.style.minHeight = surf.minHeight ? `${surf.minHeight}px` : "";
    surface.innerHTML = previewHtml(cfg, s);
    if (typeof cfg.mount === "function") cfg.mount(surface, s);

    const status = cfg.controls.filter((c) => c.type === "chips" && !(c.when && !c.when(s))).map((c) => label(s[c.key])).join(" / ");
    host.querySelector('[data-role="status"]').textContent = status || cfg.title;
    document.title = `YCO ${cfg.title}${status ? " - " + status : ""}`;

    if (controls) host.querySelector('[data-role="controls"]').innerHTML = cfg.controls.map((c) => controlHtml(cfg, c, s)).join("");
    renderCode(cfg);
  }

  async function loadCss(cfg) {
    if (!cssText.has(cfg.css)) {
      try { cssText.set(cfg.css, await (await fetch(cfg.css)).text()); } catch (e) { cssText.set(cfg.css, `/* ${cfg.css} could not be loaded (open the site through a local server) */`); }
    }
    return cssText.get(cfg.css);
  }

  async function renderCode(cfg) {
    const s = current(cfg);
    const tab = host.dataset.tab;
    const code = host.querySelector('[data-role="code"]');
    let text;
    if (tab === "react" && cfg.react) text = cfg.react(s);
    else if (tab === "css") text = await loadCss(cfg);
    else text = codeHtml(cfg, s);
    if (host.dataset.engine !== cfg.id) return;
    code.dataset.raw = text;
    code.innerHTML = tab === "css" ? window.highlightCss(text) : window.highlightMarkup(text);
  }

  /* ---------- events ---------- */
  host.addEventListener("click", async (e) => {
    const cfg = pages.get(host.dataset.engine);
    if (!cfg) return;
    const chip = e.target.closest("button[data-ctl]");
    if (chip) {
      current(cfg)[chip.dataset.ctl] = chip.dataset.value;
      update(cfg);
      return;
    }
    const tab = e.target.closest("[data-engine-tab]");
    if (tab) {
      host.dataset.tab = tab.dataset.engineTab;
      host.querySelectorAll("[data-engine-tab]").forEach((b) => b.classList.toggle("is-active", b === tab));
      renderCode(cfg);
      return;
    }
    if (e.target.closest("[data-engine-copy]")) {
      const raw = host.querySelector('[data-role="code"]').dataset.raw || "";
      let ok = false;
      try { await navigator.clipboard.writeText(raw); ok = true; } catch (err) { /* fall through */ }
      flash(ok ? "Copied" : "Select the code to copy");
      return;
    }
    const theme = e.target.closest("[data-engine-theme]");
    if (theme) {
      root.dataset.theme = theme.dataset.engineTheme;
      document.querySelectorAll("[data-theme]").forEach((b) => b.classList.toggle("is-active", b.dataset.theme === root.dataset.theme));
      host.querySelectorAll("[data-engine-theme]").forEach((b) => b.classList.toggle("is-active", b === theme));
    }
  });
  host.addEventListener("input", (e) => {
    const cfg = pages.get(host.dataset.engine);
    const el = e.target.closest("[data-ctl]");
    if (!cfg || !el || el.tagName === "BUTTON") return;
    current(cfg)[el.dataset.ctl] = el.type === "checkbox" ? el.checked : el.value;
    // Redraw the control pane only when a toggle can show or hide another control; a text field must keep focus.
    update(cfg, { controls: el.type === "checkbox" && cfg.controls.some((c) => c.when) });
  });

  let flashTimer;
  function flash(text) {
    let el = document.querySelector("#engineToast");
    if (!el) { el = document.createElement("div"); el.id = "engineToast"; el.className = "toast"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.add("is-visible");
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => el.classList.remove("is-visible"), 1400);
  }

  /* ---------- routing hook (called from script.js setActivePage) ---------- */
  function ensureCss(cfg) {
    document.querySelectorAll("link[data-yco-page]").forEach((l) => { if (l.dataset.ycoPage !== cfg?.id) l.remove(); });
    if (!cfg) return;
    [cfg.css, cfg.statesCss].filter(Boolean).forEach((href) => {
      if (document.querySelector(`link[data-yco-page="${cfg.id}"][href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = `${href}?v=${window.YCO_BUILD || 0}-${cfg.version || 1}`; l.dataset.ycoPage = cfg.id;
      document.head.appendChild(l);
    });
  }

  function show(id) {
    const cfg = pages.get(id);
    host.hidden = !cfg;
    // Button's global stylesheet is only for pages that use it, so class names never leak between pages.
    if (buttonLink) buttonLink.disabled = !!cfg && !(cfg.needs || []).includes("button");
    ensureCss(cfg);
    if (cfg) build(cfg);
    else host.innerHTML = "";
  }

  window.YCO = { page: register, has: (id) => pages.has(id), show, ids: () => [...pages.keys()], stateControl, stateClass, STATES, esc, label };
})();
