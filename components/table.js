/* Table · Figma 5418:55773. Config reference: COMPONENT-PAGES.md */
(() => {
  const svg = (cls, body, extra = "") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"${extra}>${body}</svg>`;
  const ICON = {
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
    download: '<path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    up: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
    down: '<path d="M12 5v14m-6-6 6 6 6-6"/>',
    idle: '<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    badge: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    left: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    right: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  };
  const icon = (name, cls = "ycoTable_icon") => svg(cls, ICON[name]);

  const checkbox = (label, attrs = "") => `<span class="ycoTable_check"><input class="ycoTable_checkInput" type="checkbox" aria-label="${label}"${attrs} />` +
    `<span class="ycoTable_checkBox">${svg("ycoTable_checkMark ycoTable_checkMark_tick", '<path d="m6 12.5 4 4 8-9"/>')}${svg("ycoTable_checkMark ycoTable_checkMark_dash", '<path d="M7 12h10"/>')}</span></span>`;
  const avatar = (small) => `<span class="ycoTable_avatar${small ? " ycoTable_avatar_small" : ""}">${icon("person", "ycoTable_avatarIcon")}</span>`;
  const badge = () => `<span class="ycoTable_badge">${icon("badge", "ycoTable_badgeIcon")}<span class="ycoTable_badgeLabel">Label</span></span>`;

  /* ---------- heading cells ---------- */
  // align: left | right | check. sort: no | yes | up | down. State hover is forced with is-hover (preview only).
  function th({ align = "left", sort = "no", sc = "", label = "Heading", attrs = "" }) {
    if (align === "check") return `<th class="ycoTable_th ycoTable_th_check${sc}" scope="col">${checkbox("Select all rows", ' data-ycotable="all"')}</th>`;
    const cls = `ycoTable_th${align === "right" ? " ycoTable_th_right" : ""}${sc}`;
    if (sort === "no") return `<th class="${cls}" scope="col"${attrs}>${label}</th>`;
    const aria = sort === "up" ? "ascending" : sort === "down" ? "descending" : "none";
    return `<th class="${cls}" scope="col" aria-sort="${aria}"${attrs}>
      <button class="ycoTable_sort" type="button"><span class="ycoTable_sortLabel">${label}</span>${icon("idle", "ycoTable_sortIcon ycoTable_sortIcon_idle")}${icon("up", "ycoTable_sortIcon ycoTable_sortIcon_up")}${icon("down", "ycoTable_sortIcon ycoTable_sortIcon_down")}</button>
    </th>`;
  }

  /* ---------- data cells ---------- */
  const TYPES = ["Text", "Text bold", "Number", "Link", "Secondary text", "Badge", "Tags", "Avatar", "Avatar group", "Checkbox", "Action icons", "Action links"];
  const actionIcons = () => `<div class="ycoTable_actions">${["copy", "download", "trash", "more"].map((n) => `<button class="ycoTable_iconButton" type="button" aria-label="${YCO.label(n)}">${icon(n)}</button>`).join("")}</div>`;

  function td(type, { alt = false, trend = "up", text = "Text", n = "0", name = "Name", sortAttr = "" } = {}) {
    const cls = ["ycoTable_td", alt ? "ycoTable_td_alt" : "", type === "Text bold" ? "ycoTable_td_bold" : "", type === "Number" || type === "Action icons" || type === "Action links" ? "ycoTable_td_right" : ""].filter(Boolean).join(" ");
    let inner;
    switch (type) {
      case "Text": case "Text bold": inner = text; break;
      case "Number": inner = `<span class="ycoTable_cellRow">${n}${trend === "none" ? "" : icon(trend === "down" ? "down" : "up", `ycoTable_trend ycoTable_trend_${trend === "down" ? "down" : "up"}`)}</span>`; break;
      case "Link": inner = '<a class="ycoTable_link ycoTable_link_bold" href="#">Label</a>'; break;
      case "Secondary text": inner = 'Label<span class="ycoTable_secondary">Secondary text</span>'; break;
      case "Badge": inner = badge(); break;
      case "Tags": inner = `<div class="ycoTable_tags">${[1, 2, 3].map(() => '<span class="ycoTable_tag">Label</span>').join("")}</div>`; break;
      case "Avatar": inner = `<div class="ycoTable_person">${avatar()}<div>${name}<span class="ycoTable_secondary">Secondary text</span></div></div>`; break;
      case "Avatar group": inner = `<div class="ycoTable_stack" role="img" aria-label="5 people and more">${[1, 2, 3, 4, 5].map(() => `<span class="ycoTable_stackItem">${avatar(true)}</span>`).join("")}<span class="ycoTable_stackItem"><span class="ycoTable_avatar ycoTable_avatar_small ycoTable_count">99+</span></span></div>`; break;
      case "Checkbox": inner = checkbox("Select row", ' data-ycotable="row"'); break;
      case "Action icons": inner = actionIcons(); break;
      case "Action links": inner = '<span class="ycoTable_cellRow ycoTable_cellRow_end ycoTable_cellRow_links"><a class="ycoTable_link ycoTable_link_small" href="#">Copy</a><a class="ycoTable_link ycoTable_link_small" href="#">Download</a><a class="ycoTable_link ycoTable_link_small" href="#">Delete</a></span>'; break;
      default: inner = "";
    }
    const check = type === "Checkbox" ? " ycoTable_td_check" : "";
    return `<td class="${cls}${check}"${sortAttr}>${inner}</td>`;
  }

  /* ---------- the table ---------- */
  const NUMS = [12, 48, 7, 31, 25, 3, 40, 18, 9, 36];
  const TRENDS = ["up", "down", "down", "up", "up", "down", "down", "up", "up", "down"];

  function pager() {
    return `<nav class="ycoTable_footer" aria-label="Pagination">
    <div class="ycoTable_pager">
      <button class="ycoTable_pagerLink" type="button">${icon("left", "ycoTable_pagerIcon")}Previous</button>
      <button class="ycoTable_page" type="button" aria-label="Page 1">1</button>
      <button class="ycoTable_page" type="button" aria-label="Page 2" aria-current="page">2</button>
      <button class="ycoTable_page" type="button" aria-label="Page 3">3</button>
      <span class="ycoTable_gap" aria-hidden="true">...</span>
      <button class="ycoTable_page" type="button" aria-label="Page 10">10</button>
      <button class="ycoTable_pagerLink" type="button">Next${icon("right", "ycoTable_pagerIcon")}</button>
    </div>
    <p>Showing 11 - 20 of 128</p>
  </nav>`;
  }

  function table(s) {
    const striped = s.type === "striped";
    const rows = Number(s.rows);
    const sortable = s.sortable;
    const head = [
      s.selectable ? th({ align: "check" }) : "",
      th({ align: "left", sort: sortable ? "yes" : "no", label: "Heading" }),
      th({ align: "left", label: "Heading" }),
      th({ align: "left", label: "Heading" }),
      th({ align: "right", sort: sortable ? "yes" : "no", label: "Heading" }),
      th({ align: "right", label: "Heading" }),
    ].join("\n          ");
    const body = Array.from({ length: rows }, (_, i) => `<tr class="ycoTable_row" data-i="${i}">
        ${s.selectable ? td("Checkbox") : ""}
        ${td("Avatar", { name: `Name ${i + 1}`, sortAttr: ` data-sort="${i + 1}"` })}
        ${td("Text")}
        ${td("Badge")}
        ${td("Number", { n: NUMS[i], trend: TRENDS[i], sortAttr: ` data-sort="${NUMS[i]}"` })}
        ${td("Action icons")}
      </tr>`).join("\n      ");
    return `<div class="ycoTable${striped ? " ycoTable_striped" : ""}">
  <div class="ycoTable_scroll">
    <table class="ycoTable_table">
      <thead>
        <tr>
          ${head}
        </tr>
      </thead>
      <tbody>
      ${body}
      </tbody>
    </table>
  </div>
  ${s.pagination ? pager() : ""}
</div>`.replace(/\n\s*\n/g, "\n");
  }

  const single = (inner, head) => `<div class="ycoTable"><table class="ycoTable_table ycoTable_table_single">${head ? `<thead><tr>${inner}</tr></thead>` : `<tbody><tr>${inner}</tr></tbody>`}</table></div>`;

  const variants = () => {
    const out = [];
    ["default", "striped"].forEach((type) => out.push({ label: `Table / ${YCO.label(type)}`, wide: true, html: table({ type, selectable: true, sortable: false, pagination: true, rows: 10 }) }));
    const sortLabel = { no: "Sortable No", yes: "Sortable Yes", down: "Sortable Down", up: "Sortable Up" };
    ["left", "right"].forEach((align) => ["no", "yes", "down", "up"].forEach((sort) => ["default", "hover"].forEach((state) => {
      if (state === "hover" && (sort === "down" || sort === "up")) return; // Figma draws Down / Up only in Default
      out.push({ label: `Heading ${align} / ${YCO.label(state)} / ${sortLabel[sort]}`, html: single(th({ align, sort, sc: state === "hover" ? " is-hover" : "" }), true) });
    })));
    ["default", "hover"].forEach((state) => out.push({ label: `Heading checkbox / ${YCO.label(state)}`, html: single(th({ align: "check", sc: state === "hover" ? " is-hover" : "" }), true) }));
    ["Default", "Alternate"].forEach((colour) => TYPES.forEach((type) => {
      const alt = colour === "Alternate";
      if (type === "Number") {
        out.push({ label: `Number (trend up) / ${colour}`, html: single(td(type, { alt, trend: "up" })) });
        out.push({ label: `Number (trend down) / ${colour}`, html: single(td(type, { alt, trend: "down" })) });
      } else out.push({ label: `${type} / ${colour}`, html: single(td(type, { alt })) });
    }));
    return out;
  };

  YCO.page({
    id: "table",
    group: "Content display",
    title: "Table",
    figma: "5418:55773",
    statesCss: "components/table.states.css",
    intro: "A data table with a heading row, optional row selection, sortable headings, twelve cell types and a pagination footer. Default and Striped differ only in the alternate row fill.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: ["default", "striped"], default: "default" },
      { key: "rows", label: "Rows", type: "chips", options: ["3", "5", "10"], default: "5" },
      { key: "selectable", label: "Row selection", type: "toggle", default: true },
      { key: "sortable", label: "Sortable headings", type: "toggle", default: true },
      { key: "pagination", label: "Pagination footer", type: "toggle", default: true },
    ],
    surface: { wide: true },
    render: (s) => table(s),
    mount: (el) => {
      const root = el.querySelector(".ycoTable");
      if (!root) return;
      const tbody = root.querySelector("tbody");
      const rows = () => [...tbody.querySelectorAll("tr")];
      const all = root.querySelector('[data-ycotable="all"]');
      const syncAll = () => {
        if (!all) return;
        const boxes = rows().map((r) => r.querySelector('[data-ycotable="row"]')).filter(Boolean);
        const n = boxes.filter((b) => b.checked).length;
        all.checked = n > 0 && n === boxes.length;
        all.indeterminate = n > 0 && n < boxes.length;
      };
      root.addEventListener("change", (e) => {
        const box = e.target.closest("[data-ycotable]");
        if (!box) return;
        if (box.dataset.ycotable === "all") rows().forEach((r) => { const b = r.querySelector('[data-ycotable="row"]'); if (b) { b.checked = box.checked; r.classList.toggle("ycoTable_row_selected", box.checked); } });
        else box.closest("tr").classList.toggle("ycoTable_row_selected", box.checked);
        syncAll();
      });
      root.addEventListener("click", (e) => {
        const sortBtn = e.target.closest(".ycoTable_sort");
        if (sortBtn) {
          const cell = sortBtn.closest("th");
          const next = { none: "ascending", ascending: "descending", descending: "none" }[cell.getAttribute("aria-sort")];
          root.querySelectorAll("th[aria-sort]").forEach((h) => h.setAttribute("aria-sort", "none"));
          cell.setAttribute("aria-sort", next);
          const col = cell.cellIndex;
          const val = (r) => r.cells[col].dataset.sort || "";
          const list = rows().sort((a, b) => (next === "none" ? a.dataset.i - b.dataset.i : (next === "ascending" ? 1 : -1) * val(a).localeCompare(val(b), undefined, { numeric: true })));
          list.forEach((r) => tbody.appendChild(r));
          return;
        }
        const page = e.target.closest(".ycoTable_page");
        if (page) {
          root.querySelectorAll(".ycoTable_page").forEach((p) => p.removeAttribute("aria-current"));
          page.setAttribute("aria-current", "page");
        }
      });
    },
    react: (s) => {
      const p = [];
      if (s.type === "striped") p.push('  striped');
      if (s.selectable) p.push("  selectable");
      if (s.sortable) p.push("  sortable");
      if (s.pagination) p.push("  pagination={{ page: 2, pageSize: 10, total: 128, onChange: setPage }}");
      return `// Proposed API: yce-frontend has no Table yet\nimport Table from '@/components/common/table';\n\nconst columns = [\n  { key: 'name', heading: 'Heading', type: 'avatar', sortable: true },\n  { key: 'text', heading: 'Heading', type: 'text' },\n  { key: 'status', heading: 'Heading', type: 'badge' },\n  { key: 'count', heading: 'Heading', type: 'number', align: 'right', sortable: true },\n  { key: 'actions', heading: 'Heading', type: 'actionIcons', align: 'right' },\n];\n\n<Table\n  columns={columns}\n  rows={rows}\n${p.join("\n")}\n/>`;
    },
    variants,
    notes: [
      "Figma draws the header fill inconsistently (Header left Default has none, Header right Default uses Background/alternate). The page applies --background-sunken (same value) to the whole heading row; the Hover heading uses --fill-weaker as in Figma.",
      "Background/alternate has no token of its own here: --background-sunken is used. Line height 26px (Text bold, Link) has no token (--line-height-heading-5 is missing), so 1.625rem is used.",
      "Figma shows which rows are striped only as Colour=Alternate cells; the page stripes every even row (confirm with the designer which row starts).",
      "Not in Figma: a selected-row fill (--fill-brand-weak), the checked / indeterminate checkbox look, an empty state and a loading state. They are shown or omitted here as a proposal; the designer should confirm.",
      "Avatars use a neutral placeholder circle instead of the photo. Pagination is drawn inside the table component, as in Figma (the separate Pagination page is not used).",
      "Number cell: Figma has two booleans (trend up, trend down), both on by default; the table uses one arrow per row.",
      "Below 44rem the table scrolls horizontally inside its own frame.",
    ],
  });
})();
