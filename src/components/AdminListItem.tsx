import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminListItemProps {
  title: string;
  createdAt: string;
  published: boolean;
  featured?: boolean;
  tags?: string[];
  excerpt?: string;
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showViewButton?: boolean;
}

export function AdminListItem({
  title,
  createdAt,
  published,
  featured,
  tags,
  excerpt,
  onView,
  onEdit,
  onDelete,
  showViewButton = true,
}: AdminListItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span>{formatDate(createdAt)}</span>
            <Badge variant={published ? "default" : "secondary"}>
              {published ? "Published" : "Draft"}
            </Badge>
            {featured && <Badge variant="default">Featured</Badge>}
            {tags && tags.length > 0 && (
              <div className="flex gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {excerpt && <p className="text-gray-700 text-sm">{excerpt}</p>}
        </div>
        <div className="flex gap-2">
          {showViewButton && published && onView && (
            <Button onClick={onView} variant="outline" size="sm">
              View
            </Button>
          )}
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit
          </Button>
          <Button onClick={onDelete} variant="outline" size="sm">
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
