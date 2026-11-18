/* Summary list · Figma 8168:66422. Config reference: COMPONENT-PAGES.md */
(() => {
  const ICON = {
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
    download: '<path d="M12 4v11m-5-4 5 5 5-5M5 20h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  };
  const icon = (n) => `<svg class="ycoSummaryList_icon" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

  /* One item of each Figma type. */
  const ITEM = {
    term: () => '<dt class="ycoSummaryList_item ycoSummaryList_term">Term</dt>',
    description: () => '<dd class="ycoSummaryList_item">Description</dd>',
    link: () => '<dd class="ycoSummaryList_item"><a class="ycoSummaryList_link" href="#">Label</a></dd>',
    // "Change" is the single action link the Figma list uses.
    change: () => '<dd class="ycoSummaryList_item ycoSummaryList_item_end"><a class="ycoSummaryList_link ycoSummaryList_link_small" href="#">Change</a></dd>',
    icons: () => `<dd class="ycoSummaryList_item ycoSummaryList_item_end"><div class="ycoSummaryList_actions">${["copy", "download", "trash", "more"].map((n) => `<button class="ycoSummaryList_iconButton" type="button" aria-label="${YCO.label(n)}">${icon(n)}</button>`).join("")}</div></dd>`,
    links: () => '<dd class="ycoSummaryList_item ycoSummaryList_item_end"><a class="ycoSummaryList_link ycoSummaryList_link_small" href="#">Copy</a><a class="ycoSummaryList_link ycoSummaryList_link_small" href="#">Download</a><a class="ycoSummaryList_link ycoSummaryList_link_small" href="#">Delete</a></dd>',
  };

  function list(s) {
    const row = () => `<div class="ycoSummaryList_row">
    ${ITEM.term()}
    ${ITEM[s.middle]()}
    ${s.action === "none" ? "" : ITEM[s.action]()}
  </div>`;
    return `<dl class="ycoSummaryList">
  ${Array.from({ length: Number(s.rows) }, row).join("\n  ")}
</dl>`;
  }

  const wrap = (item) => `<dl class="ycoSummaryList" style="width:12rem;border-top:0"><div class="ycoSummaryList_row">${item}</div></dl>`;

  YCO.page({
    id: "summary-list",
    group: "Content display",
    title: "Summary list",
    figma: "8168:66422",
    intro: "Term and value pairs in ruled rows, with an optional action at the end of each row: one link, a set of links, or icon buttons.",
    controls: [
      { key: "middle", label: "Value", type: "chips", options: [{ value: "description", label: "Description" }, { value: "link", label: "Link" }], default: "description" },
      { key: "action", label: "Action", type: "chips", options: [{ value: "change", label: "Link" }, { value: "links", label: "Links" }, { value: "icons", label: "Icons" }, { value: "none", label: "None" }], default: "change" },
      { key: "rows", label: "Rows", type: "chips", options: ["3", "5"], default: "5" },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? `<div style="width:100%;background:var(--background-base)">${list(s)}</div>` : list(s)),
    react: (s) => {
      const act = { change: "<a href=\"#\">Change</a>", links: "<>\n        <a href=\"#\">Copy</a>\n        <a href=\"#\">Download</a>\n        <a href=\"#\">Delete</a>\n      </>", icons: "<SummaryList.IconActions actions={['copy', 'download', 'trash', 'more']} />" }[s.action];
      return `// Proposed API: yce-frontend has no SummaryList yet\nimport SummaryList from '@/components/common/summary-list';\n\n<SummaryList>\n  {items.map((item) => (\n    <SummaryList.Row\n      key={item.id}\n      term="Term"\n      value={${s.middle === "link" ? '<a href="#">Label</a>' : '"Description"'}}${act ? `\n      action={${act}}` : ""}\n    />\n  ))}\n</SummaryList>`;
    },
    variants: () => [
      { label: "Summary list", wide: true, html: list({ middle: "description", action: "change", rows: 5 }) },
      { label: "Summary list / Link value, icon actions", wide: true, html: list({ middle: "link", action: "icons", rows: 3 }) },
      { label: "Summary list / Action links", wide: true, html: list({ middle: "description", action: "links", rows: 3 }) },
      { label: "Item / Term", html: wrap(ITEM.term()) },
      { label: "Item / Description", html: wrap(ITEM.description()) },
      { label: "Item / Link", html: wrap(ITEM.link()) },
      { label: "Item / Action icons", html: wrap(ITEM.icons()) },
      { label: "Item / Action links", html: wrap(ITEM.links()) },
    ],
    notes: [
      "Line height 26px (Term) has no token (--line-height-heading-5 is missing); 1.625rem is used.",
      "Figma's list has Term, Description and a single \"Change\" link per row. The Link item (16px, Label) and Action icons / Action links items exist as separate Figma items; the Value and Action controls combine them.",
      "Figma lays the list out as three equal columns. On narrow screens (under 40rem) the term takes its own line: not in Figma, proposed.",
    ],
  });
})();
