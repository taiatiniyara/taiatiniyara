interface StatItem {
  value: string | number;
  label: string;
  color?: 'blue' | 'purple' | 'cyan';
}

interface StatsDisplayProps {
  stats: StatItem[];
}

const colorClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
};

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {stats.map((stat, index) => {
        const color = stat.color || 'blue';
        return (
          <div key={index} className="text-center">
            <div className={`text-3xl font-bold ${colorClasses[color]}`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
