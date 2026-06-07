import type { Metadata } from "next"
import Link from "next/link"
import { getPublishedPosts } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Clock, FileText } from "lucide-react"
import { parseTags } from "@/lib/utils"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taiatiniyara.com"

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering thoughts, tutorials, and insights from Taia Tiniyara.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog — Taia Tiniyara",
    description: "Engineering thoughts, tutorials, and insights from Taia Tiniyara.",
    type: "website",
  },
}

export default async function BlogPage(props: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await props.searchParams
  const pageNum = Math.max(1, parseInt(params.page || "1") || 1)
  const { posts, page, totalPages } = await getPublishedPosts(pageNum)

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Engineering thoughts, tutorials, and insights.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <FileText className="size-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const tags = parseTags(post.tags)
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:border-primary/20"
                >
                  {post.coverUrl && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={post.coverUrl}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div />
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
            {page > 1 && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${page - 1}`}>Previous</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" asChild>
                <Link href={`/blog?page=${page + 1}`}>Next</Link>
              </Button>
            )}
          </nav>
        )}
      </div>
    </section>
  )
}
