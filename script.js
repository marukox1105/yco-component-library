const root = document.documentElement;
const previewButton = document.querySelector("#previewButton");
const previewSurface = document.querySelector("#previewSurface");
const stateLabel = document.querySelector("#stateLabel");
const codeBlock = document.querySelector("#codeBlock");
const toast = document.querySelector("#toast");
const sidebar = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-button");
let activeCodeTab = "html";

const controls = {
  label: document.querySelector("#label"),
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--button-border);
  border-radius: 32px;
  background: var(--button-bg);
  color: var(--button-fg);
  font-family: Roboto, system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: 0;
}`;

const toneCss = {
  brand: `.yco-button--brand {
  --button-strong: #03ade2;
  --button-strong-hover: #1498c7;
  --button-strong-press: #0d86b1;
  --button-weak-hover: #e6f8fd;
  --button-weak-press: #c7f0fa;
  --button-fg-on-strong: #ffffff;
}`,
  neutral: `.yco-button--neutral {
  --button-strong: #0f2026;
  --button-strong-hover: #243238;
  --button-strong-press: #34454d;
  --button-weak-hover: #f2f5f6;
  --button-weak-press: #e8eef0;
  --button-fg-on-strong: #ffffff;
}`,
  destructive: `.yco-button--destructive {
  --button-strong: #ee1010;
  --button-strong-hover: #f04444;
  --button-strong-press: #c90000;
  --button-weak-hover: #ffe1e1;
  --button-weak-press: #ffcaca;
  --button-fg-on-strong: #ffffff;
}`,
  inverse: `.yco-button--inverse {
  --button-strong: #ffffff;
  --button-strong-hover: #f2f5f6;
  --button-strong-press: #e8eef0;
  --button-weak-hover: rgba(255, 255, 255, 0.08);
  --button-weak-press: rgba(255, 255, 255, 0.14);
  --button-fg-on-strong: rgba(9, 22, 26, 0.95);
}`,
};

const typeCss = {
  primary: `.yco-button--primary {
  --button-bg: var(--button-strong);
  --button-bg-hover: var(--button-strong-hover);
  --button-bg-press: var(--button-strong-press);
  --button-fg: var(--button-fg-on-strong);
  --button-border: transparent;
}`,
  secondary: `.yco-button--secondary {
  --button-bg: #ffffff;
  --button-bg-hover: var(--button-weak-hover);
  --button-bg-press: var(--button-weak-press);
  --button-fg: var(--button-strong);
  --button-border: var(--button-strong);
}`,
  tertiary: `.yco-button--tertiary {
  --button-bg: transparent;
  --button-bg-hover: var(--button-weak-hover);
  --button-bg-press: var(--button-weak-press);
  --button-fg: var(--button-strong);
  --button-border: transparent;
}`,
};

const inverseTypeCss = {
  secondary: `.yco-button--inverse.yco-button--secondary {
  --button-bg: transparent;
  --button-bg-hover: rgba(255, 255, 255, 0.08);
  --button-bg-press: rgba(255, 255, 255, 0.14);
  --button-fg: #ffffff;
  --button-border: rgba(255, 255, 255, 0.6);
}`,
};

const neutralTypeCss = {
  secondary: `.yco-button--neutral.yco-button--secondary {
  --button-bg: rgba(255, 255, 255, 0.01);
  --button-fg: rgba(9, 22, 26, 0.95);
  --button-border: rgba(17, 24, 26, 0.2);
}`,
};

const brandTypeCss = {
  tertiary: `.yco-button--brand.yco-button--tertiary {
  --button-bg-hover: transparent;
  --button-bg-press: transparent;
}

.yco-button--brand.yco-button--tertiary .button-label {
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
}`,
};

const sizeCss = {
  large: `.yco-button--large {
  min-height: 56px;
  gap: 4px;
  padding: 0 24px;
  font-size: 20px;
  line-height: 28px;
}`,
  medium: `.yco-button--medium {
  min-height: 48px;
  gap: 4px;
  padding: 0 20px;
  font-size: 18px;
  line-height: 24px;
}`,
  small: `.yco-button--small {
  min-height: 40px;
  gap: 4px;
  padding: 0 16px;
  font-size: 16px;
  line-height: 22px;
}`,
  tiny: `.yco-button--tiny {
  min-height: 32px;
  gap: 4px;
  padding: 0 12px;
  font-size: 14px;
  line-height: 20px;
}`,
};

function buttonMarkup() {
  const label = controls.label.value.trim() || "Button";
  const leading = controls.leadingIcon.checked ? `${plusIcon}\n  ` : "";
  const trailing = controls.trailingIcon.checked ? `\n  ${chevronRightIcon}` : "";
  const disabled = selections.state === "disabled" ? " disabled" : "";
  const extraClass = controls.fullWidth.checked ? " is-full-width" : "";

  return `<button class="yco-button yco-button--${selections.tone} yco-button--${selections.type} yco-button--${selections.size}${extraClass}" type="button"${disabled}>
  ${leading}<span class="button-label">${label}</span>${trailing}
</button>`;
}

function reactMarkup() {
  const label = controls.label.value.trim() || "Button";
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
  ${label}
</Button>`;
}

function cssMarkup() {
  const stateCss = selections.state === "focus"
    ? `.yco-button:focus-visible,
.yco-button.is-focus {
  outline: 0;
  box-shadow: 0 0 0 4px #c7f0fa;
}

.yco-button--inverse.yco-button--secondary.is-focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6);
}

.yco-button--inverse.yco-button--primary.is-focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6);
}`
    : `.yco-button:hover,
.yco-button.is-hover {
  background: var(--button-bg-hover);
}

.yco-button:active,
.yco-button.is-press {
  background: var(--button-bg-press);
}`;

  const iconCss = `.button-icon {
  display: inline-grid;
  place-items: center;
  width: ${selections.size === "tiny" ? "16px" : "24px"};
  height: ${selections.size === "tiny" ? "16px" : "24px"};
  flex: 0 0 ${selections.size === "tiny" ? "16px" : "24px"};
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
    toneCss[selections.tone],
    typeCss[selections.type],
    selections.tone === "brand" ? brandTypeCss[selections.type] : "",
    selections.tone === "neutral" ? neutralTypeCss[selections.type] : "",
    selections.tone === "inverse" ? inverseTypeCss[selections.type] : "",
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
  const label = controls.label.value.trim() || "Button";

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
    `<span class="button-label">${label}</span>`,
    controls.trailingIcon.checked ? chevronRightIcon : "",
  ].filter(Boolean).join("");

  const code = codeMarkup();
  stateLabel.textContent = stateLabels[state];
  codeBlock.innerHTML = highlightCode(code);
  document.title = `YCO Buttons - ${toneLabels[tone]} ${typeLabels[type]}`;
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-theme]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    root.dataset.theme = button.dataset.theme;
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
