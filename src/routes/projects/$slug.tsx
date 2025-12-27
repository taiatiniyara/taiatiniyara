import { createFileRoute, useParams } from '@tanstack/react-router'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Project } from '@/lib/drizzle/schema'
import LoadingSpinner from '@/components/ui/loading-spinner'
import ErrorBox from '@/components/ui/error'
import EmptyListPlaceholder from '@/components/ui/empty-list-placeholder'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/projects/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = useParams({ from: '/projects/$slug' });

  const { data, isLoading, error } = useSupabaseQuery<Project>({
    queryKey: [`projects/${slug}`],
    tableName: 'projects',
    params: { name: 'slug', value: slug },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading project..." />;
  }

  if (error) {
    return <ErrorBox message="Failed to load project. Please try again later." />;
  }

  if (!data || data.length === 0) {
    return <EmptyListPlaceholder text="Project not found." />;
  }

  const project = data[0];

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <Card className="overflow-hidden shadow-xl">
            {project.img_url && (
              <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
                <img
                  src={project.img_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              </div>
            )}
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">{project.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {project.description || 'Project details coming soon.'}
                </p>
              </div>
            </div>
          </Card>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="outline">
              <a href="/projects">← Back to Projects</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
