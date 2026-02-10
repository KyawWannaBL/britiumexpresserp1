import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Scan, 
  TruckIcon, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  QrCode,
  Warehouse,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WarehouseAPI, { WarehouseUser, WarehouseStation } from '@/lib/warehouse-api';
import { ROUTE_PATHS } from '@/lib/index';

interface WarehouseStats {
  totalParcels: number;
  inbound: number;
  sorting: number;
  sorted: number;
  manifested: number;
  outbound: number;
  todayOperations: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue',
  loading = false 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <Card className={`${colorClasses[color]} border-2`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">{title}</p>
            <p className="text-3xl font-bold">
              {loading ? '...' : value.toLocaleString()}
            </p>
            {trend !== undefined && (
              <div className="flex items-center mt-2">
                {trend > 0 ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(trend)}%
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-white/50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  title, 
  description, 
  icon, 
  to, 
  color = 'bg-white' 
}) => (
  <Link to={to}>
    <Card className={`${color} hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function WarehouseDashboard() {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const [user, setUser] = useState<WarehouseUser | null>(null);
  const [station, setStation] = useState<WarehouseStation | null>(null);
  const [stats, setStats] = useState<WarehouseStats>({
    totalParcels: 0,
    inbound: 0,
    sorting: 0,
    sorted: 0,
    manifested: 0,
    outbound: 0,
    todayOperations: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get warehouse user profile
      const warehouseUser = await WarehouseAPI.getWarehouseUser();
      if (warehouseUser) {
        setUser(warehouseUser);
        
        // Get station information
        const stationData = await WarehouseAPI.getWarehouseStation(warehouseUser.station_id);
        setStation(stationData);
        
        // Get warehouse statistics
        const statsData = await WarehouseAPI.getWarehouseStats(warehouseUser.station_id);
        setStats(statsData);
      }
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading warehouse data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    loadData();
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">{t('warehouse.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              {t('warehouse.error')}
            </CardTitle>
            <CardDescription className="text-center">
              Warehouse user profile not found. Please contact administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={refreshData} 
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('warehouse.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('warehouse.hello')}, {user.full_name}
              </h1>
              <p className="text-lg text-gray-600">
                {station?.station_name || 'Warehouse'} • {user.role}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {t('common.lastUpdated')}: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Activity className="h-4 w-4 mr-1" />
                {t('common.online')}
              </Badge>
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('warehouse.refresh')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t('warehouse.totalParcels')}
            value={stats.totalParcels}
            icon={<Package className="h-6 w-6" />}
            color="blue"
            loading={loading}
          />
          <StatCard
            title={t('warehouse.inboundReceived')}
            value={stats.inbound}
            icon={<ArrowDown className="h-6 w-6" />}
            color="green"
            loading={loading}
          />
          <StatCard
            title={t('warehouse.sorting')}
            value={stats.sorting}
            icon={<Activity className="h-6 w-6" />}
            color="yellow"
            loading={loading}
          />
          <StatCard
            title={t('warehouse.todayOperations')}
            value={stats.todayOperations}
            icon={<BarChart3 className="h-6 w-6" />}
            color="purple"
            loading={loading}
          />
        </div>

        {/* Process Flow Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TruckIcon className="h-5 w-5 mr-2" />
              {t('warehouse.operations')} {t('common.status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.inbound}</div>
                <div className="text-sm text-blue-600">{t('warehouse.receiving')}</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.sorting}</div>
                <div className="text-sm text-yellow-600">{t('warehouse.sorting')}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.sorted}</div>
                <div className="text-sm text-green-600">{t('warehouse.sorted')}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.outbound}</div>
                <div className="text-sm text-purple-600">{t('warehouse.shipping')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title={t('warehouse.scanQR')}
            description="Scan QR codes for receiving, sorting, and shipping"
            icon={<QrCode className="h-6 w-6 text-primary" />}
            to={ROUTE_PATHS.WAREHOUSE_QR_SCANNER}
            color="bg-gradient-to-r from-blue-50 to-blue-100"
          />
          
          <QuickAction
            title={t('warehouse.receiving')}
            description="Scan in parcels and manage inbound operations"
            icon={<ArrowDown className="h-6 w-6 text-green-600" />}
            to={ROUTE_PATHS.WAREHOUSE_SCAN_IN}
            color="bg-gradient-to-r from-green-50 to-green-100"
          />
          
          <QuickAction
            title={t('warehouse.sorting')}
            description="Sort parcels by routes and destinations"
            icon={<Activity className="h-6 w-6 text-yellow-600" />}
            to={ROUTE_PATHS.WAREHOUSE_SORTING}
            color="bg-gradient-to-r from-yellow-50 to-yellow-100"
          />
          
          <QuickAction
            title={t('warehouse.shipping')}
            description="Scan out parcels for delivery and transfer"
            icon={<ArrowUp className="h-6 w-6 text-purple-600" />}
            to={ROUTE_PATHS.WAREHOUSE_SCAN_OUT}
            color="bg-gradient-to-r from-purple-50 to-purple-100"
          />
          
          <QuickAction
            title={t('warehouse.inventory')}
            description="View and manage warehouse inventory"
            icon={<Package className="h-6 w-6 text-indigo-600" />}
            to={ROUTE_PATHS.WAREHOUSE_INVENTORY}
            color="bg-gradient-to-r from-indigo-50 to-indigo-100"
          />
          
          <QuickAction
            title={t('warehouse.manifests')}
            description="Create and manage delivery manifests"
            icon={<TruckIcon className="h-6 w-6 text-red-600" />}
            to={ROUTE_PATHS.WAREHOUSE_MANIFESTS}
            color="bg-gradient-to-r from-red-50 to-red-100"
          />
        </div>

        {/* Station Information */}
        {station && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Warehouse className="h-5 w-5 mr-2" />
                {t('warehouse.dashboard')} {t('common.information')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('common.station')}</p>
                  <p className="text-lg font-semibold">
                    {language === 'my' ? station.station_name_my || station.station_name : station.station_name}
                  </p>
                  <p className="text-sm text-gray-600">{station.station_code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('common.zone')}</p>
                  <p className="text-lg font-semibold">{station.zone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('common.capacity')}</p>
                  <p className="text-lg font-semibold">{station.capacity?.toLocaleString() || '-'} parcels</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}