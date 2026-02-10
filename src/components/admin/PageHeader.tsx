import React from 'react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  titleKey?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ titleKey, title, subtitle, action, className }: PageHeaderProps) {
  const { t } = useLanguageContext();
  
  const displayTitle = titleKey ? t(titleKey) : (title || 'Page Title');
  
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{displayTitle}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center space-x-2">{action}</div>}
    </div>
  );
}