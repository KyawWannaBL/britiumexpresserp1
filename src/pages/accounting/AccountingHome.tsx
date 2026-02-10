import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/SharedComponents';
import PageHeader from '@/components/admin/PageHeader';
import { useLanguageContext } from '@/lib/LanguageContext';
import { ROUTE_PATHS } from '@/lib/index';

interface TileProps {
  to: string;
  title: string;
  desc: string;
}

function Tile({ to, title, desc }: TileProps) {
  return (
    <Link 
      to={to} 
      className="block rounded-2xl border bg-white p-4 shadow-sm hover:bg-slate-50 transition hover:shadow-md"
    >
      <div className="font-extrabold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </Link>
  );
}

export default function AccountingHome() {
  const { t } = useLanguageContext();

  return (
    <div className="space-y-6">
      <PageHeader 
        titleKey="admin.accounting" 
        subtitle={t('Client-side for now. For large data, move KPI/ledger aggregation to your private server and call via API.')} 
      />
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_TRANSACTIONS} 
            title={t('acct.simpleTransaction')} 
            desc="Write revenue/expense into database financials collection." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_JOURNAL} 
            title={t('acct.journalVoucher') + ' Entry'} 
            desc="Scaffold (to be implemented) for double-entry vouchers." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_JOURNAL_LIST} 
            title={t('acct.journalVoucher') + ' List'} 
            desc="Scaffold list + export." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_CASH} 
            title={t('acct.cashVoucher') + ' Entry'} 
            desc="Scaffold entry." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_CASH_LIST} 
            title={t('acct.cashVoucher') + ' List'} 
            desc="Scaffold list." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_CHART} 
            title={t('acct.chartOfAccounts')} 
            desc="Scaffold CRUD for accounts." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_BALANCE} 
            title={t('acct.accountBalance')} 
            desc="Compute balances from entries (scaffold)." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_BANKS} 
            title={t('acct.bankList')} 
            desc="Manage banks collection (scaffold)." 
          />
          <Tile 
            to={ROUTE_PATHS.ACCOUNTING_BRANCH} 
            title={t('acct.branchAccounting')} 
            desc="Branch accounting snapshots (scaffold)." 
          />
        </div>
      </Card>
    </div>
  );
}