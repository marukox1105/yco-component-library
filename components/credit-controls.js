/* Credit controls · private repo yco-collab-space, Storybook "UI / Credit Controls". Config reference: COMPONENT-PAGES.md */
(() => {
  const P = "ycoCreditControls";
  const PARTS = [
    { value: "header", label: "Header balance" },
    { value: "generate", label: "Generate" },
  ];
  const DEVICES = [
    { value: "desktop", label: "Desktop (showAdd)" },
    { value: "mobile", label: "Mobile (no add)" },
    { value: "responsive", label: "Follows viewport" },
  ];
  const defaults = {
    part: "header", device: "desktop", balance: "436", clickable: false, state: "default",
    label: "Generate", subtitle: "", cost: "10", costUnknown: false, originalCost: "", discountLabel: "", disabled: false, isLoading: false,
  };

  const COIN = `<svg class="${P}_coin" viewBox="0 0 26 26" aria-hidden="true"><circle class="${P}_coinRing" cx="13" cy="13" r="12.4"/><path class="${P}_coinMark" d="M16.7 9.3A5.2 5.2 0 1 0 16.7 16.7"/></svg>`;
  const ADD = `<span class="${P}_addIcon" aria-hidden="true"><svg class="${P}_addGlyph" viewBox="0 0 26 26"><path d="M12.17 18.83v-5h-5a.83.83 0 1 1 0-1.67h5v-5a.83.83 0 0 1 1.67 0v5h5a.83.83 0 0 1 0 1.67h-5v5a.83.83 0 1 1-1.67 0Z"/></svg></span>`;
  const badge = (credits) => `<span class="${P}_badge">${COIN}<span class="${P}_cost">${credits}</span></span>`;
  const has = (v) => v !== null && v !== undefined && String(v).trim() !== "";

  function header(s, ctx) {
    const sc = s.state === "focus" ? ctx.sc : "";
    const add = s.device === "desktop" || s.device === "responsive";
    const attr = s.device === "responsive" ? " data-add-responsive" : "";
    const inner = `${COIN}\n  <span>${s.balance}</span>${add ? `\n  ${ADD}` : ""}`;
    return s.clickable
      ? `<button class="${P}_control${sc}" type="button" aria-label="${s.balance} credits"${attr}>\n  ${inner}\n</button>`
      : `<div class="${P}_control" aria-label="${s.balance} credits"${attr}>\n  ${inner}\n</div>`;
  }

  function generate(s, ctx) {
    const loading = s.isLoading;
    const showCredit = !loading && !s.costUnknown && has(s.cost);
    const discounted = showCredit && has(s.originalCost);
    const twoLine = has(s.subtitle);
    const cls = [
      "ycoButton variant_primary tone_brand size_medium", `${P}_generate`,
      twoLine ? `${P}_generate_twoLine${showCredit ? ` ${P}_generate_twoLineCredit` : ""}` : (showCredit ? "" : `${P}_generate_noCredit`),
      loading ? "isLoading" : "",
    ].filter(Boolean).join(" ") + (ctx.sc || "");
    const attrs = s.disabled || loading ? ` disabled${loading ? ' aria-busy="true"' : ""}` : "";
    const text = loading ? "Generating…" : s.label;
    const spinner = loading ? `\n    <span class="buttonIcon"><span class="${P}_spinner" aria-hidden="true"></span></span>` : "";
    return `<div class="${P}_actionBar">
  <button class="${cls}" type="button"${attrs}>
    <span class="label ${P}_generateLabel">
      <span class="${P}_generateText">
        <span>${text}</span>${twoLine && !loading ? `\n        <span class="${P}_subtitle">${s.subtitle}</span>` : ""}
      </span>${showCredit ? `\n      ${badge(s.cost)}` : ""}${discounted ? `\n      <span class="${P}_originalCost">${s.originalCost}</span>` : ""}
    </span>${spinner}
  </button>${showCredit && has(s.discountLabel) ? `\n  <span class="${P}_discountTag">${s.discountLabel}</span>` : ""}
</div>`;
  }

  function markup(s, ctx) {
    if (s.part === "generate") return generate(s, ctx);
    return header(s, ctx);
  }

  const stage = (html) => `<div class="${P}_stage">${html}</div>`;
  const render = (s, ctx) => {
    const html = markup(s, ctx);
    return ctx.preview && s.part === "generate" ? stage(html) : html;
  };

  const V = (over) => ({ ...defaults, ...over });
  const gen = (label, over, sc = "") => ({ label, wide: true, html: stage(generate(V(over), { sc })) });
  const small = (label, s) => ({ label, html: markup(V(s), { sc: YCO.stateClass("focus") }) });
  const TWO = { subtitle: "Second line" };
  const DISC = { originalCost: "20", discountLabel: "20%OFF" };

  // Storybook has three stories: Header Balance (Desktop), Header Balance (Mobile) and one Generate story whose options are
  // controls. The grid mirrors that; hover, disabled, two lines, discount and the rest are the controls above.
  const variants = [
    small("Header Balance (Desktop)", { part: "header" }),
    small("Header Balance (Mobile)", { part: "header", device: "mobile" }),
    gen("Generate", {}),
  ];

  const js = (v) => JSON.stringify(v);
  function react(s) {
    const imp = (names) => `import { ${names} } from 'platform/ui/credit-controls/index.js';\n\n`;
    if (s.part === "generate") {
      const p = [];
      if (s.label !== "Generate") p.push(`  label=${js(s.label)}`);
      if (has(s.subtitle)) p.push(`  subtitle=${js(s.subtitle)}`);
      p.push(s.costUnknown ? "  cost={null}" : `  cost={${Number(s.cost) || 0}}`);
      if (has(s.originalCost)) p.push(`  originalCost={${Number(s.originalCost) || 0}}`);
      if (has(s.discountLabel)) p.push(`  discountLabel=${js(s.discountLabel)}`);
      if (s.disabled) p.push("  disabled");
      if (s.isLoading) p.push("  isLoading");
      p.push("  onClick={handleGenerate}");
      return `${imp("GenerateActionBar")}<GenerateActionBar\n${p.join("\n")}\n/>`;
    }
    const p = [`  balance={${Number(s.balance) || 0}}`];
    if (s.device !== "responsive") p.push(`  showAdd={${s.device === "desktop"}}`);
    if (s.clickable) p.push("  onClick={openCreditsDialog}");
    return `${imp("CreditControl")}<CreditControl\n${p.join("\n")}\n/>`;
  }

  YCO.page({
    id: "credit-controls",
    group: "Elements",
    title: "Credit controls",
    figma: "",
    needs: ["button"],
    statesCss: "components/credit-controls.states.css",
    intro: "How a credit balance and a credit price are shown: the header balance (coin, number, an add button on desktop), the Generate action bar (a brand button carrying its cost, an optional second line and a discount) whose cost pill is the credit badge.",
    controls: [
      { key: "part", label: "Part", type: "chips", options: PARTS, default: defaults.part },
      { key: "device", label: "Header width", type: "chips", options: DEVICES, default: defaults.device, when: (s) => s.part === "header" },
      { key: "balance", label: "balance", type: "text", default: defaults.balance, when: (s) => s.part === "header" },
      { key: "clickable", label: "onClick (renders a button)", type: "toggle", default: false, when: (s) => s.part === "header" },
      { key: "label", label: "label", type: "text", default: defaults.label, when: (s) => s.part === "generate" },
      { key: "subtitle", label: "subtitle (second line)", type: "text", default: "", when: (s) => s.part === "generate" },
      { key: "cost", label: "cost", type: "text", default: defaults.cost, when: (s) => s.part === "generate" },
      { key: "costUnknown", label: "Cost not known yet (cost null)", type: "toggle", default: false, when: (s) => s.part === "generate" },
      { key: "originalCost", label: "originalCost", type: "text", default: "", when: (s) => s.part === "generate" },
      { key: "discountLabel", label: "discountLabel", type: "text", default: "", when: (s) => s.part === "generate" },
      { key: "disabled", label: "disabled", type: "toggle", default: false, when: (s) => s.part === "generate" },
      { key: "isLoading", label: "isLoading", type: "toggle", default: false, when: (s) => s.part === "generate" },
      {
        key: "state", label: "State", type: "chips", default: "default",
        options: (s) => (s.part === "generate" ? ["default", "hover", "press", "focus"] : ["default", "focus"]),
        when: (s) => s.part === "generate" || (s.part === "header" && s.clickable),
      },
    ],
    surface: (s) => ({ wide: s.part === "generate", minHeight: s.part === "generate" ? 140 : 0 }),
    render,
    react,
    variants,
    notes: [
      "Lives in the private yco-collab-space repo (platform/ui/credit-controls, Storybook UI / Credit Controls), not in yce-frontend. The React tab uses its real props and import path; yce-frontend has no equivalent yet.",
      "The Generate bar is the shared Button (brand, primary, medium) with the label and credit badge inside it, so it uses .ycoButton markup. The page overrides Button's height (44px with the pill, 42px without, 56px with a second line) and its disabled look (one flat grey, white text, no fade).",
      "The collab-space Button also draws a loading spinner and the flat-grey disabled state itself; this site's button.module.css does not yet, so those two are drawn here with ycoCreditControls_spinner and the :disabled rule on ycoCreditControls_generate.",
      "Sizes with no token are in rem: the 28px badge (1.75rem), the 26px header coin and add button (1.625rem), the 42px, 44px and 56px Generate heights, the 12px original price and tag (--font-size-micro and --line-height-micro are not in the light :root here), the 64px left padding on a two-line button with a pill (no --spacing-64), the 22px tag radius, and the 400 and 900 font weights (no --font-weight-weak or black token).",
      "The coin is drawn in CSS and inline SVG from --yellow-solid-1000 and --amber-light-1000 (palette tokens, so it stays gold in dark mode); the designer's own SVG has a slightly different gradient and a 'C' with angled ends. Confirm or supply a token pair.",
      "The credit pill inside Generate is no longer a story of its own; its tint is --grey-neutral-light-100 (10% black), as in the source. On the brand button it sits on --fill-brand-strong, so it darkens the button; on a disabled button it is a plain tint over the grey;",
      "The header add button's circle uses --fill-hover where the source SVG bakes in a 10% near-black fill, so it stays visible on the dark theme.",
      "Header balance: left to follow the viewport, the add button is hidden at 768px and below; the stories pin it with showAdd. With onClick the header is a button and gets the focus ring; without it, a plain div.",
    ],
  });
})();
