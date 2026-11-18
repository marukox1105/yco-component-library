/* Rating · Figma 6683:289298 (icons 6683:289235). Config reference: COMPONENT-PAGES.md */
(() => {
  const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  const STAR_HALF = "M5.82 21.02L12 17.77V2L8.91 8.26 2 9.27l5 4.87-1.18 6.88z";
  const HEART = "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z";
  const HEART_HALF = "M10.94 4.61 12 5.67v15.56l-8.84-8.84a5.5 5.5 0 0 1 7.78-7.78z";
  const SHAPE = { star: { full: STAR, half: STAR_HALF }, heart: { full: HEART, half: HEART_HALF } };
  const VALUES = ["0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];

  const icon = (type, state) => {
    const p = SHAPE[type];
    const fill = state === "full" ? `<path class="ycoRating_fill" d="${p.full}"/>` : state === "half" ? `<path class="ycoRating_fill" d="${p.half}"/>` : "";
    return `<svg class="ycoRating_icon" viewBox="0 0 24 24" aria-hidden="true">${fill}<path class="ycoRating_outline" d="${p.full}"/></svg>`;
  };
  const stateAt = (value, i) => (value >= i ? "full" : value >= i - 0.5 ? "half" : "empty");

  function markup(s) {
    const value = Number(s.value);
    const icons = [1, 2, 3, 4, 5].map((i) => icon(s.type, stateAt(value, i))).join("");
    const vertical = s.layout === "vertical";
    const reviews = s.reviews
      ? vertical
        ? `\n  <p class="ycoRating_reviews">From <a class="ycoRating_link" href="#reviews">23 reviews</a></p>`
        : `\n  <a class="ycoRating_link" href="#reviews">(23 reviews)</a>`
      : "";
    return `<div class="ycoRating ycoRating_type_${s.type} ycoRating_layout_${s.layout}">
  <div class="ycoRating_main">
    <span class="ycoRating_stars" role="img" aria-label="${s.value} out of 5">${icons}</span>${s.number ? `\n    <span class="ycoRating_value">${s.value}</span>` : ""}
  </div>${reviews}
</div>`;
  }

  const base = { value: "3.5", number: true, reviews: true };
  const variants = [];
  ["star", "heart"].forEach((type) => ["horizontal", "vertical"].forEach((layout) => variants.push({ label: `${YCO.label(type)} / ${YCO.label(layout)}`, html: markup({ ...base, type, layout }), wide: layout === "horizontal" })));
  ["star", "heart"].forEach((type) => ["horizontal", "vertical"].forEach((layout) => variants.push({ label: `${YCO.label(type)} / ${YCO.label(layout)} / No reviews, no number`, html: markup({ ...base, type, layout, number: false, reviews: false }) })));
  ["star", "heart"].forEach((type) => ["empty", "half", "full"].forEach((state) => variants.push({ label: `Icon / ${YCO.label(type)} / ${YCO.label(state)}`, html: `<span class="ycoRating_type_${type}">${icon(type, state)}</span>` })));

  YCO.page({
    id: "rating",
    group: "Marketing",
    title: "Rating",
    figma: "6683:289298",
    intro: "A read-only score of five stars or hearts, in half steps, with an optional number and a link to the reviews. Horizontal keeps everything on one line; Vertical puts the reviews link under the icons.",
    controls: [
      { key: "type", label: "Type", type: "chips", options: ["star", "heart"], default: "star" },
      { key: "layout", label: "Layout", type: "chips", options: ["horizontal", "vertical"], default: "horizontal" },
      { key: "value", label: "Value", type: "chips", options: VALUES, default: "3.5" },
      { key: "number", label: "Number", type: "toggle", default: true },
      { key: "reviews", label: "Reviews link", type: "toggle", default: true },
    ],
    render: (s) => markup(s),
    react: (s) => {
      const p = [`  type="${s.type}"`, `  layout="${s.layout}"`, `  value={${s.value}}`];
      if (!s.number) p.push("  showNumber={false}");
      if (s.reviews) p.push('  reviews={{ count: 23, href: "#reviews" }}');
      return `// Proposed API: yce-frontend has no Rating yet\nimport Rating from '@/components/common/rating';\n\n<Rating\n${p.join("\n")}\n/>`;
    },
    variants,
    notes: [
      "The star is --fill-yellow (#fec62e) with a --stroke-warning-strong outline (the updated amber, #ef9b00 at 80%), as Figma now defines them.",
      "The heart fill and outline are --fill-error-strong, as in Figma (#DE0000, 1px outline).",
      "Figma only draws the value 3.5 (three full, one half, one empty). The Value control shows any half step from 0 to 5; the icon cells list every Star and Heart state.",
      "Display only: Figma has no hover or selected state, so the page does not make it interactive. The reviews text is a link; Figma gives it no hover style.",
      "The number is 18px semibold; its 26px line height has no token, written in rem.",
    ],
  });
})();
