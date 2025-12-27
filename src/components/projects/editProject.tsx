import type { Project } from "@/lib/drizzle/schema";
import EditForm from "../forms/editForm";

interface EditProjectFormProps {
  projectId: string; // or slug
  useSlug?: boolean; // if true, will match by slug instead of id
}

export default function EditProjectForm({ projectId, useSlug = false }: EditProjectFormProps) {
  return (
    <EditForm<Project>
      tableName="projects"
      recordId={projectId}
      matchColumn={useSlug ? "slug" : "id"}
      fields={[
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "technologies",
          type: "tags",
        },
        {
          name: "tags",
          type: "tags",
        },
        {
          name: "repo_url",
          type: "text",
        },
        {
          name: "live_url",
          type: "text",
        },
        {
          name: "img_url",
          type: "text",
        },
      ]}
    />
  );
}
