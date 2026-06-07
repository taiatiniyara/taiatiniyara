import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getRelatedPosts } from "@/lib/data"
import { getR2Object } from "@/lib/r2"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { getReadingTime, parseTags } from "@/lib/utils"
import { TipTapContent } from "@/components/blog/tip-tap-content"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Not Found" }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taiatiniyara.com"

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || "",
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt || "",
      type: "article",
      publishedTime: post.publishedAt || undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const tags = parseTags(post.tags)
  const relatedPosts = await getRelatedPosts(slug)

  let content: unknown = null
  if (post.contentR2Key) {
    try {
      const raw = await getR2Object(post.contentR2Key)
      if (raw) content = JSON.parse(raw)
    } catch {
      content = null
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDesc || post.excerpt || "",
    datePublished: post.publishedAt || undefined,
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
  }

  return (
    <article className="py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="size-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        <header>
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            )}
            {!!content && (
              <div className="flex items-center gap-1">
                <BookOpen className="size-3" />
                {getReadingTime(content)}
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {post.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground border-l-2 border-primary/30 pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.coverUrl && (
          <img
            src={post.coverUrl}
            alt={post.title}
            className="mt-8 w-full aspect-video rounded-lg object-cover bg-muted"
          />
        )}

        <div className="prose-custom mt-12">
          {content ? (
            <TipTapContent content={content} />
          ) : (
            <p className="text-muted-foreground italic">Content coming soon.</p>
          )}
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="mt-16 border-t pt-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold tracking-tight text-center">Related Posts</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:border-primary/20"
                >
                  {rp.coverUrl && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={rp.coverUrl}
                        alt={rp.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    {rp.excerpt && (
                      <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2">
                        {rp.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3" />
                        {getReadingTime(rp.excerpt || "")}
                      </span>
                      {rp.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(rp.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
