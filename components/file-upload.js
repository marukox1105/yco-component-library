/* File upload · Figma 5285:79574 (File upload 5327:19008, File 5327:18737, File list 5327:18948). Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = ["photo", "default", "invalid", "files"];
  const ICON = {
    upload: '<svg class="ycoFileUpload_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3M12 16V4M7.5 8.5 12 4l4.5 4.5"/></svg>',
    file: '<svg class="ycoFileUpload_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/></svg>',
    x: '<svg class="ycoFileUpload_icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    err: '<svg class="ycoFileUpload_errorIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3L8.3 3Z"/><path d="m9 9 6 6M15 9l-6 6"/></svg>',
  };

  /** One row of the file list. state: uploading (pct) or uploaded. */
  function fileRow(f) {
    const done = f.state === "uploaded";
    return `<li class="ycoFileUpload_file">
  <span class="ycoFileUpload_fileIcon">${ICON.file}</span>
  <span class="ycoFileUpload_fileText">
    ${done ? `<a class="ycoFileUpload_fileName" href="#">${YCO.esc(f.name || "File.pdf")}</a>` : `<span class="ycoFileUpload_fileName">${YCO.esc(f.name || "File.pdf")}</span>`}
    <span class="ycoFileUpload_fileSize">${YCO.esc(f.size || "250KB")}</span>
  </span>${done ? "" : `\n  <span class="ycoFileUpload_progress" role="progressbar" aria-label="Uploading" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${f.pct}"><span class="ycoFileUpload_track"><span class="ycoFileUpload_fill" style="width: ${f.pct}%"></span></span></span>`}
  <button class="ycoFileUpload_remove" type="button" aria-label="Remove file">${ICON.x}</button>
</li>`;
  }
  const list = (rows) => `<ul class="ycoFileUpload_list">\n${rows.map((r) => fileRow(r).replace(/^/gm, "  ")).join("\n")}\n</ul>`;
  const MIXED = [{ state: "uploaded" }, { state: "uploading", pct: 75 }, { state: "uploading", pct: 25 }];

  function text(s) {
    return `<div class="ycoFileUpload_text">
    <span class="ycoFileUpload_labelRow">Label${s.required ? '<span class="ycoFileUpload_required" aria-hidden="true">*</span>' : ""}${s.optional ? '<span class="ycoFileUpload_optional">(optional)</span>' : ""}</span>${s.hint ? '\n    <span class="ycoFileUpload_hint">Hint text</span>' : ""}
  </div>`;
  }

  const input = '<input class="ycoFileUpload_input" type="file" aria-label="Label" />';
  const zoneDefault = (button) => `<label class="ycoFileUpload_zone">
    ${input}
    <span class="ycoFileUpload_content">
      <span class="ycoFileUpload_iconBox">${ICON.upload}</span>
      <span class="ycoFileUpload_copy">
        <span class="ycoFileUpload_heading">Drop a files here</span>
        <span class="ycoFileUpload_note">Maximum file size is 5MB</span>
      </span>
    </span>
    <span class="ycoFileUpload_button ycoFileUpload_button_${button}">${button === "solid" ? "Choose an image" : "Browse files"}</span>
  </label>`;

  function markup(s) {
    const type = s.type;
    let body;
    if (type === "photo") {
      body = `<div class="ycoFileUpload_photo">
    <label class="ycoFileUpload_zone">
      ${input}
      <span class="ycoFileUpload_content">
        <span class="ycoFileUpload_iconBox">${ICON.upload}</span>
        <span class="ycoFileUpload_pick">
          <span class="ycoFileUpload_button ycoFileUpload_button_solid">Choose an image</span>
          <span class="ycoFileUpload_pickNote">or drop a files here</span>
        </span>
      </span>
    </label>
  </div>`;
    } else if (type === "default") {
      body = zoneDefault("solid");
    } else if (type === "invalid") {
      body = `${`<p class="ycoFileUpload_error" role="alert">${ICON.err}Error message</p>`}\n  ${zoneDefault("outline")}`;
    } else {
      body = `${zoneDefault("brand")}\n  ${list(s.rows || MIXED)}`;
    }
    return `<div class="ycoFileUpload ycoFileUpload_type_${type}">
  ${text(s)}
  ${body}
</div>`;
  }

  /** The File and File list frames shown on their own. */
  const box = (html) => `<div style="width:100%;max-width:600px">${html}</div>`;
  const rowOf = (state) => `<ul class="ycoFileUpload_list">\n${fileRow(state === "uploaded" ? { state } : { state, pct: 75 }).replace(/^/gm, "  ")}\n</ul>`;
  const listOf = (state) => list([0, 1, 2].map((i) => (state === "uploaded" ? { state } : { state, pct: [75, 50, 25][i] })));
  const base = { required: true, optional: false, hint: true };
  const all = [
    ...TYPES.map((t) => ({ label: `Type ${YCO.label(t)}`, wide: true, html: markup({ ...base, type: t }) })),
    { label: "File / Uploading", wide: true, html: box(rowOf("uploading")) },
    { label: "File / Uploaded", wide: true, html: box(rowOf("uploaded")) },
    { label: "File list / Uploading", wide: true, html: box(listOf("uploading")) },
    { label: "File list / Uploaded", wide: true, html: box(listOf("uploaded")) },
  ];

  YCO.page({
    id: "file-upload",
    group: "Forms",
    title: "File upload",
    figma: "5285:79574",
    intro: "A drop zone for choosing or dragging in files, with an optional label, hint and error. The zone is a real file input: click it, or drop files on it and they join the list below with an upload bar. In the preview the upload is simulated.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "default" },
      { key: "required", label: "Required mark", type: "toggle", default: true },
      { key: "optional", label: "Optional mark", type: "toggle", default: false },
      { key: "hint", label: "Hint text", type: "toggle", default: true },
    ],
    surface: { wide: true },
    render: (s, ctx) => (ctx.preview ? `<div style="display:flex;justify-content:center;width:100%">${markup(s)}</div>` : markup(s)),
    mount: (el) => {
      (el._timers || []).forEach(clearInterval);
      el._timers = [];
      const root = el.querySelector(".ycoFileUpload");
      const zone = el.querySelector(".ycoFileUpload_zone");
      const fileInput = el.querySelector(".ycoFileUpload_input");
      if (!root || !zone) return;
      const addFiles = (files) => [...files].forEach((f) => {
        let ul = root.querySelector(".ycoFileUpload_list");
        if (!ul) { ul = document.createElement("ul"); ul.className = "ycoFileUpload_list"; root.appendChild(ul); }
        const tmp = document.createElement("div");
        const size = `${Math.max(1, Math.round(f.size / 1024))}KB`;
        tmp.innerHTML = fileRow({ state: "uploading", pct: 0, name: f.name, size });
        const li = tmp.firstElementChild;
        ul.appendChild(li);
        let pct = 0;
        const timer = setInterval(() => {
          pct = Math.min(100, pct + 8 + Math.round(Math.random() * 12));
          if (pct >= 100) {
            clearInterval(timer);
            const done = document.createElement("div");
            done.innerHTML = fileRow({ state: "uploaded", name: f.name, size });
            if (li.isConnected) li.replaceWith(done.firstElementChild);
            return;
          }
          const fill = li.querySelector(".ycoFileUpload_fill");
          if (fill) fill.style.width = `${pct}%`;
        }, 160);
        el._timers.push(timer);
      });
      fileInput.addEventListener("change", () => { addFiles(fileInput.files); fileInput.value = ""; });
      ["dragenter", "dragover"].forEach((n) => zone.addEventListener(n, (e) => { e.preventDefault(); zone.classList.add("ycoFileUpload_zone_dragover"); }));
      ["dragleave", "drop"].forEach((n) => zone.addEventListener(n, () => zone.classList.remove("ycoFileUpload_zone_dragover")));
      zone.addEventListener("drop", (e) => { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files); });
      root.addEventListener("click", (e) => {
        const rm = e.target.closest(".ycoFileUpload_remove");
        if (rm) rm.closest(".ycoFileUpload_file").remove();
        if (e.target.closest("a.ycoFileUpload_fileName")) e.preventDefault();
      });
    },
    react: (s) => {
      const p = ['  label="Label"'];
      if (s.required) p.push("  required");
      if (s.optional) p.push("  optional");
      if (s.hint) p.push('  hint="Hint text"');
      p.push(`  variant="${s.type}"`);
      if (s.type === "invalid") p.push('  error="Error message"');
      p.push("  maxSizeMB={5}");
      p.push("  files={files}");
      p.push("  onSelect={handleSelect}");
      p.push("  onRemove={handleRemove}");
      return `// Proposed API: yce-frontend has no FileUpload yet (common/upload holds feature-specific upload blocks: upload-media-block, upload-strip, ...)\nimport FileUpload from '@/components/common/file-upload';\n\n<FileUpload\n${p.join("\n")}\n/>`;
    },
    variants: all,
    notes: [
      "Figma shows two file-row states, Uploading (progress bar) and Uploaded (file name as a link), and no error row; an upload error state needs a design.",
      "Figma copy is kept as drawn, including \"Drop a files here\" and \"or drop a files here\" (a grammar slip for the designer to confirm). Maximum size and file types are not Figma properties.",
      "No token exists for the 16px and 24px radii (drop zone, photo frame) or for the 26px line height of the 18px heading; rem values are used. The Photo icon circle is 72px, its icon 36px.",
      "Drop-zone hover and drag-over are not in Figma; both use --fill-brand-weak with a --stroke-selected dashed border, and the zone shows the focus ring when the file input is focused.",
      "The three buttons (solid, outline, brand outline) are drawn here as part of the zone because the whole zone is the click target; RD may swap in the Button component.",
    ],
  });
})();
