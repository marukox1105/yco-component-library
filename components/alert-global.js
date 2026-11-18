/* Alert global · Figma 5801:57029. Config reference: COMPONENT-PAGES.md */
(() => {
  const TONES = [
    { value: "error", label: "Error" },
    { value: "warning", label: "Warning" },
    { value: "success", label: "Success" },
    { value: "information", label: "Information" },
    { value: "neutral", label: "Neutral" },
    { value: "brand", label: "Brand" },
    { value: "inverse-neutral", label: "Inverse neutral" },
    { value: "inverse-brand", label: "Inverse brand" },
  ];
  const ICON = {
    error: '<path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2Z"/><path d="m15 9-6 6M9 9l6 6"/>',
    warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    success: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    information: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    // Neutral, Brand and both Inverse tones share a diamond placeholder in Figma.
    diamond: '<path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z"/>',
  };
  const iconFor = (tone) => ICON[ICON[tone] ? tone : "diamond"];
  const BTN_TONE = { error: "neutral", warning: "neutral", success: "neutral", information: "neutral", neutral: "neutral", brand: "brand", "inverse-neutral": "inverse", "inverse-brand": "inverse" };
  const LIVE = (tone) => (tone === "error" || tone === "warning" ? "alert" : "status");
  const TEXT = "Lorem ipsum dolor sit amet consec tetur adipiscing elit";

  function markup(s) {
    const cls = `ycoAlertGlobal ycoAlertGlobal_tone_${s.tone} ycoAlertGlobal_device_${s.device}`;
    const button = s.buttonGroup
      ? `\n      <div class="ycoAlertGlobal_actions">\n        <button class="ycoButton tone_${BTN_TONE[s.tone]} variant_secondary size_tiny" type="button"><span class="label">Label</span></button>\n      </div>`
      : "";
    const icon = s.icon ? `\n  <svg class="ycoAlertGlobal_icon" viewBox="0 0 24 24" aria-hidden="true">${iconFor(s.tone)}</svg>` : "";
    const dismiss = s.dismissible
      ? `\n  <button class="ycoAlertGlobal_dismiss" type="button" aria-label="Dismiss"><svg class="ycoAlertGlobal_dismissIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`
      : "";
    return `<div class="${cls}" role="${LIVE(s.tone)}">${icon}
  <div class="ycoAlertGlobal_body">
    <p class="ycoAlertGlobal_text">${s.text}</p>${button}
  </div>${dismiss}
</div>`;
  }

  const base = { icon: true, buttonGroup: true, dismissible: true, text: TEXT };
  const variants = [];
  TONES.forEach((t) => ["desktop", "mobile"].forEach((device) => {
    variants.push({ label: `${t.label} / ${YCO.label(device)}`, html: markup({ ...base, tone: t.value, device }), wide: true });
  }));

  YCO.page({
    id: "alert-global",
    group: "Feedback",
    title: "Alert global",
    figma: "5801:57029",
    needs: ["button"],
    intro: "A full-width banner for page-level messages: error, warning, success, information, neutral, brand, and two inverse tones. It can carry an icon, one button and a dismiss. Desktop sits on one row; Mobile stacks the button under the text.",
    controls: [
      { key: "tone", label: "Tone", type: "chips", options: TONES, default: "error" },
      { key: "device", label: "Device", type: "chips", options: ["desktop", "mobile"], default: "desktop" },
      { key: "icon", label: "Icon", type: "toggle", default: true },
      { key: "buttonGroup", label: "Button", type: "toggle", default: true },
      { key: "dismissible", label: "Dismissible", type: "toggle", default: true },
      { key: "text", label: "Text", type: "text", default: TEXT },
    ],
    surface: { wide: true },
    render: (s) => markup(s),
    mount: (el) => {
      const alert = el.querySelector(".ycoAlertGlobal");
      const close = el.querySelector(".ycoAlertGlobal_dismiss");
      if (!alert || !close) return;
      close.addEventListener("click", () => {
        alert.hidden = true;
        const again = document.createElement("button");
        again.type = "button";
        again.className = "ycoButton tone_neutral variant_tertiary size_tiny";
        again.innerHTML = '<span class="label">Show again</span>';
        again.addEventListener("click", () => { alert.hidden = false; again.remove(); });
        el.appendChild(again);
      });
    },
    react: (s) => {
      const p = [`  tone="${s.tone}"`, `  device="${s.device}"`];
      if (!s.icon) p.push("  icon={false}");
      p.push(`  message="${s.text}"`);
      if (s.buttonGroup) p.push('  action={{ label: "Label", onClick }}');
      if (s.dismissible) p.push('  onDismiss={onDismiss}\n  dismissLabel="Dismiss"');
      return `// Proposed API: yce-frontend has no AlertGlobal yet (common/ui/notice-banner covers only warning and error, boxed)\nimport AlertGlobal from '@/components/common/alert-global';\n\n<AlertGlobal\n${p.join("\n")}\n/>`;
    },
    variants,
    notes: [
      "Device is a Figma property, so it is a modifier here (ycoAlertGlobal_device_mobile), not a media query. RD may drive it from a breakpoint.",
      "Inverse brand uses --fill-brand-strong for both Desktop and Mobile; Figma binds Mobile to --background-brand, which is the same colour in light but exists only in the dark block of styles.css.",
      "Neutral, Brand and both Inverse tones show a diamond placeholder icon in Figma; real icons are for the designer to supply. Error, Warning, Success and Information icons are redrawn, not Figma's artwork.",
      "Figma draws the dismiss X in the 24px icon size with no hover state; a hover and focus ring were added with fill and focus tokens.",
      "The button is the shared Button (tiny, secondary) in neutral, brand or inverse tone; Figma's alert button has a near-transparent white fill instead of --grey-slate-light-25.",
      "Error and Warning use role=\"alert\", the other tones role=\"status\".",
    ],
  });
})();
