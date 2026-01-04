import { cn } from "@/lib/utils";
import { type ReactNode, type ElementType, createElement } from "react";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "hero" | "page" | "section" | "subsection" | "card" | "label";
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
}

const variantStyles = {
  hero: "text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight",
  page: "text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight",
  section: "text-2xl sm:text-3xl font-bold",
  subsection: "text-xl sm:text-2xl font-bold",
  card: "text-lg sm:text-xl font-bold",
  label: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
};

const levelStyles = {
  1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
  2: "text-xl sm:text-2xl md:text-3xl font-bold",
  3: "text-lg sm:text-xl font-bold",
  4: "text-base sm:text-lg font-semibold",
  5: "text-base font-semibold",
  6: "text-sm font-semibold",
};

export function Heading({
  children,
  level = 2,
  variant,
  className,
  as,
}: HeadingProps) {
  const Tag = (as || `h${level}`) as ElementType;
  const styles = variant ? variantStyles[variant] : levelStyles[level];

  return createElement(
    Tag,
    { className: cn(styles, className) },
    children
  );
}
