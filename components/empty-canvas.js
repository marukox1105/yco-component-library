/* Empty canvas · private repo yco-collab-space, Storybook "UI / Empty Canvas" (Figma YCO_Tool-Pages 7099:176741 / 7451:103477). Config reference: COMPONENT-PAGES.md */
(() => {
  const R = "ycoEmptyCanvas";
  const P = `${R}_art_`;
  const TYPES = ["general", "video", "edt", "t2i", "i2v", "t2v", "face-swap-photo", "face-swap-video", "upload-drag", "voice-microphone"];
  const LABELS = { general: "General (photo)", video: "Video", edt: "Edit", t2i: "T2I", i2v: "I2V", t2v: "T2V", "face-swap-photo": "Face swap photo", "face-swap-video": "Face swap video", "upload-drag": "Upload drag", "voice-microphone": "Voice microphone" };
  // The canvas sits on a white card for the video types and straight on the page for the others (Figma).
  const VIDEO_TYPES = ["video", "i2v", "t2v", "face-swap-video"];
  const KEY = { "face-swap-photo": "face_swap_photo", "face-swap-video": "face_swap_video", "upload-drag": "upload_drag" };
  const esc = (v) => YCO.esc(v);

  /* The eight Empty image types other than photo and video, drawn as in Empty image (static). */
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
    edt: () => `${at(35, 8, 0, film(54, 40, "groundStrong", "hole", "glyphLight"))}${at(14, 52, 0, photo("paper"), 0.6)}${cursor(72, 62)}`,
    upload_drag: () => `${at(26, 14, 0, rect(68, 72, 10, "ground"))}<path class="${P}paper" stroke-linejoin="round" stroke-width="5" style="stroke:var(--fill-inverse-strong)" d="M34 78 50 50l10 16 6-8 16 20z"/><circle cx="80" cy="34" r="6" class="${P}glyph"/>${hand(92, 88)}`,
    t2i: () => `${at(14, 16, -6, bubble(54, 38, "groundStrong"))}${at(41, 34, -6, quote())}${at(56, 44, 10, photo("paper"), 0.8)}${sparkle(88, 22, 1)}${sparkle(100, 34, 0.6)}`,
    i2v: () => `${at(44, 12, 8, film(56, 40, "groundStrong", "hole", "glyph"))}${at(14, 52, -10, photo("paper"), 0.75)}${sparkle(12, 28, 0.6)}${sparkle(90, 80, 1)}`,
    "voice-microphone": () => `${at(14, 14, -4, rect(56, 40, 7, "groundStrong"))}${at(42, 34, -4, wave())}${at(62, 54, 10, rect(40, 48, 7, "paper"))}${at(82, 78, 10, mic())}${sparkle(104, 26, 0.6)}${sparkle(24, 82, 1)}`,
    t2v: () => `${at(14, 16, -6, bubble(54, 38, "groundStrong"))}${at(41, 34, -6, quote())}${at(46, 58, 8, film(58, 34, "paper", "holeDark", "glyph"))}${sparkle(88, 22, 1)}${sparkle(100, 34, 0.6)}`,
    face_swap_photo: () => `${at(18, 54, 0, rect(46, 50, 6, "groundStrong"))}${at(41, 80, 0, person(true))}${at(66, 14, 0, rect(46, 50, 6, "paper"))}${at(89, 40, 0, person(false))}${arrow(22, 28)}`,
    face_swap_video: () => `${at(8, 56, 0, rect(52, 40, 6, "paper"))}${at(34, 78, 0, person(true))}${at(60, 14, 0, film(52, 40, "ground", "hole", null))}${at(86, 38, 0, person(false))}${arrow(18, 30)}`,
  };


  /* Photo and video artwork: the two that move on hover and drag, with the approved component's own outlines. */
  const PHOTO = `<svg class="${R}_photoArt" width="91.4483" height="106" viewBox="0 0 91.4483 106" fill="none" aria-hidden="true">
        <rect class="${R}_cardBack" x="35.8364" y="0" width="56.4698" height="62.7442" rx="7.57093" transform="rotate(10 35.8364 0)" />
        <rect class="${R}_cardMid" x="0" y="44.209" width="56.4698" height="62.7442" rx="7.57093" transform="rotate(-10 0 44.209)" />
        <rect class="${R}_cardFront" x="15.7927" y="21.2825" width="56.4698" height="62.7442" rx="7.84303" />
        <circle class="${R}_sun" cx="53.5002" cy="42.528" r="4.90916" />
        <path class="${R}_hills" d="M53.4794 52.915L60.6097 64.5275C61.0381 65.2253 60.536 66.1228 59.7172 66.1228H27.9663C27.1809 66.1228 26.675 65.2904 27.0366 64.5933L37.5653 44.2948C37.9503 43.5525 39.0071 43.5386 39.4116 44.2705L46.5985 57.2758C46.9668 57.9422 47.9007 58.0054 48.3553 57.3945L51.7468 52.8377C52.1891 52.2434 53.0917 52.2837 53.4794 52.915Z" />
      </svg>`;
  const VIDEO = `<svg class="${R}_videoArt" width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path class="${R}_stripBack" d="M69.5811 0C74.1979 0 77.9414 3.74256 77.9414 8.35938V46.5479C77.9414 51.3305 74.0639 55.2078 69.2812 55.208H8.66016C3.87736 55.208 0 51.3306 0 46.5479V8.66016C0 3.87736 3.87736 0 8.66016 0H69.5811ZM7.03613 41.1357C5.5417 41.1359 4.33016 42.3473 4.33008 43.8418V47.0898C4.33026 48.5842 5.54176 49.7957 7.03613 49.7959C8.53066 49.7959 9.74298 48.5843 9.74316 47.0898V43.8418C9.74308 42.3472 8.53073 41.1357 7.03613 41.1357ZM70.9043 41.1357C69.4098 41.1359 68.1983 42.3473 68.1982 43.8418V47.0898C68.1985 48.5842 69.4099 49.7958 70.9043 49.7959C72.3988 49.7959 73.6111 48.5843 73.6113 47.0898V43.8418C73.6113 42.3472 72.3989 41.1357 70.9043 41.1357ZM7.03613 29.2275C5.54163 29.2275 4.32933 30.4391 4.3291 31.9336V35.1816C4.32914 36.6762 5.54152 37.8877 7.03613 37.8877C8.5306 37.8875 9.74214 36.6761 9.74219 35.1816V31.9336C9.74196 30.4392 8.53049 29.2277 7.03613 29.2275ZM70.9053 29.2275C69.4106 29.2275 68.1982 30.4399 68.1982 31.9346V35.1816C68.1982 36.6763 69.4106 37.8877 70.9053 37.8877C72.3997 37.8875 73.6113 36.6762 73.6113 35.1816V31.9346C73.6113 30.44 72.3997 29.2277 70.9053 29.2275ZM7.03613 17.3203C5.54151 17.3203 4.33008 18.5317 4.33008 20.0264V23.2734C4.33008 24.7681 5.54151 25.9804 7.03613 25.9805C8.53078 25.9805 9.74219 24.7681 9.74219 23.2734V20.0264C9.74219 18.5317 8.53078 17.3203 7.03613 17.3203ZM70.9043 17.3203C69.4097 17.3203 68.1982 18.5317 68.1982 20.0264V23.2734C68.1982 24.7681 69.4097 25.9805 70.9043 25.9805C72.3989 25.9804 73.6104 24.7681 73.6104 23.2734V20.0264C73.6104 18.5317 72.3989 17.3203 70.9043 17.3203ZM7.03613 5.41309C5.54164 5.41326 4.33008 6.62461 4.33008 8.11914V11.3662C4.33008 12.8607 5.54164 14.0731 7.03613 14.0732C8.53078 14.0732 9.74316 12.8609 9.74316 11.3662V8.11914C9.74316 6.6245 8.53078 5.41309 7.03613 5.41309ZM70.9043 5.41211C69.4098 5.41228 68.1982 6.6246 68.1982 8.11914V11.3662C68.1982 12.8608 69.4098 14.0721 70.9043 14.0723C72.3989 14.0723 73.6113 12.8609 73.6113 11.3662V8.11914C73.6113 6.6245 72.3989 5.41211 70.9043 5.41211Z" />
        <g class="${R}_stripFront">
          <path class="${R}_stripFrontBody" d="M69.2812 0C74.0639 0.000184157 77.9414 3.87748 77.9414 8.66016V46.5479C77.9414 51.3305 74.0639 55.2078 69.2812 55.208H8.66016C3.87736 55.208 0 51.3306 0 46.5479V8.66016C0 3.87736 3.87736 0 8.66016 0H69.2812ZM7.03613 41.1357C5.54169 41.1359 4.33016 42.3473 4.33008 43.8418V47.0898C4.33027 48.5842 5.54176 49.7957 7.03613 49.7959C8.53066 49.7959 9.74297 48.5843 9.74316 47.0898V43.8418C9.74309 42.3472 8.53073 41.1357 7.03613 41.1357ZM70.9043 41.1357C69.4098 41.1359 68.1983 42.3473 68.1982 43.8418V47.0898C68.1985 48.5842 69.4099 49.7958 70.9043 49.7959C72.3988 49.7959 73.6111 48.5843 73.6113 47.0898V43.8418C73.6113 42.3472 72.3989 41.1357 70.9043 41.1357ZM7.03613 29.2275C5.54163 29.2275 4.32933 30.4391 4.3291 31.9336V35.1816C4.32914 36.6763 5.54151 37.8877 7.03613 37.8877C8.5306 37.8875 9.74215 36.6761 9.74219 35.1816V31.9336C9.74196 30.4393 8.53048 29.2277 7.03613 29.2275ZM70.9053 29.2275C69.4106 29.2275 68.1982 30.4399 68.1982 31.9346V35.1816C68.1982 36.6763 69.4106 37.8877 70.9053 37.8877C72.3997 37.8875 73.6113 36.6762 73.6113 35.1816V31.9346C73.6113 30.4401 72.3997 29.2277 70.9053 29.2275ZM7.03613 17.3203C5.5415 17.3203 4.33008 18.5317 4.33008 20.0264V23.2734C4.33008 24.7681 5.5415 25.9805 7.03613 25.9805C8.53078 25.9805 9.74219 24.7681 9.74219 23.2734V20.0264C9.74219 18.5317 8.53077 17.3203 7.03613 17.3203ZM70.9043 17.3203C69.4097 17.3203 68.1982 18.5317 68.1982 20.0264V23.2734C68.1982 24.7681 69.4097 25.9805 70.9043 25.9805C72.3989 25.9804 73.6104 24.7681 73.6104 23.2734V20.0264C73.6104 18.5317 72.3989 17.3203 70.9043 17.3203ZM7.03613 5.41309C5.54164 5.41326 4.33008 6.62461 4.33008 8.11914V11.3662C4.33008 12.8607 5.54164 14.0731 7.03613 14.0732C8.53078 14.0732 9.74316 12.8609 9.74316 11.3662V8.11914C9.74316 6.6245 8.53078 5.41309 7.03613 5.41309ZM70.9043 5.41211C69.4098 5.41227 68.1982 6.6246 68.1982 8.11914V11.3662C68.1982 12.8608 69.4098 14.0721 70.9043 14.0723C72.3989 14.0723 73.6113 12.8609 73.6113 11.3662V8.11914C73.6113 6.6245 72.3989 5.41211 70.9043 5.41211Z" />
          <path class="${R}_play" d="M51.7078 25.9479C53.2782 26.8546 53.2782 29.1212 51.7078 30.0279L32.2745 41.2477C30.7041 42.1543 28.7412 41.021 28.7412 39.2077L28.7412 16.768C28.7412 14.9547 30.7041 13.8214 32.2745 14.7281L51.7078 25.9479Z" />
        </g>
      </svg>`;
  const PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';

  const artOf = (type) => {
    if (type === "general") return `<div class="${R}_slot">\n      ${PHOTO}\n    </div>`;
    if (type === "video") return `<div class="${R}_slot">\n      ${VIDEO}\n    </div>`;
    return `<svg class="${R}_image" viewBox="0 0 120 120" aria-hidden="true" focusable="false">${ART[KEY[type] || type]()}</svg>`;
  };

  const hasCard = (s) => (s.card === "auto" ? VIDEO_TYPES.includes(s.type) : s.card === "on");
  const tiles = (s) => Array.from({ length: s.type === "video" ? 2 : 4 }, (_, i) => `\n      <li><button class="${R}_tile" type="button" aria-label="Example photo ${i + 1}"><span class="${R}_tileImage"></span></button></li>`).join("");

  function markup(s, ctx) {
    const cls = [R, hasCard(s) ? `${R}_card` : "", `${R}_clickable`, s.dragging ? `${R}_dragging` : ""].filter(Boolean).join(" ") + ctx.sc;
    const desc = s.description.trim();
    const parts = [];
    if (s.showImage) parts.push(`  <div class="${R}_art">\n    ${artOf(s.type)}\n  </div>`);
    parts.push(`  <div class="${R}_text${desc ? ` ${R}_text_withDescription` : ""}">\n    <h2 class="${R}_heading">${esc(s.heading)}</h2>${desc ? `\n    <p class="${R}_description">${esc(desc)}</p>` : ""}\n  </div>`);
    if (s.actionLabel.trim()) parts.push(`  <button class="ycoButton tone_brand variant_primary size_medium" type="button">\n    <span class="buttonIcon" aria-hidden="true">${PLUS}</span><span class="label">${esc(s.actionLabel)}</span>\n  </button>`);
    if (s.showExamples) parts.push(`  <div class="${R}_examples">${s.examplesLabel.trim() ? `\n    <p class="${R}_examplesLabel">${esc(s.examplesLabel)}</p>` : ""}\n    <ul class="${R}_tiles">${tiles(s)}\n    </ul>\n  </div>`);
    const html = `<div class="${cls}">\n${parts.join("\n")}\n</div>`;
    // The canvas fills its parent, so the live preview and the variant cells stand it on the page colour.
    return ctx.preview ? `<div class="${R}_stage${s.cell ? ` ${R}_stage_cell` : ""}">${html}</div>` : html;
  }

  const PHOTO_COPY = { heading: "No results yet", description: "Upload your photo here to get started.", actionLabel: "Upload Image", examplesLabel: "No photo? Try with our example" };
  const VIDEO_COPY = { heading: "Drop or upload your video here", description: ".MP4, MOV, M4V are supported. Please keep the duration under 1 minute.", actionLabel: "Upload Video", examplesLabel: "Try this target video" };
  const base = { type: "general", card: "auto", showImage: true, showExamples: true, dragging: false, ...PHOTO_COPY };

  const video = { type: "video", ...VIDEO_COPY };
  const one = (over, state) => markup({ ...base, ...over, cell: true }, { preview: true, sc: YCO.stateClass(state || "default") });
  const pair = (label, photo, vid, state) => ({ label, wide: true, html: `<div class="${R}_pair">${one(photo, state)}${one({ ...video, ...vid }, state)}</div>` });

  YCO.page({
    id: "empty-canvas",
    group: "Feedback",
    title: "Empty canvas",
    figma: "7099:176741",
    statesCss: "components/empty-canvas.states.css",
    needs: ["button"],
    intro: "The canvas of a tool page before anything is uploaded: a 120px Empty image, a heading with an optional supporting line, one primary action with a plus, and an optional row of example media. It fills the room its parent gives it, and a click or a dropped file anywhere on it uploads.",
    controls: [
      YCO.stateControl(["default", "hover"]),
      { key: "dragging", label: "Dragging a file over", type: "toggle", default: false },
      { key: "type", label: "Type", type: "chips", options: TYPES.map((t) => ({ value: t, label: LABELS[t] })), default: "general" },
      { key: "card", label: "Card", type: "chips", options: [{ value: "auto", label: "Follow type" }, { value: "on", label: "On" }, { value: "off", label: "Off" }], default: "auto" },
      { key: "showImage", label: "Empty image", type: "toggle", default: true },
      { key: "heading", label: "Heading", type: "text", default: PHOTO_COPY.heading },
      { key: "description", label: "Description (empty hides it)", type: "text", default: PHOTO_COPY.description },
      { key: "actionLabel", label: "Action label", type: "text", default: PHOTO_COPY.actionLabel },
      { key: "showExamples", label: "Example media", type: "toggle", default: true },
      { key: "examplesLabel", label: "Examples label", type: "text", default: PHOTO_COPY.examplesLabel, when: (s) => s.showExamples },
    ],
    surface: { wide: true },
    render: markup,
    react: (s) => {
      const q = (v) => JSON.stringify(v).slice(1, -1).replace(/'/g, "\\'");
      const p = [];
      if (s.type !== "general") p.push(`  type="${s.type}"`);
      if (s.card !== "auto") p.push(`  card={${s.card === "on"}}`);
      if (!s.showImage) p.push("  showImage={false}");
      p.push(`  heading={t('${q(s.heading)}')}`);
      if (s.description.trim()) p.push(`  description={t('${q(s.description)}')}`);
      if (s.actionLabel.trim()) p.push(`  actionLabel={t('${q(s.actionLabel)}')}`, "  onAction={openFilePicker}");
      if (s.dragging) p.push("  dragging");
      else p.push("  dropHandlers={dropHandlers}");
      if (s.showExamples) {
        if (s.examplesLabel.trim()) p.push(`  examplesLabel={t('${q(s.examplesLabel)}')}`);
        p.push("  examples={[{ id: 'a', src: examplePoster, label: 'Example photo 1' }]}", "  onSelectExample={useExample}");
      } else p.push("  showExamples={false}");
      return `// Lives in the private collab-space repo (platform/ui/empty-canvas), not in yce-frontend yet\nimport EmptyCanvas from 'platform/ui/empty-canvas/index.js';\n\n<EmptyCanvas\n${p.join("\n")}\n/>`;
    },
    // Each wide cell stands the photo and the video canvas side by side in the same state (the stories' Image and Video).
    variants: [
      pair("Photo and Video / Default", {}, {}),
      pair("Photo and Video / Hover", {}, {}, "hover"),
      pair("Photo and Video / Dragging", { dragging: true }, { dragging: true }),
      pair("Photo and Video / Without description", { description: "" }, { description: "" }),
      pair("Photo and Video / No examples", { showExamples: false }, { showExamples: false }),
      pair("Photo and Video / No Empty image", { showImage: false }, { showImage: false }),
      pair("Photo on a card / Video off the card", { card: "on" }, { card: "off" }),
    ],
    notes: [
      "The component lives in the private collab-space repo (platform/ui/empty-canvas, Storybook \"UI / Empty Canvas\"), not in yce-frontend. The React tab shows its real props.",
      "Photo and video artwork use the approved component's own outlines and its blue, spread-apart hover and dragging state (RD plays a 120x120 Lottie for this in production; the approved component draws it with a CSS transition, and so does this page). The other eight Empty image types are this site's redrawn approximations (see the Empty image page), static, and do not animate.",
      "Hover and dragging look the same. Hover is a real :hover (the Hover state chip forces it for the preview); Dragging is the dragging prop (class ycoEmptyCanvas_dragging).",
      "The card: video, I2V, T2V and Face swap video sit on a white card with a 20px radius; the other types sit straight on the page (Figma). Card follows the type unless you turn it on or off. The page colour behind it is doc-only (empty-canvas.states.css).",
      "Not reproduced in plain CSS: the React component measures its room. It drops the plus when the label would wrap onto a second line with it, and hides the Empty image when the content, centred, would not fit in the parent's height. Shrink the browser to see only the tiles shrink.",
      "Token gaps: there is no --fill-white, --corner-radius-20, --corner-radius-12, --grey-neutral-solid-1000 or --font-weight-weak in the light theme here. The card and the front card use --background-base and --fill-inverse-strong (white in light, and they follow the dark theme), the artwork's dark marks use --fill-strong at the same percentages instead of the neutral grey, the radii are 1.25rem and 0.75rem, and the supporting line is weight 400.",
      "Example tiles are neutral grey placeholder blocks here. The component draws no pictures of its own: examples (id, src, label) are data the page passes, 64px square with 12px corners, and a video example loads that video into the tool, which RD wires. With onSelectExample the tiles are buttons.",
      "The action is the shared Button (brand, primary, medium) with a 20px plus, so it uses .ycoButton markup. A click anywhere on the canvas except an example also calls onAction.",
    ],
  });
})();
