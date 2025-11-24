import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  href,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <div className="stat-card group">
      {/* Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-violet-500/10 rounded-lg">
          <Icon className="w-5 h-5 text-violet-500" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>

      {/* Value */}
      <p className="text-3xl font-bold text-white mb-2">{value}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-gray-500 mb-4">{subtitle}</p>
      )}

      {/* Link */}
      {href && (
        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
        >
          View All
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
