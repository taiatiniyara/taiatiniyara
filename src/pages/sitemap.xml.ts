import { env } from "cloudflare:workers";
import { listPosts, listProjects, postPath } from "../lib/db.ts";
import { SITE, isoDate } from "../lib/seo.ts";
import { xml } from "../lib/format.ts";

export async function GET() {
  const [projects, posts] = await Promise.all([listProjects(env.DB), listPosts(env.DB)]);
  const newest = (...xs: number[]) => (xs.length ? Math.max(...xs) : undefined);
  const entries: [path: string, updated?: number][] = [
    ["/", newest(...posts.map((p) => p.updated_at), ...projects.map((p) => p.updated_at))],
    ["/about"],
    ["/contact"],
    ["/blog", newest(...posts.map((p) => p.updated_at))],
    ["/projects", newest(...projects.map((p) => p.updated_at))],
    ...projects.map((p): [string, number] => [`/projects/${p.slug}`, p.updated_at]),
    ...posts.map((p): [string, number] => [postPath(p), p.updated_at]),
  ];
  const urls = entries
    .map(([path, updated]) => `<url><loc>${xml(SITE + path)}</loc>${updated ? `<lastmod>${isoDate(updated)}</lastmod>` : ""}</url>`)
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
