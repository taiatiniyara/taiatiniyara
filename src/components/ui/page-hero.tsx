import { Heading } from "./heading";

interface PageHeroProps {
  title: string | React.ReactNode;
  description: string;
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-chart-3/10 border-b">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Heading variant="page">
            {title}
          </Heading>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
