import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getPosts } from "@/app/admin/_actions/posts"
import { PostList } from "@/app/admin/_components/posts-form"

export default async function PostsPage() {
  const rows = await getPosts()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="size-4 mr-1.5" />
            New Post
          </Link>
        </Button>
      </div>
      <PostList rows={rows} />
    </div>
  )
}
