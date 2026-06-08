"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { safeJsonParse } from "@/lib/utils"
import { createPost, updatePost, deletePost } from "@/app/admin/_actions/posts"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UploadButton } from "./upload-button"
import { TipTapEditor } from "./tip-tap-editor"

type PostRow = {
  id: number
  title: string
  slug: string
  excerpt: string
  tags: string
  status: string
  coverUrl: string
  contentR2Key: string
  seoTitle: string
  seoDesc: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

function extractPlainText(json: string): string {
  try {
    const doc = JSON.parse(json)
    const texts: string[] = []
    function walk(node: { text?: string; content?: typeof node[] }) {
      if (node.text) texts.push(node.text)
      if (node.content) node.content.forEach(walk)
    }
    walk(doc)
    return texts.join(" ")
  } catch {
    return ""
  }
}

export function PostForm({ edit }: { edit?: PostRow }) {
  const router = useRouter()
  const slugRef = useRef<HTMLInputElement>(null)
  const slugEditedRef = useRef(false)
  const statusRef = useRef(edit?.status ?? "draft")
  const seoTitleEditedRef = useRef(!!edit?.seoTitle)
  const seoDescEditedRef = useRef(!!edit?.seoDesc)
  const seoTitleRef = useRef<HTMLInputElement>(null)
  const seoDescRef = useRef<HTMLInputElement>(null)
  const [coverUrl, setCoverUrl] = useState(edit?.coverUrl ?? "")
  const [contentR2Key, setContentR2Key] = useState(edit?.contentR2Key ?? "")

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }, [])

  function handleTitleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (slugEditedRef.current) return
    const slug = generateSlug(e.target.value)
    if (slug && slugRef.current) {
      slugRef.current.value = slug
    }
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!seoTitleEditedRef.current && seoTitleRef.current) {
      seoTitleRef.current.value = e.target.value.slice(0, 70)
    }
  }

  function onContentChange(json: string) {
    setContentR2Key(json)
    if (!seoDescEditedRef.current && seoDescRef.current) {
      const text = extractPlainText(json).slice(0, 160)
      if (text) seoDescRef.current.value = text
    }
  }

  const displayTags = safeJsonParse<string[]>(edit?.tags ?? "[]", []).join(", ")

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="size-4 mr-1" />
            Back to Posts
          </Link>
        </Button>
      </div>

      <div className="rounded-none border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">
          {edit ? "Edit Post" : "New Post"}
        </h2>

        <form
          action={async (formData) => {
            const tagsRaw = (formData.get("tags") as string) ?? ""
            const tagsArray = tagsRaw
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
            formData.set("tags", JSON.stringify(tagsArray))
            formData.set("coverUrl", coverUrl)
            formData.set("contentR2Key", contentR2Key)
            formData.set("status", statusRef.current)

            const result = edit
              ? await updatePost(edit.id, formData)
              : await createPost(formData)
            if (result.error) { toast.error("Validation failed"); return }
            toast.success(edit ? "Post updated" : "Post created")
            router.push("/admin/posts")
            router.refresh()
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title *</label>
              <Input
                name="title"
                defaultValue={edit?.title}
                required
                onBlur={handleTitleBlur}
                onChange={handleTitleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Slug *</label>
              <Input
                name="slug"
                ref={slugRef}
                defaultValue={edit?.slug}
                required
                placeholder="hello-world"
                onChange={() => { slugEditedRef.current = true }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Excerpt</label>
            <Textarea name="excerpt" defaultValue={edit?.excerpt} rows={2} maxLength={500} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input name="tags" defaultValue={displayTags} placeholder="react, typescript, nextjs" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Cover Image</label>
            <UploadButton onUpload={setCoverUrl} currentUrl={coverUrl} />
            <input type="hidden" name="coverUrl" value={coverUrl} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Content</label>
            <TipTapEditor
              value={contentR2Key}
              onChange={onContentChange}
            />
            <input type="hidden" name="contentR2Key" value={contentR2Key} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">SEO Title</label>
              <Input
                name="seoTitle"
                ref={seoTitleRef}
                defaultValue={edit?.seoTitle}
                maxLength={70}
                placeholder="Auto-generated from title"
                onChange={() => { seoTitleEditedRef.current = true }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">SEO Description</label>
              <Input
                name="seoDesc"
                ref={seoDescRef}
                defaultValue={edit?.seoDesc}
                maxLength={160}
                placeholder="Auto-generated from content"
                onChange={() => { seoDescEditedRef.current = true }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="outline"
              onMouseDown={() => { statusRef.current = "draft" }}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              onMouseDown={() => { statusRef.current = "published" }}
            >
              Publish
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/posts">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function PostList({ rows }: { rows: PostRow[] }) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const router = useRouter()

  async function handleDelete() {
    if (deleteId === null) return
    await deletePost(deleteId)
    toast.success("Post deleted")
    setDeleteId(null)
    router.refresh()
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No posts yet.</p>
  }

  return (
    <>
      <div className="space-y-2">
        {rows.map((row) => (
          <Card key={row.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{row.title}</p>
                  <Badge
                    variant="secondary"
                    className={
                      row.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : ""
                    }
                  >
                    {row.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  /{row.slug}
                  {row.publishedAt &&
                    ` · Published ${new Date(row.publishedAt).toLocaleDateString()}`}
                </p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {row.excerpt || "No excerpt"}
                </p>
                {row.tags && row.tags !== "[]" && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {safeJsonParse<string[]>(row.tags, []).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon-xs" asChild>
                  <Link href={`/admin/posts/${row.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon-xs" onClick={() => setDeleteId(row.id)}>
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
