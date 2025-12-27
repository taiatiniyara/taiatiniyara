import CreateProjectForm from "@/components/projects/createProject";
import EditProjectForm from "@/components/projects/editProject";
import { Button } from "@/components/ui/button";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Pencil } from "lucide-react";
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

  if (isLoading) return <LoadingSpinner text="Loading projects..." />;
  if (error) return <ErrorBox message={error.message} />;
  if (data && data.length === 0) {
    return (
      <div className="w-full">
        <EmptyListPlaceholder text="No projects found." />
        <CreateProjectForm />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Projects</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your projects</p>
        </div>
        <Button 
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingProjectId(null);
          }}
          size="lg"
          className="w-full sm:w-auto"
        >
          {showCreateForm ? "Cancel" : "Create New Project"}
        </Button>
      </div>
      
      {showCreateForm ? (
        <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-md">
          <CreateProjectForm />
        </div>
      ) : null}
      
      {editingProjectId ? (
        <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Edit Project</h3>
            <Button 
              variant="outline" 
              onClick={() => setEditingProjectId(null)}
            >
              Cancel Edit
            </Button>
          </div>
          <EditProjectForm projectId={editingProjectId} />
        </div>
      ) : null}
      
      <div className="space-y-4">
        {data?.map((project) => (
          <div key={project.id} className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.isArray(project.technologies) && project.technologies.map((tech: string) => (
                    <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingProjectId(project.id);
                  setShowCreateForm(false);
                }}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
