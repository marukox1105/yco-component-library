// Tokens page: reads styles.css itself, so it can never drift from the file components use.
// Primitives are the literal colours; semantic tokens are shown resolved in light and in dark (the dark block only
// re-points them), with the alias chain, and a click copies var(--name).
(() => {
  const mount = document.querySelector("#tokensBody");
  if (!mount) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function block(css, selector) {
    const i = css.indexOf(selector + " {");
    if (i < 0) return {};
    const body = css.slice(css.indexOf("{", i) + 1, css.indexOf("\n}", i));
    const out = {};
    body.replace(/(--[\w-]+)\s*:\s*([^;]+);/g, (_, k, v) => { out[k] = v.trim(); });
    return out;
  }

  function resolve(name, theme, light, dark, chain = []) {
    const raw = (theme === "dark" && dark[name]) || light[name];
    if (raw == null) return { value: null, chain };
    const m = raw.match(/^var\((--[\w-]+)\)$/);
    if (!m) return { value: raw, chain, raw };
    return resolve(m[1], theme, light, dark, [...chain, m[1]]);
  }

  function parseColour(v) {
    const m = v && v.match(/^#([0-9a-f]{3,8})$/i);
    if (!m) return null;
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const a = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
    return { hex: "#" + h.slice(0, 6).toLowerCase(), alpha: a };
  }
  const pct = (a) => `${Math.round(a * 100)}%`;

  const SEMANTIC = [
    ["Background", "background", "Page and surface colours."],
    ["Fill", "fill", "Backgrounds of controls and states. Hover is the lighter tint and press the darker one."],
    ["Stroke", "stroke", "Borders and dividers."],
    ["Text", "text", "Text colours."],
    ["Icon", "icon", "Icon colours."],
  ];
  const PALETTE = [
    ["Grey", /^--grey-(slate|neutral)-/], ["Brand blue", /^--blue-/], ["Teal", /^--teal-/], ["Green", /^--green-/],
    ["Amber", /^--amber-/], ["Yellow", /^--yellow-/], ["Red", /^--red-/],
  ];

  const label = (c, raw) => (c ? `${c.hex}${c.alpha < 1 ? ` · ${pct(c.alpha)}` : ""}` : (raw || ""));
  const lbl = (c, raw) => (c ? `${c.hex}${c.alpha < 1 ? ` ${pct(c.alpha)}` : ""}` : (raw || ""));

  // A colour is drawn over its own backdrop, because most tokens are translucent: white for light, the dark surface for dark.
  function split(lc, dc, lraw, draw) {
    const half = (c, bg, raw) => `<span class="tk-half ${bg}">${c ? `<i style="background:${c.hex};opacity:${c.alpha}"></i>` : `<b>${esc(raw || "—")}</b>`}</span>`;
    return `<span class="tk-split">${half(lc, "is-light", lraw)}${half(dc, "is-dark", draw)}</span>`;
  }

  function semanticCard(n, prefix, light, dark) {
    const l = resolve(n, "light", light, dark), d = resolve(n, "dark", light, dark);
    const lc = parseColour(l.value), dc = parseColour(d.value);
    if (!lc && !dc && !l.value) return "";
    const short = n.replace(`--${prefix}-`, "");
    const alias = l.chain.length ? l.chain[l.chain.length - 1].replace(/^--/, "") : "";
    return `<button type="button" class="tk-card" data-copy="var(${n})" data-name="${esc(n)}" title="Copy var(${esc(n)})">
      ${split(lc, dc, l.value, d.value)}
      <span class="tk-name">${esc(short)}</span>
      <span class="tk-detail"><span>${esc(lbl(lc, l.value))}</span><span>${esc(lbl(dc, d.value))}</span>${alias ? `<span>${esc(alias)}</span>` : ""}</span>
    </button>`;
  }

  function group(names, prefix, light, dark) {
    // Sub-heading = the first word after the prefix when at least two tokens share it (brand, error, inverse...).
    const first = (n) => n.replace(`--${prefix}-`, "").split("-")[0];
    const count = {};
    names.forEach((n) => { count[first(n)] = (count[first(n)] || 0) + 1; });
    const buckets = new Map();
    names.forEach((n) => { const k = count[first(n)] > 1 ? first(n) : "general"; (buckets.get(k) || buckets.set(k, []).get(k)).push(n); });
    const order = [...buckets.keys()].sort((x, y) => (x === "general" ? -1 : y === "general" ? 1 : x.localeCompare(y)));
    return order.map((k) => {
      const cards = buckets.get(k).map((n) => semanticCard(n, prefix, light, dark)).filter(Boolean);
      return cards.length ? `<div class="tk-sub" data-sub><h4>${k === "general" ? "General" : k}</h4><div class="tk-cards">${cards.join("")}</div></div>` : "";
    }).join("");
  }

  function scaleRow(title, list, light) {
    const dark = /-dark(-|$)/.test(title) || /dark/.test(title);
    const tiles = [...list].sort((x, y) => parseInt(x.split("-").pop(), 10) - parseInt(y.split("-").pop(), 10)).map((n) => {
      const c = parseColour(light[n]);
      return `<button type="button" class="tk-tile" data-copy="var(${n})" data-name="${esc(n)}" title="Copy var(${esc(n)})">
        <span class="tk-half ${dark ? "is-dark" : "is-light"} tk-big"><i style="background:${c.hex};opacity:${c.alpha}"></i></span>
        <span class="tk-step">${esc(n.split("-").pop())}</span><span class="tk-detail"><span>${esc(lbl(c))}</span></span></button>`;
    }).join("");
    return `<div class="tk-scale" data-sub><h4>${esc(title)}</h4><div class="tk-tiles">${tiles}</div></div>`;
  }

  function sizes(light) {
    const px = (v) => { const m = v.match(/^([\d.]+)rem$/); return m ? Math.round(parseFloat(m[1]) * 16) : null; };
    const spacing = Object.keys(light).filter((k) => /^--spacing-/.test(k));
    const radius = Object.keys(light).filter((k) => /^--corner-radius-/.test(k));
    const fs = Object.keys(light).filter((k) => /^--font-size-/.test(k));
    const lh = Object.keys(light).filter((k) => /^--line-height-/.test(k));
    const fw = Object.keys(light).filter((k) => /^--font-weight-/.test(k));
    const ff = Object.keys(light).filter((k) => /^--font-family-/.test(k));
    const row = (n, v, vis) => `<button type="button" class="tk-row tk-size" data-copy="var(${n})" data-name="${esc(n)}" title="Copy var(${esc(n)})">
      <span class="tk-name">${esc(n)}</span><span class="tk-val">${esc(v)}${px(v) != null ? ` · ${px(v)}px` : ""}</span><span class="tk-vis">${vis}</span></button>`;
    return `
    <section class="tk-sec" id="tk-spacing" data-sec><h3>Spacing</h3><p class="intro">Gaps and padding. Use these, not raw pixels.</p>
      <div class="tk-sizes">${spacing.map((n) => row(n, light[n], `<i class="tk-bar" style="width:${Math.max(px(light[n]) || 0, 1)}px"></i>`)).join("")}</div></section>
    <section class="tk-sec" id="tk-radius" data-sec><h3>Corner radius</h3>
      <div class="tk-sizes tk-grid">${radius.map((n) => row(n, light[n], `<i class="tk-box" style="border-radius:${light[n]}"></i>`)).join("")}</div></section>
    <section class="tk-sec" id="tk-type" data-sec><h3>Typography</h3>
      <div class="tk-sizes">${ff.map((n) => row(n, light[n].replace(/var\(--font\)/, "system sans"), `<span style="font-family:${light[n].replace(/"/g, "'")}">Aa</span>`)).join("")}
      ${fs.map((n) => row(n, light[n], `<span style="font-size:${light[n]}">Make something people love</span>`)).join("")}
      ${lh.map((n) => row(n, light[n], "")).join("")}
      ${fw.map((n) => row(n, light[n], `<span style="font-weight:${light[n]}">Strong</span>`)).join("")}</div></section>`;
  }

  function render(css) {
    const light = block(css, ":root"), dark = block(css, ':root[data-theme="dark"]');
    const names = Object.keys(light);
    const pal = PALETTE.map(([title, re]) => {
      const byScale = new Map();
      names.filter((n) => re.test(n) && parseColour(light[n])).forEach((n) => {
        const k = n.replace(/^--/, "").replace(/-[^-]+$/, ""); (byScale.get(k) || byScale.set(k, []).get(k)).push(n);
      });
      return byScale.size ? `<div class="tk-pal"><h3 class="tk-h">${title}</h3>${[...byScale].map(([k, list]) => scaleRow(k, list, light)).join("")}</div>` : "";
    }).join("");
    const sem = SEMANTIC.map(([title, prefix, text]) => {
      const set = [...new Set([...names, ...Object.keys(dark)].filter((n) => n.startsWith(`--${prefix}-`)))].sort();
      const body = group(set, prefix, light, dark);
      return body ? `<section class="tk-sec" id="tk-${prefix}" data-sec><h3>${title}</h3><p class="intro">${text}</p>${body}</section>` : "";
    }).join("");
    const secs = [["tk-colour", "Colour"], ["tk-fill", "Fill"], ["tk-stroke", "Stroke"], ["tk-text", "Text"], ["tk-icon", "Icon"], ["tk-background", "Background"],
      ["tk-spacing", "Spacing"], ["tk-radius", "Radius"], ["tk-type", "Type"]];
    mount.innerHTML = `
      <div class="tk-toolbar"><input type="search" id="tkSearch" placeholder="Search tokens, e.g. fill-hover" aria-label="Search tokens" />
        <button type="button" class="tk-toggle" id="tkValues" aria-pressed="false">Show values</button>
        <nav class="tk-jump" aria-label="Jump to">${secs.map(([id, t]) => `<a href="#" data-jump="${id}">${t}</a>`).join("")}</nav></div>
      <section class="tk-sec" id="tk-colour" data-sec><h3>Colour palette <small>primitives</small></h3>
        <p class="intro">The literal colours. Components never use these directly: they use the semantic tokens below, which point at a primitive and change with the theme.</p>${pal}</section>
      ${sem}${sizes(light)}
      <p class="tk-note" data-note>Source: <code>styles.css</code>, read live. Light and dark are resolved from the <code>:root</code> and <code>:root[data-theme="dark"]</code> blocks. Figma's hover and press variables have not been updated yet to the order shown here.</p>
      <p class="tk-toast" id="tkToast" role="status" aria-live="polite"></p>`;

    const toast = mount.querySelector("#tkToast");
    mount.addEventListener("click", async (e) => {
      const jump = e.target.closest("[data-jump]");
      if (jump) { e.preventDefault(); const t = mount.querySelector("#" + jump.dataset.jump); if (t) t.scrollIntoView({ block: "start" }); return; }
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      let ok = false;
      try { await navigator.clipboard.writeText(b.dataset.copy); ok = true; } catch (err) {
        const t = document.createElement("textarea"); t.value = b.dataset.copy; document.body.appendChild(t); t.select();
        try { ok = document.execCommand("copy"); } catch (e2) { ok = false; } t.remove();
      }
      toast.textContent = ok ? `Copied ${b.dataset.copy}` : "Select the name to copy";
      toast.classList.add("is-visible");
      clearTimeout(render.t); render.t = setTimeout(() => toast.classList.remove("is-visible"), 1400);
    });
    const vals = mount.querySelector("#tkValues");
    vals.addEventListener("click", () => { const on = vals.getAttribute("aria-pressed") !== "true"; vals.setAttribute("aria-pressed", String(on)); mount.classList.toggle("show-values", on); });
    mount.querySelector("#tkSearch").addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      mount.querySelectorAll("[data-name]").forEach((el) => { el.hidden = !!q && !el.dataset.name.includes(q); });
      mount.querySelectorAll("[data-sec]").forEach((s) => { s.hidden = !!q && ![...s.querySelectorAll("[data-name]")].some((el) => !el.hidden); });
      mount.querySelectorAll(".tk-pal, [data-sub]").forEach((p) => { p.hidden = !!q && ![...p.querySelectorAll("[data-name]")].some((el) => !el.hidden); });
    });
  }

  fetch("./styles.css", { cache: "no-cache" }).then((r) => r.text()).then(render)
    .catch(() => { mount.innerHTML = '<p class="intro">Tokens could not be read from <code>styles.css</code>.</p>'; });
})();
