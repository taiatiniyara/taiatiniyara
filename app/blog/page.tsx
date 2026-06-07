import type { Metadata } from "next"
import Link from "next/link"
import { getPublishedPosts, getAllPublishedTags } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Clock, FileText, BookOpen, X, Search } from "lucide-react"
import { getReadingTime, parseTags } from "@/lib/utils"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taiatiniyara.com"

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering thoughts, tutorials, and insights from Taia Tiniyara.",
  alternates: {
    canonical: `${siteUrl}/blog`,
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
  openGraph: {
    title: "Blog — Taia Tiniyara",
    description: "Engineering thoughts, tutorials, and insights from Taia Tiniyara.",
    type: "website",
  },
}

function buildHref(page: number, tag?: string, search?: string): string {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (tag) params.set("tag", tag)
  if (search) params.set("search", search)
  const qs = params.toString()
  return qs ? `/blog?${qs}` : "/blog"
}

export default async function BlogPage(props: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>
}) {
  const params = await props.searchParams
  const pageNum = Math.max(1, parseInt(params.page || "1") || 1)
  const activeTag = params.tag
  const activeSearch = params.search
  const [{ posts, page, totalPages }, allTags] = await Promise.all([
    getPublishedPosts(pageNum, 9, activeTag, activeSearch),
    getAllPublishedTags(),
  ])

  const hasFilter = !!activeTag || !!activeSearch

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Engineering thoughts, tutorials, and insights.
          </p>
        </div>

        <form
          action="/blog"
          method="get"
          className="mt-8 mx-auto max-w-md"
        >
          {activeTag && <input type="hidden" name="tag" value={activeTag} />}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              name="search"
              defaultValue={activeSearch}
              placeholder="Search posts..."
              className="w-full rounded-lg border bg-background py-2 pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {activeSearch && (
              <Link
                href={buildHref(1, activeTag)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </Link>
            )}
          </div>
        </form>

        {allTags.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/blog"
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                !activeTag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </Link>
            {allTags.map((tag) => {
              const isActive = activeTag === tag
              return (
                <Link
                  key={tag}
                  href={isActive ? "/blog" : buildHref(1, tag, activeSearch)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tag}
                  {isActive && <X className="ml-1 size-3" />}
                </Link>
              )
            })}
          </div>
        )}

        {hasFilter && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {posts.length === 0
              ? "No posts found"
              : `Showing ${posts.length} post${posts.length !== 1 ? "s" : ""}`}
            {activeSearch && (
              <>
                {" for "}
                <span className="font-medium text-foreground">&quot;{activeSearch}&quot;</span>
              </>
            )}
            {activeTag && (
              <>
                {" tagged "}
                <span className="font-medium text-foreground">&quot;{activeTag}&quot;</span>
              </>
            )}
            {" · "}
            <Link href="/blog" className="text-primary hover:underline">
              Clear all
            </Link>
          </p>
        )}

        {posts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <FileText className="size-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              {hasFilter
                ? "No posts match your search. Try a different query."
                : "No posts yet. Check back soon."}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          {getReadingTime(post.excerpt || "")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </span>
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
                <Link href={buildHref(page - 1, activeTag, activeSearch)}>Previous</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" asChild>
                <Link href={buildHref(page + 1, activeTag, activeSearch)}>Next</Link>
              </Button>
            )}
          </nav>
        )}
      </div>
    </section>
  )
}
