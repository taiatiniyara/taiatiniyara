// Admin dashboard: project ordering, deletes, unused-media cleanup.
const msg = document.querySelector<HTMLElement>("#message")!;

function show(text: string, isError = false) {
  msg.textContent = text;
  msg.className = isError ? "error" : "ok";
  msg.hidden = !text;
}

async function call(url: string, method: string, body: unknown) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = (await res.json()) as Record<string, any>;
  if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
  return json;
}

const mb = (n: number) => (n / 1024 / 1024).toFixed(2);

document.addEventListener("click", async (e) => {
  const el = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
  if (!el) return;
  const { action, id, title } = el.dataset;
  try {
    if (action === "move-up" || action === "move-down") {
      await call("/api/admin/projects", "PATCH", { id: Number(id), move: action === "move-up" ? "up" : "down" });
      location.reload();
    } else if (action === "delete-project" || action === "delete-post") {
      if (!confirm(`Delete "${title}" permanently?`)) return;
      await call(`/api/admin/${action === "delete-project" ? "projects" : "posts"}`, "DELETE", { id: Number(id) });
      location.reload();
    } else if (action === "media-scan") {
      const r = await call("/api/admin/media", "POST", { dryRun: true });
      const list = document.querySelector<HTMLElement>("#media-result")!;
      list.textContent = r.files.length
        ? `${r.files.length} unused file(s), ${mb(r.bytes)} MB. Files uploaded in the last 24 hours are kept.`
        : "No unused media.";
      document.querySelector<HTMLButtonElement>("[data-action=media-delete]")!.hidden = !r.files.length;
    } else if (action === "media-delete") {
      if (!confirm("Delete all unused media permanently?")) return;
      const r = await call("/api/admin/media", "POST", { dryRun: false });
      show(`Deleted ${r.deleted} file(s).`);
      document.querySelector<HTMLElement>("#media-result")!.textContent = "";
      el.hidden = true;
    }
  } catch (err) {
    show((err as Error).message, true);
  }
});
