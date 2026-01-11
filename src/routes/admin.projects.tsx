import CreateProjectForm from "@/components/projects/createProject";
import EditProjectForm from "@/components/projects/editProject";
import { AdminCrudPage } from "@/components/ui/admin-crud-page";
import { ItemCard } from "@/components/ui/item-card";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import type { Project } from "@/lib/drizzle/schema";

export const Route = createFileRoute("/admin/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isLoading } = useSupabaseQuery<Project>({
    queryKey: ["admin-projects"],
    tableName: "projects",
    fields: ["id", "title", "created_at", "technologies", "tags"],
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);

  return (
    <AdminCrudPage
      title="Projects"
      description="Manage your projects"
      createButtonText="Create New Project"
      emptyText="No projects found."
      loadingText="Loading projects..."
      data={data}
      isLoading={isLoading}
      error={error}
      showCreateForm={showCreateForm}
      editingItemId={editingProjectId}
      onToggleCreateForm={() => {
        setShowCreateForm(!showCreateForm);
        setEditingProjectId(null);
      }}
      onCancelEdit={() => setEditingProjectId(null)}
      renderCreateForm={() => <CreateProjectForm />}
      renderEditForm={(id) => <EditProjectForm projectId={id} />}
      renderItem={(project) => (
        <ItemCard
          title={project.title}
          createdAt={project.created_at.toDateString()}
          tags={Array.isArray(project.technologies) ? project.technologies : []}
          onEdit={() => {
            setEditingProjectId(project.id);
            setShowCreateForm(false);
          }}
        />
      )}
    />
  );
}
