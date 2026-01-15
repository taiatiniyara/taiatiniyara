import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { useEffect } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showStructuredData?: boolean;
}

export function Breadcrumb({ items, className = "", showStructuredData = true }: BreadcrumbProps) {
  // Add structured data for SEO
  useEffect(() => {
    if (!showStructuredData || items.length === 0) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        ...(item.href && {
          "item": typeof window !== 'undefined' 
            ? `${window.location.origin}${item.href}`
            : item.href
        })
      }))
    };

    const scriptId = "breadcrumb-structured-data";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [items, showStructuredData]);

  return (
    <nav 
      className={`flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto scrollbar-thin ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 list-none m-0 p-0 min-w-0 flex-nowrap">
        {items.map((item, index) => {
          // On mobile, hide intermediate items if there are more than 3 items
          const shouldHideOnMobile = items.length > 3 && index > 0 && index < items.length - 1;
          
          return (
            <li 
              key={index} 
              className={`flex items-center gap-2 shrink-0 ${shouldHideOnMobile ? 'hidden sm:flex' : 'flex'}`}
            >
              {index > 0 && (
                <ChevronRight 
                  size={16} 
                  className="shrink-0" 
                  aria-hidden="true"
                />
              )}
              
              {item.href ? (
                <Link 
                  to={item.href} 
                  className="hover:text-primary transition-colors flex items-center gap-1 min-w-0 max-w-50 sm:max-w-none"
                  aria-current={index === items.length - 1 ? "page" : undefined}
                >
                  {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </Link>
              ) : (
                <span 
                  className="text-foreground font-medium flex items-center gap-1 min-w-0 max-w-50 sm:max-w-none"
                  aria-current="page"
                >
                  {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
        
        {/* Show ellipsis on mobile when items are hidden */}
        {items.length > 3 && (
          <li className="flex items-center gap-2 shrink-0 sm:hidden">
            <ChevronRight 
              size={16} 
              className="shrink-0" 
              aria-hidden="true"
            />
            <span className="text-muted-foreground">...</span>
          </li>
        )}
      </ol>
    </nav>
  );
}

// Helper function to create common breadcrumb patterns
export function createBreadcrumbs(
  path: "home" | "blog" | "courses" | "projects" | "admin",
  currentPage?: { label: string; href?: string },
  intermediatePages?: Array<{ label: string; href: string }>
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

  // Add intermediate pages (e.g., course page between courses list and lesson)
  if (intermediatePages) {
    intermediatePages.forEach(page => {
      breadcrumbs.push(page);
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
