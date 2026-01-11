import { Button } from "./button";
import { Pencil } from "lucide-react";
import { Badge } from "./badge";

interface ItemCardProps {
  title: string;
  createdAt: string;
  onEdit: () => void;
  tags?: string[];
  children?: React.ReactNode;
}

export function ItemCard({
  title,
  createdAt,
  onEdit,
  tags,
  children,
}: ItemCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold mb-2">{title}</h2>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {children}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Created: {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
