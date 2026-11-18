/* Testimonial · Figma 8120:53922. Config reference: COMPONENT-PAGES.md */
(() => {
  const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  const star = `<svg class="ycoTestimonial_star" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>`;
  const QUOTE = "Quote text. Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Lorem ipsum dolor sit amet.";

  function markup(s) {
    return `<figure class="ycoTestimonial ycoTestimonial_align_${s.align}">${s.avatar ? `
  <div class="ycoTestimonial_person">
    <span class="ycoTestimonial_avatar" role="img" aria-label="Avatar"></span>
    <span class="ycoTestimonial_who">
      <span class="ycoTestimonial_name">Name</span>
      <span class="ycoTestimonial_email">name@example.com</span>
    </span>
  </div>` : ""}${s.text ? `
  <blockquote class="ycoTestimonial_quote">${s.quote}</blockquote>` : ""}${s.rating ? `
  <span class="ycoTestimonial_stars" role="img" aria-label="5 out of 5">${star.repeat(5)}</span>` : ""}
</figure>`;
  }

  const full = { align: "left", avatar: true, text: true, rating: true, quote: QUOTE };
  YCO.page({
    id: "testimonial",
    group: "Marketing",
    title: "Testimonial",
    figma: "8120:53922",
    intro: "A customer quote with the person's avatar, name and email, the words they said and a five-star rating. Left aligns everything to the start; Centre centres it. Each part can be left out.",
    controls: [
      { key: "align", label: "Align", type: "chips", options: [{ value: "left", label: "Left" }, { value: "centre", label: "Centre" }], default: "left" },
      { key: "avatar", label: "Avatar", type: "toggle", default: true },
      { key: "text", label: "Text", type: "toggle", default: true },
      { key: "rating", label: "Rating", type: "toggle", default: true },
      { key: "quote", label: "Quote", type: "text", default: QUOTE, when: (s) => s.text },
    ],
    surface: { start: true },
    render: (s) => markup(s),
    react: (s) => {
      const p = [`  align="${s.align}"`];
      if (s.avatar) p.push('  author={{ name: "Name", email: "name@example.com", avatarSrc }}');
      if (s.text) p.push(`  quote="${s.quote}"`);
      if (s.rating) p.push("  rating={5}");
      return `// Proposed API: yce-frontend has no Testimonial yet\nimport Testimonial from '@/components/common/testimonial';\n\n<Testimonial\n${p.join("\n")}\n/>`;
    },
    variants: [
      { label: "Left", html: markup(full) },
      { label: "Centre", html: markup({ ...full, align: "centre" }) },
      { label: "Left / No avatar", html: markup({ ...full, avatar: false }) },
      { label: "Centre / No rating", html: markup({ ...full, align: "centre", rating: false }) },
    ],
    notes: [
      "Figma's Testimonial set has two variants, Align = Left and Centre; the Avatar, Text and Rating switches are shown on. The last two cells show some switches off.",
      "The avatar photo is a neutral token-coloured circle (--fill-disabled), not an image. The real component takes the photo from the product. The name and email in Figma are a real-looking sample; placeholders are used here.",
      "The stars are always five full stars here, as in Figma. They use --fill-yellow with a --stroke-warning-strong outline, as on the Rating page.",
      "Rendered as figure and blockquote. A figcaption is avoided for the author because the doc site styles figcaption globally.",
      "The component is 364px wide in Figma; here it fills its container up to 364px.",
    ],
  });
})();
