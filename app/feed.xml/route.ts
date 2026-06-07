import { getPublishedPosts } from "@/lib/data"
import { parseTags } from "@/lib/utils"

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taiatiniyara.com"

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function toRfc822(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return new Date().toUTCString()
  return date.toUTCString()
}

export async function GET() {
  const { posts } = await getPublishedPosts(1, 50)

  const items = posts
    .map((post) => {
      const tags = parseTags(post.tags)
      const link = `${siteUrl}/blog/${post.slug}`
      const pubDate = post.publishedAt ? toRfc822(post.publishedAt) : toRfc822(post.createdAt)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <pubDate>${pubDate}</pubDate>
${tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Taia Tiniyara Blog</title>
    <link>${escapeXml(siteUrl)}/blog</link>
    <description>Engineering thoughts, tutorials, and insights from Taia Tiniyara.</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
