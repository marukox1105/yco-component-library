/* Pagination · Figma 4157:48294. Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoPagination";
  const TOTAL = 10;
  const SIZE = 10;
  const ARROW_L = '<path d="M19 12H5m0 0 6-6m-6 6 6 6"/>';
  const ARROW_R = '<path d="M5 12h14m0 0-6-6m6 6-6 6"/>';
  const icon = (d) => `<svg class="${P}_icon" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

  // 1, the current page and its neighbours, the last page, with "..." for the gaps.
  function pagesFor(c) {
    const set = new Set([1, c - 1, c, c + 1, TOTAL].filter((n) => n >= 1 && n <= TOTAL));
    const out = [];
    [...set].sort((a, b) => a - b).forEach((n, i, arr) => { if (i && n - arr[i - 1] > 1) out.push("gap"); out.push(n); });
    return out;
  }

  const page = (n, current, sc = "", disabled = false) => `<button class="${P}_page${n === current ? ` ${P}_page_selected` : ""}${sc}" type="button" data-page="${n}"${n === current ? ' aria-current="page"' : ""} aria-label="Page ${n}"${disabled ? " disabled" : ""}>${n}</button>`;

  function inner(s, current) {
    const first = current === 1;
    const last = current === TOTAL;
    if (s.device === "mobile") {
      return `<button class="${P}_step" type="button" data-step="-1" aria-label="Previous page"${first ? " disabled" : ""}>${icon(ARROW_L)}</button>
  <p class="${P}_status" aria-live="polite">${current} of ${TOTAL}</p>
  <button class="${P}_step" type="button" data-step="1" aria-label="Next page"${last ? " disabled" : ""}>${icon(ARROW_R)}</button>`;
    }
    const from = (current - 1) * SIZE + 1;
    return `<div class="${P}_buttons">
    <button class="${P}_step ${P}_step_prev" type="button" data-step="-1"${first ? " disabled" : ""}>${icon(ARROW_L)}<span>Previous</span></button>
    ${pagesFor(current).map((n) => (n === "gap" ? `<span class="${P}_gap" aria-hidden="true">...</span>` : page(n, current))).join("\n    ")}
    <button class="${P}_step ${P}_step_next" type="button" data-step="1"${last ? " disabled" : ""}><span>Next</span>${icon(ARROW_R)}</button>
  </div>
  ${s.summary ? `<p class="${P}_summary" aria-live="polite">Showing ${from} - ${Math.min(current * SIZE, 128)} of 128</p>` : ""}`;
  }

  const wrap = (s, current) => `<nav class="${P} ${P}_device_${s.device}" aria-label="Pagination">\n  ${inner(s, current)}\n</nav>`;

  function mount(el, s) {
    const nav = el.querySelector(`.${P}`);
    if (!nav) return;
    let current = Number(s.current);
    const draw = () => { nav.innerHTML = inner(s, current); };
    const go = (n, refocus) => {
      current = Math.max(1, Math.min(TOTAL, n)); draw();
      if (refocus) nav.querySelector(`[data-page="${current}"]`)?.focus();
    };
    nav.addEventListener("click", (e) => {
      const p = e.target.closest("[data-page]");
      const st = e.target.closest("[data-step]");
      if (p) go(Number(p.dataset.page), true);
      else if (st && !st.disabled) go(current + Number(st.dataset.step), false);
    });
    nav.addEventListener("keydown", (e) => {
      if (!e.target.closest("[data-page]")) return;
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); go(current + d, true); }
    });
  }

  const variants = [
    { label: "Desktop", html: wrap({ device: "desktop", summary: true }, 2), wide: true },
    { label: "Mobile", html: wrap({ device: "mobile" }, 2) },
  ];
  [false, true].forEach((selected) => ["default", "hover", "press", "focus", "disabled"].forEach((state) => {
    variants.push({ label: `Page item / ${selected ? "Selected" : "Unselected"} / ${YCO.label(state)}`, html: page(1, selected ? 1 : 0, YCO.stateClass(state), state === "disabled") });
  }));

  YCO.page({
    id: "pagination",
    group: "Navigation",
    title: "Pagination",
    figma: "4157:48294",
    statesCss: "components/pagination.states.css",
    intro: "Moves through a paged list. Desktop shows Previous, numbered pages with gaps, Next and a result summary; Mobile shows arrows and the current position. Click a page or Previous / Next, or use the left and right arrow keys on a page.",
    controls: [
      { key: "device", label: "Device", type: "chips", options: ["desktop", "mobile"], default: "desktop" },
      { key: "current", label: "Current page", type: "chips", options: ["1", "2", "5", "10"], default: "2" },
      { key: "summary", label: "Result summary", type: "toggle", default: true, when: (s) => s.device === "desktop" },
    ],
    surface: { wide: true },
    render: (s) => wrap(s, Number(s.current)),
    mount,
    react: (s) => `// Proposed API: yce-frontend has no Pagination yet\nimport Pagination from '@/components/common/pagination';\n\n<Pagination\n  device="${s.device}"\n  page={${s.current}}\n  pageCount={10}\n  pageSize={10}\n  total={128}\n  onChange={setPage}\n${s.device === "desktop" && !s.summary ? "" : ""}/>`,
    variants,
    notes: [
      "Figma draws only page 2 selected and shows no disabled Previous / Next; they disable at the first and last page here.",
      "The gap rule (first page, the current page and its neighbours, last page, with ... between) is inferred from one Figma example (1 2 3 ... 10); confirm it with the designer.",
      "Focus ring uses a 3px offset around the 40px page item; Figma draws an inset -4px ring with a 12px radius (-5px when selected).",
    ],
  });
})();
