import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowDown, 
  Package, 
  Scan, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  RefreshCw,
  QrCode,
  Clock,
  User,
  MapPin
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import WarehouseAPI, { WarehouseParcel, WarehouseUser } from '@/lib/warehouse-api';
import { ROUTE_PATHS } from '@/lib/index';

interface ScanInResult {
  id: string;
  trackingNumber: string;
  success: boolean;
  message: string;
  parcel?: WarehouseParcel;
  timestamp: Date;
}

export default function WarehouseScanIn() {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const [user, setUser] = useState<WarehouseUser | null>(null);
  const [trackingCode, setTrackingCode] = useState('');
  const [scanLocation, setScanLocation] = useState('receiving_dock');
  const [notes, setNotes] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanInResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [todayStats, setTodayStats] = useState({
    scannedIn: 0,
    successful: 0,
    failed: 0
  });

  useEffect(() => {
    loadUserData();
    loadTodayStats();
  }, []);

  const loadUserData = async () => {
    try {
      const warehouseUser = await WarehouseAPI.getWarehouseUser();
      setUser(warehouseUser);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadTodayStats = async () => {
    if (!user?.station_id) return;
    
    try {
      const operations = await WarehouseAPI.getOperations(user.station_id, 100);
      const today = new Date().toDateString();
      const todayOperations = operations.filter(op => 
        new Date(op.created_at).toDateString() === today && 
        op.operation_type === 'scan_in'
      );
      
      setTodayStats({
        scannedIn: todayOperations.length,
        successful: todayOperations.filter(op => op.to_status === 'inbound_received').length,
        failed: todayOperations.filter(op => op.to_status !== 'inbound_received').length
      });
    } catch (error) {
      console.error('Error loading today stats:', error);
    }
  };

  const handleScanIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim() || !user) return;

    setScanning(true);
    setError(null);

    try {
      // First, scan the QR code to get parcel data
      const scanResult = await WarehouseAPI.scanQRCode(trackingCode.trim());
      
      if (!scanResult.success || scanResult.type !== 'parcel') {
        throw new Error(scanResult.message || 'Invalid parcel QR code');
      }

      const parcel = scanResult.data as WarehouseParcel;
      
      // Update parcel status to inbound_received
      const updateSuccess = await WarehouseAPI.updateParcelStatus(
        parcel.id,
        'inbound_received',
        'scan_in',
        {
          scanMethod: 'manual_entry',
          scanLocation,
          notes: notes.trim() || undefined,
          qrCodeScanned: trackingCode.trim()
        }
      );

      const result: ScanInResult = {
        id: Date.now().toString(),
        trackingNumber: parcel.tracking_number,
        success: updateSuccess,
        message: updateSuccess 
          ? `${t('warehouse.scanSuccess')} - ${parcel.tracking_number}` 
          : t('warehouse.scanFailed'),
        parcel: updateSuccess ? parcel : undefined,
        timestamp: new Date()
      };

      setScanResults(prev => [result, ...prev.slice(0, 9)]);
      
      if (updateSuccess) {
        setTrackingCode('');
        setNotes('');
        loadTodayStats(); // Refresh stats
      }

    } catch (error: any) {
      console.error('Error scanning in parcel:', error);
      
      const errorResult: ScanInResult = {
        id: Date.now().toString(),
        trackingNumber: trackingCode.trim(),
        success: false,
        message: error.message || t('warehouse.scanFailed'),
        timestamp: new Date()
      };
      
      setScanResults(prev => [errorResult, ...prev.slice(0, 9)]);
      setError(error.message || 'Failed to scan in parcel');
    } finally {
      setScanning(false);
    }
  };

  const renderScanResult = (result: ScanInResult) => (
    <Card key={result.id} className={`${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium">{result.trackingNumber}</p>
              <p className="text-sm text-gray-600">{result.message}</p>
              {result.success && result.parcel && (
                <div className="mt-2 text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span><strong>{t('common.sender')}:</strong> {result.parcel.sender_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span><strong>{t('common.receiver')}:</strong> {result.parcel.receiver_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span><strong>{t('common.type')}:</strong> {result.parcel.package_type}</span>
                  </div>
                  {result.parcel.cod_amount > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600 font-medium">COD: {result.parcel.cod_amount.toLocaleString()} MMK</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <Badge variant={result.success ? 'default' : 'destructive'}>
              {result.success ? t('warehouse.received') : t('warehouse.failed')}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">
              {result.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <ArrowDown className="h-6 w-6 mr-2 text-green-600" />
                  {t('warehouse.scanIn')} - {t('warehouse.receiving')}
                </h1>
                <p className="text-gray-600">
                  Scan parcels into warehouse inventory
                </p>
              </div>
            </div>
            <Link to={ROUTE_PATHS.WAREHOUSE_QR_SCANNER}>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Scanner
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">{t('warehouse.todayOperations')}</p>
                  <p className="text-3xl font-bold text-blue-700">{todayStats.scannedIn}</p>
                </div>
                <ArrowDown className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">{t('warehouse.success')}</p>
                  <p className="text-3xl font-bold text-green-700">{todayStats.successful}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">{t('warehouse.failed')}</p>
                  <p className="text-3xl font-bold text-red-700">{todayStats.failed}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scan In Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scan className="h-5 w-5 mr-2" />
                {t('warehouse.scanIn')} {t('warehouse.parcel')}
              </CardTitle>
              <CardDescription>
                Scan or enter tracking number to receive parcel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScanIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.tracking')} {t('common.number')} / QR Code
                  </label>
                  <Input
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Scan or enter tracking number"
                    className="text-lg"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('warehouse.scanLocation')}
                  </label>
                  <Select value={scanLocation} onValueChange={setScanLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receiving_dock">Receiving Dock</SelectItem>
                      <SelectItem value="main_entrance">Main Entrance</SelectItem>
                      <SelectItem value="sorting_area">Sorting Area</SelectItem>
                      <SelectItem value="storage_area">Storage Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.notes')} ({t('common.optional')})
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about the parcel condition or special instructions"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={scanning || !trackingCode.trim()}
                >
                  {scanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('warehouse.scanning')}...
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 mr-2" />
                      {t('warehouse.scanIn')}
                    </>
                  )}
                </Button>
              </form>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Scan the QR code on the parcel label</li>
                  <li>• Verify parcel condition before scanning</li>
                  <li>• Add notes for damaged or special parcels</li>
                  <li>• Ensure correct scan location is selected</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {t('common.recent')} {t('warehouse.scanIn')} {t('common.results')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scans yet today</p>
                    <p className="text-sm">Start scanning parcels to see results here</p>
                  </div>
                ) : (
                  scanResults.map(renderScanResult)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Flow Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Receiving Process Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <ArrowDown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-900">1. Receive</h4>
                <p className="text-sm text-blue-700">Scan parcel QR code</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Package className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h4 className="font-medium text-yellow-900">2. Inspect</h4>
                <p className="text-sm text-yellow-700">Check parcel condition</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-purple-900">3. Stage</h4>
                <p className="text-sm text-purple-700">Move to sorting area</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-900">4. Complete</h4>
                <p className="text-sm text-green-700">Ready for sorting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}