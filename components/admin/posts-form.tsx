"use client"

import { useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { createPost, updatePost, deletePost } from "@/lib/actions/posts"
import { fetchPostContent } from "@/lib/actions/posts-content"
import { TipTapEditor } from "@/components/admin/tiptap-editor"
import { UploadButton } from "@/components/admin/upload-button"
import { InputField } from "@/components/admin/input-field"
import type { Post } from "@/lib/data"

interface Props {
  mode: "create" | "edit" | "delete"
  post?: Post
}

export function PostsForm({ mode, post }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    tags: post?.tags ?? "[]",
    status: post?.status ?? "draft",
    coverUrl: post?.coverUrl ?? "",
    content: "",
    seoTitle: post?.seoTitle ?? "",
    seoDesc: post?.seoDesc ?? "",
  })

  useEffect(() => {
    if (!open || mode !== "edit" || !post?.contentR2Key) return
    startTransition(() => setLoadingContent(true))
    fetchPostContent(post.contentR2Key).then((json) => {
      if (json) setForm((prev) => ({ ...prev, content: json }))
      startTransition(() => setLoadingContent(false))
    })
  }, [open, mode, post])

  if (!open) {
    return (
      <Button
        variant={mode === "delete" ? "destructive" : mode === "create" ? "default" : "outline"}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {mode === "create" && <Plus className="size-4 mr-1" />}
        {mode === "edit" && <Pencil className="size-4" />}
        {mode === "delete" && <Trash2 className="size-4" />}
        {mode === "create" && "New Post"}
      </Button>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "delete" && post) {
        await deletePost(post.id)
      } else if (mode === "edit" && post) {
        await updatePost(post.id, form)
      } else {
        await createPost(form)
      }
      setOpen(false)
      if (mode !== "delete") {
        setForm({
          title: "", slug: "", excerpt: "", tags: "[]", status: "draft",
          coverUrl: "", content: "", seoTitle: "", seoDesc: "",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = mode !== "delete"

  return (
    <>
      {mode === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Delete Post</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Delete &ldquo;{post?.title}&rdquo;?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleSubmit} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {fields && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-3xl rounded-lg border bg-background p-6 shadow-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">
              {mode === "create" ? "New Post" : "Edit Post"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <InputField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <InputField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <InputField label="Tags (JSON array)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Cover Image URL</label>
                  <UploadButton
                    label="Upload Cover"
                    onUploaded={(url) => setForm({ ...form, coverUrl: url })}
                  />
                </div>
                <input
                  type="text"
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                  placeholder="https://..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                {loadingContent ? (
                  <div className="flex h-[300px] items-center justify-center rounded-md border border-input text-sm text-muted-foreground">
                    Loading content...
                  </div>
                ) : (
                  <div className="min-h-[300px]">
                    <TipTapEditor
                      value={form.content}
                      onChange={(json) => setForm({ ...form, content: json })}
                    />
                  </div>
                )}
              </div>
              <InputField label="SEO Title" value={form.seoTitle} onChange={(v) => setForm({ ...form, seoTitle: v })} />
              <InputField label="SEO Description" value={form.seoDesc} onChange={(v) => setForm({ ...form, seoDesc: v })} />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "Saving..." : mode === "create" ? "Create" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}


