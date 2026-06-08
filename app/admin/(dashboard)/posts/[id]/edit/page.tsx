import { notFound } from "next/navigation"
import { getPost } from "@/app/admin/_actions/posts"
import { getFromR2 } from "@/lib/r2"
import { PostForm } from "@/app/admin/_components/posts-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(Number(id))

  if (!post) notFound()

  const contentJson = post.contentR2Key
    ? (await getFromR2(post.contentR2Key)) ?? ""
    : ""

  return <PostForm edit={{ ...post, contentR2Key: contentJson }} />
}
