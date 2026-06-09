import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getPublishedPosts } from "@/lib/data"
import { PostCard } from "@/app/(public)/blog/_components/post-card"
import { Pagination } from "@/app/(public)/blog/_components/pagination"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

type Props = {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)

  const pageTitle = page > 1 ? `Blog — Page ${page}` : "Blog"
  const pageDesc =
    page > 1
      ? `Page ${page} of articles and insights on software engineering from Taia Tiniyara.`
      : "Articles and insights on software engineering from Taia Tiniyara."

    return {
      title: pageTitle,
      description: pageDesc,
      openGraph: {
        title: `${pageTitle} | Taia Tiniyara`,
        description: pageDesc,
        type: "website",
        images: [{ url: "/taia.jpg", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | Taia Tiniyara`,
        description: pageDesc,
        images: ["/taia.jpg"],
      },
      alternates: {
        canonical: page > 1 ? `${siteUrl}/blog?page=${page}` : `${siteUrl}/blog`,
      },
    }
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const { posts, totalPages } = await getPublishedPosts(page, 9)

  if (totalPages > 0 && page > totalPages) {
    redirect(`/blog?page=${totalPages}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Articles and insights on software engineering.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          No posts published yet. Check back soon.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/blog"
          />
        </>
      )}
    </div>
  )
}
