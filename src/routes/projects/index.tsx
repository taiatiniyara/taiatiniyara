import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Project } from "@/lib/drizzle/schema";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/useSEO";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import React from "react";
import { Search, Code, ExternalLink, Github, Zap, CheckCircle, Filter } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSEO({
    title: "Projects - Portfolio of Software Development Work",
    description:
      "Explore my portfolio of software development projects including web applications, mobile apps, and custom solutions. See examples of quality software engineering work from Fiji and the Pacific.",
    keywords:
      "software projects Fiji, web development portfolio, developer portfolio Pacific, programming projects, software engineering examples",
    canonicalUrl: "/projects",
    ogType: "website",
  });
  
  const { error, data, isLoading } = useSupabaseQuery<Project>({
    tableName: "projects",
    queryKey: ["all-projects"],
  });

  // Filter published projects
  const publishedProjects = data?.filter(p => p.is_published) || [];

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTech, setSelectedTech] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<"all" | "ongoing" | "completed">("all");

  if (isLoading) {
    return <LoadingSpinner text="Loading projects..." />;
  }

  if (error) {
    return <ErrorBox message={error.message} />;
  }

  if (!publishedProjects || publishedProjects.length === 0) {
    return <EmptyListPlaceholder text="No projects found." />;
  }

  // Get all unique technologies
  const allTechnologies = Array.from(
    new Set(
      publishedProjects.flatMap((project) => 
        Array.isArray(project.technologies) ? project.technologies : []
      )
    )
  ).sort();

  // Filter projects
  const filteredProjects = publishedProjects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTech = 
      !selectedTech || 
      (Array.isArray(project.technologies) && project.technologies.includes(selectedTech));
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "ongoing" && project.ongoing) ||
      (filterStatus === "completed" && !project.ongoing);
    
    return matchesSearch && matchesTech && matchesStatus;
  });

  const ongoingCount = publishedProjects.filter(p => p.ongoing).length;
  const completedCount = publishedProjects.filter(p => !p.ongoing).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <PageHero 
        title={<>My <span className="text-primary">Projects</span></>} 
        description="A showcase of software solutions and creative work" 
      />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-bold">{publishedProjects.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Projects</p>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{ongoingCount}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Ongoing</p>
          </Card>
          
          <Card className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Status:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All ({publishedProjects.length})
                </Button>
                <Button
                  variant={filterStatus === "ongoing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("ongoing")}
                  className={filterStatus === "ongoing" ? "" : "hover:border-blue-500"}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Ongoing ({ongoingCount})
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                  className={filterStatus === "completed" ? "" : "hover:border-green-500"}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed ({completedCount})
                </Button>
              </div>
            </div>

            {/* Technology Filter */}
            {allTechnologies.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Filter by Technology:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTech === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTech(null)}
                  >
                    All
                  </Button>
                  {allTechnologies.map((tech) => (
                    <Button
                      key={tech}
                      variant={selectedTech === tech ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTech(tech)}
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(searchQuery || selectedTech || filterStatus !== "all") && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <p className="text-sm text-muted-foreground">Active filters:</p>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedTech && (
                  <Badge variant="secondary" className="gap-1">
                    Tech: {selectedTech}
                  </Badge>
                )}
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {filterStatus}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTech(null);
                    setFilterStatus("all");
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {publishedProjects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.slug} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Image */}
                {project.img_url && (
                  <a href={`/projects/${project.slug}`} className="block">
                    <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
                      <img
                        src={project.img_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {project.ongoing && (
                        <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-blue-600 hover:bg-blue-700 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Ongoing
                        </Badge>
                      )}
                    </div>
                  </a>
                )}

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <a href={`/projects/${project.slug}`} className="block mb-4">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </a>

                  {/* Technologies */}
                  {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-2 pt-3 border-t">
                    {project.repo_url && (
                      <a 
                        href={project.repo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        Code
                      </a>
                    )}
                    {project.live_url && (
                      <a 
                        href={project.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No projects found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedTech(null);
                setFilterStatus("all");
              }}
            >
              Clear all filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
