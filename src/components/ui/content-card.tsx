import { Heading } from "./heading";

interface ContentCardProps {
  title: string;
  imageUrl?: string | null;
  imageAlt: string;
  href: string;
  children: React.ReactNode;
}

export function ContentCard({
  title,
  imageUrl,
  imageAlt,
  href,
  children,
}: ContentCardProps) {
  return (
    <a
      href={href}
      className="group block animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <div className="bg-card border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
        {imageUrl && (
          <div className="relative overflow-hidden h-48">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        )}
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <Heading 
            variant="subsection" 
            className="mb-3 group-hover:text-emerald-500 transition-colors line-clamp-2"
          >
            {title}
          </Heading>
          {children}
        </div>
      </div>
    </a>
  );
}
