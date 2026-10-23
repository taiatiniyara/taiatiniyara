// The content schema, shared by the admin editor and the public renderer.
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import type { JSONContent } from "@tiptap/core";
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import { IMAGE_WIDTHS, MEDIA_PATH, safeUrl } from "./url.ts";

const SiteLink = Link.extend({
  renderHTML({ HTMLAttributes }) {
    const href = HTMLAttributes.href as string | undefined;
    if (!safeUrl(href)) return ["span", {}, 0];
    const external = /^(https?:)?\/\//.test(href!);
    return ["a", { href, ...(external && { target: "_blank", rel: "noopener" }) }, 0];
  },
}).configure({ openOnClick: false, isAllowedUri: (url) => safeUrl(url) });

const ArticleImage = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
      width: { default: null },
      height: { default: null },
    };
  },
  renderHTML({ HTMLAttributes: a }) {
    if (!MEDIA_PATH.test(a.src ?? "")) return ["span", {}, 0];
    const img = ["img", {
      src: `${a.src}?w=1200`,
      srcset: IMAGE_WIDTHS.map((w) => `${a.src}?w=${w} ${w}w`).join(", "),
      sizes: "(min-width: 64rem) 60ch, 100vw",
      alt: a.alt ?? "",
      loading: "lazy",
      decoding: "async",
      ...(a.width && a.height && { width: a.width, height: a.height }),
    }] as const;
    return a.caption ? ["figure", {}, img, ["figcaption", {}, a.caption]] : ["figure", {}, img];
  },
});

export const extensions = [
  StarterKit.configure({ heading: { levels: [2, 3, 4] }, underline: false, link: false }),
  SiteLink,
  ArticleImage,
];

export const emptyDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function renderBody(doc: JSONContent): string {
  return renderToHTMLString({ content: doc, extensions });
}

/** First image in a doc, for og:image. */
export function firstImage(doc: JSONContent): string | undefined {
  if (doc.type === "image" && MEDIA_PATH.test(doc.attrs?.src ?? "")) return doc.attrs!.src;
  for (const c of doc.content ?? []) {
    const found = firstImage(c);
    if (found) return found;
  }
}

/** Every /media/ key referenced by a doc (for the unused-media scan). */
export function mediaKeys(doc: JSONContent, out = new Set<string>()): Set<string> {
  const src = doc.type === "image" ? (doc.attrs?.src as string | undefined) : undefined;
  if (src && MEDIA_PATH.test(src)) out.add(src.slice(1)); // "media/<hash>.<ext>"
  doc.content?.forEach((c) => mediaKeys(c, out));
  return out;
}
