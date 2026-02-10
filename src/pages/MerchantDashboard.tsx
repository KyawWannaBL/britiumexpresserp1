import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  DollarSign, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardStat } from '@/components/ui/SharedComponents';
import { useLanguageContext } from '@/lib/LanguageContext';
import { ROUTE_PATHS } from '@/lib/index';

interface Shipment {
  id: string;
  trackingNumber: string;
  recipient: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  amount: number;
  createdAt: string;
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'BE-2024-001',
    recipient: 'Mg Mg',
    destination: 'Yangon',
    status: 'delivered',
    amount: 25000,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    trackingNumber: 'BE-2024-002',
    recipient: 'Ma Ma',
    destination: 'Mandalay',
    status: 'in_transit',
    amount: 35000,
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    trackingNumber: 'BE-2024-003',
    recipient: 'Ko Ko',
    destination: 'Naypyidaw',
    status: 'pending',
    amount: 15000,
    createdAt: '2024-01-17'
  }
];

export default function MerchantDashboardPage() {
  const { t } = useLanguageContext();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: Shipment['status']) => {
    const statusConfig = {
      pending: { label: t('interface.pending'), variant: 'secondary' as const },
      in_transit: { label: t('interface.inTransit'), variant: 'default' as const },
      delivered: { label: t('interface.delivered'), variant: 'outline' as const },
      failed: { label: t('interface.failed'), variant: 'destructive' as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredShipments = mockShipments.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{t('merchant.portal')}</h1>
          <p className="text-sm text-gray-500">{t('merchant.trackShipments')}</p>
        </div>
        <Button className="bg-gold hover:bg-gold/90 text-navy-900 font-semibold">
          <Plus className="mr-2 h-4 w-4" /> {t('merchant.newOrder')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DashboardStat 
          icon={Package} 
          label={t('interface.pending')} 
          value="12" 
          color="blue" 
        />
        <DashboardStat 
          icon={Truck} 
          label={t('interface.inTransit')} 
          value="5" 
          color="orange" 
        />
        <DashboardStat 
          icon={CheckCircle2} 
          label={t('interface.delivered')} 
          value="142" 
          color="green" 
        />
        <DashboardStat 
          icon={DollarSign} 
          label={t('merchant.codBalance')} 
          value="450,000 MMK" 
          color="red" 
        />
      </div>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {t('Recent Shipments')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('form.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('common.filter')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {t('Tracking Number')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {t('interface.recipient')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {t('Destination')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {t('interface.status')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {t('interface.amount')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {t('common.date')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {t('interface.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link 
                        to={`${ROUTE_PATHS.PUBLIC_TRACKING}?tracking=${shipment.trackingNumber}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {shipment.trackingNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{shipment.recipient}</td>
                    <td className="py-3 px-4">{shipment.destination}</td>
                    <td className="py-3 px-4">{getStatusBadge(shipment.status)}</td>
                    <td className="py-3 px-4 font-medium">
                      {shipment.amount.toLocaleString()} MMK
                    </td>
                    <td className="py-3 px-4 text-gray-500">{shipment.createdAt}</td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('interface.viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            {t('Download Invoice')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}