/* Sidebar manifest: Figma's component list, grouped like its All components board.
   An entry is clickable once its page is registered (components/<id>.js calls YCO.page).
   `legacy` entries are the two hand-built pages that predate the engine. `figma` is the
   Figma page node (file JXNIQPJT9I9qFrgtiaCn4i). */
// Bumped whenever a stylesheet changes, so browsers refetch components/*.css.
window.YCO_BUILD = "20261125b";
window.YCO_NAV = [
  { group: null, items: [{ id: "overview", label: "Overview", legacy: true }] },
  { group: "Elements", items: [
    { id: "buttons", label: "Button", legacy: true, figma: "3823:28983" },
    { id: "button-group", label: "Button group", figma: "4661:66290" },
    { id: "button-icon", label: "Button icon", figma: "6478:101404" },
    { id: "icon-container", label: "Icon container", figma: "6638:143061" },
    { id: "text-link", label: "Text link", figma: "4783:90492" },
    { id: "avatar", label: "Avatar", figma: "4063:39892" },
    { id: "tag", label: "Tag", figma: "4136:45445" },
    { id: "badge", label: "Badge", figma: "4136:44588" },
    { id: "badge-count", label: "Badge count", figma: "4661:66038" },
    { id: "badge-dot", label: "Badge dot", figma: "6478:100529" },
    { id: "slot", label: "Slot", figma: "5367:7872" },
    { id: "scrollbar", label: "Scrollbar", figma: "13491:401" },
  ] },
  { group: "Forms", items: [
    { id: "text-input", label: "Text input", figma: "3823:28845" },
    { id: "text-area", label: "Text area", figma: "3831:37803" },
    { id: "select", label: "Select", figma: "3831:38234" },
    { id: "search-input", label: "Search input", figma: "4865:151602" },
    { id: "autocomplete", label: "Autocomplete", figma: "3831:38785" },
    { id: "combobox", label: "Combobox", figma: "6736:182892" },
    { id: "date-picker", label: "Date picker", figma: "3909:33038" },
    { id: "file-upload", label: "File upload", figma: "5285:79574" },
    { id: "slider", label: "Slider", figma: "4993:6497" },
    { id: "loading-bar", label: "Loading bar", figma: "5320:31941" },
    { id: "progress-indicator", label: "Progress indicator", figma: "4157:47199" },
    { id: "checkboxes", label: "Checkboxes", figma: "3832:41623" },
    { id: "radio-buttons", label: "Radio buttons", figma: "3832:40131" },
    { id: "stepper", label: "Stepper", figma: "3965:36404" },
    { id: "toggle", label: "Toggle", figma: "3834:44518" },
    { id: "prompt-composer", label: "Prompt Composer", figma: "15742:21191" },
  ] },
  { group: "Feedback", items: [
    { id: "toast", label: "Alert (Toast)", legacy: true, figma: "4109:42475" },
    { id: "alert-global", label: "Alert global", figma: "5785:53468" },
    { id: "empty-state", label: "Empty state", figma: "4865:151487" },
    { id: "empty-image", label: "Empty image", figma: "13023:5838" },
  ] },
  { group: "Navigation", items: [
    { id: "navigation-header", label: "Navigation header", figma: "6143:45465" },
    { id: "footer", label: "Footer", figma: "7217:129740" },
    { id: "tabs", label: "Tabs", figma: "4157:46485" },
    { id: "pagination", label: "Pagination", figma: "4157:48294" },
    { id: "segmented-control", label: "Segmented control", figma: "6373:78550" },
    { id: "breadcrumbs", label: "Breadcrumbs", figma: "4993:5844" },
    { id: "navigation-side", label: "Navigation side", figma: "5635:96897" },
  ] },
  { group: "Surfaces", items: [
    { id: "modal", label: "Modal / Overlay", figma: "4109:43377" },
    { id: "drawer", label: "Drawer", figma: "5358:7210" },
    { id: "card", label: "Card", figma: "3981:37974" },
    { id: "tooltip", label: "Tooltip", figma: "4136:45743" },
    { id: "dropdown-menu", label: "Dropdown menu", figma: "3834:44802" },
  ] },
  { group: "Content display", items: [
    { id: "table", label: "Table", figma: "5418:55773" },
    { id: "summary-list", label: "Summary list", figma: "8168:66422" },
    { id: "accordion", label: "Accordion", figma: "3812:28380" },
    { id: "text", label: "Text", figma: "5371:9961" },
    { id: "text-block", label: "Text block", figma: "8119:52164" },
    { id: "divider", label: "Divider", figma: "3981:37904" },
  ] },
  { group: "Marketing", items: [
    { id: "hero", label: "Hero", figma: "6687:289765" },
    { id: "testimonial", label: "Testimonial", figma: "8120:53895" },
    { id: "rating", label: "Rating", figma: "6683:288013" },
  ] },
];

(() => {
  const nav = document.querySelector("#componentNav");
  if (!nav) return;
  const esc = window.YCO.esc;
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const KEY = "yco-nav-collapsed";
  const CHEVRON = '<svg class="nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  // Which groups the viewer collapsed. Storage can be blocked (private window), so every access is guarded.
  let collapsed = [];
  try { collapsed = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { collapsed = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(collapsed)); } catch (e) { /* the page works without it */ } };

  const link = (i) => (i.legacy || window.YCO.has(i.id)
    ? `<a class="side-link" href="#${i.id}" data-page-link="${i.id}">${esc(i.label)}</a>`
    : `<a class="side-link is-disabled" href="#" aria-disabled="true" tabindex="-1">${esc(i.label)}<span class="soon">Soon</span></a>`);

  nav.innerHTML = window.YCO_NAV.map((g) => {
    if (!g.group) return g.items.map(link).join("");
    const id = `navg-${slug(g.group)}`;
    const open = !collapsed.includes(g.group);
    return `<section class="nav-section" data-group="${esc(g.group)}">
      <button class="nav-group" type="button" aria-expanded="${open}" aria-controls="${id}"><span>${esc(g.group)}</span>${CHEVRON}</button>
      <div class="nav-items" id="${id}"${open ? "" : " hidden"}>${g.items.map(link).join("")}</div>
    </section>`;
  }).join("");

  function setOpen(section, open) {
    const name = section.dataset.group;
    section.querySelector(".nav-group").setAttribute("aria-expanded", String(open));
    section.querySelector(".nav-items").hidden = !open;
    collapsed = open ? collapsed.filter((g) => g !== name) : [...new Set([...collapsed, name])];
    save();
  }
  nav.addEventListener("click", (e) => {
    const head = e.target.closest(".nav-group");
    if (head) setOpen(head.closest(".nav-section"), head.getAttribute("aria-expanded") !== "true");
  });

  // The group that holds the page being shown is always open, so the active item is never hidden.
  function reveal(id) {
    const a = id && nav.querySelector(`[data-page-link="${id}"]`);
    const section = a && a.closest(".nav-section");
    if (section && section.querySelector(".nav-items").hidden) setOpen(section, true);
  }
  reveal(window.location.hash.replace("#", ""));
  window.addEventListener("hashchange", () => reveal(window.location.hash.replace("#", "")));
})();
