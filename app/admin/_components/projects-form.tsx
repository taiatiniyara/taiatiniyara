"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Pencil, Trash2, Star } from "lucide-react"
import { toast } from "sonner"
import { safeJsonParse } from "@/lib/utils"
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/app/admin/_actions/projects"
import { useRouter } from "next/navigation"
import { UploadButton } from "./upload-button"

type ProjectRow = {
  id: number
  title: string
  description: string
  techStack: string
  imageUrl: string
  link: string
  clientName: string
  completedDate: string
  testimonial: string
  featured: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export function ProjectForm({ edit, onClose }: { edit?: ProjectRow; onClose?: () => void }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState(edit?.imageUrl ?? "")

  function handleClose() {
    setOpen(false)
    onClose?.()
  }

  const button = (
    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
      Add Project
    </Button>
  )

  const formContent = (
    <form
      action={async (formData) => {
        formData.set("imageUrl", imageUrl)
        const result = edit
          ? await updateProject(edit.id, formData)
          : await createProject(formData)
        if (result.error) { toast.error("Validation failed"); return }
        toast.success(edit ? "Project updated" : "Project created")
        handleClose()
        router.refresh()
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Title *</label>
        <Input name="title" defaultValue={edit?.title} required />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description *</label>
        <Textarea name="description" defaultValue={edit?.description} required rows={3} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Tech Stack (JSON array)</label>
        <Input name="techStack" defaultValue={edit?.techStack ?? "[]"} placeholder='["React","Node.js"]' />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Image</label>
        <UploadButton onUpload={setImageUrl} currentUrl={imageUrl} />
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Link</label>
        <Input name="link" defaultValue={edit?.link} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Client Name</label>
          <Input name="clientName" defaultValue={edit?.clientName} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Completed Date</label>
          <Input name="completedDate" defaultValue={edit?.completedDate} type="date" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Testimonial</label>
        <Textarea name="testimonial" defaultValue={edit?.testimonial} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sort Order</label>
          <Input name="sortOrder" type="number" defaultValue={edit?.sortOrder ?? 0} />
        </div>
        <div className="space-y-1.5 flex items-end gap-2">
          <input type="hidden" name="featured" value={edit?.featured ?? 0} />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="featured"
              value="1"
              defaultChecked={edit?.featured === 1}
              className="rounded-none"
            />
            Featured
          </label>
        </div>
      </div>
      <Button type="submit" className="w-full">
        {edit ? "Save Changes" : "Create Project"}
      </Button>
    </form>
  )

  if (edit) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {button}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}

export function ProjectList({ rows }: { rows: ProjectRow[] }) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<ProjectRow | null>(null)
  const router = useRouter()

  async function handleDelete() {
    if (deleteId === null) return
    await deleteProject(deleteId)
    toast.success("Project deleted")
    setDeleteId(null)
    router.refresh()
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No projects yet.</p>
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
                  {row.featured === 1 && (
                    <Star className="size-3.5 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {row.description}
                </p>
                {row.techStack && row.techStack !== "[]" && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {safeJsonParse<string[]>(row.techStack, []).map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon-xs" onClick={() => setEditRow(row)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon-xs" onClick={() => setDeleteId(row.id)}>
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editRow && (
        <ProjectForm
          edit={editRow}
          onClose={() => setEditRow(null)}
        />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
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
