import type { APIContext } from "astro";
import type { JSONContent } from "@tiptap/core";
import { env } from "cloudflare:workers";
import { mediaKeys } from "../../../lib/content.ts";
import { listMedia } from "../../../lib/db.ts";

const MIN_AGE = 24 * 60 * 60; // seconds; protects images in a draft that hasn't been saved yet

/** Media older than 24 h that no saved post body or project cover references. */
async function unused() {
  const used = new Set<string>();
  const { results } = await env.DB.prepare("SELECT cover_key FROM projects WHERE cover_key IS NOT NULL").all<{ cover_key: string }>();
  results.forEach((r) => used.add(r.cover_key));
  for (const prefix of ["posts/", "projects/"]) {
    let cursor: string | undefined;
    do {
      const page = await env.BUCKET.list({ prefix, cursor });
      for (const o of page.objects) {
        const body = await env.BUCKET.get(o.key);
        if (body) mediaKeys((await body.json()) as JSONContent, used);
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
  }
  const cutoff = Math.floor(Date.now() / 1000) - MIN_AGE;
  return (await listMedia(env.DB)).filter((m) => m.created_at < cutoff && !used.has(m.key));
}

// POST { dryRun: true } lists what would go; POST { dryRun: false } deletes it.
export async function POST({ request }: APIContext) {
  const { dryRun } = (await request.json()) as { dryRun?: boolean };
  const stale = await unused();
  if (dryRun !== false) return Response.json({ files: stale, bytes: stale.reduce((n, m) => n + m.size, 0) });
  for (let i = 0; i < stale.length; i += 100) {
    const batch = stale.slice(i, i + 100);
    await env.BUCKET.delete(batch.map((m) => m.key));
    await env.DB.batch(batch.map((m) => env.DB.prepare("DELETE FROM media WHERE key = ?1").bind(m.key)));
  }
  return Response.json({ deleted: stale.length });
}
