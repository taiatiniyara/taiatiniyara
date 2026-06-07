"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { createProject, updateProject, deleteProject } from "@/lib/actions/projects"
import { UploadButton } from "@/components/admin/upload-button"
import { InputField } from "@/components/admin/input-field"
import type { Project } from "@/lib/data"

interface Props {
  mode: "create" | "edit" | "delete"
  project?: Project
}

export function ProjectsForm({ mode, project }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    techStack: project?.techStack ?? "[]",
    imageUrl: project?.imageUrl ?? "",
    link: project?.link ?? "",
    clientName: project?.clientName ?? "",
    completedDate: project?.completedDate ?? "",
    testimonial: project?.testimonial ?? "",
    featured: project?.featured ?? 0,
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
        {mode === "create" && "Add Project"}
      </Button>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "delete" && project) {
        await deleteProject(project.id)
      } else if (mode === "edit" && project) {
        await updateProject(project.id, form)
      } else {
        await createProject(form)
      }
      setOpen(false)
      if (mode !== "delete") {
        setForm({
          title: "", description: "", techStack: "[]", imageUrl: "",
          link: "", clientName: "", completedDate: "", testimonial: "", featured: 0,
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
            <h3 className="text-lg font-semibold mb-2">Delete Project</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Delete &ldquo;{project?.title}&rdquo;? This action cannot be undone.
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
              {mode === "create" ? "Add Project" : "Edit Project"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <InputField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
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
              <InputField label="Tech Stack (JSON array)" value={form.techStack} onChange={(v) => setForm({ ...form, techStack: v })} />
              <InputField
                label="Image URL"
                value={form.imageUrl}
                onChange={(v) => setForm({ ...form, imageUrl: v })}
                action={
                  <UploadButton
                    label="Upload Screenshot"
                    onUploaded={(url) => setForm({ ...form, imageUrl: url })}
                  />
                }
              />
              <InputField label="Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
              <InputField label="Client Name" value={form.clientName} onChange={(v) => setForm({ ...form, clientName: v })} />
              <InputField label="Completed Date" value={form.completedDate} onChange={(v) => setForm({ ...form, completedDate: v })} />
              <div>
                <label className="block text-sm font-medium mb-1">Testimonial</label>
                <textarea
                  value={form.testimonial}
                  onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured === 1}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked ? 1 : 0 })}
                  className="size-4"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured</label>
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


