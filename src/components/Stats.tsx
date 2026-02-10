import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  className?: string;
}

/**
 * StatsCard - High-level KPI summary card with trend indicator
 * © 2026 Britium Express
 */
export function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        {change && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              isNegative && "bg-destructive/10 text-destructive",
              !isPositive && !isNegative && "bg-muted text-muted-foreground"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {change}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="mt-1 font-mono text-2xl font-bold tracking-tight text-foreground">
          {value}
        </h3>
      </div>

      <div className="absolute -bottom-2 -right-2 h-16 w-16 opacity-5">
        {icon}
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

/**
 * MetricCard - Specialized small-scale metric indicator for dense grids
 */
export function MetricCard({ label, value, subValue, status = 'neutral', className }: MetricCardProps) {
  const statusColors = {
    success: "bg-emerald-500",
    warning: "bg-accent",
    error: "bg-destructive",
    neutral: "bg-muted-foreground/30",
  };

  return (
    <div className={cn("rounded-lg border border-border bg-card/50 p-4", className)}>
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", statusColors[status])} />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-xl font-bold">{value}</span>
        {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
      </div>
    </div>
  );
}

interface KPIGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * KPIGrid - Responsive container for dashboard metrics
 */
export function KPIGrid({ children, columns = 4, className }: KPIGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}
