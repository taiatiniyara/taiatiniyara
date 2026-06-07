import { getProjects } from "@/lib/data"
import { ProjectsForm } from "@/components/admin/projects-form"

export default async function AdminProjectsPage() {
  const allProjects = await getProjects()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <ProjectsForm mode="create" />
      </div>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Tech Stack</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Featured</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No projects yet.
                </td>
              </tr>
            )}
            {allProjects.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm font-medium">{p.title}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {p.clientName || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                  {p.techStack}
                </td>
                <td className="px-4 py-3 text-sm">
                  {p.featured ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <ProjectsForm mode="edit" project={p} />
                    <ProjectsForm mode="delete" project={p} />
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
