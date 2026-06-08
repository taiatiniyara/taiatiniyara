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
import { Pencil, Trash2, GripVertical, Layers } from "lucide-react"
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

export function AddServiceButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} size="sm">
        Add Service
      </Button>
      <ServiceFormDialog
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  )
}

function EditServiceDialog({
  row,
  onClose,
}: {
  row: ServiceRow
  onClose: () => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); setOpen(v); }}>
      <ServiceFormDialog
        edit={row}
        onSuccess={() => {
          setOpen(false)
          onClose()
        }}
      />
    </Dialog>
  )
}

function ServiceFormDialog({
  edit,
  onSuccess,
}: {
  edit?: ServiceRow
  onSuccess: () => void
}) {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const result = edit
      ? await updateService(edit.id, formData)
      : await createService(formData)

    if (result.error) {
      toast.error("Validation failed")
      return
    }

    toast.success(edit ? "Service updated" : "Service created")
    onSuccess()
    router.refresh()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{edit ? "Edit Service" : "New Service"}</DialogTitle>
      </DialogHeader>
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title *</label>
          <Input name="title" defaultValue={edit?.title} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description *</label>
          <Textarea name="description" defaultValue={edit?.description} required rows={3} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Icon (Lucide name) *</label>
          <Input name="icon" defaultValue={edit?.icon} required placeholder="e.g. Code, Server, Globe" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sort Order</label>
          <Input name="sortOrder" type="number" defaultValue={edit?.sortOrder ?? 0} />
        </div>
        <Button type="submit" className="w-full">
          {edit ? "Save Changes" : "Create Service"}
        </Button>
      </form>
    </DialogContent>
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
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <Layers className="size-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No services yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">
          Add services to display on your homepage.
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-1">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-2.5 px-3 py-2 bg-muted/40 rounded-md group hover:bg-muted/70 transition-colors"
          >
            <GripVertical className="size-3.5 text-muted-foreground/30 shrink-0" />
            <span className="text-[10px] text-muted-foreground/50 font-mono w-4 text-center shrink-0">
              {row.sortOrder}
            </span>
            <span className="text-[10px] text-muted-foreground/60 shrink-0 w-12 truncate hidden sm:inline">
              {row.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{row.title}</p>
              <p className="text-[11px] text-muted-foreground/50 truncate">
                {row.description}
              </p>
            </div>
            <div className="items-center gap-0.5 hidden group-hover:flex">
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-6"
                onClick={() => setEditRow(row)}
              >
                <Pencil className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-6"
                onClick={() => setDeleteId(row.id)}
              >
                <Trash2 className="size-3 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editRow && (
        <EditServiceDialog row={editRow} onClose={() => setEditRow(null)} />
      )}

      <p className="text-[11px] text-muted-foreground/50 mt-2">
        {rows.length} service{rows.length !== 1 ? "s" : ""}
      </p>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
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
