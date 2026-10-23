import { env } from "cloudflare:workers";
import { listPosts, listProjects, postPath } from "../lib/db.ts";

export async function GET() {
  const [projects, posts] = await Promise.all([listProjects(env.DB), listPosts(env.DB)]);
  const paths = ["/", "/about", "/contact", "/blog", "/projects", ...projects.map((p) => `/projects/${p.slug}`), ...posts.map(postPath)];
  const urls = paths.map((p) => `<url><loc>https://taiatiniyara.com${p}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
