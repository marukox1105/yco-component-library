/* Avatar · Figma 3531:66915 (+ stack 3633:1630, labelled 4017:38201, dropdown 5691:49022). Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = [{ value: "avatar", label: "Avatar" }, { value: "labelled", label: "Labelled" }, { value: "stack", label: "Stack" }, { value: "dropdown", label: "Dropdown" }];
  const KINDS = ["photo", "icon", "initials"];
  const SIZES = ["small", "medium", "large"];
  const STATUSES = ["none", "online", "busy", "away", "offline"];
  const PLACEMENTS = [{ value: "button", label: "Button" }, { value: "navigation", label: "Navigation side" }];
  const DROP_STATES = [{ value: "default", label: "Default" }, { value: "hover", label: "Hover" }, { value: "pressed", label: "Pressed" }, { value: "focused", label: "Focused" }, { value: "open", label: "Open" }, { value: "disabled", label: "Disabled" }];
  const FORCED = { hover: " is-hover", pressed: " is-press", focused: " is-focus" };

  const GLYPH = {
    online: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    busy: '<path d="M6 12h12"/>',
    away: '<circle cx="12" cy="12" r="0.1"/><path d="M12 6v6l4 2"/>',
    offline: '<path d="m7 7 10 10M17 7 7 17"/>',
  };
  const USER = '<svg class="ycoAvatar_icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/></svg>';
  const CHEVRON = '<svg class="ycoAvatar_trailing ycoAvatar_chevronDown" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg><svg class="ycoAvatar_trailing ycoAvatar_chevronUp" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';
  const MORE = '<svg class="ycoAvatar_trailing" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"/></svg>';

  // A neutral stand-in for a photo, so the doc page needs no image files. The copied HTML uses a placeholder path.
  const TINTS = ["c9a17f", "9fb8c9", "b7a1c9", "a6c9a1", "c9a1a6"];
  const photo = (n, ctx) => (ctx.preview === false ? "photo.jpg" : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23${TINTS[n % TINTS.length]}'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23f1e4d6'/%3E%3Cpath d='M6 40c2-10 9-13 14-13s12 3 14 13z' fill='%23f1e4d6'/%3E%3C/svg%3E`);

  const dot = (kind, size) => {
    const status = kind !== "notification";
    const glyph = status && size !== "small" && GLYPH[kind] ? `<svg class="ycoAvatar_badgeGlyph" viewBox="0 0 24 24" aria-hidden="true">${GLYPH[kind]}</svg>` : "";
    const cls = status ? "ycoAvatar_badge_status" : "ycoAvatar_badge_notification";
    return `<span class="ycoAvatar_badge ${cls}" role="img" aria-label="${kind}"><span class="ycoAvatar_badgeDot ycoAvatar_status_${kind}">${glyph}</span></span>`;
  };

  function avatar(o, ctx) {
    const { kind, size, status, notification, initials, n } = o;
    const body = kind === "photo" ? `<img class="ycoAvatar_image" src="${photo(n || 0, ctx)}" alt="" />` : kind === "icon" ? USER : `<span class="ycoAvatar_initials">${initials || "AD"}</span>`;
    return `<span class="ycoAvatar ycoAvatar_size_${size}">${body}${status && status !== "none" ? dot(status, size) : ""}${notification ? dot("notification", size) : ""}</span>`;
  }

  function labelled(o, ctx) {
    return `<div class="ycoAvatar_labelled ycoAvatar_size_${o.size}">
  ${avatar({ kind: "photo", size: o.size, n: 0 }, ctx)}
  <span class="ycoAvatar_text">
    <span class="ycoAvatar_primary">Name</span>${o.secondary ? '\n    <span class="ycoAvatar_secondary">name@example.com</span>' : ""}
  </span>
</div>`;
  }

  function stack(o, ctx) {
    const items = [];
    for (let i = 0; i < o.count; i++) items.push(`  <span class="ycoAvatar_stackItem">${avatar({ kind: "photo", size: o.size, n: i }, ctx)}</span>`);
    if (o.more) items.push(`  <span class="ycoAvatar_stackItem">${avatar({ kind: "initials", size: o.size, initials: "99+" }, ctx)}</span>`);
    return `<div class="ycoAvatar_stack ycoAvatar_size_${o.size}" role="group" aria-label="Members">\n${items.join("\n")}\n</div>`;
  }

  function dropdown(o, ctx) {
    const nav = o.placement === "navigation";
    const cls = `ycoAvatar_dropdown${nav ? " ycoAvatar_dropdown_navigation" : ""}${ctx.sc || ""}`;
    const open = o.state === "open";
    return `<button class="${cls}" type="button" aria-haspopup="menu" aria-expanded="${open}"${o.state === "disabled" ? " disabled" : ""}>
  <span class="ycoAvatar_labelled ycoAvatar_size_small">
    ${avatar({ kind: "photo", size: "small", n: 0 }, ctx)}
    <span class="ycoAvatar_text"><span class="ycoAvatar_primary">Name</span></span>
  </span>
  ${nav ? MORE : CHEVRON}
</button>`;
  }

  function markup(s, ctx) {
    if (s.type === "labelled") return labelled({ size: s.size, secondary: s.secondary }, ctx);
    if (s.type === "stack") return stack({ size: s.size, count: Number(s.count), more: s.more }, ctx);
    if (s.type === "dropdown") return dropdown({ placement: s.placement, state: s.dstate }, { ...ctx, sc: FORCED[s.dstate] || "" });
    return avatar({ kind: s.kind, size: s.size, status: s.status, notification: s.notification, initials: s.initials, n: 0 }, ctx);
  }

  const is = (t) => (s) => s.type === t;
  const variants = [];
  const V = { preview: true };
  KINDS.forEach((kind) => SIZES.forEach((size) => variants.push({ label: `Avatar / ${YCO.label(kind)} / ${YCO.label(size)}`, html: avatar({ kind, size, status: "none" }, V) })));
  STATUSES.filter((x) => x !== "none").forEach((status) => SIZES.forEach((size) => variants.push({ label: `Avatar / Status ${status} / ${YCO.label(size)}`, html: `<div style="padding:var(--spacing-8)">${avatar({ kind: "photo", size, status }, V)}</div>` })));
  SIZES.forEach((size) => variants.push({ label: `Avatar / Notification / ${YCO.label(size)}`, html: `<div style="padding:var(--spacing-8)">${avatar({ kind: "photo", size, status: "none", notification: true }, V)}</div>` }));
  SIZES.forEach((size) => variants.push({ label: `Avatar stack / ${YCO.label(size)}`, html: stack({ size, count: 5, more: true }, V), wide: size === "large" }));
  SIZES.forEach((size) => variants.push({ label: `Avatar labelled / ${YCO.label(size)}`, html: labelled({ size, secondary: size !== "small" }, V) }));
  PLACEMENTS.forEach((p) => DROP_STATES.forEach((st) => variants.push({ label: `Avatar dropdown / ${p.label} / ${st.label}`, html: dropdown({ placement: p.value, state: st.value }, { ...V, sc: FORCED[st.value] || "" }), wide: p.value === "navigation" })));

  YCO.page({
    id: "avatar",
    group: "Elements",
    title: "Avatar",
    figma: "3531:66915",
    statesCss: "components/avatar.states.css",
    intro: "A round picture, icon or initials for a person, in three sizes with optional status and notification dots. The same page covers the labelled avatar (with a name), the overlapping stack, and the dropdown trigger used in headers and the side navigation.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "avatar" },
      { key: "kind", label: "Content", type: "chips", options: KINDS, default: "photo", when: is("avatar") },
      { key: "size", label: "Size", type: "chips", options: SIZES, default: "medium", when: (s) => s.type !== "dropdown" },
      { key: "status", label: "Status", type: "chips", options: STATUSES, default: "none", when: is("avatar") },
      { key: "notification", label: "Notification", type: "toggle", default: false, when: is("avatar") },
      { key: "initials", label: "Initials", type: "text", default: "AD", when: (s) => s.type === "avatar" && s.kind === "initials" },
      { key: "secondary", label: "Secondary text", type: "toggle", default: true, when: is("labelled") },
      { key: "count", label: "Avatars", type: "chips", options: ["1", "2", "3", "4", "5"], default: "5", when: is("stack") },
      { key: "more", label: "Count (99+)", type: "toggle", default: true, when: is("stack") },
      { key: "placement", label: "Placement", type: "chips", options: PLACEMENTS, default: "button", when: is("dropdown") },
      { key: "dstate", label: "State", type: "chips", options: DROP_STATES, default: "default", when: is("dropdown") },
    ],
    surface: (s) => ({ wide: s.type === "dropdown" && s.placement === "navigation", minHeight: 160 }),
    render: markup,
    mount: (el) => {
      const btn = el.querySelector(".ycoAvatar_dropdown");
      if (btn) btn.addEventListener("click", () => btn.setAttribute("aria-expanded", String(btn.getAttribute("aria-expanded") !== "true")));
    },
    react: (s) => {
      const head = "// Proposed API: yce-frontend has no Avatar yet\n";
      if (s.type === "labelled") return `${head}import { AvatarLabelled } from '@/components/common/avatar';\n\n<AvatarLabelled size="${s.size}" src="/photo.jpg" name="Name"${s.secondary ? ' secondary="name@example.com"' : ""} />`;
      if (s.type === "stack") return `${head}import { AvatarStack } from '@/components/common/avatar';\n\n<AvatarStack size="${s.size}" avatars={members.slice(0, ${s.count})}${s.more ? " overflowCount={99}" : ""} />`;
      if (s.type === "dropdown") return `${head}import { AvatarDropdown } from '@/components/common/avatar';\n\n<AvatarDropdown\n  placement="${s.placement}"\n  src="/photo.jpg"\n  name="Name"\n  open={open}\n  onToggle={setOpen}${s.dstate === "disabled" ? "\n  disabled" : ""}\n/>`;
      const p = [`  size="${s.size}"`];
      if (s.kind === "photo") p.push('  src="/photo.jpg"', '  alt=""');
      if (s.kind === "icon") p.push("  icon");
      if (s.kind === "initials") p.push(`  initials="${s.initials || "AD"}"`);
      if (s.status !== "none") p.push(`  status="${s.status}"`);
      if (s.notification) p.push("  notification");
      return `${head}import Avatar from '@/components/common/avatar';\n\n<Avatar\n${p.join("\n")}\n/>`;
    },
    variants,
    notes: [
      "The Photo type is an image in Figma; the doc page draws a neutral stand-in. In the copied HTML the src is a placeholder path.",
      "Status dots are Badge dot (online, busy, away, offline) and sit bottom right; Notification sits top right. Medium and Small statuses hang off the avatar edge at the offsets Figma gives (36px and 22px), which look unintended: confirm with the designer.",
      "The dot ring is --background-base; inner dots follow Badge dot colours. Small status dots (12px) keep their glyph-less look only for the Notification dot (8px), as in Figma.",
      "Figma's Disabled dropdown is the default look at 30% opacity; the navigation dropdown's hover and focus fills have square corners in Figma, so the navigation placement uses no radius.",
      "Avatar stack overlap is -8 / -12 / -16px with a 2px ring in --background-base; the count chip is the Initials avatar with 99+.",
    ],
  });
})();
