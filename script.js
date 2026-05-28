const root = document.documentElement;
const previewButton = document.querySelector("#previewButton");
const previewSurface = document.querySelector("#previewSurface");
const stateLabel = document.querySelector("#stateLabel");
const codeBlock = document.querySelector("#codeBlock");
const toast = document.querySelector("#toast");
const sidebar = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-button");
const pages = document.querySelectorAll("[data-page]");
const pageLinks = document.querySelectorAll("[data-page-link]");
const alertPreview = document.querySelector("#alertPreview");
const alertPreviewSurface = document.querySelector("#alertPreviewSurface");
const alertStateLabel = document.querySelector("#alertStateLabel");
const alertCodeBlock = document.querySelector("#alertCodeBlock");
const defaultLabel = "Button";
const mobileThemeQuery = window.matchMedia("(max-width: 960px)");
let activeCodeTab = "html";
let activeAlertCodeTab = "html";

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

const alertControls = {
  icon: document.querySelector("#alertIcon"),
  dismissible: document.querySelector("#alertDismissible"),
  border: document.querySelector("#alertBorder"),
  link: document.querySelector("#alertLink"),
  buttons: document.querySelector("#alertButtons"),
};

const alertSelections = {
  tone: "error",
  size: "large",
  layout: "horizontal",
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

const alertToneLabels = {
  error: "Error",
  warning: "Warning",
  success: "Success",
  information: "Information",
  neutral: "Neutral",
  brand: "Brand",
  "inverse-neutral": "Inverse Neutral",
  "inverse-brand": "Inverse Brand",
};

const alertSizeLabels = {
  large: "Large",
  small: "Small",
};

const alertLayoutLabels = {
  horizontal: "Horizontal",
  vertical: "Vertical",
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
  const classNames = [
    `styles.${selections.type}`,
    `styles.${selections.tone}`,
    `styles.${selections.size}`,
    selections.state !== "default" && selections.state !== "disabled" ? `styles.${selections.state}` : "",
    controls.fullWidth.checked ? "styles.fullWidth" : "",
  ].filter(Boolean).join(",\n      ");
  const disabled = selections.state === "disabled" ? "true" : "disabled";
  const leading = controls.leadingIcon.checked
    ? `\n    <PlusIcon className={styles.icon} aria-hidden="true" />`
    : "";
  const trailing = controls.trailingIcon.checked
    ? `\n    <ChevronRightIcon className={styles.icon} aria-hidden="true" />`
    : "";

  return `import styles from './index.module.scss';
import ButtonWrapper from './ButtonWrapper';
import { disabledVariants } from './types/buttonWrapperTypes';

<ButtonWrapper
  className={[
      ${classNames}
    ].filter(Boolean).join(' ')}
  hideHoverEffect={hideHoverEffect}
  hoverClass={styles.hover}
  touchClass={styles.press}
  order={order}
  nonce={nonce}
  gaClass={gaClass}
  disabled={${disabled}}
  disabledVariant={disabledVariants.DEFAULT}
  onTouchStart={onTouchStart}
  onTouchEnd={onTouchEnd}
  alt="${defaultLabel}"
  href={href}
  type="button"
>${leading}
  <span className={styles.label}>${defaultLabel}</span>${trailing}
</ButtonWrapper>`;
}

function cssMarkup() {
  const iconSize = selections.size === "large"
    ? "24px"
    : selections.size === "tiny"
      ? "16px"
      : "20px";

  const moduleBaseCss = `.button {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--corner-radius-32);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-strong);
  letter-spacing: 0;
}

.button::before {
  content: "";
  position: absolute;
  inset: var(--spacing-0);
  z-index: 0;
  border-radius: inherit;
  background: transparent;
  pointer-events: none;
}

.button > * {
  position: relative;
  z-index: 1;
}`;

  const moduleVariantCss = variantCss[`${selections.tone}-${selections.type}`]
    .replaceAll(".yco-button--", ".")
    .replaceAll(".yco-button", ".button")
    .replaceAll(".button-icon", ".icon")
    .replaceAll(".button-label", ".label")
    .replaceAll(".is-", ".");

  const moduleSizeCss = sizeCss[selections.size]
    .replaceAll(".yco-button--", ".")
    .replaceAll(".yco-button", ".button");

  const stateCss = selections.state === "focus"
    ? `.button:focus-visible,
.button.focus {
  outline: 0;
  box-shadow: 0 0 0 var(--spacing-4) var(--stroke-focus);
}

.button.inverse.secondary.focus,
.button.inverse.tertiary.focus {
  box-shadow: 0 0 0 3px var(--stroke-inverse-strong);
}

.button.inverse.primary.focus {
  box-shadow: 0 0 0 3px var(--stroke-inverse-strong);
}`
    : selections.state === "disabled"
      ? `.button:disabled,
.button.disabled {
  cursor: not-allowed;
  transform: none;
}

.button.primary:disabled,
.button.primary.disabled {
  border-color: transparent;
  background: var(--fill-disabled);
  color: var(--text-inverse-strong);
}

.button.primary:disabled .icon,
.button.primary.disabled .icon {
  color: var(--icon-inverse-strong);
}

.button.secondary:disabled,
.button.secondary.disabled {
  border-color: var(--stroke-disabled);
  background: transparent;
  color: var(--text-disabled);
}

.button.secondary:disabled .icon,
.button.secondary.disabled .icon {
  color: var(--icon-disabled);
}

.button.tertiary:disabled,
.button.tertiary.disabled {
  border-color: transparent;
  background: transparent;
  color: var(--text-disabled);
}

.button.tertiary:disabled .icon,
.button.tertiary.disabled .icon {
  color: var(--icon-disabled);
}

.button.inverse.primary:disabled,
.button.inverse.primary.disabled {
  border-color: transparent;
  background: var(--fill-inverse-disabled);
  color: var(--text-strong);
}

.button.inverse.primary:disabled .icon,
.button.inverse.primary.disabled .icon {
  color: var(--icon-neutral);
}

.button.inverse.secondary:disabled,
.button.inverse.secondary.disabled {
  border-color: var(--stroke-inverse-disabled);
  background: transparent;
  color: var(--text-inverse-disabled);
}

.button.inverse.secondary:disabled .icon,
.button.inverse.secondary.disabled .icon {
  color: var(--icon-inverse-disabled);
}

.button.inverse.tertiary:disabled,
.button.inverse.tertiary.disabled {
  border-color: transparent;
  background: transparent;
  color: var(--text-inverse-disabled);
}

.button.inverse.tertiary:disabled .icon,
.button.inverse.tertiary.disabled .icon {
  color: var(--icon-inverse-disabled);
}`
    : "";

  const iconCss = `.icon {
  display: inline-grid;
  place-items: center;
  width: ${iconSize};
  height: ${iconSize};
  flex: 0 0 ${iconSize};
}

.icon svg {
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
    moduleBaseCss,
    moduleVariantCss,
    moduleSizeCss,
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

function alertStatusLabel() {
  return [
    alertToneLabels[alertSelections.tone],
    alertSizeLabels[alertSelections.size],
    alertLayoutLabels[alertSelections.layout],
  ].join(" / ");
}

function alertIconMarkup(tone = alertSelections.tone) {
  const iconName = tone.replace("inverse-", "");
  const icons = {
    error: `<path d="M12 8v5"></path><path d="M12 17h.01"></path><circle cx="12" cy="12" r="9"></circle>`,
    warning: `<path d="m21 19-9-16-9 16h18Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>`,
    success: `<circle cx="12" cy="12" r="9"></circle><path d="m8.5 12.5 2.2 2.2 4.8-5.4"></path>`,
    information: `<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5"></path><path d="M12 8h.01"></path>`,
    neutral: `<circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path>`,
    brand: `<circle cx="12" cy="12" r="9"></circle><path d="M12 7v10"></path><path d="M7 12h10"></path>`,
  };

  return `<svg viewBox="0 0 24 24" focusable="false">${icons[iconName] || icons.neutral}</svg>`;
}

const closeIcon = `<svg viewBox="0 0 24 24" focusable="false">
  <path d="M18 6 6 18"></path>
  <path d="m6 6 12 12"></path>
</svg>`;

function alertMessageMarkup() {
  const link = alertControls.link.checked
    ? `\n      <a class="alert-link" href="#">Anchor link</a>`
    : "";
  const buttons = alertControls.buttons.checked
    ? `\n      <div class="alert-actions">
        <button class="yco-button yco-button--neutral yco-button--primary yco-button--tiny" type="button">
          <span class="button-label">Label</span>
        </button>
        <button class="yco-button yco-button--neutral yco-button--secondary yco-button--tiny" type="button">
          <span class="button-label">Label</span>
        </button>
      </div>`
    : "";

  return `<div class="alert-text">
    <strong class="alert-title">Heading</strong>
    <p>Lorem ipsum dolor sit amet, consec tetur adipiscing elit dolor sit.</p>${link}${buttons}
  </div>`;
}

function alertMarkup() {
  const classes = [
    "yco-alert",
    `yco-alert--${alertSelections.tone}`,
    `yco-alert--${alertSelections.size}`,
    `yco-alert--${alertSelections.layout}`,
    alertControls.icon.checked ? "has-icon" : "",
    alertControls.dismissible.checked ? "is-dismissible" : "",
    alertControls.border.checked ? "has-border" : "",
  ].filter(Boolean).join(" ");

  const icon = `<span class="alert-icon" aria-hidden="true">
    ${alertIconMarkup()}
  </span>`;
  const dismiss = `<button class="alert-dismiss" type="button" aria-label="Dismiss alert">
    ${closeIcon}
  </button>`;

  return `<div class="${classes}" id="alertPreview" role="alert">
  <div class="alert-border" aria-hidden="true"></div>
  <div class="alert-content">
    ${icon}
    ${alertMessageMarkup()}
    ${dismiss}
  </div>
</div>`;
}

function alertReactMarkup() {
  const toneClass = alertSelections.tone.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  const classNames = [
    "styles.alert",
    `styles.${toneClass}`,
    `styles.${alertSelections.size}`,
    `styles.${alertSelections.layout}`,
    alertControls.border.checked ? "styles.hasBorder" : "",
  ].filter(Boolean).join(",\n      ");
  const icon = alertControls.icon.checked
    ? `\n      <AlertIcon className={styles.icon} aria-hidden="true" />`
    : "";
  const dismiss = alertControls.dismissible.checked
    ? `\n      <button className={styles.dismiss} type="button" aria-label="Dismiss alert">
        <CloseIcon aria-hidden="true" />
      </button>`
    : "";
  const link = alertControls.link.checked
    ? `\n        <LinkWithLocale className={styles.link} href={href}>
          Anchor link
        </LinkWithLocale>`
    : "";
  const actions = alertControls.buttons.checked
    ? `\n        <div className={styles.actions}>
          <ButtonWrapper className={[styles.actionButton, styles.primary].join(' ')}>
            Label
          </ButtonWrapper>
          <ButtonWrapper className={[styles.actionButton, styles.secondary].join(' ')}>
            Label
          </ButtonWrapper>
        </div>`
    : "";

  return `import styles from './index.module.scss';
import ButtonWrapper from '@/components/button-wrapper';
import LinkWithLocale from '@/components/utils/link-with-locale';

<div
  className={[
      ${classNames}
    ].filter(Boolean).join(' ')}
  role="alert"
>
  {borderLeft && <div className={styles.border} aria-hidden="true" />}
  <div className={styles.content}>${icon}
    <div className={styles.text}>
      <strong className={styles.title}>Heading</strong>
      <p>Lorem ipsum dolor sit amet, consec tetur adipiscing elit dolor sit.</p>${link}${actions}
    </div>${dismiss}
  </div>
</div>`;
}

const alertBaseCss = `.alert {
  display: flex;
  width: min(100%, 600px);
  overflow: hidden;
  border: 1px solid var(--alert-border);
  border-radius: var(--corner-radius-8);
  background: var(--alert-background);
  color: var(--alert-body);
}`;

const alertToneCss = {
  error: `.error {
  --alert-background: var(--background-base);
  --alert-border: var(--stroke-error-weak);
  --alert-fill: var(--fill-error-weak);
  --alert-icon: var(--icon-error);
  --alert-title: var(--text-strong);
  --alert-body: var(--text-weak);
  --alert-action: var(--text-error);
}`,
  warning: `.warning {
  --alert-background: var(--background-base);
  --alert-border: var(--stroke-warning-weak);
  --alert-fill: var(--fill-warning-weak);
  --alert-icon: var(--icon-warning);
  --alert-title: var(--text-strong);
  --alert-body: var(--text-weak);
  --alert-action: var(--text-warning);
}`,
  success: `.success {
  --alert-background: var(--background-base);
  --alert-border: var(--stroke-success-weak);
  --alert-fill: var(--fill-success-weak);
  --alert-icon: var(--icon-success);
  --alert-title: var(--text-strong);
  --alert-body: var(--text-weak);
  --alert-action: var(--text-success);
}`,
  information: `.information {
  --alert-background: var(--background-base);
  --alert-border: var(--stroke-information-weak);
  --alert-fill: var(--fill-information-weak);
  --alert-icon: var(--icon-information);
  --alert-title: var(--text-strong);
  --alert-body: var(--text-weak);
  --alert-action: var(--text-information);
}`,
  neutral: `.neutral {
  --alert-background: var(--background-base);
  --alert-border: var(--stroke-weak);
  --alert-fill: transparent;
  --alert-icon: var(--icon-neutral);
  --alert-title: var(--text-strong);
  --alert-body: var(--text-weak);
  --alert-action: var(--text-strong);
}`,
  brand: `.brand {
  --alert-background: var(--background-base);
  --alert-border: var(--stroke-brand-weak);
  --alert-fill: var(--fill-brand-weak);
  --alert-icon: var(--icon-brand);
  --alert-title: var(--text-strong);
  --alert-body: var(--text-weak);
  --alert-action: var(--text-brand);
}`,
  "inverse-neutral": `.inverseNeutral {
  --alert-background: var(--background-inverse);
  --alert-border: transparent;
  --alert-fill: transparent;
  --alert-icon: var(--icon-inverse-strong);
  --alert-title: var(--text-inverse-strong);
  --alert-body: var(--text-inverse-weak);
  --alert-action: var(--text-inverse-strong);
}`,
  "inverse-brand": `.inverseBrand {
  --alert-background: var(--fill-brand-strong);
  --alert-border: transparent;
  --alert-fill: transparent;
  --alert-icon: var(--icon-inverse-strong);
  --alert-title: var(--text-inverse-strong);
  --alert-body: var(--text-inverse-weak);
  --alert-action: var(--text-inverse-strong);
}`,
};

const alertLayoutCss = `.border {
  width: 4px;
  flex: 0 0 4px;
  align-self: stretch;
  background: var(--alert-icon);
}

.content {
  display: flex;
  flex: 1 1 auto;
  gap: var(--spacing-12);
  align-items: flex-start;
  background: var(--alert-fill);
}

.large .content {
  padding: var(--spacing-24);
}

.small .content {
  padding: var(--spacing-16);
}

.vertical .content {
  flex-direction: column;
}

.icon {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  color: var(--alert-icon);
}

.text {
  display: grid;
  flex: 1 1 auto;
  min-width: 0;
  gap: 2px;
  padding-top: 2px;
}

.title {
  color: var(--alert-title);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-strong);
}

.text p {
  margin: 0;
  color: var(--alert-body);
}

.link {
  color: var(--alert-action);
  font-weight: var(--font-weight-strong);
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
}

.dismiss {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  place-items: center;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--alert-action);
}`;

function alertCssMarkup() {
  return [
    alertBaseCss,
    alertToneCss[alertSelections.tone],
    alertLayoutCss,
  ].join("\n\n");
}

function alertCodeMarkup() {
  if (activeAlertCodeTab === "react") return alertReactMarkup();
  if (activeAlertCodeTab === "css") return alertCssMarkup();
  return alertMarkup();
}

function updateAlertPreview() {
  const currentAlertPreview = document.querySelector("#alertPreview");
  if (!currentAlertPreview) return;

  currentAlertPreview.outerHTML = alertMarkup();
  alertPreviewSurface.classList.toggle("is-inverse-preview", alertSelections.tone.startsWith("inverse"));
  alertStateLabel.textContent = alertStatusLabel();
  alertCodeBlock.innerHTML = activeAlertCodeTab === "css"
    ? highlightCss(alertCodeMarkup())
    : highlightMarkup(alertCodeMarkup());
  document.title = `YCO Feedback - ${alertToneLabels[alertSelections.tone]} Alert`;
}

function setActivePage(pageId) {
  pages.forEach((page) => {
    const isActive = page.dataset.page === pageId;
    page.hidden = !isActive;
    page.classList.toggle("is-active", isActive);
  });
  pageLinks.forEach((link) => {
    const isActive = link.dataset.pageLink === pageId;
    link.classList.toggle("is-active", isActive);
    link.classList.toggle("is-disabled", false);
    link.removeAttribute("aria-disabled");
  });

  if (pageId === "feedback") {
    updateAlertPreview();
  } else {
    updatePreview();
  }
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    const currentTheme = root.dataset.theme || "light";
    const nextTheme = mobileThemeQuery.matches
      ? currentTheme === "light" ? "dark" : "light"
      : button.dataset.theme;

    document.querySelectorAll("[data-theme]").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(`[data-theme="${nextTheme}"]`).forEach((item) => item.classList.add("is-active"));
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

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pageId = link.dataset.pageLink;
    window.history.replaceState(null, "", `#${pageId}`);
    setActivePage(pageId);
  });
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

document.querySelectorAll("[data-alert-control]").forEach((button) => {
  button.addEventListener("click", () => {
    const control = button.dataset.alertControl;
    document.querySelectorAll(`[data-alert-control="${control}"]`).forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    alertSelections[control] = button.dataset.value;
    updateAlertPreview();
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

document.querySelectorAll("[data-alert-code-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-alert-code-tab]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeAlertCodeTab = button.dataset.alertCodeTab;
    updateAlertPreview();
  });
});

Object.values(controls).forEach((control) => {
  control.addEventListener("input", updatePreview);
  control.addEventListener("change", updatePreview);
});

Object.values(alertControls).forEach((control) => {
  control.addEventListener("input", updateAlertPreview);
  control.addEventListener("change", updateAlertPreview);
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

const initialPage = window.location.hash.replace("#", "") === "feedback" ? "feedback" : "buttons";
setActivePage(initialPage);
updatePreview();
updateAlertPreview();
