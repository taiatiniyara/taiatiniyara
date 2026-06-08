"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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
import { Separator } from "@/components/ui/separator"
import { Mail, MailOpen, Trash2, CheckCheck, Inbox, Send, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { markAsRead, markAsUnread, deleteContact, markAllAsRead, sendReplyToContact } from "@/app/admin/_actions/contacts"
import { useRouter } from "next/navigation"

type ContactRow = {
  id: number
  name: string
  email: string
  message: string
  projectType: string
  timeline: string
  budgetRange: string
  isRead: number
  createdAt: string
  updatedAt: string
}

type Filter = "all" | "unread" | "read"
type Sort = "newest" | "oldest"

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function MarkAllReadButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleClick() {
    setPending(true)
    await markAllAsRead()
    toast.success("All messages marked as read")
    router.refresh()
    setPending(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={pending}>
      <CheckCheck className="size-3.5 mr-1.5" />
      Mark all read
    </Button>
  )
}

function ReplyForm({
  contactId,
  contactName,
  contactEmail,
  onSent,
}: {
  contactId: number
  contactName: string
  contactEmail: string
  onSent: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [replyKey, setReplyKey] = useState(0)

  async function handleSubmit(formData: FormData) {
    setSending(true)
    setError("")
    formData.set("id", String(contactId))

    const result = await sendReplyToContact(formData)

    if (result.error) {
      const errors = result.error as { message?: string[]; _form?: string[] }
      const msg = errors._form?.[0] ?? errors.message?.[0] ?? "Failed to send"
      setError(msg)
      toast.error(msg)
    } else {
      toast.success(`Reply sent to ${contactName}`)
      formRef.current?.reset()
      setReplyKey((k) => k + 1)
      onSent()
    }
    setSending(false)
  }

  return (
    <form ref={formRef} key={replyKey} action={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Send className="size-3" />
          Reply to <span className="font-medium text-foreground">{contactEmail}</span>
        </div>
      </div>
      <Textarea
        name="message"
        placeholder={`Hi ${contactName.split(" ")[0]},\n\n...`}
        rows={4}
        required
        className="min-h-[80px]"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={sending}>
          <Send className="size-3.5 mr-1.5" />
          {sending ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </form>
  )
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
]

export function MessageList({ rows }: { rows: ContactRow[] }) {
  const [selected, setSelected] = useState<ContactRow | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<Sort>("newest")
  const router = useRouter()

  const filtered = useMemo(() => {
    let result = [...rows]

    if (filter === "unread") result = result.filter((r) => !r.isRead)
    if (filter === "read") result = result.filter((r) => !!r.isRead)

    result.sort((a, b) => {
      const da = new Date(a.createdAt).getTime()
      const db = new Date(b.createdAt).getTime()
      return sort === "newest" ? db - da : da - db
    })

    return result
  }, [rows, filter, sort])

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

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
          className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
          title={sort === "newest" ? "Newest first" : "Oldest first"}
        >
          <ArrowUpDown className="size-3" />
          {sort === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Inbox className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {rows.length === 0 ? "No messages yet" : "No messages match this filter"}
          </p>
        </Card>
      ) : (
        <div className="space-y-1">
          {filtered.map((row) => (
            <div
              key={row.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setSelected(row)
                if (!row.isRead) {
                  markAsRead(row.id)
                  router.refresh()
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setSelected(row)
                  if (!row.isRead) {
                    markAsRead(row.id)
                    router.refresh()
                  }
                }
              }}
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg group"
            >
              <Card className="px-3 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0">
                  {row.isRead ? (
                    <MailOpen className="size-3.5 text-muted-foreground/40 shrink-0" />
                  ) : (
                    <Mail className="size-3.5 text-primary shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs truncate ${row.isRead ? "" : "font-semibold"}`}>
                        {row.name}
                      </span>
                      {!row.isRead && (
                        <span className="size-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      <span className="text-[11px] text-muted-foreground/50 truncate hidden sm:inline">
                        {row.email}
                      </span>
                      {row.projectType && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 shrink-0 hidden sm:inline-flex">
                          {row.projectType}
                        </Badge>
                      )}
                      <span
                        className="text-[10px] text-muted-foreground/50 shrink-0 ml-auto"
                        suppressHydrationWarning
                      >
                        {timeAgo(row.createdAt)}
                      </span>
                      <div className="items-center gap-0.5 hidden group-hover:flex">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="size-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleRead(row)
                          }}
                          title={row.isRead ? "Mark unread" : "Mark read"}
                        >
                          {row.isRead ? (
                            <MailOpen className="size-3" />
                          ) : (
                            <Mail className="size-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="size-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteId(row.id)
                          }}
                          title="Delete"
                        >
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/60 line-clamp-1 mt-0.5 leading-snug">
                      {row.message}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground/50 mt-2">
        {filtered.length} of {rows.length} messages
      </p>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-8">
              {selected?.isRead ? (
                <MailOpen className="size-4 text-muted-foreground shrink-0" />
              ) : (
                <Mail className="size-4 text-primary shrink-0" />
              )}
              <span className="truncate">Message from {selected?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">From</p>
                <p className="font-medium">{selected?.name}</p>
                <p className="text-xs text-muted-foreground">{selected?.email}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Date</p>
                <p className="text-muted-foreground">
                  {selected?.createdAt ? formatDate(selected.createdAt) : ""}
                </p>
              </div>
            </div>

            {(selected?.projectType || selected?.timeline || selected?.budgetRange) && (
              <>
                <Separator />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selected?.projectType && (
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                        Project Type
                      </p>
                      <Badge variant="secondary" className="mt-0.5 text-xs">
                        {selected.projectType}
                      </Badge>
                    </div>
                  )}
                  {selected?.timeline && (
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                        Timeline
                      </p>
                      <p className="text-xs mt-0.5">{selected.timeline}</p>
                    </div>
                  )}
                  {selected?.budgetRange && (
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                        Budget
                      </p>
                      <p className="text-xs mt-0.5">{selected.budgetRange}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">
                Message
              </p>
              <p className="whitespace-pre-wrap leading-relaxed text-foreground/85">
                {selected?.message}
              </p>
            </div>
          </div>

          {selected && (
            <>
              <Separator />

              <ReplyForm
                contactId={selected.id}
                contactName={selected.name}
                contactEmail={selected.email}
                onSent={() => setSelected(null)}
              />

              <div className="flex items-center gap-1 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleToggleRead(selected)
                    setSelected(null)
                  }}
                >
                  {selected.isRead ? (
                    <>
                      <Mail className="size-3.5 mr-1.5" />
                      Mark unread
                    </>
                  ) : (
                    <>
                      <MailOpen className="size-3.5 mr-1.5" />
                      Mark read
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDeleteId(selected.id)
                    setSelected(null)
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </>
          )}
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
