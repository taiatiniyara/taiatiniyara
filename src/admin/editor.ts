// Admin editor page: TipTap editor, image upload, save, localStorage safety net.
import { Editor, type JSONContent } from "@tiptap/core";
import { extensions } from "../lib/content.ts";
import { safeUrl } from "../lib/url.ts";

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const form = $<HTMLFormElement>("#entity-form");
const { kind, id, updated } = form.dataset as { kind: "post" | "project"; id?: string; updated?: string };
const initial = JSON.parse($("#initial-body").textContent!) as JSONContent;
const backupKey = `draft:${kind}:${id || "new"}`;
const msg = $("#message");

function show(text: string, isError = false) {
  msg.textContent = text;
  msg.className = isError ? "error" : "ok";
  msg.hidden = !text;
}

// ---- image shrink + upload ----

async function shrink(file: File): Promise<{ file: File; width: number; height: number }> {
  const bmp = await createImageBitmap(file);
  if (file.type === "image/gif") return { file, width: bmp.width, height: bmp.height }; // keep animation
  const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
  const width = Math.round(bmp.width * scale);
  const height = Math.round(bmp.height * scale);
  const canvas = new OffscreenCanvas(width, height);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, width, height);
  const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
  if (blob.type !== "image/webp") throw new Error("This browser can't convert that image to WebP.");
  return { file: new File([blob], "image.webp", { type: "image/webp" }), width, height };
}

async function upload(file: File) {
  const s = await shrink(file);
  const body = new FormData();
  body.set("file", s.file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = (await res.json()) as { src?: string; error?: string };
  if (!res.ok || !json.src) throw new Error(json.error ?? "Upload failed.");
  return { src: json.src, width: s.width, height: s.height };
}

async function insertImages(files: File[]) {
  for (const f of files) {
    try {
      show(`Uploading ${f.name}…`);
      const { src, width, height } = await upload(f);
      editor.chain().focus().insertContent({ type: "image", attrs: { src, alt: "", caption: "", width, height } }).run();
      show("");
    } catch (e) {
      show((e as Error).message, true);
    }
  }
}

// ---- editor ----

const imageFiles = (list?: FileList | null) => [...(list ?? [])].filter((f) => f.type.startsWith("image/"));

let dirty = false;
let ready = false; // the editor fires transactions while it is still being constructed

const editor = new Editor({
  element: $("#editor"),
  extensions,
  content: initial,
  editorProps: {
    attributes: { role: "textbox", "aria-multiline": "true", "aria-label": "Body" },
    handlePaste: (_v, e) => {
      const files = imageFiles(e.clipboardData?.files);
      if (!files.length) return false;
      void insertImages(files);
      return true;
    },
    handleDrop: (_v, e) => {
      const files = imageFiles(e.dataTransfer?.files);
      if (!files.length) return false;
      e.preventDefault();
      void insertImages(files);
      return true;
    },
  },
  onUpdate: () => (dirty = true),
  onTransaction: () => syncToolbar(),
});

const commands: Record<string, { run: () => void; active?: () => boolean }> = {
  bold: { run: () => editor.chain().focus().toggleBold().run(), active: () => editor.isActive("bold") },
  italic: { run: () => editor.chain().focus().toggleItalic().run(), active: () => editor.isActive("italic") },
  strike: { run: () => editor.chain().focus().toggleStrike().run(), active: () => editor.isActive("strike") },
  code: { run: () => editor.chain().focus().toggleCode().run(), active: () => editor.isActive("code") },
  h2: { run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: () => editor.isActive("heading", { level: 2 }) },
  h3: { run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: () => editor.isActive("heading", { level: 3 }) },
  h4: { run: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), active: () => editor.isActive("heading", { level: 4 }) },
  bullets: { run: () => editor.chain().focus().toggleBulletList().run(), active: () => editor.isActive("bulletList") },
  numbers: { run: () => editor.chain().focus().toggleOrderedList().run(), active: () => editor.isActive("orderedList") },
  quote: { run: () => editor.chain().focus().toggleBlockquote().run(), active: () => editor.isActive("blockquote") },
  codeblock: { run: () => editor.chain().focus().toggleCodeBlock().run(), active: () => editor.isActive("codeBlock") },
  rule: { run: () => editor.chain().focus().setHorizontalRule().run() },
  link: { run: () => openPanel("link"), active: () => editor.isActive("link") },
  image: { run: () => $<HTMLInputElement>("#image-input").click() },
  undo: { run: () => editor.chain().focus().undo().run() },
  redo: { run: () => editor.chain().focus().redo().run() },
};

document.querySelectorAll<HTMLButtonElement>("[data-cmd]").forEach((b) =>
  b.addEventListener("click", () => commands[b.dataset.cmd!]?.run()),
);

ready = true;

function syncToolbar() {
  if (!ready) return;
  document.querySelectorAll<HTMLButtonElement>("[data-cmd]").forEach((b) => {
    const active = commands[b.dataset.cmd!]?.active;
    if (active) b.setAttribute("aria-pressed", String(active()));
  });
  // The image panel follows the selected image node.
  const sel = editor.isActive("image");
  $("#panel-image").hidden = !sel;
  if (sel) {
    const a = editor.getAttributes("image");
    const alt = $<HTMLInputElement>("#image-alt");
    const cap = $<HTMLInputElement>("#image-caption");
    if (document.activeElement !== alt) alt.value = a.alt ?? "";
    if (document.activeElement !== cap) cap.value = a.caption ?? "";
  }
}

$<HTMLInputElement>("#image-input").addEventListener("change", (e) => {
  const input = e.currentTarget as HTMLInputElement;
  void insertImages(imageFiles(input.files));
  input.value = "";
});

const setImageAttr = (name: "alt" | "caption") => (e: Event) => {
  editor.chain().updateAttributes("image", { [name]: (e.currentTarget as HTMLInputElement).value }).run();
  dirty = true;
};
$("#image-alt").addEventListener("input", setImageAttr("alt"));
$("#image-caption").addEventListener("input", setImageAttr("caption"));

// ---- link panel ----

function openPanel(_name: "link") {
  const panel = $("#panel-link");
  panel.hidden = false;
  const input = $<HTMLInputElement>("#link-url");
  input.value = editor.getAttributes("link").href ?? "";
  input.focus();
}
$("#link-apply").addEventListener("click", () => {
  const url = $<HTMLInputElement>("#link-url").value.trim();
  if (!safeUrl(url)) return show("Enter a link like https://example.com, mailto:name@site.com or /blog.", true);
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  $("#panel-link").hidden = true;
  show("");
});
$("#link-remove").addEventListener("click", () => {
  editor.chain().focus().extendMarkRange("link").unsetLink().run();
  $("#panel-link").hidden = true;
});

// ---- cover image (projects) ----

const cover = document.querySelector<HTMLInputElement>("#cover-input");
cover?.addEventListener("change", async () => {
  const f = cover.files?.[0];
  if (!f) return;
  try {
    show("Uploading cover…");
    const { src } = await upload(f);
    $<HTMLInputElement>("[name=cover_key]").value = src.slice(1);
    $("#cover-current").textContent = src.slice(1);
    dirty = true;
    show("");
  } catch (e) {
    show((e as Error).message, true);
  }
});

// ---- localStorage safety net ----

const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;

function snapshot() {
  const fields: Record<string, string> = {};
  for (const el of form.elements) {
    const n = (el as HTMLInputElement).name;
    if (n) fields[n] = (el as HTMLInputElement).value;
  }
  return { base: updated, fields, body: editor.getJSON() };
}

setInterval(() => {
  if (!dirty) return;
  try {
    localStorage.setItem(backupKey, JSON.stringify(snapshot()));
  } catch {}
}, 3000);
form.addEventListener("input", () => (dirty = true));

try {
  const saved = JSON.parse(localStorage.getItem(backupKey) ?? "null");
  if (saved && saved.base === updated) {
    $("#restore").hidden = false;
    $("#restore-yes").addEventListener("click", () => {
      for (const [n, v] of Object.entries<string>(saved.fields)) {
        const el = field(n);
        if (el && !el.disabled && !(el as HTMLInputElement).readOnly) el.value = v;
      }
      editor.commands.setContent(saved.body);
      $("#restore").hidden = true;
      dirty = true;
    });
    $("#restore-no").addEventListener("click", () => {
      localStorage.removeItem(backupKey);
      $("#restore").hidden = true;
    });
  }
} catch {}

// ---- save / delete ----

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data: Record<string, unknown> = {};
  for (const el of form.elements) {
    const n = (el as HTMLInputElement).name;
    if (n) data[n] = (el as HTMLInputElement).value;
  }
  if (id) data.id = Number(id);
  data.body = editor.getJSON();
  const submit = $<HTMLButtonElement>("#save");
  submit.disabled = true;
  try {
    const res = await fetch(`/api/admin/${kind}s`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = (await res.json()) as { id?: number; error?: string; published_at?: number | null; slug?: string };
    if (!res.ok) return show(json.error ?? "Could not save.", true);
    localStorage.removeItem(backupKey);
    dirty = false;
    if (!id) return location.replace(`/admin/${kind}s/${json.id}`);
    if (json.published_at && field("slug")) {
      field("slug")!.value = json.slug!;
      (field("slug") as HTMLInputElement).readOnly = true;
    }
    show("Saved.");
  } catch {
    show("Could not reach the server. Your text is backed up in this browser.", true);
  } finally {
    submit.disabled = false;
  }
});

document.querySelector<HTMLButtonElement>("#delete")?.addEventListener("click", async () => {
  if (!confirm("Delete this permanently?")) return;
  const res = await fetch(`/api/admin/${kind}s`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: Number(id) }) });
  if (res.ok) {
    localStorage.removeItem(backupKey);
    location.assign("/admin");
  } else show(((await res.json()) as { error?: string }).error ?? "Could not delete.", true);
});

addEventListener("beforeunload", (e) => {
  if (dirty) e.preventDefault();
});
syncToolbar();
