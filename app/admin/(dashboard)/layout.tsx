import { AdminSidebar } from "@/app/admin/_components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
