import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClipLoader } from "react-spinners";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjectBySlug } from "@/hooks/useProjectQueries";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProjectBySlug(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100px">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Button
        onClick={() => navigate({ to: "/projects" })}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>

      <article>
        {project.thumbnail && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8 bg-gray-100">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{project.title}</h1>
            {project.featured && (
              <Badge variant="default" className="ml-4">
                Featured
              </Badge>
            )}
          </div>
          
          <p className="text-lg text-gray-600 mb-4">{project.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            {project.published_at && (
              <span>Published on {formatDate(project.published_at)}</span>
            )}
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-3 mb-8">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              </a>
            )}
          </div>
        </div>

        <Card className="p-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </Card>

        <div className="mt-12 text-center">
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Projects
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
