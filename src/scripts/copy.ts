// "Copy" buttons: the email address on the site, and every code block in an article.
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
  const status = btn.closest(".direct")?.nextElementSibling as HTMLElement | null; // the role="status" line under it
  btn.addEventListener("click", async () => {
    const ok = await copy(btn.dataset.copy!);
    if (status) status.textContent = ok ? `Copied ${btn.dataset.copy}.` : "Could not copy. Select the address and copy it.";
    setTimeout(() => status && (status.textContent = ""), 4000);
  });
});

document.querySelectorAll<HTMLPreElement>(".prose pre").forEach((pre) => {
  const wrap = document.createElement("div");
  wrap.className = "codewrap";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy";
  btn.textContent = "Copy code";
  btn.setAttribute("aria-live", "polite");
  btn.addEventListener("click", async () => {
    btn.textContent = (await copy(pre.textContent ?? "")) ? "Copied" : "Could not copy";
    setTimeout(() => (btn.textContent = "Copy code"), 2000);
  });
  pre.replaceWith(wrap);
  wrap.appendChild(btn); // append() is typed for HTMLRewriter by the Workers types
  wrap.appendChild(pre);
});
