import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import { IMAGE_WIDTHS } from "../../lib/url.ts";

const KEY = /^[a-f0-9]{64}\.(webp|gif)$/;
const HEADERS = { "Cache-Control": "public, max-age=31536000, immutable", "Vary": "Accept" };

export async function GET({ params, request, url, locals }: APIContext) {
  const name = params.key ?? "";
  if (!KEY.test(name)) return new Response("Not found", { status: 404 });

  const obj = await env.BUCKET.get(`media/${name}`);
  if (!obj) return new Response("Not found", { status: 404 });

  const w = Number(url.searchParams.get("w"));
  const original = () => new Response(obj.body, { headers: { ...HEADERS, "Content-Type": obj.httpMetadata?.contentType ?? "image/webp" } });
  if (!IMAGE_WIDTHS.includes(w) || name.endsWith(".gif")) return original(); // GIFs stay animated

  const format = request.headers.get("Accept")?.includes("image/avif") ? "image/avif" : "image/webp";
  const cacheKey = new Request(`${url.origin}${url.pathname}?w=${w}&f=${format}`);
  const hit = await caches.default.match(cacheKey);
  if (hit) return hit;

  try {
    const out = await env.IMAGES.input(obj.body).transform({ width: w, fit: "scale-down" }).output({ format, quality: 80 });
    const res = out.response({ headers: HEADERS });
    locals.cfContext.waitUntil(caches.default.put(cacheKey, res.clone()));
    return res;
  } catch {
    // Images binding unavailable (e.g. local dev) or failed: the stored 2000 px WebP is still a valid answer.
    const fresh = await env.BUCKET.get(`media/${name}`);
    return new Response(fresh!.body, { headers: { ...HEADERS, "Content-Type": "image/webp" } });
  }
}
