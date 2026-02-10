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

export default function ReportsHome() {
  const { t } = useLanguageContext();

  return (
    <div className="space-y-6">
      <PageHeader 
        titleKey="admin.reports" 
        subtitle={t('Client-side for now. For large datasets, move aggregation to server API later.')} 
      />
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <Tile 
            to={ROUTE_PATHS.REPORTS_DELIVERYMAN} 
            title={t('reports.byDeliveryman')} 
            desc="Performance and delivery statistics by rider/deliveryman." 
          />
          <Tile 
            to={ROUTE_PATHS.REPORTS_MERCHANT} 
            title={t('reports.byMerchant')} 
            desc="Merchant performance and transaction reports." 
          />
          <Tile 
            to={ROUTE_PATHS.REPORTS_TOWN} 
            title={t('reports.byTown')} 
            desc="Regional delivery statistics and coverage analysis." 
          />
          <Tile 
            to={ROUTE_PATHS.REPORTS_AUDIT} 
            title={t('reports.auditLogs')} 
            desc="System audit trails and user activity logs." 
          />
          <Tile 
            to={ROUTE_PATHS.REPORTS_DELIVERY_WAYS} 
            title={t('reports.waysToDeliver')} 
            desc="Analyze delivery types and methods performance." 
          />
        </div>
      </Card>
    </div>
  );
}