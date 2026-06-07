"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/products"
import { UploadButton } from "@/components/admin/upload-button"
import { InputField } from "@/components/admin/input-field"
import type { Product } from "@/lib/data"

interface Props {
  mode: "create" | "edit" | "delete"
  product?: Product
}

export function ProductsForm({ mode, product }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    techStack: product?.techStack ?? "[]",
    imageUrl: product?.imageUrl ?? "",
    link: product?.link ?? "",
    status: product?.status ?? "coming-soon",
    featured: product?.featured ?? 0,
  })

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
        {mode === "create" && "Add Product"}
      </Button>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "delete" && product) {
        await deleteProduct(product.id)
      } else if (mode === "edit" && product) {
        await updateProduct(product.id, form)
      } else {
        await createProduct(form)
      }
      setOpen(false)
      if (mode !== "delete") {
        setForm({
          name: "", description: "", techStack: "[]", imageUrl: "",
          link: "", status: "coming-soon", featured: 0,
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
            <h3 className="text-lg font-semibold mb-2">Delete Product</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Delete &ldquo;{product?.name}&rdquo;?
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
          <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">
              {mode === "create" ? "Add Product" : "Edit Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>
              <InputField label="Tech Stack (JSON)" value={form.techStack} onChange={(v) => setForm({ ...form, techStack: v })} />
              <InputField
                label="Image URL"
                value={form.imageUrl}
                onChange={(v) => setForm({ ...form, imageUrl: v })}
                action={
                  <UploadButton
                    label="Upload Logo"
                    onUploaded={(url) => setForm({ ...form, imageUrl: url })}
                  />
                }
              />
              <InputField label="Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="coming-soon">Coming Soon</option>
                  <option value="in-progress">In Progress</option>
                  <option value="launched">Launched</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-p"
                  checked={form.featured === 1}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked ? 1 : 0 })}
                  className="size-4"
                />
                <label htmlFor="featured-p" className="text-sm font-medium">Featured</label>
              </div>
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


