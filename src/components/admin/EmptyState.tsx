import React from 'react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ 
  title, 
  description,
  action,
  className 
}: EmptyStateProps) {
  const { t } = useLanguageContext();
  
  const displayTitle = title || t('common.loading');
  const displayDescription = description || t('This feature is under development.');
  
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{displayTitle}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">{displayDescription}</p>
      {action && action}
    </div>
  );
}