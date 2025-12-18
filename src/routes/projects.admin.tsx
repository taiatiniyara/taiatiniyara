import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useAllProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjectQueries";
import { generateSlug } from "@/lib/project";
import type { Project, CreateProjectInput } from "@/types/project";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useSessionStorage } from "@/hooks/useSessionStorage";

const adminKey = import.meta.env.VITE_BLOG_KEY;

export const Route = createFileRoute("/projects/admin")({
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const navigate = useNavigate();
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
  const [techInput, setTechInput] = useState("");
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
    setTechInput("");
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

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
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
      alert(err instanceof Error ? err.message : "Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await deleteProjectMutation.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const sessionStorage = useSessionStorage<string | null>(
    "projects_admin_key",
    null
  );
  const [storedKey, setStoredKey] = sessionStorage;

  if (storedKey !== adminKey) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
          <p className="mb-4">
            Please enter the admin key to access the projects administration panel.
          </p>
          <Input
            type="password"
            placeholder="Enter admin key"
            value={storedKey || ""}
            onChange={(e) => setStoredKey(e.target.value)}
          />
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Projects Administration</h1>
        <div className="flex gap-4">
          <Button onClick={() => navigate({ to: "/projects" })} variant="outline">
            View Projects
          </Button>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>Create New Project</Button>
          )}
        </div>
      </div>

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

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies</Label>
              <div className="flex gap-2">
                <Input
                  id="technologies"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                  placeholder="Add a technology"
                />
                <Button type="button" onClick={handleAddTechnology} variant="outline">
                  Add
                </Button>
              </div>
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTechnology(tech)}
                    >
                      {tech} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

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
              <Button type="submit" className="flex-1">
                {editingProject ? "Update Project" : "Create Project"}
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
            <Card key={project.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>{formatDate(project.created_at)}</span>
                    <Badge variant={project.published ? "default" : "secondary"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                    {project.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex gap-1">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  {project.published && (
                    <Button
                      onClick={() => navigate({ to: `/projects/${project.slug}` })}
                      variant="outline"
                      size="sm"
                    >
                      View
                    </Button>
                  )}
                  <Button
                    onClick={() => handleEdit(project)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="outline"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
