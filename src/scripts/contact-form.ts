// Inline hints on the contact form. The server checks everything again, so the form works without this.
import { checkField, type FieldName } from "../lib/enquiry.ts";

const NAMES = ["email", "message", "timeline"] as const;

document.querySelectorAll<HTMLFormElement>("form[data-enquiry]").forEach((form) => {
  const input = (n: FieldName) => form.elements.namedItem(n) as HTMLInputElement;
  const error = (n: FieldName) => form.querySelector<HTMLElement>(`[data-error-for="${n}"]`)!;

  function validate(n: FieldName) {
    const msg = checkField(n, input(n).value);
    error(n).textContent = msg ?? "";
    if (msg) input(n).setAttribute("aria-invalid", "true");
    else input(n).removeAttribute("aria-invalid");
    return !msg;
  }

  for (const n of NAMES) {
    input(n).addEventListener("blur", () => validate(n));
    // Once a field has been flagged, clear the message as soon as it is fixed.
    input(n).addEventListener("input", () => input(n).hasAttribute("aria-invalid") && validate(n));
  }

  // How the visitor found the site, noted by the layout for this tab only (see referrer.ts). Sent with the message.
  const referrer = form.elements.namedItem("referrer") as HTMLInputElement | null;
  if (referrer && !referrer.value) {
    try { referrer.value = sessionStorage.getItem("ref") ?? ""; } catch {}
  }

  const send = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  form.addEventListener("submit", (e) => {
    const bad = NAMES.filter((n) => !validate(n));
    if (bad.length) {
      e.preventDefault();
      input(bad[0]).focus();
      return;
    }
    send.textContent = "Sending…";
    form.dataset.sending = ""; // shows the tile loader
    send.setAttribute("aria-disabled", "true"); // stays focusable and blocks a second click below
    form.addEventListener("submit", (again) => again.preventDefault(), { once: true });
  });
  // Coming back with the browser's Back button restores the page as it was; undo "Sending…".
  addEventListener("pageshow", () => {
    send.textContent = send.dataset.label ?? "Send";
    send.removeAttribute("aria-disabled");
    delete form.dataset.sending;
  });
});
