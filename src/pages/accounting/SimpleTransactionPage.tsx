import React from 'react';
import { Card } from '@/components/ui/SharedComponents';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';
import { useLanguageContext } from '@/lib/LanguageContext';

export default function SimpleTransactionPage() {
  const { t } = useLanguageContext();

  return (
    <div className="space-y-6">
      <PageHeader 
        titleKey="acct.simpleTransaction" 
        subtitle={t('Write revenue/expense transactions into the database.')} 
      />
      <Card className="p-4">
        <EmptyState 
          title={t('Transaction Entry')}
          description={t('Simple transaction entry interface will be implemented here.')}
        />
      </Card>
    </div>
  );
}