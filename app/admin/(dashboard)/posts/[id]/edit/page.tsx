import { notFound } from "next/navigation"
import { getPost } from "@/app/admin/_actions/posts"
import { PostForm } from "@/app/admin/_components/posts-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(Number(id))

  if (!post) notFound()

  return <PostForm edit={post} />
}
