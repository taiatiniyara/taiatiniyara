import { getServices } from "@/lib/data"
import { ServicesForm } from "@/components/admin/services-form"

export default async function AdminServicesPage() {
  const allServices = await getServices()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
        <ServicesForm mode="create" />
      </div>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Icon</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allServices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No services yet. Add your first service.
                </td>
              </tr>
            )}
            {allServices.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{s.sortOrder}</td>
                <td className="px-4 py-3 text-sm font-mono">{s.icon}</td>
                <td className="px-4 py-3 text-sm font-medium">{s.title}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                  {s.description}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <ServicesForm mode="edit" service={s} />
                    <ServicesForm mode="delete" service={s} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
