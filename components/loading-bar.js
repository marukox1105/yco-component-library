/* Loading bar · Figma 5320:31941 (Bar 5320:31962, Spinner 1 14197:5832, Spinner 2 14197:5841, Dots 14197:5856). Config reference: COMPONENT-PAGES.md */
(() => {
  const KINDS = [{ value: "bar", label: "Bar" }, { value: "spinner1", label: "Spinner 1" }, { value: "spinner2", label: "Spinner 2" }, { value: "dots", label: "Dots" }];
  const PERCENTS = ["0", "25", "50", "75", "100"];

  const bar = (n, label) => `<div class="ycoLoadingBar" role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${n}">
  <div class="ycoLoadingBar_track"><span class="ycoLoadingBar_fill" style="width: ${n}%"></span></div>${label ? `\n  <span class="ycoLoadingBar_value">${n}%</span>` : ""}
</div>`;

  const spinner = (kind, frame, animate) => {
    const cls = ["ycoLoadingBar_spinner", `ycoLoadingBar_spinner_kind_${kind}`, animate ? "ycoLoadingBar_animated" : frame > 1 ? `ycoLoadingBar_frame_${frame}` : ""].filter(Boolean).join(" ");
    return `<span class="${cls}" role="status" aria-label="Loading">
  <span class="ycoLoadingBar_arc"></span>
  <span class="ycoLoadingBar_cap"></span>
</span>`;
  };

  // Figma Dots frames: 1, 3, 5, 7 level; 2, 4, 6 lift the first, second, third dot.
  const LIFT = { 2: 0, 4: 1, 6: 2 };
  const dots = (frame, animate) => `<span class="ycoLoadingBar_dots${animate ? " ycoLoadingBar_dots_animated" : ""}" role="status" aria-label="Loading">
${[0, 1, 2].map((i) => `  <span class="ycoLoadingBar_dot${!animate && LIFT[frame] === i ? " ycoLoadingBar_dot_lifted" : ""}"></span>`).join("\n")}
</span>`;

  function markup(s) {
    const animate = s.motion === "animated";
    if (s.kind === "bar") return bar(Number(s.percent), s.label);
    if (s.kind === "dots") return dots(Number(s.dotsFrame), animate);
    return spinner(s.kind === "spinner2" ? 2 : 1, Number(s.frame), animate);
  }

  const wrap = (html) => `<div style="display:flex;justify-content:center;width:100%">${html}</div>`;
  const all = [
    ...PERCENTS.map((p) => ({ label: `Bar / Percentage ${p}`, html: wrap(bar(Number(p), true)) })),
    { label: "Bar / Percentage 25 / no label", html: wrap(bar(25, false)) },
    ...[1, 2, 3, 4].map((f) => ({ label: `Spinner 1 / Variant ${f}`, html: spinner(1, f, false) })),
    ...[1, 2, 3, 4].map((f) => ({ label: `Spinner 2 / Variant ${f}`, html: spinner(2, f, false) })),
    ...[1, 2, 3, 4, 5, 6, 7].map((f) => ({ label: `Dots / Variant ${f}`, html: dots(f, false) })),
  ];

  YCO.page({
    id: "loading-bar",
    group: "Forms",
    title: "Loading bar",
    figma: "5320:31941",
    intro: "Shows that something is in progress. The bar fills to a known percentage; the two spinners and the dots loop for waits with no known length. Spinner and dots can be paused on any of Figma's frames.",
    controls: [
      { key: "kind", label: "Kind", type: "chips", options: KINDS, default: "bar" },
      { key: "percent", label: "Percentage", type: "chips", options: PERCENTS, default: "25", when: (s) => s.kind === "bar" },
      { key: "label", label: "Percentage label", type: "toggle", default: true, when: (s) => s.kind === "bar" },
      { key: "motion", label: "Motion", type: "chips", options: [{ value: "animated", label: "Animated" }, { value: "static", label: "Static frame" }], default: "animated", when: (s) => s.kind !== "bar" },
      { key: "frame", label: "Frame", type: "chips", options: ["1", "2", "3", "4"], default: "1", when: (s) => (s.kind === "spinner1" || s.kind === "spinner2") && s.motion === "static" },
      { key: "dotsFrame", label: "Frame", type: "chips", options: ["1", "2", "3", "4", "5", "6", "7"], default: "1", when: (s) => s.kind === "dots" && s.motion === "static" },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview && s.kind === "bar" ? wrap(markup(s)) : markup(s)),
    react: (s) => {
      if (s.kind === "bar") return `// Proposed API: yce-frontend has no LoadingBar yet\nimport { LoadingBar } from '@/components/common/loading-bar';\n\n<LoadingBar value={${s.percent}}${s.label ? " showValue" : ""} />`;
      const name = s.kind === "dots" ? "LoadingDots" : "Spinner";
      return `// Proposed API: yce-frontend has no ${name} yet\nimport { ${name} } from '@/components/common/loading-bar';\n\n<${name}${s.kind === "spinner2" ? ' variant="2"' : ""} />`;
    },
    variants: all,
    notes: [
      "Figma draws the spinner and dots as pre-rendered rotation / bounce frames (images, not vectors we can read). They are rebuilt here as one CSS animation; the Variant cells show the loop paused at those positions. Please confirm the speed, the exact arc length of Spinner 1 vs Spinner 2, and the dot size (6px here).",
      "The arc ends use --fill-strong; Spinner 2's grey tail uses --fill-disabled. Figma's exact gradient stops are not readable from the exported image.",
      "The bar track uses --fill-weak with a 4%/8% inner shadow (nearest token --grey-neutral-light-100); the fill uses --fill-brand-strong, Figma's fill/selected only exists in the dark theme.",
      "With reduced motion the spinner slows and the dots stop.",
    ],
  });
})();
