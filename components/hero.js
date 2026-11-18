/* Hero · Figma 6689:40167. Config reference: COMPONENT-PAGES.md */
(() => {
  const TYPES = [
    { value: "horizontal", label: "Horizontal" },
    { value: "horizontal-padded", label: "Horizontal padded" },
    { value: "vertical", label: "Vertical" },
    { value: "vertical-large", label: "Vertical large" },
    { value: "vertical-small", label: "Vertical small" },
  ];
  const DEVICES = ["desktop", "tablet", "mobile"];
  const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  const STAR_HALF = "M5.82 21.02L12 17.77V2L8.91 8.26 2 9.27l5 4.87-1.18 6.88z";
  const star = (state) => (state === "full"
    ? `<svg class="ycoHero_star" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>`
    : state === "half"
      ? `<svg class="ycoHero_star ycoHero_starHalf" viewBox="0 0 24 24" aria-hidden="true"><path class="ycoHero_starHalfFill" d="${STAR_HALF}"/><path d="${STAR}"/></svg>`
      : `<svg class="ycoHero_star ycoHero_starEmpty" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>`);
  const PICTURE = '<svg class="ycoHero_imageIcon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-4.5-4.5L6 21"/></svg>';

  function markup(s) {
    const mobile = s.device === "mobile";
    const size = mobile ? "size_medium" : "size_large";
    const avatars = Array.from({ length: mobile ? 3 : 5 }, () => '<span class="ycoHero_avatar"><span class="ycoHero_avatarFace"></span></span>').join("\n        ");
    const email = s.emailField ? `
    <form class="ycoHero_form">
      <div class="ycoHero_field"><input class="ycoHero_input" type="email" name="email" placeholder="Email" aria-label="Email" autocomplete="email" /></div>
      <button class="ycoButton tone_brand variant_primary size_medium ycoHero_submit" type="submit"><span class="label">Label</span></button>
    </form>` : "";
    const buttons = s.buttonGroup ? `
    <div class="ycoHero_buttons">
      <button class="ycoButton tone_brand variant_primary ${size} ycoHero_button" type="button"><span class="label">Label</span></button>
      <button class="ycoButton tone_brand variant_secondary ${size} ycoHero_button" type="button"><span class="label">Label</span></button>
    </div>` : "";
    const proof = s.socialProof ? `
    <div class="ycoHero_proof">
      <div class="ycoHero_avatars" aria-hidden="true">
        ${avatars}
      </div>
      <div class="ycoHero_rating">
        <div class="ycoHero_ratingMain">
          <span class="ycoHero_stars" role="img" aria-label="3.5 out of 5">${star("full").repeat(3)}${star("half")}${star("empty")}</span>
          <span class="ycoHero_score">3.5</span>
        </div>
        <p class="ycoHero_reviews">From <a class="ycoHero_link" href="#reviews">23 reviews</a></p>
      </div>
    </div>` : "";
    return `<section class="ycoHero ycoHero_type_${s.type} ycoHero_device_${s.device}">
  <div class="ycoHero_content">
    <div class="ycoHero_top">${s.uppercase ? '\n      <p class="ycoHero_eyebrow">Label</p>' : ""}${s.tag ? '\n      <span class="ycoHero_tag">Label</span>' : ""}
      <div class="ycoHero_text">
        <h2 class="ycoHero_title">${s.heading}</h2>
        <p class="ycoHero_description">${s.description}</p>
      </div>
    </div>${email}${buttons}${proof}
  </div>
  <div class="ycoHero_media">
    <div class="ycoHero_image" role="img" aria-label="Image placeholder">${PICTURE}</div>
  </div>
</section>`;
  }

  // Doc-only: the preview is narrower than a desktop page, so each device is drawn at its design width (1440 / 768 / 428)
  // and the preview scrolls sideways. Without it the flex columns squeeze and the picture lands on the copy.
  const WIDTH = { desktop: "90rem", tablet: "48rem", mobile: "26.75rem" };
  const frame = (html, device) => `<div style="width:${WIDTH[device]};max-width:none;flex:none">${html}</div>`;

  const base = { uppercase: false, tag: false, emailField: true, buttonGroup: true, socialProof: true, heading: "Lorem ipsum dolor sit amet tetur elit", description: "Lorem ipsum dolor sit amet, con sec tetur adipiscing elit dolor sit. Donec rutrum, tellus sed fringilla rhoncus." };
  const variants = [];
  TYPES.forEach((t) => DEVICES.forEach((device) => variants.push({ label: `${t.label} / ${YCO.label(device)}`, html: frame(markup({ ...base, type: t.value, device }), device), wide: true })));

  YCO.page({
    id: "hero",
    group: "Marketing",
    title: "Hero",
    figma: "6689:40167",
    needs: ["button"],
    intro: "The opening block of a marketing page: headline and description, an optional email field, buttons and social proof, beside or above a picture. Five layouts, each drawn for desktop, tablet and mobile.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: TYPES, default: "horizontal" },
      { key: "device", label: "Device", type: "chips", options: DEVICES, default: "desktop" },
      { key: "uppercase", label: "Uppercase label", type: "toggle", default: false },
      { key: "tag", label: "Tag", type: "toggle", default: false },
      { key: "emailField", label: "Email field", type: "toggle", default: true },
      { key: "buttonGroup", label: "Button group", type: "toggle", default: true },
      { key: "socialProof", label: "Social proof", type: "toggle", default: true },
      { key: "heading", label: "Heading", type: "text", default: base.heading },
      { key: "description", label: "Description", type: "text", default: base.description },
    ],
    surface: { wide: true, start: true },
    render: (s, ctx) => (ctx.preview ? frame(markup(s), s.device) : markup(s)),
    mount: (el) => {
      el.querySelectorAll(".ycoHero_form").forEach((f) => f.addEventListener("submit", (e) => e.preventDefault()));
      el.querySelectorAll('a[href="#reviews"]').forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
    },
    react: (s) => {
      const p = [`  type="${s.type}"`, `  device="${s.device}"`, `  heading="${s.heading}"`, `  description="${s.description}"`];
      if (s.uppercase) p.push('  eyebrow="Label"');
      if (s.tag) p.push('  tag="Label"');
      if (s.emailField) p.push('  emailField={{ placeholder: "Email", submitLabel: "Label", onSubmit }}');
      if (s.buttonGroup) p.push('  actions={[{ label: "Label", variant: "primary" }, { label: "Label", variant: "secondary" }]}');
      if (s.socialProof) p.push("  socialProof={{ avatars, rating: 3.5, reviewCount: 23 }}");
      p.push("  image={<img src={src} alt=\"\" />}");
      return `// Proposed API: yce-frontend has no Hero yet\nimport Hero from '@/components/common/hero';\n\n<Hero\n${p.join("\n")}\n/>`;
    },
    variants,
    notes: [
      "Type and Device are Figma properties, so they are modifiers (ycoHero_type_*, ycoHero_device_*), not media queries. Desktop is 1440 wide, Tablet 768, Mobile 428; the page caps each at that width. RD may drive Device from a breakpoint.",
      "Tokens missing from styles.css, written in rem: display heading 56px / 64px (-1px tracking) and mobile heading 36px / 44px (-0.5px), the 26px score line height, and spacing 64, 96, 120, 128. The uppercase label reuses the tiny size and line height (14 / 20).",
      "The picture is a token-coloured placeholder (--fill-hover) with a picture glyph, not Figma's photo; avatars are token-coloured circles. The product supplies both.",
      "Tablet and Mobile were read from layer sizes plus the mobile heading, description and button styles; the tablet heading is assumed to match desktop (56px) because its two-line height does. Please confirm with the designer.",
      "Vertical large and Vertical small round the image at 24px in this page as Figma draws a rounded rectangle there; Figma's bottom edge for Vertical large is flush with the hero, so no bottom padding.",
      "The email Subscribe button is the shared Button (medium) raised to 48px to match the input; Figma's version carries a two-layer drop shadow in some variants that has no token and is omitted. The social-proof stars use --fill-warning-strong (see the Rating page for the star colour gap).",
      "The Tag is drawn here rather than imported (Figma uses a Tag instance, 32px pill, white fill).",
    ],
  });
})();
