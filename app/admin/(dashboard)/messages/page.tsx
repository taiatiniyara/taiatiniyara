import { getContacts } from "@/app/admin/_actions/contacts"
import { MessageList } from "@/app/admin/_components/messages-list"

export default async function MessagesPage() {
  const rows = await getContacts()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Messages</h1>
      <MessageList rows={rows} />
    </div>
  )
}
