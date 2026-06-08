import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { safeJsonParse } from "@/lib/utils"

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  tags: string
  coverUrl: string
  publishedAt: string
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden h-full pt-0 hover:border-primary/50 transition-colors">
        {post.coverUrl ? (
          <div className="relative h-44 bg-muted">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          <h3 className="font-semibold text-lg leading-snug">{post.title}</h3>

          {post.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags !== "[]" && (
            <div className="flex flex-wrap gap-1 mt-3">
              {safeJsonParse<string[]>(post.tags, []).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
