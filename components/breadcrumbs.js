/* Breadcrumbs · Figma 4993:5844. Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoBreadcrumbs";
  const link = (cur) => (cur ? `<a class="${P}_link ${P}_link_current" href="#" aria-current="page">Label</a>` : `<a class="${P}_link" href="#">Label</a>`);
  const item = (inner) => `<li class="${P}_item">${inner}</li>`;

  function crumbs(type, count) {
    if (type === "collapsed") {
      return [item(link()), item(`<button class="${P}_link" type="button" data-expand aria-label="Show hidden pages">...</button>`), item(link(true))];
    }
    return Array.from({ length: count }, (_, i) => item(link(i === count - 1)));
  }
  const markup = (type, count) => `<nav class="${P} ${P}_type_${type}" aria-label="Breadcrumb">
  <ol class="${P}_list">
    ${crumbs(type, count).join("\n    ")}
  </ol>
</nav>`;

  function mount(el, s) {
    const nav = el.querySelector(`.${P}`);
    const btn = nav && nav.querySelector("[data-expand]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const holder = document.createElement("div");
      holder.innerHTML = markup("default", 4);
      nav.replaceWith(holder.firstElementChild);
      el.querySelector(`.${P}_link`)?.focus();
    });
  }

  const variants = [
    { label: "Default / 3 items", html: markup("default", 3) },
    { label: "Default / 5 items", html: markup("default", 5) },
    { label: "Default / 8 items", html: markup("default", 8) },
    { label: "Collapsed", html: markup("collapsed", 3) },
  ];

  YCO.page({
    id: "breadcrumbs",
    group: "Navigation",
    title: "Breadcrumbs",
    figma: "4993:5844",
    intro: "Shows where the current page sits in the site. The last item is the current page; Collapsed hides the middle levels behind a button that reveals them.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: ["default", "collapsed"], default: "default" },
      { key: "count", label: "Items", type: "chips", options: ["2", "3", "4", "5", "6", "7", "8"], default: "3", when: (s) => s.type === "default" },
    ],
    render: (s) => markup(s.type, Number(s.count)),
    mount,
    react: (s) => `// Proposed API: yce-frontend has no Breadcrumbs yet\nimport Breadcrumbs from '@/components/common/breadcrumbs';\n\n<Breadcrumbs\n  items={[${s.type === "collapsed" ? "{ label: 'Label', href: '/' }, { label: 'Label' }" : Array.from({ length: Number(s.count) }, () => "{ label: 'Label', href: '/' }").join(", ")}]}\n  collapsed={${s.type === "collapsed"}}\n/>`,
    variants,
    notes: [
      "Figma sets the first three items in 12px semibold and items 4 to 8 in 14px regular; this page uses 12px semibold for every item (the second is almost certainly a Figma slip).",
      "The 12px label size has no font-size token (--font-size-micro is not in the light :root), so it is written as 0.75rem / 1rem.",
      "The slash separator is drawn with ::before and --icon-neutral, as in Figma.",
    ],
  });
})();
