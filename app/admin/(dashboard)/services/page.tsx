import { getServices } from "@/app/admin/_actions/services"
import { AddServiceButton, ServiceList } from "@/app/admin/_components/services-form"

export default async function ServicesPage() {
  const rows = await getServices()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
        <AddServiceButton />
      </div>
      <ServiceList rows={rows} />
    </div>
  )
}
