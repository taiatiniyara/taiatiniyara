import { getServices } from "@/app/admin/_actions/services"
import { ServiceForm } from "@/app/admin/_components/services-form"
import { ServiceList } from "@/app/admin/_components/services-form"

export default async function ServicesPage() {
  const rows = await getServices()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Services</h1>
      <ServiceForm />
      <div className="mt-8">
        <ServiceList rows={rows} />
      </div>
    </div>
  )
}
