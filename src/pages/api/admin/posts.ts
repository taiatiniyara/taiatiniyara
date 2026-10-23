import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import { deletePost, getPost, getProject, postPath, putBody, savePost } from "../../../lib/db.ts";
import { emptyDoc } from "../../../lib/content.ts";
import { parsePost, isUniqueError } from "../../../lib/validate.ts";
import { purge } from "../../../lib/cache.ts";

const err = (error: string, status: number) => Response.json({ error }, { status });

// POST { id?: number, ...fields, body? } creates or updates. DELETE { id }.
export async function POST({ request, url }: APIContext) {
  const raw = (await request.json()) as Record<string, unknown>;
  const p = parsePost(raw);
  if (!p.ok) return err(p.error, 400);
  const id = raw.id === undefined ? null : Number(raw.id);
  if (id !== null && !(await getPost(env.DB, id))) return err("Post not found.", 404);
  if (p.value.project_id !== null && !(await getProject(env.DB, p.value.project_id))) return err("Choose a valid project.", 400);
  try {
    const saved = await savePost(env.DB, id, p.value);
    if (p.body || id === null) await putBody(env.BUCKET, "posts", saved, p.body ?? emptyDoc);
    const row = (await getPost(env.DB, saved))!;
    await purge(url.origin, [postPath(row), "/", "/blog", "/rss.xml", "/sitemap.xml", ...(row.project_slug ? [`/projects/${row.project_slug}`] : [])]);
    return Response.json({ id: saved, slug: row.slug, project_id: row.project_id, published_at: row.published_at });
  } catch (e) {
    return isUniqueError(e) ? err("Another post here already uses that slug.", 409) : err("Could not save.", 500);
  }
}

export async function DELETE({ request, url }: APIContext) {
  const { id } = (await request.json()) as { id: number };
  const row = await getPost(env.DB, Number(id));
  if (!row) return err("Post not found.", 404);
  await deletePost(env.DB, env.BUCKET, row.id);
  await purge(url.origin, [postPath(row), "/", "/blog", "/rss.xml", "/sitemap.xml", ...(row.project_slug ? [`/projects/${row.project_slug}`] : [])]);
  return Response.json({ ok: true });
}
