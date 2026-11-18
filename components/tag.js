/* Tag · Figma 3667:21811 (+ Tag group 6735:174735). Config reference: COMPONENT-PAGES.md */
(() => {
  const SIZES = ["medium", "small"];
  const RADII = ["pill", "rounded"];
  const SELECTED = [{ value: "false", label: "Unselected" }, { value: "true", label: "Selected" }];
  const TYPES = [{ value: "tag", label: "Tag" }, { value: "group", label: "Tag group" }];
  const GROUP_TYPES = [{ value: "default", label: "Default" }, { value: "dismissible", label: "Dismissible" }];
  const CHECK = '<svg class="ycoTag_check" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-6"/></svg>';
  const X = '<svg class="ycoTag_closeIcon" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg>';

  function tag(o, ctx = {}) {
    const selected = o.selected === "true" || o.selected === true;
    const disabled = o.state === "disabled";
    const cls = ["ycoTag", `ycoTag_size_${o.size}`, `ycoTag_radius_${o.radius}`, `ycoTag_selected_${selected}`, o.icon === false ? "ycoTag_icon_false" : "", o.weak ? "ycoTag_fill_weak" : "", disabled ? "ycoTag_disabled" : ""].filter(Boolean).join(" ");
    const sc = ctx.sc || "";
    return `<span class="${cls}">
  <button class="ycoTag_button${sc}" type="button" aria-pressed="${selected}"${disabled ? " disabled" : ""}>${CHECK}<span class="ycoTag_label">${o.text || "Label"}</span></button>${o.dismissible ? `\n  <button class="ycoTag_close" type="button" aria-label="Remove"${disabled ? " disabled" : ""}>${X}</button>` : ""}
</span>`;
  }

  function group(o) {
    const items = [];
    for (let i = 0; i < o.count; i++) items.push(tag({ selected: "false", size: o.size, radius: "pill", state: "default", dismissible: o.type === "dismissible", weak: o.type === "dismissible", icon: true }));
    return `<div class="ycoTag_group" role="group" aria-label="Tags">\n${items.join("\n")}\n</div>`;
  }

  function markup(s, ctx) {
    if (s.view === "group") return group({ type: s.gtype, size: s.size, count: Number(s.count) });
    return tag({ ...s, icon: s.icon }, ctx);
  }

  const variants = [];
  SELECTED.forEach((sel) => SIZES.forEach((size) => ["default", "hover", "press", "focus", "disabled"].forEach((state) => RADII.forEach((radius) => {
    variants.push({ label: `${sel.label} / ${YCO.label(size)} / ${YCO.label(state)} / ${YCO.label(radius)}`, html: `<div style="padding:var(--spacing-4)">${tag({ selected: sel.value, size, radius, state }, { sc: YCO.stateClass(state) })}</div>` });
  }))));
  SIZES.forEach((size) => variants.push({ label: `Dismissible / ${YCO.label(size)}`, html: tag({ selected: "false", size, radius: "pill", state: "default", dismissible: true }) }));
  GROUP_TYPES.forEach((g) => SIZES.forEach((size) => variants.push({ label: `Tag group / ${g.label} / ${YCO.label(size)}`, html: group({ type: g.value, size, count: 10 }), wide: true })));

  YCO.page({
    id: "tag",
    group: "Elements",
    title: "Tag",
    figma: "3667:21811",
    statesCss: "components/tag.states.css",
    intro: "A compact toggle for filters and categories: pill or rounded, medium or small, with a check when selected and an optional dismiss button. Tag group lays several out in a wrapping row.",
    controls: [
      { key: "view", label: "Type", type: "chips", options: TYPES, default: "tag" },
      YCO.stateControl(),
      { key: "selected", label: "Selected", type: "chips", options: SELECTED, default: "false" },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "medium" },
      { key: "radius", label: "Radius", type: "chips", options: RADII, default: "pill" },
      { key: "icon", label: "Icon (check)", type: "toggle", default: true },
      { key: "dismissible", label: "Dismissible", type: "toggle", default: false },
      { key: "text", label: "Text", type: "text", default: "Label" },
      { key: "gtype", label: "Group type", type: "chips", options: GROUP_TYPES, default: "default" },
      { key: "count", label: "Tags", type: "chips", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], default: "10" },
    ].map((c) => (c.key === "state" ? { ...c, when: (s) => s.view === "tag" } : ["selected", "radius", "icon", "dismissible", "text"].includes(c.key) ? { ...c, when: (s) => s.view === "tag" } : ["gtype", "count"].includes(c.key) ? { ...c, when: (s) => s.view === "group" } : c)),
    surface: (s) => ({ wide: s.view === "group", minHeight: 120 }),
    render: markup,
    mount: (el) => {
      el.querySelectorAll(".ycoTag").forEach((t) => {
        const btn = t.querySelector(".ycoTag_button");
        const close = t.querySelector(".ycoTag_close");
        if (btn) btn.addEventListener("click", () => {
          const on = btn.getAttribute("aria-pressed") !== "true";
          btn.setAttribute("aria-pressed", String(on));
          t.classList.toggle("ycoTag_selected_true", on);
          t.classList.toggle("ycoTag_selected_false", !on);
        });
        if (close) close.addEventListener("click", () => t.remove());
      });
    },
    react: (s) => {
      const head = "// Proposed API: yce-frontend has no Tag yet\n";
      if (s.view === "group") return `${head}import { TagGroup } from '@/components/common/tag';\n\n<TagGroup size="${s.size}" dismissible={${s.gtype === "dismissible"}} tags={tags} onRemove={removeTag} />`;
      const p = [`  size="${s.size}"`, `  radius="${s.radius}"`, `  selected={${s.selected}}`, "  onToggle={toggle}"];
      if (!s.icon) p.push("  icon={false}");
      if (s.dismissible) p.push("  onDismiss={remove}");
      if (s.state === "disabled") p.push("  disabled");
      return `${head}import Tag from '@/components/common/tag';\n\n<Tag\n${p.join("\n")}\n>\n  ${s.text || "Label"}\n</Tag>`;
    },
    variants,
    notes: [
      "Fill / Selected exists only in the dark theme; the light CSS uses --fill-brand-strong, which has the same value there. Ask the designer for the light token.",
      "Figma's Dismissible is a boolean on Tag (the X) and also a separate Tag/Dismissible component used by Tag group, filled with --fill-weak. Both are drawn here; the group's dismissible type adds the weak fill.",
      "Selected tags show a check by default (Icon boolean); turning it off drops the check and the padding stays.",
      "Figma Tag group wraps at 600px with 4px between tags and 8px between rows; here it wraps at the container width.",
      "The Figma page also contains premium_icon (PRO / PLUS) and Label_new (NEW / HOT) marketing marks. They use gradients and PerfectP brand colours with no tokens, so they are not built here.",
    ],
  });
})();
