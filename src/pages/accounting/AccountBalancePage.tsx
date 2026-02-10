import React from 'react';
import { Card } from '@/components/ui/SharedComponents';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';

export default function AccountBalancePage() {
  return (
    <div className="space-y-6">
      <PageHeader titleKey="acct.accountBalance" subtitle="Compute balances from entries (scaffold)" />
      <Card className="p-4">
        <EmptyState />
      </Card>
    </div>
  );
}