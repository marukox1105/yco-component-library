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
import ButtonWrapper from '@/components/common/button-wrapper';
import { disabledVariants } from '@/components/common/button-wrapper/types/buttonWrapperTypes';

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

  const toModuleScss = (value) => value
    .replace(/\.yco-button--([a-z]+)\.yco-button--([a-z]+)/g, ".$1.$2")
    .replace(/\.yco-button--([a-z]+)/g, ".$1")
    .replaceAll(".yco-button", `.${selections.type}`)
    .replaceAll(".button-icon", ".icon")
    .replaceAll(".button-label", ".label")
    .replaceAll(".is-hover", ".hover")
    .replaceAll(".is-press", ".press")
    .replace(/var\(--(background|fill|icon|stroke|text)-([\w-]+)\)/g, "color($1-$2)")
    .replace(/var\(--corner-radius-([\w-]+)\)/g, "border-radius(corner-radius-$1)")
    .replace(/var\(--font-size-heading-([0-9])\)/g, "font-size(heading$1)")
    .replace(/var\(--line-height-heading-([0-9])\)/g, "line-height(heading$1)")
    .replace(/var\(--font-size-([\w-]+)\)/g, "font-size($1)")
    .replace(/var\(--line-height-([\w-]+)\)/g, "line-height($1)");

  const moduleBaseCss = `@import "@/styles/variables.scss";

.${selections.type} {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: border-radius(corner-radius-32);
  font-weight: 600;
  letter-spacing: 0;
}

.${selections.type}::before {
  content: "";
  position: absolute;
  inset: var(--spacing-0);
  z-index: 0;
  border-radius: inherit;
  background: transparent;
  pointer-events: none;
}

.${selections.type} > * {
  position: relative;
  z-index: 1;
}`;

  const moduleVariantCss = toModuleScss(variantCss[`${selections.tone}-${selections.type}`])
    .replaceAll("var(--grey-slate-light-25)", "color(fill-weaker)");

  const moduleSizeCss = toModuleScss(sizeCss[selections.size]);

  const stateCss = selections.state === "focus"
    ? `.${selections.type}:focus-visible,
.${selections.type}.focus {
  outline: 0;
  box-shadow: 0 0 0 var(--spacing-4) color(stroke-focus);
}

.inverse.secondary.focus,
.inverse.tertiary.focus {
  box-shadow: 0 0 0 3px color(stroke-inverse-strong);
}

.inverse.primary.focus {
  box-shadow: 0 0 0 3px color(stroke-inverse-strong);
}`
    : selections.state === "disabled"
      ? `.${selections.type}:disabled,
.${selections.type}.disabled {
  cursor: not-allowed;
  transform: none;
}

.primary:disabled,
.primary.disabled {
  border-color: transparent;
  background: color(fill-disabled);
  color: color(text-inverse-strong);
}

.primary:disabled .icon,
.primary.disabled .icon {
  color: color(icon-inverse-strong);
}

.secondary:disabled,
.secondary.disabled {
  border-color: color(stroke-disabled);
  background: transparent;
  color: color(text-disabled);
}

.secondary:disabled .icon,
.secondary.disabled .icon {
  color: color(icon-disabled);
}

.tertiary:disabled,
.tertiary.disabled {
  border-color: transparent;
  background: transparent;
  color: color(text-disabled);
}

.tertiary:disabled .icon,
.tertiary.disabled .icon {
  color: color(icon-disabled);
}

.inverse.primary:disabled,
.inverse.primary.disabled {
  border-color: transparent;
  background: color(fill-inverse-disabled);
  color: color(text-strong);
}

.inverse.primary:disabled .icon,
.inverse.primary.disabled .icon {
  color: color(icon-neutral);
}

.inverse.secondary:disabled,
.inverse.secondary.disabled {
  border-color: color(stroke-inverse-disabled);
  background: transparent;
  color: color(text-inverse-disabled);
}

.inverse.secondary:disabled .icon,
.inverse.secondary.disabled .icon {
  color: color(icon-inverse-disabled);
}

.inverse.tertiary:disabled,
.inverse.tertiary.disabled {
  border-color: transparent;
  background: transparent;
  color: color(text-inverse-disabled);
}

.inverse.tertiary:disabled .icon,
.inverse.tertiary.disabled .icon {
  color: color(icon-inverse-disabled);
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
  fill: currentColor;
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
    ? `\n      <a class="toast-link" href="#">Anchor link</a>`
    : "";
  const buttons = alertControls.buttons.checked
    ? `\n      <div class="toast-actions">
        <button class="yco-button yco-button--neutral yco-button--primary yco-button--tiny" type="button">
          <span class="button-label">Label</span>
        </button>
        <button class="yco-button yco-button--neutral yco-button--secondary yco-button--tiny" type="button">
          <span class="button-label">Label</span>
        </button>
      </div>`
    : "";

  return `<div class="toast-text">
    <strong class="toast-title">Heading</strong>
    <p>Lorem ipsum dolor sit amet, consec tetur adipiscing elit dolor sit.</p>${link}${buttons}
  </div>`;
}

function alertMarkup() {
  const classes = [
    "yco-toast",
    `yco-toast--${alertSelections.tone}`,
    `yco-toast--${alertSelections.size}`,
    `yco-toast--${alertSelections.layout}`,
    alertControls.icon.checked ? "has-icon" : "",
    alertControls.dismissible.checked ? "is-dismissible" : "",
    alertControls.border.checked ? "has-border" : "",
  ].filter(Boolean).join(" ");

  const icon = `<span class="toast-icon" aria-hidden="true">
    ${alertIconMarkup()}
  </span>`;
  const dismiss = `<button class="toast-dismiss" type="button" aria-label="Dismiss toast">
    ${closeIcon}
  </button>`;

  return `<div class="${classes}" id="alertPreview" role="alert">
  <div class="toast-border" aria-hidden="true"></div>
  <div class="toast-content">
    ${icon}
    ${alertMessageMarkup()}
    ${dismiss}
  </div>
</div>`;
}

function alertReactMarkup() {
  const typeMap = {
    error: "toastTypes.ERROR",
    warning: "toastTypes.WARNING",
    success: "toastTypes.SUCCESS",
    information: "toastTypes.INFO",
    neutral: "toastTypes.INFO",
    brand: "toastTypes.INFO",
    "inverse-neutral": "toastTypes.INFO",
    "inverse-brand": "toastTypes.INFO",
  };
  const variant = alertSelections.size === "small"
    ? "toastVariantTypes.COMPACT"
    : "toastVariantTypes.DEFAULT";
  const position = alertSelections.layout === "horizontal"
    ? "toastPositionTypes.FIXED"
    : "toastPositionTypes.BOTTOM_RIGHT";
  const actions = alertControls.buttons.checked
    ? `,
    actions: [
      { label: 'Label', variant: 'filled', eventName: 'toast-primary-action' },
      { label: 'Label', variant: 'outlined', eventName: 'toast-secondary-action' },
    ]`
    : "";

  return `import { useDispatch } from 'react-redux';
import { setToast } from '@/store/actions/uiAction';
import {
  toastTypes,
  toastPositionTypes,
  toastVariantTypes,
} from '@/components/common/yce-toast/toastTypes';

const dispatch = useDispatch();

dispatch(setToast({
  isShow: true,
  title: 'Heading',
  description: 'Lorem ipsum dolor sit amet, consec tetur adipiscing elit dolor sit.',
  type: ${typeMap[alertSelections.tone]},
  position: ${position},
  variant: ${variant},
  autoClose: ${alertControls.dismissible.checked ? "true" : "false"},
  autoCloseDelay: 3000${actions},
}));`;
}

const alertBaseCss = `@import "@/styles/variables.scss";

.wrapper {
  display: flex;
  width: min(100%, 600px);
  overflow: hidden;
  border: 1px solid color(stroke-weak);
  border-left: 0;
  border-radius: border-radius(corner-radius-8);
  background: color(background-base);
  color: color(text-weak);
  position: relative;
}`;

const alertToneCss = {
  error: `.type-error {
  border-color: color(stroke-error-weak);
  background:
    linear-gradient(color(fill-error-weak), color(fill-error-weak)),
    color(background-base);

  &::before {
    background: color(stroke-error-strong);
  }

  .icon,
  .closeIcon {
    color: color(icon-error);
  }
}`,
  warning: `.type-warning {
  border-color: color(stroke-warning-weak);
  background:
    linear-gradient(color(fill-warning-weak), color(fill-warning-weak)),
    color(background-base);

  &::before {
    background: color(stroke-warning-strong);
  }

  .icon,
  .closeIcon {
    color: color(icon-warning);
  }
}`,
  success: `.type-success {
  border-color: color(stroke-success-weak);
  background:
    linear-gradient(color(fill-success-weak), color(fill-success-weak)),
    color(background-base);

  &::before {
    background: color(stroke-success-strong);
  }

  .icon,
  .closeIcon {
    color: color(icon-success);
  }
}`,
  information: `.type-info {
  border-color: color(stroke-information-weak);
  background:
    linear-gradient(color(fill-information-weak), color(fill-information-weak)),
    color(background-base);

  &::before {
    background: color(stroke-information-strong);
  }

  .icon,
  .closeIcon {
    color: color(icon-information);
  }
}`,
  neutral: `.type-neutral {
  border-color: color(stroke-weak);

  &::before {
    background: color(stroke-strong);
  }

  .icon,
  .closeIcon {
    color: color(icon-neutral);
  }
}`,
  brand: `.type-brand {
  border-color: color(stroke-brand-weak);
  background:
    linear-gradient(color(fill-brand-weak), color(fill-brand-weak)),
    color(background-base);

  &::before {
    background: color(stroke-brand-strong);
  }

  .icon,
  .closeIcon {
    color: color(icon-brand);
  }
}`,
  "inverse-neutral": `.type-inverse-neutral {
  border-color: transparent;
  background: color(background-inverse);
  color: color(text-inverse-weak);

  &::before {
    background: color(stroke-inverse-strong);
  }

  .title,
  .icon,
  .closeIcon {
    color: color(text-inverse-strong);
  }
}`,
  "inverse-brand": `.type-inverse-brand {
  border-color: transparent;
  background: color(fill-brand-strong);
  color: color(text-inverse-weak);

  &::before {
    background: color(stroke-inverse-strong);
  }

  .title,
  .icon,
  .closeIcon {
    color: color(text-inverse-strong);
  }
}`,
};

const alertLayoutCss = `.wrapper::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  border-radius: border-radius(corner-radius-8) 0 0 border-radius(corner-radius-8);
}

.container {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-start;
  width: 100%;
  padding: 24px;
}

.variant-compact .container {
  padding: 16px;
}

.flexBasic {
  flex: 0 0 24px;
  margin: 0 12px;
}

.flexCenter {
  flex: 1 1 auto;
  min-width: 0;
}

.icon {
  width: 24px;
  height: 24px;
  margin-top: 2px;
}

.closeIcon {
  width: 24px;
  height: 24px;
  margin-top: 2px;
  cursor: pointer;
}

.title {
  @include text-style(heading4, heading4);

  color: color(text-strong);
  font-weight: 600;
}

.description {
  @include text-style(small, small);

  margin-top: 4px;
  color: color(text-weak);
}

.actionsRow {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.actionBtn {
  height: 32px;
  padding: 0 16px;
  border: 1px solid color(fill-strong);
  border-radius: border-radius(corner-radius-32);
  background: transparent;
  color: color(text-strong);
  font-size: font-size(small);
  line-height: line-height(small);
  font-weight: 600;
  cursor: pointer;
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
  document.title = `YCO Toast - ${alertToneLabels[alertSelections.tone]} Toast`;
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

  if (pageId === "toast") {
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

const initialPage = window.location.hash.replace("#", "") === "toast" ? "toast" : "buttons";
setActivePage(initialPage);
updatePreview();
updateAlertPreview();
