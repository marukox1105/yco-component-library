const root = document.documentElement;
const previewButton = document.querySelector("#previewButton");
const stateLabel = document.querySelector("#stateLabel");
const codeBlock = document.querySelector("#codeBlock");
const toast = document.querySelector("#toast");

const controls = {
  variant: document.querySelector("#variant"),
  state: document.querySelector("#state"),
  label: document.querySelector("#label"),
  leadingIcon: document.querySelector("#leadingIcon"),
  trailingIcon: document.querySelector("#trailingIcon"),
  fullWidth: document.querySelector("#fullWidth"),
};

let currentSize = "medium";

const variantLabels = {
  primary: "Primary",
  secondary: "Secondary",
  ghost: "Ghost",
  danger: "Danger",
  warning: "Warning",
  success: "Success",
  inverse: "Inverse",
};

const stateLabels = {
  default: "Default",
  hover: "Hover",
  pressed: "Pressed",
  focused: "Focused",
  disabled: "Disabled",
  loading: "Loading",
};

function buttonMarkup() {
  const label = controls.label.value.trim() || "Button";
  const leading = controls.leadingIcon.checked ? '<span class="button-icon" aria-hidden="true">+</span>\n  ' : "";
  const trailing = controls.trailingIcon.checked ? '\n  <span class="button-icon" aria-hidden="true">›</span>' : "";
  const loading = controls.state.value === "loading" ? '<span class="spinner" aria-hidden="true"></span>\n  ' : "";
  const disabled = controls.state.value === "disabled" ? " disabled" : "";
  const busy = controls.state.value === "loading" ? ' aria-busy="true"' : "";
  const extraClass = controls.fullWidth.checked ? " is-full-width" : "";

  return `<button class="yco-button yco-button--${controls.variant.value} yco-button--${currentSize}${extraClass}" type="button"${disabled}${busy}>
  ${loading}${leading}<span class="button-label">${label}</span>${trailing}
</button>`;
}

function reactMarkup() {
  const label = controls.label.value.trim() || "Button";
  const props = [
    `variant="${controls.variant.value}"`,
    `size="${currentSize}"`,
    controls.fullWidth.checked ? "fullWidth" : "",
    controls.leadingIcon.checked ? "leadingIcon={<PlusIcon />}" : "",
    controls.trailingIcon.checked ? "trailingIcon={<ChevronRightIcon />}" : "",
    controls.state.value === "loading" ? "loading" : "",
    controls.state.value === "disabled" ? "disabled" : "",
  ].filter(Boolean).join("\n  ");

  return `<Button
  ${props}
>
  ${label}
  </Button>`;
}

function updatePreview() {
  const variant = controls.variant.value;
  const state = controls.state.value;
  const label = controls.label.value.trim() || "Button";

  previewButton.className = [
    "yco-button",
    `yco-button--${variant}`,
    `yco-button--${currentSize}`,
    controls.fullWidth.checked ? "is-full-width" : "",
    state !== "default" ? `is-${state}` : "",
  ].filter(Boolean).join(" ");

  previewButton.disabled = state === "disabled";
  if (state === "loading") {
    previewButton.setAttribute("aria-busy", "true");
  } else {
    previewButton.removeAttribute("aria-busy");
  }
  previewButton.innerHTML = [
    state === "loading" ? '<span class="spinner" aria-hidden="true"></span>' : "",
    controls.leadingIcon.checked ? '<span class="button-icon" aria-hidden="true">+</span>' : "",
    `<span class="button-label">${label}</span>`,
    controls.trailingIcon.checked ? '<span class="button-icon" aria-hidden="true">›</span>' : "",
  ].filter(Boolean).join("");

  stateLabel.textContent = stateLabels[state];
  codeBlock.textContent = `${buttonMarkup()}\n\n/* React usage */\n${reactMarkup()}`;
  document.title = `YCO Buttons - ${variantLabels[variant]}`;
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-theme]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    root.dataset.theme = button.dataset.theme;
  });
});

document.querySelectorAll("[data-size]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-size]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    currentSize = button.dataset.size;
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
