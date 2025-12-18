import { Link } from '@tanstack/react-router';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface NavigationCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  colorTheme: 'blue' | 'purple' | 'cyan';
}

const colorClasses = {
  blue: {
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    gradient: 'from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5',
    iconBg: 'bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    actionColor: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    gradient: 'from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-cyan-500/5',
    iconBg: 'bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    titleHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    actionColor: 'text-purple-600 dark:text-purple-400',
  },
  cyan: {
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    gradient: 'from-cyan-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5',
    iconBg: 'bg-linear-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    titleHover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    actionColor: 'text-cyan-600 dark:text-cyan-400',
  },
};

export function NavigationCard({ 
  to, 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  colorTheme,
}: NavigationCardProps) {
  const colors = colorClasses[colorTheme];

  return (
    <Link to={to} className="group">
      <div className={`relative p-5 sm:p-6 md:p-8 rounded-2xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 ${colors.hoverBorder} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}>
        {/* Decorative gradient overlay */}
        <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient} transition-all duration-500`}></div>
        
        {/* Icon */}
        <div className={`relative mb-3 md:mb-4 inline-flex p-3 md:p-4 rounded-xl ${colors.iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colors.iconColor}`} />
        </div>
        
        <h2 className={`relative text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 ${colors.titleHover} transition-colors`}>
          {title}
        </h2>
        <p className="relative text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 md:mb-4">
          {description}
        </p>
        
        <div className={`relative flex items-center gap-2 ${colors.actionColor} text-sm md:text-base font-medium group-hover:gap-3 transition-all`}>
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
    </Link>
  );
}
