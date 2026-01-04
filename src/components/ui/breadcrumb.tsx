import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav 
      className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight size={16} className="shrink-0" />}
          
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors flex items-center gap-1 min-w-0"
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className={index === items.length - 1 ? "truncate" : ""}>{item.label}</span>
            </Link>
          ) : (
            <span className="text-foreground font-medium flex items-center gap-1 min-w-0">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper function to create common breadcrumb patterns
export function createBreadcrumbs(
  path: "home" | "blog" | "courses" | "projects",
  currentPage?: { label: string; href?: string }
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/", icon: <Home size={16} /> },
  ];

  if (path !== "home") {
    breadcrumbs.push({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: `/${path}`,
    });
  }

  if (currentPage) {
    breadcrumbs.push({
      label: currentPage.label,
      href: currentPage.href,
    });
  }

  return breadcrumbs;
}
