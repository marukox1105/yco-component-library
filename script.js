const root = document.documentElement;
const previewButton = document.querySelector("#previewButton");
const previewSurface = document.querySelector("#previewSurface");
const stateLabel = document.querySelector("#stateLabel");
const codeBlock = document.querySelector("#codeBlock");
const toast = document.querySelector("#toast");
const sidebar = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-button");
const defaultLabel = "Button";
const mobileThemeQuery = window.matchMedia("(max-width: 960px)");
let activeCodeTab = "html";

const controls = {
  leadingIcon: document.querySelector("#leadingIcon"),
  trailingIcon: document.querySelector("#trailingIcon"),
  fullWidth: document.querySelector("#fullWidth"),
};

const selections = {
  type: "primary",
  tone: "brand",
  state: "default",
  size: "medium",
};

const typeLabels = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
};

const toneLabels = {
  brand: "Brand",
  neutral: "Neutral",
  destructive: "Destructive",
  inverse: "Inverse",
};

const stateLabels = {
  default: "Default",
  hover: "Hover",
  press: "Press",
  focus: "Focus",
  disabled: "Disabled",
};

const sizeLabels = {
  large: "Large",
  medium: "Medium",
  small: "Small",
  tiny: "Tiny",
};

function previewStateLabel() {
  return [
    typeLabels[selections.type],
    toneLabels[selections.tone],
    sizeLabels[selections.size],
    stateLabels[selections.state],
  ].join(" / ");
}

const plusIcon = `<span class="button-icon" aria-hidden="true">
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
</span>`;

const chevronRightIcon = `<span class="button-icon" aria-hidden="true">
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="m9 18 6-6-6-6"></path>
  </svg>
</span>`;

const baseCss = `.yco-button {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--corner-radius-32);
  font-family: var(--font-family-heading, Roboto), system-ui, sans-serif;
  font-weight: var(--font-weight-strong, 600);
  letter-spacing: 0;
}

.yco-button::before {
  content: "";
  position: absolute;
  inset: var(--spacing-0);
  z-index: 0;
  border-radius: inherit;
  background: transparent;
  pointer-events: none;
}

.yco-button > * {
  position: relative;
  z-index: 1;
}`;

const variantCss = {
  "brand-primary": `.yco-button--brand.yco-button--primary {
  background: var(--fill-brand-strong);
  color: var(--text-inverse-strong);
}

.yco-button--brand.yco-button--primary .button-icon {
  color: var(--icon-inverse-strong);
}

.yco-button--brand.yco-button--primary:hover,
.yco-button--brand.yco-button--primary.is-hover {
  background: var(--fill-brand-strong);
}

.yco-button--brand.yco-button--primary:hover::before,
.yco-button--brand.yco-button--primary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--brand.yco-button--primary:active,
.yco-button--brand.yco-button--primary.is-press {
  background: var(--fill-brand-strong);
}

.yco-button--brand.yco-button--primary:active::before,
.yco-button--brand.yco-button--primary.is-press::before {
  background: var(--fill-press);
}`,
  "neutral-primary": `.yco-button--neutral.yco-button--primary {
  background: var(--fill-strong);
  color: var(--text-inverse-strong);
}

.yco-button--neutral.yco-button--primary .button-icon {
  color: var(--icon-inverse-strong);
}

.yco-button--neutral.yco-button--primary:hover,
.yco-button--neutral.yco-button--primary.is-hover {
  background: var(--fill-strong);
}

.yco-button--neutral.yco-button--primary:hover::before,
.yco-button--neutral.yco-button--primary.is-hover::before {
  background: var(--fill-inverse-hover);
}

.yco-button--neutral.yco-button--primary:active,
.yco-button--neutral.yco-button--primary.is-press {
  background: var(--fill-strong);
}

.yco-button--neutral.yco-button--primary:active::before,
.yco-button--neutral.yco-button--primary.is-press::before {
  background: var(--fill-inverse-press);
}`,
  "destructive-primary": `.yco-button--destructive.yco-button--primary {
  background: var(--fill-error-strong);
  color: var(--text-inverse-strong);
}

.yco-button--destructive.yco-button--primary .button-icon {
  color: var(--icon-inverse-strong);
}

.yco-button--destructive.yco-button--primary:hover,
.yco-button--destructive.yco-button--primary.is-hover {
  background: var(--fill-error-strong);
}

.yco-button--destructive.yco-button--primary:hover::before,
.yco-button--destructive.yco-button--primary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--destructive.yco-button--primary:active,
.yco-button--destructive.yco-button--primary.is-press {
  background: var(--fill-error-strong);
}

.yco-button--destructive.yco-button--primary:active::before,
.yco-button--destructive.yco-button--primary.is-press::before {
  background: var(--fill-press);
}`,
  "inverse-primary": `.yco-button--inverse.yco-button--primary {
  background: var(--fill-inverse-strong);
  color: var(--text-strong);
}

.yco-button--inverse.yco-button--primary .button-icon {
  color: var(--icon-neutral);
}

.yco-button--inverse.yco-button--primary:hover,
.yco-button--inverse.yco-button--primary.is-hover {
  background: var(--fill-inverse-strong);
}

.yco-button--inverse.yco-button--primary:hover::before,
.yco-button--inverse.yco-button--primary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--inverse.yco-button--primary:active,
.yco-button--inverse.yco-button--primary.is-press {
  background: var(--fill-inverse-strong);
}

.yco-button--inverse.yco-button--primary:active::before,
.yco-button--inverse.yco-button--primary.is-press::before {
  background: var(--fill-press);
}`,
  "brand-secondary": `.yco-button--brand.yco-button--secondary {
  border-color: var(--stroke-brand-strong);
  background: transparent;
  color: var(--text-brand);
}

.yco-button--brand.yco-button--secondary .button-icon {
  color: var(--icon-brand);
}

.yco-button--brand.yco-button--secondary:hover,
.yco-button--brand.yco-button--secondary.is-hover {
  background: transparent;
}

.yco-button--brand.yco-button--secondary:hover::before,
.yco-button--brand.yco-button--secondary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--brand.yco-button--secondary:active,
.yco-button--brand.yco-button--secondary.is-press {
  background: transparent;
}

.yco-button--brand.yco-button--secondary:active::before,
.yco-button--brand.yco-button--secondary.is-press::before {
  background: var(--fill-press);
}`,
  "neutral-secondary": `.yco-button--neutral.yco-button--secondary {
  border-color: var(--stroke-strong);
  background: var(--grey-slate-light-25);
  color: var(--text-strong);
}

.yco-button--neutral.yco-button--secondary .button-icon {
  color: var(--icon-neutral);
}

.yco-button--neutral.yco-button--secondary:hover,
.yco-button--neutral.yco-button--secondary.is-hover {
  background: var(--grey-slate-light-25);
}

.yco-button--neutral.yco-button--secondary:hover::before,
.yco-button--neutral.yco-button--secondary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--neutral.yco-button--secondary:active,
.yco-button--neutral.yco-button--secondary.is-press {
  background: var(--fill-press);
}`,
  "destructive-secondary": `.yco-button--destructive.yco-button--secondary {
  border-color: var(--stroke-error-strong);
  background: transparent;
  color: var(--text-error);
}

.yco-button--destructive.yco-button--secondary .button-icon {
  color: var(--icon-error);
}

.yco-button--destructive.yco-button--secondary:hover,
.yco-button--destructive.yco-button--secondary.is-hover {
  background: transparent;
}

.yco-button--destructive.yco-button--secondary:hover::before,
.yco-button--destructive.yco-button--secondary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--destructive.yco-button--secondary:active,
.yco-button--destructive.yco-button--secondary.is-press {
  background: transparent;
}

.yco-button--destructive.yco-button--secondary:active::before,
.yco-button--destructive.yco-button--secondary.is-press::before {
  background: var(--fill-press);
}`,
  "inverse-secondary": `.yco-button--inverse.yco-button--secondary {
  border-color: var(--stroke-inverse-strong);
  background: transparent;
  color: var(--text-inverse-strong);
}

.yco-button--inverse.yco-button--secondary .button-icon {
  color: var(--icon-inverse-strong);
}

.yco-button--inverse.yco-button--secondary:hover,
.yco-button--inverse.yco-button--secondary.is-hover {
  background: var(--fill-inverse-hover);
}

.yco-button--inverse.yco-button--secondary:active,
.yco-button--inverse.yco-button--secondary.is-press {
  background: var(--fill-inverse-press);
}`,
  "brand-tertiary": `.yco-button--brand.yco-button--tertiary {
  background: transparent;
  color: var(--text-brand);
}

.yco-button--brand.yco-button--tertiary .button-icon {
  color: var(--icon-brand);
}

.yco-button--tertiary .button-label {
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
}

.yco-button--brand.yco-button--tertiary:hover,
.yco-button--brand.yco-button--tertiary.is-hover {
  background: transparent;
}

.yco-button--brand.yco-button--tertiary:hover::before,
.yco-button--brand.yco-button--tertiary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--brand.yco-button--tertiary:active,
.yco-button--brand.yco-button--tertiary.is-press {
  background: transparent;
}

.yco-button--brand.yco-button--tertiary:active::before,
.yco-button--brand.yco-button--tertiary.is-press::before {
  background: var(--fill-press);
}`,
  "neutral-tertiary": `.yco-button--neutral.yco-button--tertiary {
  background: transparent;
  color: var(--text-strong);
}

.yco-button--neutral.yco-button--tertiary .button-icon {
  color: var(--icon-neutral);
}

.yco-button--tertiary .button-label {
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
}

.yco-button--neutral.yco-button--tertiary:hover,
.yco-button--neutral.yco-button--tertiary.is-hover {
  background: transparent;
}

.yco-button--neutral.yco-button--tertiary:hover::before,
.yco-button--neutral.yco-button--tertiary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--neutral.yco-button--tertiary:active,
.yco-button--neutral.yco-button--tertiary.is-press {
  background: var(--fill-press);
}`,
  "destructive-tertiary": `.yco-button--destructive.yco-button--tertiary {
  background: transparent;
  color: var(--text-error);
}

.yco-button--destructive.yco-button--tertiary .button-icon {
  color: var(--icon-error);
}

.yco-button--tertiary .button-label {
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
}

.yco-button--destructive.yco-button--tertiary:hover,
.yco-button--destructive.yco-button--tertiary.is-hover {
  background: transparent;
}

.yco-button--destructive.yco-button--tertiary:hover::before,
.yco-button--destructive.yco-button--tertiary.is-hover::before {
  background: var(--fill-hover);
}

.yco-button--destructive.yco-button--tertiary:active,
.yco-button--destructive.yco-button--tertiary.is-press {
  background: transparent;
}

.yco-button--destructive.yco-button--tertiary:active::before,
.yco-button--destructive.yco-button--tertiary.is-press::before {
  background: var(--fill-press);
}`,
  "inverse-tertiary": `.yco-button--inverse.yco-button--tertiary {
  background: transparent;
  color: var(--text-inverse-strong);
}

.yco-button--inverse.yco-button--tertiary .button-icon {
  color: var(--icon-inverse-strong);
}

.yco-button--tertiary .button-label {
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
}

.yco-button--inverse.yco-button--tertiary:hover,
.yco-button--inverse.yco-button--tertiary.is-hover {
  background: var(--fill-inverse-hover);
}

.yco-button--inverse.yco-button--tertiary:active,
.yco-button--inverse.yco-button--tertiary.is-press {
  background: var(--fill-inverse-press);
}`,
};

const sizeCss = {
  large: `.yco-button--large {
  min-height: var(--spacing-56);
  gap: var(--spacing-4);
  padding: var(--spacing-0) var(--spacing-24);
  font-size: var(--font-size-heading-4);
  line-height: var(--line-height-heading-4);
}`,
  medium: `.yco-button--medium {
  min-height: var(--spacing-48);
  gap: var(--spacing-4);
  padding: var(--spacing-0) var(--spacing-16);
  font-size: var(--font-size-heading-5);
  line-height: var(--line-height-small);
}`,
  small: `.yco-button--small {
  min-height: var(--spacing-40);
  gap: var(--spacing-4);
  padding: var(--spacing-0) var(--spacing-16);
  font-size: var(--font-size-small);
  line-height: var(--line-height-small);
}`,
  tiny: `.yco-button--tiny {
  min-height: var(--spacing-32);
  gap: var(--spacing-4);
  padding: var(--spacing-0) var(--spacing-12);
  font-size: var(--font-size-tiny);
  line-height: var(--line-height-tiny);
}`,
};

function buttonMarkup() {
  const leading = controls.leadingIcon.checked ? `${plusIcon}\n  ` : "";
  const trailing = controls.trailingIcon.checked ? `\n  ${chevronRightIcon}` : "";
  const disabled = selections.state === "disabled" ? " disabled" : "";
  const extraClass = controls.fullWidth.checked ? " is-full-width" : "";

  return `<button class="yco-button yco-button--${selections.tone} yco-button--${selections.type} yco-button--${selections.size}${extraClass}" type="button"${disabled}>
  ${leading}<span class="button-label">${defaultLabel}</span>${trailing}
</button>`;
}

function reactMarkup() {
  const props = [
    `variant="${selections.type}"`,
    `tone="${selections.tone}"`,
    `size="${selections.size}"`,
    selections.state === "disabled" ? "disabled" : "",
    selections.state !== "default" && selections.state !== "disabled" ? `state="${selections.state}"` : "",
    controls.fullWidth.checked ? "fullWidth" : "",
    controls.leadingIcon.checked ? "leadingIcon={PlusIcon}" : "",
    controls.trailingIcon.checked ? "trailingIcon={ChevronRightIcon}" : "",
  ].filter(Boolean).join("\n  ");

  return `<Button
  ${props}
>
  ${defaultLabel}
</Button>`;
}

function cssMarkup() {
  const iconSize = selections.size === "large"
    ? "24px"
    : selections.size === "tiny"
      ? "16px"
      : "20px";

  const stateCss = selections.state === "focus"
    ? `.yco-button:focus-visible,
.yco-button.is-focus {
  outline: 0;
  box-shadow: 0 0 0 var(--spacing-4) var(--stroke-focus);
}

.yco-button--inverse.yco-button--secondary.is-focus,
.yco-button--inverse.yco-button--tertiary.is-focus {
  box-shadow: 0 0 0 3px var(--stroke-inverse-strong);
}

.yco-button--inverse.yco-button--primary.is-focus {
  box-shadow: 0 0 0 3px var(--stroke-inverse-strong);
}`
    : selections.state === "disabled"
      ? `.yco-button:disabled,
.yco-button.is-disabled {
  cursor: not-allowed;
  transform: none;
}

.yco-button.yco-button--primary:disabled,
.yco-button.yco-button--primary.is-disabled {
  border-color: transparent;
  background: var(--fill-disabled);
  color: var(--text-inverse-strong);
}

.yco-button.yco-button--primary:disabled .button-icon,
.yco-button.yco-button--primary.is-disabled .button-icon {
  color: var(--icon-inverse-strong);
}

.yco-button.yco-button--secondary:disabled,
.yco-button.yco-button--secondary.is-disabled {
  border-color: var(--stroke-disabled);
  background: transparent;
  color: var(--text-disabled);
}

.yco-button.yco-button--secondary:disabled .button-icon,
.yco-button.yco-button--secondary.is-disabled .button-icon {
  color: var(--icon-disabled);
}

.yco-button.yco-button--tertiary:disabled,
.yco-button.yco-button--tertiary.is-disabled {
  border-color: transparent;
  background: transparent;
  color: var(--text-disabled);
}

.yco-button.yco-button--tertiary:disabled .button-icon,
.yco-button.yco-button--tertiary.is-disabled .button-icon {
  color: var(--icon-disabled);
}

.yco-button.yco-button--inverse.yco-button--primary:disabled,
.yco-button.yco-button--inverse.yco-button--primary.is-disabled {
  border-color: transparent;
  background: var(--fill-inverse-disabled);
  color: var(--text-strong);
}

.yco-button.yco-button--inverse.yco-button--primary:disabled .button-icon,
.yco-button.yco-button--inverse.yco-button--primary.is-disabled .button-icon {
  color: var(--icon-neutral);
}

.yco-button.yco-button--inverse.yco-button--secondary:disabled,
.yco-button.yco-button--inverse.yco-button--secondary.is-disabled {
  border-color: var(--stroke-inverse-disabled);
  background: transparent;
  color: var(--text-inverse-disabled);
}

.yco-button.yco-button--inverse.yco-button--secondary:disabled .button-icon,
.yco-button.yco-button--inverse.yco-button--secondary.is-disabled .button-icon {
  color: var(--icon-inverse-disabled);
}

.yco-button.yco-button--inverse.yco-button--tertiary:disabled,
.yco-button.yco-button--inverse.yco-button--tertiary.is-disabled {
  border-color: transparent;
  background: transparent;
  color: var(--text-inverse-disabled);
}

.yco-button.yco-button--inverse.yco-button--tertiary:disabled .button-icon,
.yco-button.yco-button--inverse.yco-button--tertiary.is-disabled .button-icon {
  color: var(--icon-inverse-disabled);
}`
    : "";

  const iconCss = `.button-icon {
  display: inline-grid;
  place-items: center;
  width: ${iconSize};
  height: ${iconSize};
  flex: 0 0 ${iconSize};
}

.button-icon svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.5;
}`;

  return [
    baseCss,
    variantCss[`${selections.tone}-${selections.type}`],
    sizeCss[selections.size],
    stateCss,
    iconCss,
  ].filter(Boolean).join("\n\n");
}

function codeMarkup() {
  if (activeCodeTab === "react") return reactMarkup();
  if (activeCodeTab === "css") return cssMarkup();
  return buttonMarkup();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightMarkup(value) {
  return escapeHtml(value).replace(/(&lt;\/?)([A-Za-z][\w-]*)([\s\S]*?)(\/?&gt;)/g, (match, open, tag, attrs, close) => {
    const highlightedAttrs = attrs.replace(/([\w:-]+)(=)(&quot;[^&]*?&quot;|\{[\s\S]*?\})/g, '<span class="token attr">$1</span>$2<span class="token string">$3</span>');
    return `<span class="token punctuation">${open}</span><span class="token tag">${tag}</span>${highlightedAttrs}<span class="token punctuation">${close}</span>`;
  });
}

function highlightCss(value) {
  return escapeHtml(value)
    .replace(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s)?\b)/g, '<span class="token number">$1</span>')
    .replace(/(--[\w-]+|[\w-]+)(?=:)/g, '<span class="token attr">$1</span>')
    .replace(/(\.[\w-]+|:[\w-]+|::[\w-]+)/g, '<span class="token selector">$1</span>')
    .replace(/(var\()(<span class="token attr">--[\w-]+<\/span>)(\))/g, '<span class="token function">$1</span>$2<span class="token function">$3</span>');
}

function highlightCode(value) {
  if (activeCodeTab === "css") return highlightCss(value);
  return highlightMarkup(value);
}

function updatePreview() {
  const type = selections.type;
  const tone = selections.tone;
  const state = selections.state;

  previewButton.className = [
    "yco-button",
    `yco-button--${tone}`,
    `yco-button--${type}`,
    `yco-button--${selections.size}`,
    controls.fullWidth.checked ? "is-full-width" : "",
    state !== "default" ? `is-${state}` : "",
  ].filter(Boolean).join(" ");
  previewSurface.classList.toggle("is-inverse-preview", tone === "inverse");

  previewButton.disabled = state === "disabled";
  previewButton.removeAttribute("aria-busy");
  previewButton.innerHTML = [
    controls.leadingIcon.checked ? plusIcon : "",
    `<span class="button-label">${defaultLabel}</span>`,
    controls.trailingIcon.checked ? chevronRightIcon : "",
  ].filter(Boolean).join("");

  const code = codeMarkup();
  stateLabel.textContent = previewStateLabel();
  codeBlock.innerHTML = highlightCode(code);
  document.title = `YCO Buttons - ${toneLabels[tone]} ${typeLabels[type]}`;
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    const currentTheme = root.dataset.theme || "light";
    const nextTheme = mobileThemeQuery.matches
      ? currentTheme === "light" ? "dark" : "light"
      : button.dataset.theme;

    document.querySelectorAll("[data-theme]").forEach((item) => item.classList.remove("is-active"));
    document.querySelector(`[data-theme="${nextTheme}"]`)?.classList.add("is-active");
    root.dataset.theme = nextTheme;
  });
});

function setMenuOpen(isOpen) {
  sidebar.classList.toggle("is-menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close component menu" : "Open component menu");
}

menuButton.addEventListener("click", () => {
  setMenuOpen(!sidebar.classList.contains("is-menu-open"));
});

sidebar.addEventListener("click", (event) => {
  if (event.target === sidebar || event.target.closest(".side-link")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

document.querySelectorAll("[data-control]").forEach((button) => {
  button.addEventListener("click", () => {
    const control = button.dataset.control;
    document.querySelectorAll(`[data-control="${control}"]`).forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    selections[control] = button.dataset.value;
    updatePreview();
  });
});

document.querySelectorAll("[data-code-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-code-tab]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeCodeTab = button.dataset.codeTab;
    updatePreview();
  });
});

Object.values(controls).forEach((control) => {
  control.addEventListener("input", updatePreview);
  control.addEventListener("change", updatePreview);
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(`#${button.dataset.copyTarget}`);
    const didCopy = await copyText(target.textContent);
    toast.textContent = didCopy ? "Copied" : "Select code to copy";
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 1400);
  });
});

async function copyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto 0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

updatePreview();
