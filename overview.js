// Renders the Overview page from components-data.js (generated from the Storybook source).
(() => {
  const C = window.YCO_CATALOG;
  const mount = document.querySelector("#overviewBody");
  if (!C || !mount) return;

  // Components that already have a page on this site.
  const LIBRARY_PAGES = {
    button: { label: "Buttons", state: "page-doc", text: "Documented", href: "#buttons" },
    "yce-toast": { label: "Toast", state: "page-draft", text: "Draft, not verified", href: "#toast" },
  };
  const MATCH = {
    figma: ["figma", "In Figma"],
    inferred: ["inferred", "Confirm pairing"],
    none: ["none", "No Storybook component"],
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const comps = C.components;
  const storyCount = (c) => c.stories.reduce((n, s) => n + s.count, 0);
  const storyTitle = (c) => c.stories.map((s) => s.title).filter(Boolean).join(", ");

  function sbCell(ids) {
    if (!ids.length) return '<span class="ov-empty-cell">None</span>';
    return ids.map((id) => {
      const c = comps[id];
      const page = LIBRARY_PAGES[id];
      return `<div class="ov-sb"><b>${esc(c.name)}</b> <code>platform/ui/${esc(id)}/</code>
        <small>${esc(storyTitle(c))} · ${storyCount(c)} stories · ${c.props.length} props${c.figmaNode ? ` · Figma ${esc(c.figmaNode)}` : ""}</small>
        ${page ? `<a class="ov-badge ${page.state}" href="${page.href}" data-page-link="${page.href.slice(1)}">${esc(page.label)} page: ${esc(page.text)}</a>` : ""}</div>`;
    }).join("");
  }

  function group(g) {
    const rows = g.items.map((i) => {
      const [cls, label] = MATCH[i.conf];
      return `<tr data-conf="${i.conf}" data-search="${esc((i.name + " " + i.sb.map((id) => comps[id].name + " " + id).join(" ")).toLowerCase())}">
        <td>${esc(i.name)}</td><td>${sbCell(i.sb)}</td>
        <td><span class="ov-badge ${cls}">${label}</span>${i.note ? `<span class="ov-note">${esc(i.note)}</span>` : ""}</td></tr>`;
    }).join("");
    return `<section class="ov-group" data-group>
      <h3>${esc(g.name)} <small>${g.items.length} in Figma</small></h3>
      <table class="ov-table"><thead><tr><th>Figma component</th><th>Storybook</th><th>Match</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }

  function onlyGroup() {
    const total = C.notInFigma.reduce((n, g) => n + g.ids.length, 0);
    const body = C.notInFigma.map((g) => `<div class="ov-group" data-search-group>
      <p class="eyebrow">${esc(g.name)}</p>
      <div class="ov-chips">${g.ids.map((id) => {
        const c = comps[id];
        return `<span class="ov-chip" data-search="${esc((c.name + " " + id).toLowerCase())}">${esc(c.name)}<small>${storyCount(c)} stories · ${esc(c.portability || "")}</small></span>`;
      }).join("")}</div></div>`).join("");
    return `<section class="ov-group" data-conf="only" data-group>
      <h3>Storybook only <small>${total} components with no Figma counterpart</small></h3>
      <p class="intro">Ported from RD or built for one feature. Candidates to move out of the shared <code>UI/</code> tree, to get a Figma component, or to stay as-is on purpose.</p>${body}</section>`;
  }

  function housekeeping() {
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const mism = [];
    Object.values(comps).forEach((c) => c.stories.forEach((s) => {
      if (s.title && s.title.startsWith("UI/") && !s.title.includes("/", 3) && norm(s.title.slice(3)) !== norm(c.id)) {
        mism.push(`<li><code>${esc(s.title)}</code> lives in <code>platform/ui/${esc(c.id)}/</code></li>`);
      }
    }));
    return `<section class="ov-group" data-conf="only" data-group><h3>Storybook housekeeping <small>found while building this page</small></h3>
      <ul class="ov-list">${mism.join("")}
        <li><code>UI/Result Page Shell/Sidebar</code> is the ToolFamilyMenu story, nested under another component's title.</li>
        <li><code>Surfaces/Review</code> (<code>app/src/surfaces/</code>) holds ten full-page prototype reviews, not components.</li>
        <li>${Object.values(comps).filter((c) => c.figmaStatus !== "mapped").length} of ${Object.keys(comps).length} components have no Figma node recorded in their contract.</li>
      </ul></section>`;
  }

  const allItems = C.groups.flatMap((g) => g.items);
  const count = (conf) => allItems.filter((i) => i.conf === conf).length;
  const onlyTotal = C.notInFigma.reduce((n, g) => n + g.ids.length, 0);
  const stats = [
    [Object.keys(comps).length, "Storybook components"],
    [count("figma"), "Figma components paired (recorded)"],
    [count("inferred"), "Pairings to confirm"],
    [count("none"), "Figma components not in Storybook"],
    [onlyTotal, "Storybook only"],
  ].map(([n, t]) => `<div class="ov-stat"><strong>${n}</strong><span>${t}</span></div>`).join("");

  mount.innerHTML = `
    <div class="ov-stats">${stats}</div>
    <div class="ov-toolbar">
      <input type="search" id="ovSearch" placeholder="Search components" aria-label="Search components" />
      <div class="ov-filters" role="group" aria-label="Filter">
        ${[["all", "All"], ["figma", "In Figma"], ["inferred", "Confirm pairing"], ["none", "Missing in Storybook"], ["only", "Storybook only"]]
          .map(([v, t], i) => `<button type="button" data-ov-filter="${v}" class="${i ? "" : "is-active"}">${t}</button>`).join("")}
      </div>
    </div>
    ${C.groups.map(group).join("")}${onlyGroup()}${housekeeping()}
    <p class="ov-foot">Generated ${esc(C.generatedAt)} from ${esc(C.source.repo)} at ${esc(C.source.commit)} · Figma board ${esc(C.figma.board)} · Do not edit by hand: re-run the generator.</p>`;

  let filter = "all";
  let query = "";
  function apply() {
    mount.querySelectorAll("[data-group]").forEach((sec) => {
      let visible = 0;
      const rows = sec.querySelectorAll("tr[data-conf]");
      rows.forEach((r) => {
        const show = (filter === "all" || filter === r.dataset.conf) && (!query || r.dataset.search.includes(query));
        r.hidden = !show;
        if (show) visible++;
      });
      const chips = sec.querySelectorAll(".ov-chip");
      if (chips.length) {
        const okFilter = filter === "all" || filter === "only";
        chips.forEach((c) => { const show = okFilter && (!query || c.dataset.search.includes(query)); c.hidden = !show; if (show) visible++; });
        sec.querySelectorAll("[data-search-group]").forEach((g) => { g.hidden = ![...g.querySelectorAll(".ov-chip")].some((c) => !c.hidden); });
      }
      if (!rows.length && !chips.length) visible = filter === "all" && !query ? 1 : 0; // housekeeping: only on the unfiltered view
      sec.hidden = visible === 0;
    });
  }
  mount.querySelectorAll("[data-ov-filter]").forEach((b) => b.addEventListener("click", () => {
    filter = b.dataset.ovFilter;
    mount.querySelectorAll("[data-ov-filter]").forEach((x) => x.classList.toggle("is-active", x === b));
    apply();
  }));
  mount.querySelector("#ovSearch").addEventListener("input", (e) => { query = e.target.value.trim().toLowerCase(); apply(); });
})();
