import { env } from "cloudflare:workers";
import { listPosts, postPath } from "../lib/db.ts";
import { xml } from "../lib/format.ts";

export async function GET() {
  const posts = await listPosts(env.DB, { limit: 50 });
  const items = posts
    .map((p) => {
      const link = `https://taiatiniyara.com${postPath(p)}`;
      const date = new Date((p.published_at ?? p.created_at) * 1000).toUTCString();
      const category = p.project_title ? `<category>${xml(p.project_title)}</category>` : "";
      return `<item><title>${xml(p.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${date}</pubDate>${category}<description>${xml(p.summary)}</description></item>`;
    })
    .join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Taia Tiniyara</title><link>https://taiatiniyara.com</link><description>Posts and project notes.</description>${items}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
