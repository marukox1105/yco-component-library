const root = document.documentElement;
const previewButton = document.querySelector("#previewButton");
const previewSurface = document.querySelector("#previewSurface");
const stateLabel = document.querySelector("#stateLabel");
const codeBlock = document.querySelector("#codeBlock");
const toast = document.querySelector("#toast");

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

function buttonMarkup() {
  const label = controls.label.value.trim() || "Button";
  const leading = controls.leadingIcon.checked ? '<span class="button-icon" aria-hidden="true">+</span>\n  ' : "";
  const trailing = controls.trailingIcon.checked ? '\n  <span class="button-icon" aria-hidden="true">›</span>' : "";
  const disabled = selections.state === "disabled" ? " disabled" : "";
  const extraClass = controls.fullWidth.checked ? " is-full-width" : "";

  return `<button class="yco-button yco-button--${selections.tone} yco-button--${selections.type} yco-button--${selections.size}${extraClass}" type="button"${disabled}>
  ${leading}<span class="button-label">${label}</span>${trailing}
</button>`;
}

function reactMarkup() {
  const label = controls.label.value.trim() || "Button";
  const props = [
    `type="${typeLabels[selections.type]}"`,
    `tone="${toneLabels[selections.tone]}"`,
    `state="${stateLabels[selections.state]}"`,
    `size="${selections.size}"`,
    controls.fullWidth.checked ? "fullWidth" : "",
    controls.leadingIcon.checked ? "iconLeft" : "",
    controls.trailingIcon.checked ? "iconRight" : "",
  ].filter(Boolean).join("\n  ");

  return `<Button
  ${props}
>
  ${label}
</Button>`;
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
    controls.leadingIcon.checked ? '<span class="button-icon" aria-hidden="true">+</span>' : "",
    `<span class="button-label">${label}</span>`,
    controls.trailingIcon.checked ? '<span class="button-icon" aria-hidden="true">›</span>' : "",
  ].filter(Boolean).join("");

  stateLabel.textContent = stateLabels[state];
  codeBlock.textContent = `${buttonMarkup()}\n\n/* React usage */\n${reactMarkup()}`;
  document.title = `YCO Buttons - ${toneLabels[tone]} ${typeLabels[type]}`;
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-theme]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    root.dataset.theme = button.dataset.theme;
  });
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
