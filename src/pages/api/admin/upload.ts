import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import { MAX_BYTES, sha256Hex, sniff } from "../../../lib/media.ts";
import { recordMedia } from "../../../lib/db.ts";

export async function POST({ request }: APIContext) {
  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose an image file." }, { status: 400 });

  const buf = await file.arrayBuffer();
  const kind = sniff(new Uint8Array(buf, 0, Math.min(16, buf.byteLength)));
  if (!kind) return Response.json({ error: "Only WebP or GIF images can be uploaded." }, { status: 415 });
  if (buf.byteLength > MAX_BYTES[kind]) return Response.json({ error: "That image is too large." }, { status: 413 });

  const key = `media/${await sha256Hex(buf)}.${kind}`;
  await env.BUCKET.put(key, buf, { httpMetadata: { contentType: `image/${kind}` } });
  await recordMedia(env.DB, key, buf.byteLength);
  return Response.json({ src: `/${key}` });
}
