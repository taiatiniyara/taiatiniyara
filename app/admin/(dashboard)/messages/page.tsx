import { getContacts, getUnreadCount } from "@/app/admin/_actions/contacts"
import { Badge } from "@/components/ui/badge"
import { MessageList, MarkAllReadButton } from "@/app/admin/_components/messages-list"

export default async function MessagesPage() {
  const [rows, unreadCount] = await Promise.all([getContacts(), getUnreadCount()])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} unread</Badge>
          )}
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>
      <MessageList rows={rows} />
    </div>
  )
}
