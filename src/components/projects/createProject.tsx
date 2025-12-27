import type { Project } from "@/lib/drizzle/schema";
import CreateForm from "../forms/createForm";
import { slugGenerate } from "@/lib/utils";

export default function CreateProjectForm() {
  return (
    <CreateForm<Project>
      tableName="projects"
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
      defaultValues={{
        created_at: new Date(),
        updated_at: new Date(),
        slug: slugGenerate(),
        is_published: true,
        technologies: [],
        tags: [],
      }}
    />
  );
}
