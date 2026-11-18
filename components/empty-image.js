/* Empty image · Figma 13023:12548. Config reference: COMPONENT-PAGES.md
   The artwork is redrawn as inline SVG that follows Figma's composition and tone. */
(() => {
  const TYPES = ["general", "video", "edt", "upload_drag", "t2i", "i2v", "voice-microphone", "t2v", "face_swap_photo", "face_swap_video"];
  const GALLERY = ["general", "video", "edt", "upload_drag", "t2i", "i2v", "voice-microphone"];
  const LABELS = { general: "General", video: "Video", edt: "Edit", upload_drag: "Upload drag", t2i: "T2I", i2v: "I2V", "voice-microphone": "Voice microphone", t2v: "T2V", face_swap_photo: "Face swap photo", face_swap_video: "Face swap video" };
  const P = "ycoEmptyImage_";

  const rect = (w, h, r, cls) => `<rect width="${w}" height="${h}" rx="${r}" class="${P}${cls}"/>`;
  const at = (x, y, rot, inner, k = 1) => `<g transform="translate(${x} ${y})${rot ? ` rotate(${rot})` : ""}${k !== 1 ? ` scale(${k})` : ""}">${inner}</g>`;
  const sparkle = (x, y, k) => `<path class="${P}sparkle" transform="translate(${x} ${y}) scale(${k})" d="M0-6C1-2 2-1 6 0 2 1 1 2 0 6-1 2-2 1-6 0-2-1-1-2 0-6Z"/>`;
  // Picture card: 56 x 62, sun and mountains.
  const photo = (cls) => `${rect(56.5, 62.7, 7.8, cls)}<circle cx="37.7" cy="21.2" r="4.9" class="${P}glyph"/><path class="${P}glyphLight" stroke-linejoin="round" stroke-width="2.4" style="stroke:var(--text-weaker)" d="M12 44 22.4 24l9.6 17 4.4-6 8.4 9z"/>`;
  // Film card: perforation holes down both edges, play triangle between.
  const film = (w, h, cls, holeCls, playCls) => {
    const n = Math.max(3, Math.floor((h - 8) / 8));
    const gap = (h - 8) / n;
    let holes = "";
    for (let i = 0; i < n; i += 1) {
      const y = 6 + i * gap;
      holes += `<rect x="3.5" y="${y.toFixed(1)}" width="3.6" height="4.4" rx="1.6" class="${P}${holeCls}"/><rect x="${(w - 7.1).toFixed(1)}" y="${y.toFixed(1)}" width="3.6" height="4.4" rx="1.6" class="${P}${holeCls}"/>`;
    }
    const tri = playCls ? `<path class="${P}${playCls}" stroke-linejoin="round" stroke-width="2.4" style="stroke:var(--${playCls === "glyph" ? "text-weak" : "text-weaker"})" d="M${w / 2 - 5} ${h / 2 - 8}v16l14-8z"/>` : "";
    return `${rect(w, h, 6, cls)}${holes}${tri}`;
  };
  const bubble = (w, h, cls) => `${rect(w, h, 7, cls)}<path class="${P}${cls}" d="M7 ${h - 2}l-4 14 15-14z"/>`;
  const quote = () => `<g class="${P}glyph"><circle cx="-4.4" cy="0" r="3.3"/><circle cx="4.6" cy="0" r="3.3"/><path d="M-7.2 1l-2.2 5.6 5.4-2.8zM1.8 1l-2.2 5.6 5.4-2.8z"/></g>`;
  const wave = () => [-12, -8, -4, 0, 4, 8, 12].map((x, i) => { const h = [3, 6, 10, 7, 11, 6, 3][i]; return `<path class="${P}stroke" style="stroke-width:2.4" d="M${x} ${-h}v${h * 2}"/>`; }).join("");
  const mic = () => `<rect x="-4.2" y="-12" width="8.4" height="15" rx="4.2" class="${P}glyph"/><path class="${P}strokeLight" d="M-9 -1a9 9 0 0 0 18 0M0 8v6M-4.5 14h9"/>`;
  const person = (outline) => (outline
    ? `<circle cx="0" cy="-5" r="5" class="${P}stroke" style="stroke-width:2"/><path class="${P}glyphLight" d="M-10 11a10 9 0 0 1 20 0z"/>`
    : `<circle cx="0" cy="-5" r="5.2" class="${P}glyph"/><path class="${P}glyphLight" d="M-11 11a11 10 0 0 1 22 0z"/>`);
  const arrow = (x, y) => `<path class="${P}stroke" transform="translate(${x} ${y})" d="M0 12c0-8 6-12 14-12M9-6l6 6-6 6"/>`;
  const cursor = (x, y) => `<g transform="translate(${x} ${y})"><path class="${P}glyph" stroke-linejoin="round" style="stroke:var(--fill-inverse-strong);stroke-width:1.6" d="M0 0v18l4.8-4.2 3.6 7.6 3.8-1.8-3.6-7.4 6.4-.8z"/><path class="${P}strokeLight" style="stroke-width:2.2" d="M-3-5-6-8M4-6l.6-4M-6 1l-4-.6M-4 7"/></g>`;
  const hand = (x, y) => `<path transform="translate(${x} ${y})" class="${P}stroke" style="fill:var(--fill-inverse-strong)" d="M-10 2V-3a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0V3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z"/>`;

  const ART = {
    general: () => `<g transform="translate(14 7.5)">${at(35.8, 0, 10, rect(56.5, 62.7, 7.6, "ground"))}${at(0, 44.2, -10, rect(56.5, 62.7, 7.6, "groundStrong"))}${at(15.8, 21.3, 0, photo("paper"))}</g>`,
    video: () => `${at(14, 66, -12, film(60, 36, "groundStrong", "hole", "glyph"))}${at(42, 18, 10, film(58, 40, "paper", "holeDark", "glyph"))}`,
    edt: () => `${at(35, 8, 0, film(54, 40, "groundStrong", "hole", "glyphLight"))}${at(14, 52, 0, photo("paper"), 0.6)}${cursor(72, 62)}`,
    upload_drag: () => `${at(26, 14, 0, rect(68, 72, 10, "ground"))}<path class="${P}paper" stroke-linejoin="round" stroke-width="5" style="stroke:var(--fill-inverse-strong)" d="M34 78 50 50l10 16 6-8 16 20z"/><circle cx="80" cy="34" r="6" class="${P}glyph"/>${hand(92, 88)}`,
    t2i: () => `${at(14, 16, -6, bubble(54, 38, "groundStrong"))}${at(41, 34, -6, quote())}${at(56, 44, 10, photo("paper"), 0.8)}${sparkle(88, 22, 1)}${sparkle(100, 34, 0.6)}`,
    i2v: () => `${at(44, 12, 8, film(56, 40, "groundStrong", "hole", "glyph"))}${at(14, 52, -10, photo("paper"), 0.75)}${sparkle(12, 28, 0.6)}${sparkle(90, 80, 1)}`,
    "voice-microphone": () => `${at(14, 14, -4, rect(56, 40, 7, "groundStrong"))}${at(42, 34, -4, wave())}${at(62, 54, 10, rect(40, 48, 7, "paper"))}${at(82, 78, 10, mic())}${sparkle(104, 26, 0.6)}${sparkle(24, 82, 1)}`,
    t2v: () => `${at(14, 16, -6, bubble(54, 38, "groundStrong"))}${at(41, 34, -6, quote())}${at(46, 58, 8, film(58, 34, "paper", "holeDark", "glyph"))}${sparkle(88, 22, 1)}${sparkle(100, 34, 0.6)}`,
    face_swap_photo: () => `${at(18, 54, 0, rect(46, 50, 6, "groundStrong"))}${at(41, 80, 0, person(true))}${at(66, 14, 0, rect(46, 50, 6, "paper"))}${at(89, 40, 0, person(false))}${arrow(22, 28)}`,
    face_swap_video: () => `${at(8, 56, 0, rect(52, 40, 6, "paper"))}${at(34, 78, 0, person(true))}${at(60, 14, 0, film(52, 40, "ground", "hole", null))}${at(86, 38, 0, person(false))}${arrow(18, 30)}`,
  };

  const allowed = (s) => (s.page === "gallery" && !GALLERY.includes(s.type) ? "general" : s.type);
  const svg = (s) => `<svg class="ycoEmptyImage ${P}page_${s.page} ${P}type_${allowed(s)}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">${ART[allowed(s)]()}</svg>`;

  const variants = [];
  ["tool", "gallery"].forEach((page) => (page === "tool" ? TYPES : GALLERY).forEach((type) => variants.push({ label: `${LABELS[type]} / ${YCO.label(page)}`, html: `<span class="${P}stage">${svg({ type, page })}</span>` })));

  YCO.page({
    id: "empty-image",
    statesCss: "components/empty-image.states.css",
    group: "Feedback",
    title: "Empty image",
    figma: "13023:12548",
    intro: "The 120px illustration that sits above an empty state, one per kind of content: pictures, video, editing, upload, text to image or video, voice, and face swap. Tool pages draw white paper cards; Gallery pages draw them transparent.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: (s) => (s.page === "gallery" ? GALLERY : TYPES).map((t) => ({ value: t, label: LABELS[t] })), default: "general" },
      { key: "page", label: "Page", type: "chips", options: ["tool", "gallery"], default: "tool" },
    ],
    render: (s, ctx) => (ctx.preview ? `<span class="${P}stage">${svg(s)}</span>` : svg(s)),
    react: (s) => `// Proposed API: yce-frontend has no EmptyImage yet\nimport EmptyImage from '@/components/common/empty-image';\n\n<EmptyImage type="${allowed(s)}" page="${s.page}" />`,
    variants,
    notes: [
      "The illustrations are approximations of Figma's artwork, redrawn as simple inline SVG with the same composition and grey tone. The designer's exported SVGs should replace them before release.",
      "Colours are tokens, so the art follows light and dark themes: ground cards use --fill-hover and --fill-disabled, glyphs --text-weak and --text-weaker, paper --fill-inverse-strong (Tool) or --fill-weaker (Gallery). In Figma the paper is plain white and the Gallery paper is a faint grey.",
      "Gallery has seven types in Figma (no T2V, Face swap photo or Face swap video); picking one of those on Gallery shows General.",
      "The light ground behind the art in the preview and grid is doc-only (empty-image.states.css); Figma draws the paper cards on a light page.",
      "Decorative: the SVG is aria-hidden, so the heading of the empty state carries the meaning.",
    ],
  });
})();
