/* Card · Figma 3981:37974 (set 3472:58376). Config reference: COMPONENT-PAGES.md */
(() => {
  const SLOTS = [1, 2, 3, 4, 5];
  const DIAMOND = '<svg class="ycoCard_iconGlyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.7 3.7l7.6 7.6a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0l-7.6-7.6a1 1 0 0 1 0-1.4l7.6-7.6a1 1 0 0 1 1.4 0Z"/></svg>';
  const PICTURE = '<svg class="ycoCard_imageGlyph" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>';
  const ARROW = '<svg class="ycoCard_linkGlyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const PERSON = '<svg class="ycoCard_avatarGlyph" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5"/></svg>';

  const base = { type: "vertical", state: "default", image: true, icon: true, label: false, heading: true, secondary: true, textLink: true, avatar: true, tags: true, tagCount: "3", slot1: true, slot2: false, slot3: false, slot4: false, slot5: false };

  function card(s, ctx) {
    const o = { ...base, ...s };
    const sc = ctx && ctx.sc ? ctx.sc : "";
    const parts = [];
    if (o.image) parts.push(`  <div class="ycoCard_image" role="img" aria-label="Image">${PICTURE}</div>`);
    const titles = [o.label ? '<p class="ycoCard_label">Label</p>' : "", o.heading ? '<h3 class="ycoCard_heading">Heading</h3>' : ""].filter(Boolean);
    const text = [titles.length ? `<div class="ycoCard_titles">\n          ${titles.join("\n          ")}\n        </div>` : "", o.secondary ? '<p class="ycoCard_secondary">Secondary text</p>' : ""].filter(Boolean);
    const header = [o.icon ? `<span class="ycoCard_icon">${DIAMOND}</span>` : "", text.length ? `<div class="ycoCard_text">\n        ${text.join("\n        ")}\n      </div>` : ""].filter(Boolean);
    const body = [];
    if (header.length) body.push(`    <div class="ycoCard_header">\n      ${header.join("\n      ")}\n    </div>`);
    if (o.textLink) body.push(`    <a class="ycoCard_link" href="#">Label${ARROW}</a>`);
    if (o.avatar) body.push(`    <div class="ycoCard_avatar">\n      <span class="ycoCard_avatarImage" role="img" aria-label="Avatar">${PERSON}</span>\n      <div class="ycoCard_avatarText">\n        <span class="ycoCard_avatarName">Name</span>\n        <span class="ycoCard_avatarMeta">Secondary</span>\n      </div>\n    </div>`);
    if (o.tags) body.push(`    <ul class="ycoCard_tags" role="list">\n${Array.from({ length: parseInt(o.tagCount, 10) || 3 }, () => '      <li class="ycoCard_tag">Label</li>').join("\n")}\n    </ul>`);
    SLOTS.filter((n) => o[`slot${n}`]).forEach(() => body.push('    <div class="ycoCard_slot">Slot</div>'));
    parts.push(`  <div class="ycoCard_content">\n${body.join("\n")}\n  </div>`);
    return `<article class="ycoCard ycoCard_type_${o.type}${sc}">\n${parts.join("\n")}\n</article>`;
  }

  const label = YCO.label;
  const COMPOSITIONS = [
    ["Image", { icon: false, textLink: false, avatar: false, tags: false, slot1: false }],
    ["Image + avatar", { icon: false, textLink: false, tags: false, slot1: false }],
    ["Image + tags", { icon: false, textLink: false, avatar: false, slot1: false }],
    ["Image + text link", { icon: false, avatar: false, tags: false, slot1: false }],
    ["Icon", { image: false, textLink: false, avatar: false, tags: false, slot1: false }],
    ["Icon + text link", { image: false, avatar: false, tags: false, slot1: false }],
    ["Text only", { image: false, icon: false, textLink: false, avatar: false, tags: false, slot1: false }],
  ];

  YCO.page({
    id: "card",
    group: "Surfaces",
    title: "Card",
    figma: "3472:58376",
    needs: ["button"],
    statesCss: "components/card.states.css",
    intro: "A raised container for one topic: an optional image, icon, label, heading and secondary text, a text link, an avatar, tags and five free slots. Vertical is 364 wide; Horizontal is 600 with the image on the left. The text link covers the whole card, so a card is one click target.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: ["vertical", "horizontal"], default: "vertical" },
      YCO.stateControl(["default", "hover", "press", "focus"]),
      { key: "image", label: "Image", type: "toggle", default: true },
      { key: "icon", label: "Icon", type: "toggle", default: true },
      { key: "label", label: "Label", type: "toggle", default: false },
      { key: "heading", label: "Heading", type: "toggle", default: true },
      { key: "secondary", label: "Secondary text", type: "toggle", default: true },
      { key: "textLink", label: "Text link", type: "toggle", default: true },
      { key: "avatar", label: "Avatar", type: "toggle", default: true },
      { key: "tags", label: "Tags", type: "toggle", default: true },
      { key: "tagCount", label: "Tag count", type: "chips", options: ["1", "3", "6", "10"], default: "3", when: (s) => s.tags },
      ...SLOTS.map((n) => ({ key: `slot${n}`, label: `Slot ${n}`, type: "toggle", default: n === 1 })),
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? `<div style="display:grid;place-items:center;width:100%">${card(s, ctx)}</div>` : card(s, ctx)),
    react: (s) => {
      const p = [];
      if (s.type === "horizontal") p.push('  type="horizontal"');
      if (s.image) p.push("  image={<img src={src} alt=\"\" />}");
      if (s.icon) p.push("  icon={<DiamondIcon />}");
      if (s.label) p.push('  label="Label"');
      if (s.heading) p.push('  heading="Heading"');
      if (s.secondary) p.push('  description="Secondary text"');
      if (s.textLink) p.push('  link={{ label: "Label", href }}');
      if (s.avatar) p.push('  avatar={{ name: "Name", meta: "Secondary" }}');
      if (s.tags) p.push(`  tags={["Label", ...] /* ${s.tagCount} */}`);
      const n = SLOTS.filter((k) => s[`slot${k}`]).length;
      return `// Proposed API: yce-frontend has no Card yet\nimport Card from '@/components/common/card';\n\n<Card\n${p.join("\n")}\n>${n ? `\n  {/* ${n} slot${n > 1 ? "s" : ""}: any content below the tags */}\n` : ""}</Card>`;
    },
    variants: () => {
      const v = [];
      ["vertical", "horizontal"].forEach((type) => ["default", "hover", "press", "focus"].forEach((state) => {
        v.push({ label: `${label(type)} / ${label(state)}`, wide: type === "horizontal", html: `<div style="width:100%;display:grid;place-items:center;padding:6px">${card({ type }, { sc: YCO.stateClass(state) })}</div>` });
      }));
      COMPOSITIONS.forEach(([name, o]) => ["vertical", "horizontal"].forEach((type) => {
        v.push({ label: `${name} / ${label(type)}`, wide: type === "horizontal", html: `<div style="width:100%;display:grid;place-items:center;padding:6px">${card({ ...o, type }, {})}</div>` });
      }));
      return v;
    },
    notes: [
      "Shadow: Figma's Shadow/Raised (two soft layers, 2px and 4px) has no token. Default has none (the border carries it), Hover uses --shadow (heavier than Figma's), Press has none.",
      "Hover is drawn as a lifted shadow only; Press is the Default look without a shadow. Focus is a 2px --stroke-focus ring 2px outside the card, as in Figma.",
      "Card image and avatar are CSS placeholder blocks; callers supply real art. Figma's Horizontal has no phone layout, so it stacks like Vertical below 576px.",
      "Heading uses the Heading 4 tokens (20/28); the Label is the 14px uppercase style with 2px tracking, written without a token. Tag pills and the avatar block are drawn here to keep the page standalone; they should become the Tag and Avatar pages' components in the product.",
      "Variant grid also lists Figma's seven documented compositions (Image, Image + avatar, Image + tags, Image + text link, Icon, Icon + text link, Text only) in both types.",
      "RD to confirm: when a card has no text link there is no keyboard target; use a heading link with the same stretched ::after.",
    ],
  });
})();
