import { Card } from "./card";
import type { LucideIcon } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  date: string | Date;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  emptyMessage?: string;
  maxItems?: number;
}

export function ActivityFeed({
  activities,
  title = "Recent Activity",
  emptyMessage = "No recent activity",
  maxItems = 10,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      <div className="space-y-3">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity) => {
            const Icon = activity.icon;
            const bgColor = activity.iconBgColor || "bg-primary/10";
            const color = activity.iconColor || "text-primary";

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor} shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {typeof activity.date === 'string'
                      ? new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : activity.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            {emptyMessage}
          </p>
        )}
      </div>
    </Card>
  );
}
