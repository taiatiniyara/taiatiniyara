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
import { Pencil, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"
import {
  createService,
  updateService,
  deleteService,
} from "@/app/admin/_actions/services"
import { useRouter } from "next/navigation"

type ServiceRow = {
  id: number
  title: string
  description: string
  icon: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export function ServiceForm({
  edit,
}: {
  edit?: ServiceRow
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = edit
      ? await updateService(edit.id, formData)
      : await createService(formData)

    if (result.error) {
      toast.error("Validation failed")
      return
    }

    toast.success(edit ? "Service updated" : "Service created")
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open || !!edit} onOpenChange={edit ? undefined : setOpen}>
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        Add Service
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Service" : "New Service"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <Input
              name="title"
              defaultValue={edit?.title}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description *</label>
            <Textarea
              name="description"
              defaultValue={edit?.description}
              required
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Icon (Lucide name) *</label>
            <Input
              name="icon"
              defaultValue={edit?.icon}
              required
              placeholder="e.g. Code, Server, Globe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sort Order</label>
            <Input
              name="sortOrder"
              type="number"
              defaultValue={edit?.sortOrder ?? 0}
            />
          </div>
          <Button type="submit" className="w-full">
            {edit ? "Save Changes" : "Create Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ServiceList({ rows }: { rows: ServiceRow[] }) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<ServiceRow | null>(null)
  const router = useRouter()

  async function handleDelete() {
    if (deleteId === null) return
    await deleteService(deleteId)
    toast.success("Service deleted")
    setDeleteId(null)
    router.refresh()
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No services yet.</p>
  }

  return (
    <>
      <div className="space-y-2">
        {rows.map((row) => (
          <Card key={row.id} className="flex items-center gap-3 p-3">
            <GripVertical className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{row.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {row.description}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setEditRow(row)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setDeleteId(row.id)}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {editRow && (
        <ServiceFormWrapper edit={editRow} onClose={() => setEditRow(null)} />
      )}

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
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

function ServiceFormWrapper({
  edit,
  onClose,
}: {
  edit: ServiceRow
  onClose: () => void
}) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  async function handleSubmit(formData: FormData) {
    const result = await updateService(edit.id, formData)
    if (result.error) {
      toast.error("Validation failed")
      return
    }
    toast.success("Service updated")
    onClose()
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); setOpen(v); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <Input name="title" defaultValue={edit.title} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description *</label>
            <Textarea name="description" defaultValue={edit.description} required rows={3} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Icon (Lucide name) *</label>
            <Input name="icon" defaultValue={edit.icon} required placeholder="e.g. Code, Server" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sort Order</label>
            <Input name="sortOrder" type="number" defaultValue={edit.sortOrder} />
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
