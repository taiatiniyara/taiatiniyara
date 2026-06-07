import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/data"
import { getR2Object } from "@/lib/r2"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock } from "lucide-react"
import { parseTags } from "@/lib/utils"
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
      images: post.coverUrl ? [{ url: post.coverUrl, width: 1200, height: 630, alt: post.title }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const tags = parseTags(post.tags)

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
    </article>
  )
}
