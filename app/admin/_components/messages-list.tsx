"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Mail, MailOpen, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { markAsRead, markAsUnread, deleteContact } from "@/app/admin/_actions/contacts"
import { useRouter } from "next/navigation"

type ContactRow = {
  id: number
  name: string
  email: string
  message: string
  isRead: number
  createdAt: string
  updatedAt: string
}

export function MessageList({ rows }: { rows: ContactRow[] }) {
  const [selected, setSelected] = useState<ContactRow | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const router = useRouter()

  async function handleToggleRead(row: ContactRow) {
    if (row.isRead) {
      await markAsUnread(row.id)
    } else {
      await markAsRead(row.id)
    }
    router.refresh()
  }

  async function handleDelete() {
    if (deleteId === null) return
    await deleteContact(deleteId)
    toast.success("Message deleted")
    setDeleteId(null)
    setSelected(null)
    router.refresh()
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>
  }

  return (
    <>
      <div className="space-y-1">
        {rows.map((row) => (
          <button
            key={row.id}
            onClick={async () => {
              setSelected(row)
              if (!row.isRead) {
                await markAsRead(row.id)
                router.refresh()
              }
            }}
            className="w-full text-left"
          >
            <Card className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer">
              {row.isRead ? (
                <MailOpen className="size-4 text-muted-foreground shrink-0" />
              ) : (
                <Mail className="size-4 text-primary shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={row.isRead ? "font-medium" : "font-bold"}>
                    {row.name}
                  </p>
                  {!row.isRead && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{row.email}</p>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {row.message}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleRead(row)
                  }}
                >
                  {row.isRead ? (
                    <MailOpen className="size-3.5" />
                  ) : (
                    <Mail className="size-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteId(row.id)
                  }}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p>{selected?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p>{selected?.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Message</p>
              <p className="whitespace-pre-wrap mt-1">{selected?.message}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
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
