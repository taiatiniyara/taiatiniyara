import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjectQueries";
import type { Project, CreateProjectInput } from "@/types/project";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useAlertDialog } from "@/components/AlertDialogProvider";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminListItem } from "@/components/AdminListItem";
import { TagInput } from "@/components/TagInput";
import { generateSlug } from "@/lib/admin-utils";
import { AdminRoute } from "@/components/ProtectedRoute";

const adminKey = import.meta.env.VITE_BLOG_KEY;

export const Route = createFileRoute("/projects/admin")({
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlertDialog();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all projects (including drafts)
  const { data: projectsData, isLoading: loading } = useAllProjects(1, 100);
  const projects = projectsData?.projects || [];

  // Mutations
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setContent("");
    setThumbnail("");
    setTechnologies([]);
    setGithubUrl("");
    setDemoUrl("");
    setFeatured(false);
    setPublished(false);
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingProject) {
      setSlug(generateSlug(value));
    }
  };

  const handleAddTechnology = (tech: string) => {
    setTechnologies([...technologies, tech]);
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleEdit = async (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setSlug(project.slug);
    setDescription(project.description);
    setContent(project.content);
    setThumbnail(project.thumbnail || "");
    setTechnologies(project.technologies || []);
    setGithubUrl(project.github_url || "");
    setDemoUrl(project.demo_url || "");
    setFeatured(project.featured);
    setPublished(project.published);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData: CreateProjectInput = {
      title,
      slug,
      description,
      content,
      thumbnail: thumbnail || undefined,
      technologies,
      github_url: githubUrl || undefined,
      demo_url: demoUrl || undefined,
      featured,
      published,
    };

    try {
      if (editingProject) {
        await updateProjectMutation.mutateAsync({
          id: editingProject.id,
          input: projectData,
        });
      } else {
        await createProjectMutation.mutateAsync(projectData);
      }
      resetForm();
    } catch (err) {
      showAlert("Error", err instanceof Error ? err.message : "Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "Delete Project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      async () => {
        try {
          await deleteProjectMutation.mutateAsync(id);
        } catch (err) {
          showAlert("Error", err instanceof Error ? err.message : "Failed to delete project");
        }
      }
    );
  };

  return (
    <AdminRoute>
      <AdminLayout
        title="Projects Administration"
        viewPath="/projects"
        viewLabel="View Projects"
        isLoading={loading}
        adminKey={adminKey}
        storageKey="projects_admin_key"
        onCreateNew={() => setIsCreating(true)}
        showCreateButton={!isCreating}
      >

      {isCreating ? (
        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h2>
              <Button type="button" onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Enter project title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="project-url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief description of the project"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your project details here..."
                className="min-h-100"
              />
              <p className="text-sm text-gray-500">
                Use the toolbar above for rich text formatting. The editor
                supports headings, lists, links, and more.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <TagInput
              label="Technologies"
              tags={technologies}
              onAddTag={handleAddTechnology}
              onRemoveTag={handleRemoveTechnology}
              placeholder="Add a technology"
              id="technologies"
            />

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo.example.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="featured">Feature this project</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
              >
                {createProjectMutation.isPending || updateProjectMutation.isPending
                  ? "Saving..."
                  : editingProject
                  ? "Update Project"
                  : "Create Project"}
              </Button>
              <Button type="button" onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">All Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-600">No projects yet. Create your first project!</p>
        ) : (
          projects.map((project) => (
            <AdminListItem
              key={project.id}
              title={project.title}
              createdAt={project.created_at}
              published={project.published}
              featured={project.featured}
              tags={project.technologies}
              excerpt={project.description}
              onView={() => navigate({ to: `/projects/${project.slug}` })}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project.id)}
            />
          ))
        )}
      </div>
    </AdminLayout>
    </AdminRoute>
  );
}
