import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <span
            className={`text-sm font-semibold ${
              trend.isPositive ? 'text-[#22C55E]' : 'text-[#FF6B6B]'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1" data-testid={`text-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {value}
      </h3>
      <p className="text-sm text-muted-foreground">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
