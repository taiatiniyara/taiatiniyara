import { validateSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authed = await validateSession()
  if (!authed) redirect("/admin/login")

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">{children}</main>
    </div>
  )
}
