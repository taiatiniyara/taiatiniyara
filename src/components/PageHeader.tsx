import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
}

export function PageHeader({
  badge,
  title,
  description,
  titleClassName = "text-5xl md:text-6xl lg:text-7xl",
  descriptionClassName = "text-lg md:text-xl",
  children,
}: PageHeaderProps) {
  const BadgeIcon = badge?.icon;

  return (
    <section className="relative pt-20 pb-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6 animate-fade-in">
              {BadgeIcon && <BadgeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{badge.text}</span>
            </div>
          )}
          
          <h1 className={`${titleClassName} font-extrabold mb-6 animate-fade-in`}>
            <span className="bg-linear-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          
          <p className={`${descriptionClassName} text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in`} style={{ animationDelay: '0.1s' }}>
            {description}
          </p>

          {children}
        </div>
      </div>
    </section>
  );
}
