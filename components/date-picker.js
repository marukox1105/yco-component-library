/* Date picker · Figma 3617:20663 (+ _Calendar 3619:1143, _Calendar date 3612:34173). Config reference: COMPONENT-PAGES.md */
(() => {
  const CAL = '<svg class="ycoDatePicker_icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
  const PREV = '<svg class="ycoDatePicker_navIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  const NEXT = '<svg class="ycoDatePicker_navIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const X_OCTAGON = '<svg class="ycoDatePicker_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  // Figma draws May 2024 with the 15th as today and the 23rd selected; the demo keeps that fixed.
  const TODAY = { y: 2024, m: 4, d: 15 };
  const SELECTED = { y: 2024, m: 4, d: 23 };
  let uid = 0;

  const pad = (n) => String(n).padStart(2, "0");
  const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const fmt = (y, m, d) => `${y}/${pad(m + 1)}/${pad(d)}`;
  const same = (a, b) => a && b && a.y === b.y && a.m === b.m && a.d === b.d;

  function calendarInner(view, sel) {
    const first = new Date(view.y, view.m, 1).getDay();
    const count = new Date(view.y, view.m + 1, 0).getDate();
    const cells = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
    while (cells.length % 7) cells.push(null);
    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    const date = (d) => {
      if (!d) return '<span aria-hidden="true"></span>';
      const day = { y: view.y, m: view.m, d };
      const cls = ["ycoDatePicker_date", same(day, TODAY) ? "ycoDatePicker_date_current" : "", same(day, sel) ? "ycoDatePicker_date_selected" : ""].filter(Boolean).join(" ");
      return `<button class="${cls}" type="button" data-date="${iso(view.y, view.m, d)}"${same(day, sel) ? ' aria-pressed="true"' : ' aria-pressed="false"'}${same(day, TODAY) ? ' aria-current="date"' : ""}>${d}</button>`;
    };
    return `<div class="ycoDatePicker_header">
      <button class="ycoDatePicker_nav" type="button" data-nav="-1" aria-label="Previous month">${PREV}</button>
      <p class="ycoDatePicker_title" aria-live="polite">${MONTHS[view.m]} ${view.y}</p>
      <button class="ycoDatePicker_nav" type="button" data-nav="1" aria-label="Next month">${NEXT}</button>
    </div>
    <div class="ycoDatePicker_grid">
      <div class="ycoDatePicker_week" aria-hidden="true">${DAYS.map((d) => `<span class="ycoDatePicker_day">${d}</span>`).join("")}</div>
      ${rows.map((r) => `<div class="ycoDatePicker_row">${r.map(date).join("")}</div>`).join("\n      ")}
    </div>`;
  }

  function markup(s, ctx) {
    const id = ctx.id || "date-picker";
    const disabled = s.state === "disabled";
    const valid = s.valid === "true" || disabled; // Figma's Disabled / Invalid has no message
    const open = s.open === "true";
    const cls = ["ycoDatePicker", `ycoDatePicker_size_${s.size}`, valid ? "" : "ycoDatePicker_valid_false", disabled ? "ycoDatePicker_disabled" : ""].filter(Boolean).join(" ");
    const describedBy = [s.hint ? `${id}-hint` : "", valid ? "" : `${id}-error`].filter(Boolean).join(" ");
    const sel = s.filled || open ? SELECTED : null;
    return `<div class="${cls}">
  <div class="ycoDatePicker_text">
    <div class="ycoDatePicker_labelRow">
      <label for="${id}">Date</label>${s.required ? '\n      <span class="ycoDatePicker_required" aria-hidden="true">*</span>' : ""}${s.optional ? '\n      <span class="ycoDatePicker_optional">(optional)</span>' : ""}
    </div>${s.hint ? `\n    <p class="ycoDatePicker_hint" id="${id}-hint">(yyyy/mm/dd)</p>` : ""}
  </div>
  <div class="ycoDatePicker_field">
    <div class="ycoDatePicker_state${ctx.sc}">
      <input class="ycoDatePicker_input" id="${id}" type="text" inputmode="numeric" autocomplete="off"${s.filled ? ` value="${fmt(SELECTED.y, SELECTED.m, SELECTED.d)}"` : ""}${s.required ? " required" : ""}${disabled ? " disabled" : ""}${valid ? "" : ' aria-invalid="true"'}${describedBy ? ` aria-describedby="${describedBy}"` : ""} />
      <button class="ycoDatePicker_toggle" type="button" aria-label="Choose date" aria-haspopup="dialog" aria-expanded="${open}" aria-controls="${id}-calendar"${disabled ? " disabled" : ""}>${CAL}</button>
    </div>
  </div>
  ${valid ? "" : `<p class="ycoDatePicker_error" id="${id}-error" role="alert">${X_OCTAGON}Enter date</p>`}
  <div class="ycoDatePicker_calendar" id="${id}-calendar" role="dialog" aria-label="Choose date"${open ? "" : " hidden"}>
    ${calendarInner({ y: 2024, m: 4 }, sel)}
  </div>
</div>`;
  }

  const base = { filled: false, hint: true, required: true, optional: false };
  const cell = (s) => {
    const open = s.open === "true";
    const html = markup({ ...base, ...s }, { sc: YCO.stateClass(s.state), id: `date-picker-v${++uid}` });
    const room = open ? (s.size === "small" ? 60 : 66) + 8 + 402 + 24 : 0;
    return { label: `${open ? "Open" : "Closed"} / ${YCO.label(s.state)} / ${s.valid === "true" ? "Valid" : "Invalid"} / ${YCO.label(s.size)}`, html: open ? `<div style="width:100%;min-height:${room}px">${html}</div>` : html };
  };
  const all = [];
  ["false", "true"].forEach((open) => ["medium", "small"].forEach((size) => ["true", "false"].forEach((valid) =>
    ["default", "hover", "press", "focus", "disabled"].forEach((state) => all.push(cell({ open, size, valid, state }))))));
  all.push(cell({ open: "false", size: "medium", valid: "true", state: "default", filled: true }));
  all.push(cell({ open: "false", size: "small", valid: "true", state: "default", filled: true }));

  // The _Calendar component on its own.
  all.push({ label: "Calendar", wide: true, html: `<div class="ycoDatePicker" style="max-width:364px"><div class="ycoDatePicker_calendar ycoDatePicker_calendar_static" role="group" aria-label="Calendar">${calendarInner({ y: 2024, m: 4 }, SELECTED)}</div></div>` });

  // The _Calendar date component: Type x State x Current.
  ["unselected", "selected"].forEach((type) => ["false", "true"].forEach((cur) => ["default", "hover", "press", "focus", "disabled"].forEach((state) => {
    const cls = ["ycoDatePicker_date", cur === "true" ? "ycoDatePicker_date_current" : "", type === "selected" ? "ycoDatePicker_date_selected" : "", YCO.stateClass(state).trim()].filter(Boolean).join(" ");
    all.push({ label: `Date / ${YCO.label(type)} / ${YCO.label(state)} / ${cur === "true" ? "Current" : "Not current"}`, html: `<div class="ycoDatePicker_dateAlone"><button class="${cls}" type="button"${state === "disabled" ? " disabled" : ""}>1</button></div>` });
  })));

  // Live behaviour: open / close, month navigation, choose a date, type a date, keyboard.
  let off = null;
  function mount(el, s) {
    if (off) off();
    const root = el.querySelector(".ycoDatePicker");
    if (!root || s.state === "disabled") { off = null; return; }
    const input = root.querySelector(".ycoDatePicker_input");
    const toggle = root.querySelector(".ycoDatePicker_toggle");
    const cal = root.querySelector(".ycoDatePicker_calendar");
    let view = { y: 2024, m: 4 };
    let sel = s.filled || s.open === "true" ? { ...SELECTED } : null;
    const isOpen = () => !cal.hidden;
    const draw = (focusDate) => {
      cal.innerHTML = calendarInner(view, sel);
      if (focusDate) { const b = cal.querySelector(`[data-date="${focusDate}"]`); if (b) b.focus(); }
    };
    const setOpen = (v, focus) => {
      cal.hidden = !v;
      toggle.setAttribute("aria-expanded", String(v));
      if (v) { if (sel) view = { y: sel.y, m: sel.m }; draw(); if (focus) { const t = cal.querySelector("[aria-pressed='true']") || cal.querySelector("[aria-current='date']") || cal.querySelector("[data-date]"); if (t) t.focus(); } }
    };
    const choose = (iso8) => {
      const [y, m, d] = iso8.split("-").map(Number);
      sel = { y, m: m - 1, d };
      input.value = fmt(y, m - 1, d);
      input.removeAttribute("aria-invalid");
      setOpen(false);
      toggle.focus();
    };
    toggle.addEventListener("click", () => setOpen(!isOpen(), true));
    input.addEventListener("input", () => {
      const m = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(input.value.trim());
      if (!m) return;
      const dt = new Date(+m[1], +m[2] - 1, +m[3]);
      if (dt.getFullYear() !== +m[1] || dt.getMonth() !== +m[2] - 1 || dt.getDate() !== +m[3]) return;
      sel = { y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate() };
      view = { y: sel.y, m: sel.m };
      if (isOpen()) draw();
    });
    input.addEventListener("keydown", (e) => { if (e.key === "ArrowDown" && e.altKey) { e.preventDefault(); setOpen(true, true); } else if (e.key === "Escape" && isOpen()) setOpen(false); });
    cal.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-nav]");
      if (nav) { const n = new Date(view.y, view.m + Number(nav.dataset.nav), 1); view = { y: n.getFullYear(), m: n.getMonth() }; draw(); const again = cal.querySelector(`[data-nav="${nav.dataset.nav}"]`); if (again) again.focus(); return; }
      const d = e.target.closest("[data-date]");
      if (d) choose(d.dataset.date);
    });
    cal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); toggle.focus(); return; }
      const cur = e.target.closest("[data-date]");
      if (!cur) return;
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      const month = { PageUp: -1, PageDown: 1 }[e.key];
      if (step === undefined && month === undefined) return;
      e.preventDefault();
      const [y, m, d] = cur.dataset.date.split("-").map(Number);
      const t = step !== undefined ? new Date(y, m - 1, d + step) : new Date(y, m - 1 + month, d);
      view = { y: t.getFullYear(), m: t.getMonth() };
      draw(iso(t.getFullYear(), t.getMonth(), t.getDate()));
    });
    const outside = (e) => { if (!root.isConnected) return off && off(); if (!root.contains(e.target) && isOpen()) setOpen(false); };
    document.addEventListener("click", outside);
    off = () => { document.removeEventListener("click", outside); off = null; };
  }

  YCO.page({
    id: "date-picker",
    group: "Forms",
    title: "Date picker",
    figma: "3617:20663",
    needs: [],
    statesCss: "components/date-picker.states.css",
    intro: "A date field with a calendar that opens under it. Type a date as yyyy/mm/dd or open the calendar, step through months with the arrows or Page Up / Page Down, move between days with the arrow keys and pick one with Enter.",
    controls: [
      YCO.stateControl(),
      { key: "open", label: "Open", type: "chips", options: [{ value: "false", label: "Closed" }, { value: "true", label: "Open" }], default: "false" },
      { key: "valid", label: "Valid", type: "chips", options: [{ value: "true", label: "Valid" }, { value: "false", label: "Invalid" }], default: "true" },
      { key: "size", label: "Size", type: "chips", options: ["medium", "small"], default: "medium" },
      { key: "filled", label: "Filled", type: "toggle", default: false },
      { key: "hint", label: "Hint text", type: "toggle", default: true },
      { key: "required", label: "Required mark", type: "toggle", default: true },
      { key: "optional", label: "Optional mark", type: "toggle", default: false },
    ],
    surface: (s) => ({ start: true, minHeight: s.open === "true" ? 540 : 0 }),
    render: markup,
    mount,
    react: (s) => {
      const p = ['  label="Date"'];
      if (s.required) p.push("  required");
      if (s.optional) p.push("  optional");
      if (s.hint) p.push('  hint="(yyyy/mm/dd)"');
      if (s.valid === "false") p.push('  error="Enter date"');
      if (s.size === "small") p.push('  size="small"');
      if (s.filled) p.push('  value="2024/05/23"');
      p.push("  onChange={(date) => {}}");
      if (s.state === "disabled") p.push("  disabled");
      return `// Proposed API: yce-frontend has no DatePicker yet\nimport DatePicker from '@/components/common/date-picker';\n\n<DatePicker\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "The calendar uses --background-raised: Figma's --background-overlay exists only in the dark theme of styles.css. Its shadow (0 8 12, 16% black) has no token and is built with color-mix on --fill-overlay.",
      "The selected date uses --fill-brand-strong: Figma's --fill-selected exists only in the dark theme (same value, #03ade2, in light).",
      "Micro text (12px / 16px) and Heading 5's 26px line height have no token; they use 0.75rem / 1rem and 1.625rem.",
      "Figma shows the value as 08/09/2023 next to a (yyyy/mm/dd) hint; the page uses yyyy/mm/dd (2024/05/23) so the hint, the value and the calendar agree. The designer should confirm the format.",
      "Figma draws May 2024 with the 1st on a Tuesday and the 15th as today; the page computes a real calendar (the 1st is a Wednesday) and keeps 2024/05/15 as a fixed demo 'today'. RD must use the real date.",
      "The calendar is 364px wide with 24px side padding in Figma, which leaves less than the 336px the seven 48px columns need; the columns here shrink to fit instead of being clipped.",
      "In Figma the Open variants show no error message, and the Disabled / Invalid variants are drawn like Disabled / Valid; the calendar hides the message while open.",
      "The focus ring is a 4px --stroke-focus outline outside the field border (red-tinted when invalid), as in the Small Focus / Invalid variant; other variants were not read individually. The calendar-date focus ring is 2px with a 2px gap.",
      "Figma's Today dot colour and the Selected + Hover / Press overlay come from assets and layers: the dot is --fill-brand-strong (white on a selected date) and the overlay is --fill-hover / --fill-press on top of the brand fill; confirm with the designer.",
      "Small shows a 20px calendar icon 20px from the right edge in Figma; here the icon sits at the end of the padded field.",
    ],
  });
})();
