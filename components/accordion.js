/* Accordion · Figma 3812:28380. Config reference: COMPONENT-PAGES.md */
(() => {
  const BODY = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus blandit euismod. Pellentesque et blandit nunc, ultricies aliquam lectus. Nam et urna vitae libero blandit vestibulum in id ex.";
  const CHEVRON = '<svg class="ycoAccordion_chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  function item({ open = false, state = "default", sc = "", group = "", heading = "Heading label" } = {}) {
    const disabled = state === "disabled";
    const cls = `ycoAccordion_item${disabled ? " ycoAccordion_item_disabled" : ""}${sc}`;
    return `<details class="${cls}"${group ? ` name="${group}"` : ""}${open ? " open" : ""}>
    <summary class="ycoAccordion_header"${disabled ? ' aria-disabled="true" tabindex="-1"' : ""}>
      <span class="ycoAccordion_label">${heading}</span>
      ${CHEVRON}
    </summary>
    <div class="ycoAccordion_content">
      <p>${BODY}</p>
    </div>
  </details>`;
  }

  const list = (items) => `<div class="ycoAccordion">\n  ${items.join("\n  ")}\n</div>`;

  function markup(s, ctx) {
    const group = s.mode === "single" ? "accordion" : "";
    const n = Number(s.items);
    const items = Array.from({ length: n }, (_, i) => (i === 0 ? item({ open: s.open, state: s.state, sc: ctx.sc, group }) : item({ group })));
    return list(items);
  }

  const variants = () => {
    const out = [{ label: "Accordion / 5 closed items", html: list(Array.from({ length: 5 }, () => item())) }];
    [false, true].forEach((open) => ["default", "hover", "press", "focus", "disabled"].forEach((state) => {
      out.push({ label: `Open ${open ? "True" : "False"} / ${YCO.label(state)}`, html: list([item({ open, state, sc: YCO.stateClass(state) })]) });
    }));
    out.push({ label: "Single open at a time (name attribute)", html: list([item({ open: true, group: "demo" }), item({ group: "demo" }), item({ group: "demo" })]) });
    return out.map((v) => ({ ...v, wide: true }));
  };

  YCO.page({
    id: "accordion",
    group: "Content display",
    title: "Accordion",
    figma: "3812:28380",
    intro: "Stacked headings that each reveal a section of content. Built on details and summary, so it opens with the keyboard and without script. Items can open independently or one at a time.",
    statesCss: "components/accordion.states.css",
    controls: [
      YCO.stateControl(),
      { key: "open", label: "First item open", type: "toggle", default: true },
      { key: "mode", label: "Open items", type: "chips", options: [{ value: "multiple", label: "Several" }, { value: "single", label: "One at a time" }], default: "multiple" },
      { key: "items", label: "Items", type: "chips", options: ["3", "5"], default: "3" },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? `<div style="width:100%;max-width:37.5rem;margin:0 auto;background:var(--background-base)">${markup(s, ctx)}</div>` : markup(s, ctx)),
    mount: (el) => {
      // Keep a disabled item shut, and close the others when the group is exclusive (older browsers ignore `name`).
      el.querySelectorAll("details").forEach((d) => {
        const sum = d.querySelector("summary");
        if (d.classList.contains("ycoAccordion_item_disabled")) sum.addEventListener("click", (e) => e.preventDefault());
        d.addEventListener("toggle", () => {
          const name = d.getAttribute("name");
          if (d.open && name) el.querySelectorAll(`details[name="${name}"]`).forEach((o) => { if (o !== d) o.open = false; });
        });
      });
    },
    react: (s) => {
      const first = [s.state === "disabled" ? " disabled" : "", s.open ? " defaultOpen" : ""].join("");
      return `// Proposed API: yce-frontend has no Accordion yet\nimport Accordion from '@/components/common/accordion';\n\n<Accordion${s.mode === "single" ? ' type="single"' : ""}>\n  <Accordion.Item heading="Heading label"${first}>\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n  </Accordion.Item>\n  <Accordion.Item heading="Heading label">\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n  </Accordion.Item>\n</Accordion>`;
    },
    variants,
    notes: [
      "Line height 26px (heading) has no token (--line-height-heading-5 is missing); 1.625rem is used.",
      "Figma's Hover and Press draw the whole item (heading and content) with the fill and an underlined heading; the page does the same on :hover and :active of the item.",
      "A <details> cannot be disabled: a disabled item is aria-disabled, drops out of the tab order and ignores clicks. RD should do the same in the React component.",
      "Single / multiple open is not drawn in Figma. The page uses the details name attribute (exclusive group), with a script fallback in the preview. The chevron turns up when open, as in Figma.",
    ],
  });
})();
