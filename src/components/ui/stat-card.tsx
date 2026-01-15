import { Card } from "./card";
import { Badge } from "./badge";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  badge,
  badgeVariant = "secondary",
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${iconBgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
        </div>
        {badge && <Badge variant={badgeVariant} className="text-xs">{badge}</Badge>}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold mb-1">{value}</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
}
