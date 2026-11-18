/* Footer · Figma 7217:129740. Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoFooter";
  const DEVICES = [{ value: "desktop", label: "Desktop" }, "tablet", "mobile"];
  const SIZES = ["small", "large"];
  const SOCIAL = [
    ["Instagram", '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/>', false],
    ["Facebook", '<path d="M12 21v-8m0 0h3l.5-3.5H12V7.8c0-1 .5-1.8 2-1.8h1.6V3.2C15 3.1 14 3 13 3c-2.6 0-4 1.600-4 4.200v2.300H6.500V13H9v8"/>', false],
    ["LinkedIn", '<path d="M5 9.5V19M5 5.5v.01M9.500 19v-9.500m0 3.500c0-2 1.500-3.500 3.500-3.500s3.500 1.300 3.500 3.500V19"/>', false],
    ["X", '<path d="m5 4 14 16M19 4 5 20"/>', false],
    ["YouTube", '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10.500 9.500 4 2.500-4 2.500z"/>', false],
  ];
  const social = () => `<ul class="${P}_social" aria-label="Social media">
${SOCIAL.map(([n, d]) => `      <li><a class="${P}_socialLink" href="#" aria-label="${n}"><svg class="${P}_socialIcon" viewBox="0 0 24 24" aria-hidden="true">${d}</svg></a></li>`).join("\n")}
    </ul>`;
  const logo = `<a class="${P}_logo" href="#" aria-label="Home"><span class="${P}_logoMark" aria-hidden="true">Logo</span><span class="${P}_logoText">Wordmark</span></a>`;
  const links = (n, cls) => `<ul class="${cls}">${Array.from({ length: n }, () => `\n        <li><a class="${P}_link" href="#">Label</a></li>`).join("")}\n      </ul>`;

  function markup(s) {
    const cls = `${P} ${P}_device_${s.device} ${P}_size_${s.size}`;
    const copy = `<p class="${P}_copyright">&copy; 2024 Practical UI</p>`;
    if (s.size === "small") {
      return `<footer class="${cls}">
  <div class="${P}_top">
    ${logo}
    ${social()}
  </div>
  <div class="${P}_bottomSmall">
    <nav aria-label="Footer">
      ${links(5, `${P}_navSmall`)}
    </nav>
    ${copy}
  </div>
</footer>`;
    }
    const topic = `<nav class="${P}_topic" aria-label="Topic">
      <h2 class="${P}_heading">Topic</h2>
      ${links(5, `${P}_list`)}
    </nav>`;
    return `<footer class="${cls}">
  <div class="${P}_content">
    <div class="${P}_about">
      ${logo}
      <p class="${P}_aboutText">Lorem ipsum dolor sit amet, consec tetur adipiscing elit etiam finibus blan dit.</p>
    </div>
    <div class="${P}_links">
      ${[1, 2, 3, 4, 5].map(() => topic).join("\n      ")}
    </div>
  </div>
  <div class="${P}_bottom">
    ${copy}
    ${social()}
  </div>
</footer>`;
  }

  const variants = [];
  SIZES.forEach((size) => DEVICES.forEach((d) => {
    const device = typeof d === "object" ? d.value : d;
    variants.push({ label: `${YCO.label(size)} / ${YCO.label(device)}`, html: `<div style="width:100%;max-width:${{ desktop: "none", tablet: "48rem", mobile: "23.4375rem" }[device]}">${markup({ device, size })}</div>`, wide: true });
  }));

  YCO.page({
    id: "footer",
    group: "Navigation",
    title: "Footer",
    figma: "7217:129740",
    intro: "The site footer: logo, link columns, copyright and social links. Small is a compact bar with one row of links; Large adds an about text and five link columns. It adapts to Desktop, Tablet and Mobile.",
    controls: [
      { key: "device", label: "Device", type: "chips", options: DEVICES, default: "desktop" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "large" },
    ],
    surface: { wide: true, start: true },
    render: (s, ctx) => {
      const out = markup(s);
      return ctx.preview ? `<div style="width:100%;overflow-x:auto"><div style="min-width:${{ desktop: "60rem", tablet: "48rem", mobile: "23.4375rem" }[s.device]}">${out}</div></div>` : out;
    },
    react: (s) => `// yce-frontend has Footer (@/components/common/footer) with no props: it reads locale, device and user status itself.\n// Proposed API for the doc-site contract, if it is split into a presentational component:\nimport Footer from '@/components/common/footer';\n\n<Footer device="${s.device}" size="${s.size}" />`,
    variants,
    notes: [
      "The wide preview scrolls sideways in a narrow pane; the variant grid shows each device at its Figma width (Desktop fills the cell).",
      "Social icons are simple stroke glyphs drawn for this page; Figma uses filled brand marks. Use the brand assets in production.",
      "The logo is a neutral placeholder (Figma: 146 x 42 logo); the mobile / tablet Large and Small layouts were read from the Figma frame geometry, copy is placeholder.",
      "Mobile Large link columns are two per row with the fifth on its own row (row gap 37px in Figma, 36px here).",
    ],
  });
})();
