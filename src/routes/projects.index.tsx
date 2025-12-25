import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublishedProjects } from "@/hooks/useProjectQueries";
import { ExternalLink, Github, TrendingUp, FolderGit2 } from "lucide-react";
import { SEO, StructuredData } from "@/components/SEO";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { PageHeader } from "@/components/PageHeader";
import { StatsDisplay } from "@/components/StatsDisplay";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/projects/")({
  component: ProjectsIndex,
});

function ProjectsIndex() {
  const { data, isLoading } = usePublishedProjects(1, 100);
  const projects = data?.projects || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO
        title="Projects - Full-Stack Development Portfolio"
        description="Software development portfolio showcasing SaaS applications, multi-tenant systems, web applications, and system architecture projects. Built with React, TypeScript, .NET Core, Python, and modern technologies."
        canonicalUrl="https://taiatiniyara.com/projects"
        ogType="website"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: "Taia Tiniyara Projects Portfolio",
          description: "Software development portfolio and project showcase",
          url: `${window.location.origin}/projects`,
          author: {
            "@type": "Person",
            name: "Taia Tiniyara",
            url: window.location.origin,
          },
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: window.location.origin,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Projects",
              item: `${window.location.origin}/projects`,
            },
          ],
        }}
      />
      <div className="min-h-screen">
        <DecorativeBackground />

        <PageHeader
          badge={{ icon: TrendingUp, text: "Portfolio & Work" }}
          title="My Projects"
          description="Check out some of the projects I've worked on, showcasing real-world solutions and creative implementations"
        >
          <StatsDisplay
            stats={[
              { value: projects.length, label: "Projects", color: "blue" },
              { value: projects.filter(p => p.featured).length, label: "Featured", color: "blue" },
              { value: "∞", label: "Ideas", color: "blue" },
            ]}
          />

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/projects/admin">
              <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600">
                Admin
              </Button>
            </Link>
          </div>
        </PageHeader>

        {/* Projects Section */}
        <section className="relative container mx-auto px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            {projects.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FolderGit2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                  No projects published yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Check back soon for exciting new work!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <Card
                    key={project.id}
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-slate-800/70 animate-fade-in"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    {/* Decorative overlay */}
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500 pointer-events-none"></div>
                    
                    {/* Animated corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 group-hover:bg-blue-400/20 transition-all duration-700"></div>
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

                    {/* Project thumbnail or linear bar */}
                    {project.thumbnail ? (
                      <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-2 bg-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    )}

                    <div className="relative p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {project.title}
                        </h2>
                        {project.featured && (
                          <Badge className="shrink-0 bg-blue-500 text-white border-0 shadow-md">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs text-slate-400 dark:text-slate-600 self-center">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <Link
                          to="/projects/$slug"
                          params={{ slug: project.slug }}
                          className="flex-1"
                        >
                          <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                            View Details
                          </Button>
                        </Link>
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Button variant="outline" size="icon" className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
                              <Github className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Button variant="outline" size="icon" className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
