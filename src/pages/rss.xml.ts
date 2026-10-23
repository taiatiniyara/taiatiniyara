import { env } from "cloudflare:workers";
import { listPosts, postPath } from "../lib/db.ts";
import { xml } from "../lib/format.ts";
import { SITE, SITE_NAME } from "../lib/seo.ts";

export async function GET() {
  const posts = await listPosts(env.DB, { limit: 50 });
  const items = posts
    .map((p) => {
      const link = `${SITE}${postPath(p)}`;
      const date = new Date((p.published_at ?? p.created_at) * 1000).toUTCString();
      const category = p.project_title ? `<category>${xml(p.project_title)}</category>` : "";
      return `<item><title>${xml(p.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${date}</pubDate>${category}<description>${xml(p.summary)}</description></item>`;
    })
    .join("");
  const built = posts.length ? new Date(Math.max(...posts.map((p) => p.updated_at)) * 1000).toUTCString() : new Date().toUTCString();
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE_NAME}</title><link>${SITE}</link><atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/><description>Posts and project notes.</description><language>en</language><lastBuildDate>${built}</lastBuildDate>${items}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
