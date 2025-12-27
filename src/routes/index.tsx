import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Main Content */}
      <div className="relative z-0 h-full flex flex-col items-center justify-center px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            <span className="text-sm font-medium text-primary">
              Ready to transform your ideas
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-primary">Turn Your Vision</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-muted-foreground">
              Into Powerful Software
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you need a web app, mobile solution, or cloud
            infrastructure, get a partner who turns your challenges into
            elegant, scalable software that drives results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="/projects">
              <Button
                size="lg"
                className="text-base px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                See What's Possible
                <svg
                  className="ml-2"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </a>
            <a href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all duration-300"
              >
                How I Can Help
              </Button>
            </a>
          </div>

          {/* Stats or Tech Stack Icons */}
          <div className="pt-12 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <span className="font-medium">Quality You Trust</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-chart-3/10 flex items-center justify-center group-hover:bg-chart-3/20 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="font-medium">Results On Time</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center group-hover:bg-chart-2/20 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="font-medium">Built to Grow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
