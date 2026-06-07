"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { createService, updateService, deleteService } from "@/lib/actions/services"
import type { Service } from "@/lib/data"

interface ServiceFormProps {
  mode: "create" | "edit" | "delete"
  service?: Service
}

export function ServicesForm({ mode, service }: ServiceFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: service?.title ?? "",
    description: service?.description ?? "",
    icon: service?.icon ?? "Code",
    sortOrder: service?.sortOrder ?? 0,
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
        {mode === "create" && "Add Service"}
      </Button>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "delete" && service) {
        await deleteService(service.id)
      } else if (mode === "edit" && service) {
        await updateService(service.id, form)
      } else {
        await createService(form)
      }
      setOpen(false)
      if (mode !== "delete") {
        setForm({ title: "", description: "", icon: "Code", sortOrder: 0 })
      }
    } finally {
      setLoading(false)
    }
  }

  if (mode === "delete") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
        <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-2">Delete Service</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete &ldquo;{service?.title}&rdquo;?
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
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">
          {mode === "create" ? "Add Service" : "Edit Service"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium mb-1">Lucide Icon Name</label>
            <Input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              e.g. Code, Globe, Smartphone, Server
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <Input
              type="number"
              value={form.sortOrder.toString()}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-2">
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
  )
}
