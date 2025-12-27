import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-chart-3/10 border-b">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              About <span className="text-primary">Me</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn more about my experience, skills, and professional journey
            </p>
          </div>
        </div>
      </div>

      {/* CV Section */}
      <div className="container mx-auto px-6 py-12">
        <Card className="overflow-hidden shadow-xl">
          <iframe 
            className="w-full" 
            style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
            src="/CV.pdf"
            title="Curriculum Vitae"
          />
        </Card>
        <div className="flex justify-center mt-8">
          <Button asChild size="lg">
            <a href="/CV.pdf" download>
              Download CV
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
