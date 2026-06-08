import { getProjects } from "@/app/admin/_actions/projects"
import { ProjectForm, ProjectList } from "@/app/admin/_components/projects-form"

export default async function ProjectsPage() {
  const rows = await getProjects()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Projects</h1>
      <ProjectForm />
      <div className="mt-8">
        <ProjectList rows={rows} />
      </div>
    </div>
  )
}
