import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Package, 
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowRight,
  MapPin,
  Truck,
  Clock,
  User
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import WarehouseAPI, { WarehouseParcel, WarehouseUser } from '@/lib/warehouse-api';
import { ROUTE_PATHS } from '@/lib/index';

const SORT_BINS = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3'];
const ROUTE_CODES = ['R001', 'R002', 'R003', 'R004', 'R005', 'R006', 'R007', 'R008'];

export default function WarehouseSorting() {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const [user, setUser] = useState<WarehouseUser | null>(null);
  const [parcels, setParcels] = useState<WarehouseParcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<WarehouseParcel[]>([]);
  const [selectedParcels, setSelectedParcels] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');
  
  // Bulk actions
  const [bulkSortBin, setBulkSortBin] = useState('A1');
  const [bulkRouteCode, setBulkRouteCode] = useState('R001');
  
  // Statistics
  const [stats, setStats] = useState({
    inbound: 0,
    sorting: 0,
    sorted: 0,
    todaySorted: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterParcels();
  }, [parcels, searchTerm, statusFilter, routeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get warehouse user
      const warehouseUser = await WarehouseAPI.getWarehouseUser();
      if (!warehouseUser) {
        throw new Error('Warehouse user not found');
      }
      setUser(warehouseUser);
      
      // Get parcels that need sorting (inbound_received and sorting status)
      const allParcels = await WarehouseAPI.getParcelsByStation(warehouseUser.station_id);
      const sortableParcels = allParcels.filter(p => 
        p.status === 'inbound_received' || p.status === 'sorting' || p.status === 'sorted'
      );
      setParcels(sortableParcels);
      
      // Calculate statistics
      const inbound = sortableParcels.filter(p => p.status === 'inbound_received').length;
      const sorting = sortableParcels.filter(p => p.status === 'sorting').length;
      const sorted = sortableParcels.filter(p => p.status === 'sorted').length;
      
      // Get today's sorted count
      const operations = await WarehouseAPI.getOperations(warehouseUser.station_id, 100);
      const today = new Date().toDateString();
      const todaySorted = operations.filter(op => 
        new Date(op.created_at).toDateString() === today && 
        op.operation_type === 'sort' &&
        op.to_status === 'sorted'
      ).length;
      
      setStats({ inbound, sorting, sorted, todaySorted });
      
    } catch (error) {
      console.error('Error loading sorting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterParcels = () => {
    let filtered = parcels;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.receiver_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Route filter
    if (routeFilter !== 'all') {
      filtered = filtered.filter(p => p.route_code === routeFilter);
    }
    
    setFilteredParcels(filtered);
  };

  const toggleParcelSelection = (parcelId: string) => {
    const newSelected = new Set(selectedParcels);
    if (newSelected.has(parcelId)) {
      newSelected.delete(parcelId);
    } else {
      newSelected.add(parcelId);
    }
    setSelectedParcels(newSelected);
  };

  const selectAllFiltered = () => {
    const allIds = new Set(filteredParcels.map(p => p.id));
    setSelectedParcels(allIds);
  };

  const clearSelection = () => {
    setSelectedParcels(new Set());
  };

  const applySorting = async () => {
    if (selectedParcels.size === 0) return;
    
    setProcessing(true);
    try {
      const promises = Array.from(selectedParcels).map(parcelId =>
        WarehouseAPI.updateParcelStatus(
          parcelId,
          'sorted',
          'sort',
          {
            sortBin: bulkSortBin,
            routeCode: bulkRouteCode,
            notes: `Sorted to bin ${bulkSortBin}, route ${bulkRouteCode}`
          }
        )
      );
      
      await Promise.all(promises);
      
      // Refresh data
      await loadData();
      clearSelection();
      
    } catch (error) {
      console.error('Error applying sorting:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inbound_received': return 'bg-blue-100 text-blue-800';
      case 'sorting': return 'bg-yellow-100 text-yellow-800';
      case 'sorted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'inbound_received': return t('warehouse.inboundReceived');
      case 'sorting': return t('warehouse.sorting');
      case 'sorted': return t('warehouse.sorted');
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">{t('warehouse.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to={ROUTE_PATHS.WAREHOUSE_DASHBOARD}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.back')}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Activity className="h-6 w-6 mr-2 text-yellow-600" />
                  {t('warehouse.sorting')} {t('warehouse.operations')}
                </h1>
                <p className="text-gray-600">
                  Sort parcels by destination routes and bins
                </p>
              </div>
            </div>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('warehouse.refresh')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">{t('warehouse.inboundReceived')}</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.inbound}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">{t('warehouse.sorting')}</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.sorting}</p>
                </div>
                <Activity className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">{t('warehouse.sorted')}</p>
                  <p className="text-3xl font-bold text-green-700">{stats.sorted}</p>
                </div>
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Today Sorted</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.todaySorted}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters and Bulk Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  {t('warehouse.filter')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('warehouse.search')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tracking, sender, receiver"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.status')}
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="inbound_received">Inbound Received</SelectItem>
                      <SelectItem value="sorting">Sorting</SelectItem>
                      <SelectItem value="sorted">Sorted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('warehouse.routeCode')}
                  </label>
                  <Select value={routeFilter} onValueChange={setRouteFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Routes</SelectItem>
                      {ROUTE_CODES.map(route => (
                        <SelectItem key={route} value={route}>{route}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Bulk Sorting</CardTitle>
                <CardDescription>
                  Apply sorting to selected parcels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('warehouse.sortBin')}
                  </label>
                  <Select value={bulkSortBin} onValueChange={setBulkSortBin}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_BINS.map(bin => (
                        <SelectItem key={bin} value={bin}>{bin}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('warehouse.routeCode')}
                  </label>
                  <Select value={bulkRouteCode} onValueChange={setBulkRouteCode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUTE_CODES.map(route => (
                        <SelectItem key={route} value={route}>{route}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={selectAllFiltered} 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    Select All
                  </Button>
                  <Button 
                    onClick={clearSelection} 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
                
                <Button 
                  onClick={applySorting}
                  disabled={selectedParcels.size === 0 || processing}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Sort {selectedParcels.size} Parcels
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Parcels List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Parcels for Sorting ({filteredParcels.length})
                  </span>
                  <Badge variant="outline">
                    {selectedParcels.size} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredParcels.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No parcels found</p>
                      <p>Try adjusting your filters or check back later</p>
                    </div>
                  ) : (
                    filteredParcels.map(parcel => (
                      <Card 
                        key={parcel.id} 
                        className={`cursor-pointer transition-all ${
                          selectedParcels.has(parcel.id) 
                            ? 'ring-2 ring-yellow-500 bg-yellow-50' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => toggleParcelSelection(parcel.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1">
                                {selectedParcels.has(parcel.id) ? (
                                  <CheckSquare className="h-5 w-5 text-yellow-600" />
                                ) : (
                                  <Square className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{parcel.tracking_number}</h3>
                                  <Badge className={getStatusColor(parcel.status)}>
                                    {getStatusText(parcel.status)}
                                  </Badge>
                                  {parcel.is_fragile && (
                                    <Badge variant="destructive">Fragile</Badge>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-gray-400" />
                                      <span><strong>From:</strong> {parcel.sender_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-gray-400" />
                                      <span><strong>To:</strong> {parcel.receiver_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Package className="h-4 w-4 text-gray-400" />
                                      <span><strong>Type:</strong> {parcel.package_type}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-4 w-4 text-gray-400" />
                                      <span><strong>Bin:</strong> {parcel.sort_bin || 'Not assigned'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Truck className="h-4 w-4 text-gray-400" />
                                      <span><strong>Route:</strong> {parcel.route_code || 'Not assigned'}</span>
                                    </div>
                                    {parcel.cod_amount > 0 && (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-orange-600 font-medium">
                                          COD: {parcel.cod_amount.toLocaleString()} MMK
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}