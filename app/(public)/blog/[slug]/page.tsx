import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug } from "@/lib/data"
import { getFromR2 } from "@/lib/r2"
import { safeJsonParse } from "@/lib/utils"
import { TipTapContent } from "@/app/(public)/blog/_components/tip-tap-content"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { db } from "@/lib/db"
import { posts } from "@/lib/schema"
import { eq } from "drizzle-orm"
import Image from "next/image"

export const revalidate = 3600

export async function generateStaticParams() {
  const publishedPosts = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.status, "published"))

  return publishedPosts.map((post) => ({ slug: post.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: "Not Found" }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverUrl ? [{ url: post.coverUrl }] : [{ url: "/taia.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt,
      images: post.coverUrl ? [post.coverUrl] : ["/taia.jpg"],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    other: {
      "article:published_time": post.publishedAt ?? "",
      "article:modified_time": post.updatedAt ?? "",
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""
  const contentJson = post.contentR2Key
    ? (await getFromR2(post.contentR2Key)) ?? ""
    : ""

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "Taia Tiniyara",
    },
    publisher: {
      "@type": "Organization",
      name: "Taia Tiniyara",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.svg`,
      },
    },
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
    url: `${siteUrl}/blog/${post.slug}`,
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
      },
    ],
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {post.coverUrl && (
        <div className="relative h-64 sm:h-80 mb-8 bg-muted overflow-hidden">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.tags && post.tags !== "[]" && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {safeJsonParse<string[]>(post.tags, []).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      {post.publishedAt && (
        <time
          dateTime={post.publishedAt}
          className="mt-3 block text-sm text-muted-foreground"
        >
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      )}

      <div className="mt-8 font-serif text-lg leading-relaxed">
        <TipTapContent content={contentJson} />
      </div>
    </article>
  )
}
