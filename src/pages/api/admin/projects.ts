import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import { deleteProject, getProject, moveProject, putBody, saveProject } from "../../../lib/db.ts";
import { emptyDoc } from "../../../lib/content.ts";
import { parseProject, isUniqueError } from "../../../lib/validate.ts";
import { purge } from "../../../lib/cache.ts";

const err = (error: string, status: number) => Response.json({ error }, { status });

// POST { id?: number, ...fields, body? } creates or updates. DELETE { id }. PATCH { id, move: "up" | "down" }.
export async function POST({ request, url }: APIContext) {
  const raw = (await request.json()) as Record<string, unknown>;
  const p = parseProject(raw);
  if (!p.ok) return err(p.error, 400);
  const id = raw.id === undefined ? null : Number(raw.id);
  if (id !== null && !(await getProject(env.DB, id))) return err("Project not found.", 404);
  try {
    const saved = await saveProject(env.DB, id, p.value);
    if (p.body || id === null) await putBody(env.BUCKET, "projects", saved, p.body ?? emptyDoc);
    const row = (await getProject(env.DB, saved))!;
    await purge(url.origin, ["/", "/projects", `/projects/${row.slug}`, "/sitemap.xml"]);
    return Response.json({ id: saved, slug: row.slug, published_at: row.published_at });
  } catch (e) {
    return isUniqueError(e) ? err("Another project already uses that slug.", 409) : err("Could not save.", 500);
  }
}

export async function DELETE({ request, url }: APIContext) {
  const { id } = (await request.json()) as { id: number };
  const row = await getProject(env.DB, Number(id));
  if (!row) return err("Project not found.", 404);
  if (!(await deleteProject(env.DB, env.BUCKET, row.id))) return err("Delete or move this project's posts first.", 409);
  await purge(url.origin, ["/", "/projects", `/projects/${row.slug}`, "/sitemap.xml"]);
  return Response.json({ ok: true });
}

export async function PATCH({ request, url }: APIContext) {
  const { id, move } = (await request.json()) as { id: number; move: "up" | "down" };
  if (move !== "up" && move !== "down") return err("Bad request.", 400);
  await moveProject(env.DB, Number(id), move);
  await purge(url.origin, ["/", "/projects"]);
  return Response.json({ ok: true });
}
