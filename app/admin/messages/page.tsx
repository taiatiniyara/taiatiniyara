import { getContacts } from "@/lib/data"

export default async function AdminMessagesPage() {
  const allContacts = await getContacts()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Messages</h1>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {allContacts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No messages yet.
                </td>
              </tr>
            )}
            {allContacts.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-sm max-w-md">{c.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
