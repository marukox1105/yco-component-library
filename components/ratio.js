/* Ratio · aspect-ratio selector. Approved in Storybook (UI/Ratio); no Figma component set yet. Config reference: COMPONENT-PAGES.md */
(() => {
  const VARIANTS = ["default", "gery", "gery_v2", "image_extender"];
  const TITLE_VARIANTS = ["default", "gery"];
  const RATIOS = [{ w: 16, h: 9 }, { w: 9, h: 16 }, { w: 4, h: 3 }, { w: 3, h: 4 }, { w: 1, h: 1 }];
  const COUNTS = ["1", "2", "3", "4", "5"];
  const pair = (r) => `${r.w}:${r.h}`;
  const NAME = { default: "Default", gery: "Gery", gery_v2: "Gery v2", image_extender: "Image Extender" };
  const CONST = { default: "DEFAULT", gery: "GERY", gery_v2: "GERY_V2", image_extender: "IMAGE_EXTENDER" };
  let uid = 0;

  // Same maths as the component's shapeStyle(): contain-fit the w:h rectangle inside its box.
  const pct = (n) => `${Math.round(n * 100 * 100) / 100}%`;
  const shape = (r) => (r.h > r.w ? `width: ${pct(r.w / r.h)}; height: 100%` : `width: 100%; height: ${pct(r.h / r.w)}`);

  /** One group. o: variant, titleVariant, list (ratios), selected ("w:h" or ""), title (string or ""), disabled, focus, name. */
  function group(o) {
    const id = `${o.name}-title`;
    const columns = o.list.length <= 2 ? "two" : "three";
    const items = o.list.map((r) => {
      const attrs = ['class="ycoRatio_input"', 'type="radio"', `name="${o.name}"`, `value="${pair(r)}"`];
      if (pair(r) === o.selected) attrs.push("checked");
      if (o.disabled) attrs.push("disabled");
      const cls = "ycoRatio_option" + (o.focus && pair(r) === o.selected ? " is-focus" : "");
      return `<label class="${cls}">
  <input ${attrs.join(" ")} />
  <span class="ycoRatio_wrapper" aria-hidden="true"><span class="ycoRatio_shape"><span class="ycoRatio_swatch" style="${shape(r)}"></span></span></span>
  <span class="ycoRatio_text">${pair(r)}</span>
</label>`;
    });
    const head = o.title ? `\n  <h2 class="ycoRatio_title ycoRatio_titleVariant_${o.titleVariant}" id="${id}">${YCO.esc(o.title)}</h2>` : "";
    const aria = o.title ? `aria-labelledby="${id}"` : 'aria-label="Aspect ratio"';
    return `<section class="ycoRatio">${head}
  <div class="ycoRatio_content ycoRatio_variant_${o.variant} ycoRatio_columns_${columns}" role="radiogroup" ${aria}>
${items.map((h) => h.replace(/^/gm, "    ")).join("\n")}
  </div>
</section>`;
  }

  const fromState = (s, ctx) => ({
    variant: s.variant,
    titleVariant: s.titleVariant,
    list: RATIOS.slice(0, Number(s.count)),
    selected: s.selected === "none" ? "" : s.selected,
    title: s.title ? s.titleText : "",
    disabled: s.disabled,
    focus: ctx.preview && s.focus,
    name: ctx.preview ? "ratio" : "ratio",
  });

  const v = (label, o) => ({ label, html: group({ variant: "gery_v2", titleVariant: "gery", list: RATIOS, selected: "16:9", title: "Aspect ratio", disabled: false, focus: false, ...o, name: `ratio-v${++uid}` }) });
  const variants = [];
  // Default is shown with its RD title (regular weight); the other variants use the Gery title.
  variants.push(v("Default / Five ratios / Default title", { variant: "default", titleVariant: "default" }));
  variants.push(v("Default / Disabled", { variant: "default", titleVariant: "default", disabled: true }));
  variants.push(v("Gery / Five ratios", { variant: "gery" }));
  variants.push(v("Gery / Disabled", { variant: "gery", disabled: true }));
  variants.push(v("Gery v2 / Five ratios (three columns)", {}));
  variants.push(v("Gery v2 / Two options (two columns)", { list: RATIOS.slice(0, 2) }));
  variants.push(v("Gery v2 / Portrait selected", { selected: "9:16" }));
  variants.push(v("Gery v2 / Nothing selected", { selected: "" }));
  variants.push(v("Gery v2 / No title", { title: "" }));
  variants.push(v("Gery v2 / Disabled", { disabled: true }));
  variants.push(v("Gery v2 / Focus (keyboard)", { focus: true }));
  variants.push(v("Image Extender / Five ratios", { variant: "image_extender" }));
  variants.push(v("Image Extender / Two options", { variant: "image_extender", list: RATIOS.slice(0, 2) }));
  variants.push(v("Image Extender / Disabled", { variant: "image_extender", disabled: true }));
  variants.push(v("Image Extender / Focus (keyboard)", { variant: "image_extender", focus: true }));

  YCO.page({
    id: "ratio",
    group: "Forms",
    title: "Ratio",
    figma: "15012:276926",
    statesCss: "components/ratio.states.css",
    intro: "Pick the aspect ratio of an image or video: a list of swatches, each drawn in its own w:h shape with the ratio as its label. It is a single-choice group of real radio inputs, so the arrow keys move the choice. Four variants; Gery v2 lays out in two columns for two options and three for more.",
    controls: [
      { key: "variant", label: "Variant", type: "chips", options: VARIANTS.map((x) => ({ value: x, label: NAME[x] })), default: "gery_v2" },
      { key: "count", label: "Number of ratios", type: "chips", options: COUNTS, default: "5" },
      { key: "selected", label: "Selected ratio", type: "chips", options: (s) => [...RATIOS.slice(0, Number(s.count)).map((r) => ({ value: pair(r), label: pair(r) })), { value: "none", label: "None" }], default: "16:9" },
      { key: "title", label: "Title", type: "toggle", default: true },
      { key: "titleText", label: "Title text", type: "text", default: "Aspect ratio", when: (s) => s.title },
      { key: "titleVariant", label: "Title variant", type: "chips", options: TITLE_VARIANTS.map((x) => ({ value: x, label: NAME[x] })), default: "gery", when: (s) => s.title },
      { key: "disabled", label: "Disabled", type: "toggle", default: false },
      { key: "focus", label: "Show focus ring (doc only)", type: "toggle", default: false, when: (s) => !s.disabled },
    ],
    surface: { start: true },
    render: (s, ctx) => group(fromState(s, ctx)),
    // The radios are real: a click or an arrow key changes the choice, and the Selected ratio chip follows.
    mount: (el, s) => {
      if (el.dataset.ratioBound) return;
      el.dataset.ratioBound = "1";
      el.addEventListener("change", (e) => {
        const input = e.target.closest('input[type="radio"]');
        const chip = input && el.closest("#enginePage").querySelector(`button[data-ctl="selected"][data-value="${input.value}"]`);
        if (!chip) return;
        chip.click();
        const next = el.querySelector(`input[value="${input.value}"]`);
        if (next) next.focus();
      });
    },
    react: (s) => {
      const p = ["  ratioList={ratioList}", "  ratio={ratio}", "  setRatio={setRatio}"];
      const noTitle = !s.title;
      if (noTitle) p.push('  title="" // the heading still renders; hiding it is a change to Ratio.jsx');
      else if (s.titleText !== "Aspect ratio") p.push(`  title=${JSON.stringify(s.titleText)}`);
      p.push(`  variant={ratioTypes.${CONST[s.variant]}}`);
      if (s.title && s.titleVariant !== "gery") p.push(`  titleVariant={ratioTitleTypes.${CONST[s.titleVariant]}}`);
      if (s.disabled) p.push("  disabled");
      const list = RATIOS.slice(0, Number(s.count)).map((r) => `  { id: '${r.w}-${r.h}', w: ${r.w}, h: ${r.h} },`).join("\n");
      const sel = s.selected === "none" ? "null" : `{ w: ${s.selected.split(":")[0]}, h: ${s.selected.split(":")[1]} }`;
      const imports = `import Ratio, { ratioTypes${s.title && s.titleVariant !== "gery" ? ", ratioTitleTypes" : ""} } from '@/platform/ui/ratio';`;
      return `${imports}\n\nconst ratioList = [\n${list}\n];\n\nconst [ratio, setRatio] = useState(${sel});\n\n<Ratio\n${p.join("\n")}\n/>`;
    },
    variants,
    notes: [
      "This page follows the approved Storybook component UI/Ratio (platform/ui/ratio in the private collab-space repo); the original is RD's yce-frontend src/components/common/ratio. There is no Figma component set yet; the Figma node shown is the Dev Mode node (15012:276926) the sizes were checked against.",
      "Ratio.jsx draws each option as a <button aria-pressed>. This page draws real radio inputs in a radiogroup, so the arrow keys move the choice and one option is in the tab order. The look is the same; RD must confirm it accepts the markup change.",
      "No corner-radius-4 token: the option card uses 0.25rem, the swatch 0.125rem (2px, a Designer instruction in the source). No spacing-96 token: the phone minimum width of a Gery v2 option is 6.5rem (104px) and of an Image Extender option 5.5rem (88px); the Image Extender minimum height is 4.625rem (74px). No font-weight-weak token: the Default title uses 400.",
      "Ratio has no hover or focus style in the source (the browser's default focus ring shows on the button). This page adds the library's 3px --stroke-focus ring on the focused option so a keyboard user can see where they are; the designer must confirm it.",
      "Default and Gery size the option to its content, so the selected Gery option (2px border) is 2px wider than the others and the row shifts by 2px when the choice changes; Gery v2 and Image Extender are grid cells and do not shift. The Default variant draws a 3px --stroke-inverse-strong border, a 60% white line that is barely visible on a light page.",
      "Disabled fades the whole option with opacity 0.3 (Figma's Opacity 30% on the group) instead of disabled colour tokens.",
      "The source always renders the title heading; a Title toggle that hides it is only on this page. Under 768px Gery v2 and Image Extender become a horizontal swipe strip with the scrollbar hidden; the doc removes the full-bleed margin there because the preview cards have no gutter.",
    ],
  });
})();
