import React from 'react';
import { Card as ShadcnCard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// Re-export shadcn components with consistent naming
export const Card = ShadcnCard;
export const CardBody = CardContent;
export const Button = ShadcnButton;
export const Badge = ShadcnBadge;

// Enhanced Card Header component
interface EnhancedCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EnhancedCardHeader({ title, subtitle, action, className }: EnhancedCardHeaderProps) {
  return (
    <CardHeader className={cn('flex flex-row items-center justify-between space-y-0 pb-2', className)}>
      <div className="space-y-1">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center space-x-2">{action}</div>}
    </CardHeader>
  );
}

// Stat Card component for dashboards
interface StatCardProps {
  title: string;
  value: string | number;
  hint?: string;
  tone?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, hint, tone = 'blue', icon: Icon, className }: StatCardProps) {
  const toneClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-900',
    green: 'border-green-200 bg-green-50 text-green-900',
    orange: 'border-orange-200 bg-orange-50 text-orange-900',
    red: 'border-red-200 bg-red-50 text-red-900',
    purple: 'border-purple-200 bg-purple-50 text-purple-900',
  };

  const iconClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };

  return (
    <Card className={cn('border-l-4', toneClasses[tone], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          {Icon && <Icon className={cn('h-8 w-8', iconClasses[tone])} />}
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard Stat component (alternative design)
interface DashboardStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: 'blue' | 'orange' | 'green' | 'red';
  className?: string;
}

export function DashboardStat({ icon: Icon, label, value, color, className }: DashboardStatProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className={cn('p-4', colorClasses[color])}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="p-4 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Data Table component
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({ data, columns, className }: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn('text-left p-3 font-medium text-muted-foreground', column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-border hover:bg-muted/50">
              {columns.map((column) => (
                <td key={String(column.key)} className={cn('p-3', column.className)}>
                  {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Empty State component
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title = 'No data available', 
  description = 'This feature is under development.',
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && action}
    </div>
  );
}

// Page Header component
interface PageHeaderProps {
  titleKey?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ titleKey, title, subtitle, action, className }: PageHeaderProps) {
  const displayTitle = title || titleKey || 'Page Title';
  
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{displayTitle}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center space-x-2">{action}</div>}
    </div>
  );
}

export default {
  Card,
  CardBody,
  CardHeader: EnhancedCardHeader,
  Button,
  Badge,
  StatCard,
  DashboardStat,
  DataTable,
  EmptyState,
  PageHeader,
};