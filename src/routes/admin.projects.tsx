import CreateProjectForm from "@/components/projects/createProject";
import EditProjectForm from "@/components/projects/editProject";
import { AdminHeader } from "@/components/ui/admin-header";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import type { Project } from "@/lib/drizzle/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import { Eye, EyeOff, Pencil, Code, ExternalLink, Github, Calendar, Zap, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isLoading } = useSupabaseQuery<Project>({
    queryKey: ["admin-projects"],
    tableName: "projects",
    orderBy: { column: "created_at", ascending: false },
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<"all" | "published" | "draft">("all");
  const [filterOngoing, setFilterOngoing] = React.useState<"all" | "ongoing" | "completed">("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterOngoing]);

  if (isLoading) return <LoadingSpinner text="Loading projects..." />;
  if (error) return <ErrorBox message={error.message} />;

  // Filter projects
  const filteredProjects = data?.filter((project) => {
    const statusMatch = 
      filterStatus === "all" || 
      (filterStatus === "published" && project.is_published) ||
      (filterStatus === "draft" && !project.is_published);
    
    const ongoingMatch =
      filterOngoing === "all" ||
      (filterOngoing === "ongoing" && project.ongoing) ||
      (filterOngoing === "completed" && !project.ongoing);
    
    return statusMatch && ongoingMatch;
  });

  const publishedCount = data?.filter(p => p.is_published).length || 0;
  const draftCount = data?.filter(p => !p.is_published).length || 0;
  const ongoingCount = data?.filter(p => p.ongoing).length || 0;
  const completedCount = data?.filter(p => !p.ongoing).length || 0;

  // Pagination calculations
  const totalItems = filteredProjects?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects?.slice(startIndex, endIndex);

  if (!data || data.length === 0) {
    return (
      <div className="w-full space-y-6">
        <AdminHeader
          title="Projects"
          description="Manage your portfolio projects"
          buttonText="Create New Project"
          showForm={showCreateForm}
          onToggleForm={() => setShowCreateForm(!showCreateForm)}
        />
        <EmptyListPlaceholder text="No projects found. Create your first project!" />
        {showCreateForm && (
          <FormWrapper>
            <CreateProjectForm />
          </FormWrapper>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <AdminHeader
        title="Projects"
        description="Manage your portfolio projects"
        buttonText="Create New Project"
        showForm={showCreateForm}
        onToggleForm={() => {
          setShowCreateForm(!showCreateForm);
          setEditingProjectId(null);
        }}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{data.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Code className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{publishedCount}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ongoingCount}</p>
              <p className="text-sm text-muted-foreground">Ongoing</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Status:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All ({data.length})
              </Button>
              <Button
                variant={filterStatus === "published" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("published")}
              >
                Published ({publishedCount})
              </Button>
              <Button
                variant={filterStatus === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("draft")}
              >
                Drafts ({draftCount})
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Progress:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterOngoing === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterOngoing("all")}
              >
                All
              </Button>
              <Button
                variant={filterOngoing === "ongoing" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterOngoing("ongoing")}
              >
                Ongoing ({ongoingCount})
              </Button>
              <Button
                variant={filterOngoing === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterOngoing("completed")}
              >
                Completed ({completedCount})
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {showCreateForm && (
        <FormWrapper>
          <CreateProjectForm />
        </FormWrapper>
      )}

      {editingProjectId && (
        <FormWrapper title="Edit Project" onCancel={() => setEditingProjectId(null)}>
          <EditProjectForm projectId={editingProjectId} />
        </FormWrapper>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedProjects && paginatedProjects.length > 0 ? (
          paginatedProjects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                {project.img_url && (
                  <div className="lg:w-48 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={project.img_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <Badge variant={project.is_published ? "default" : "secondary"}>
                          {project.is_published ? (
                            <><Eye className="w-3 h-3 mr-1" />Published</>
                          ) : (
                            <><EyeOff className="w-3 h-3 mr-1" />Draft</>
                          )}
                        </Badge>
                        <Badge variant={project.ongoing ? "outline" : "default"} className={project.ongoing ? "border-blue-500 text-blue-500" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30"}>
                          {project.ongoing ? (
                            <><Zap className="w-3 h-3 mr-1" />Ongoing</>
                          ) : (
                            <><CheckCircle className="w-3 h-3 mr-1" />Completed</>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Technologies */}
                  {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Code className="w-4 h-4 text-muted-foreground" />
                      {project.technologies.slice(0, 5).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs bg-primary/5">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(project.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Github className="w-4 h-4" />
                            Repo
                          </Button>
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Live
                          </Button>
                        </a>
                      )}
                      {project.is_published && (
                        <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProjectId(project.id);
                          setShowCreateForm(false);
                        }}
                        className="gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No projects found with the selected filters.
            </p>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredProjects && filteredProjects.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-md px-2 py-1 bg-background"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted-foreground">
                per page | Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
              </span>
            </div>

            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, idx, arr) => (
                      <React.Fragment key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-10"
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
