import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Camera, 
  Scan, 
  Package, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  RefreshCw,
  Flashlight,
  FlashlightOff,
  History,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import WarehouseAPI, { WarehouseParcel, WarehouseManifest } from '@/lib/warehouse-api';
import { ROUTE_PATHS } from '@/lib/index';

interface ScanResult {
  id: string;
  qrCode: string;
  success: boolean;
  message: string;
  data?: WarehouseParcel | WarehouseManifest;
  type?: 'parcel' | 'manifest';
  timestamp: Date;
}

export default function QRScanner() {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setFlashlightOn(false);
  };

  // Toggle flashlight
  const toggleFlashlight = async () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && 'torch' in videoTrack.getCapabilities()) {
        try {
          await videoTrack.applyConstraints({
            advanced: [{ torch: !flashlightOn } as any]
          });
          setFlashlightOn(!flashlightOn);
        } catch (err) {
          console.error('Flashlight not supported:', err);
        }
      }
    }
  };

  // Process scanned QR code
  const processQRCode = async (qrCode: string, method: 'camera' | 'manual' = 'manual') => {
    if (!qrCode.trim()) return;
    
    setScanning(true);
    setError(null);
    
    try {
      const result = await WarehouseAPI.scanQRCode(qrCode.trim());
      
      const scanResult: ScanResult = {
        id: Date.now().toString(),
        qrCode: qrCode.trim(),
        success: result.success,
        message: result.message || (result.success ? t('warehouse.scanSuccess') : t('warehouse.scanFailed')),
        data: result.data,
        type: result.type as 'parcel' | 'manifest',
        timestamp: new Date()
      };
      
      setScanResults(prev => [scanResult, ...prev.slice(0, 9)]); // Keep last 10 results
      setCurrentScan(scanResult);
      
      if (method === 'manual') {
        setManualCode('');
      }
      
      // Auto-clear current scan after 5 seconds
      setTimeout(() => setCurrentScan(null), 5000);
      
    } catch (error) {
      console.error('Error processing QR code:', error);
      const errorResult: ScanResult = {
        id: Date.now().toString(),
        qrCode: qrCode.trim(),
        success: false,
        message: t('warehouse.scanFailed'),
        timestamp: new Date()
      };
      setScanResults(prev => [errorResult, ...prev.slice(0, 9)]);
      setCurrentScan(errorResult);
    } finally {
      setScanning(false);
    }
  };

  // Handle manual scan
  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    processQRCode(manualCode, 'manual');
  };

  // Simulate QR code detection (in real app, use a QR code library like jsQR)
  const simulateQRDetection = () => {
    // This is a placeholder - in a real implementation, you would use a library like jsQR
    // to detect QR codes from the video stream
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Here you would use jsQR or similar library to detect QR codes
        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // const code = jsQR(imageData.data, imageData.width, imageData.height);
        // if (code) {
        //   processQRCode(code.data, 'camera');
        // }
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cameraActive) {
      interval = setInterval(simulateQRDetection, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const renderScanResult = (result: ScanResult) => {
    const isParcel = result.type === 'parcel';
    const data = result.data as WarehouseParcel | WarehouseManifest;
    
    return (
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
                <p className="font-medium">{result.qrCode}</p>
                <p className="text-sm text-gray-600">{result.message}</p>
                {result.success && data && (
                  <div className="mt-2 text-sm">
                    {isParcel ? (
                      <div>
                        <p><strong>{t('common.tracking')}:</strong> {(data as WarehouseParcel).tracking_number}</p>
                        <p><strong>{t('common.status')}:</strong> {(data as WarehouseParcel).status}</p>
                        <p><strong>{t('common.receiver')}:</strong> {(data as WarehouseParcel).receiver_name}</p>
                      </div>
                    ) : (
                      <div>
                        <p><strong>{t('warehouse.manifestNumber')}:</strong> {(data as WarehouseManifest).manifest_number}</p>
                        <p><strong>{t('common.type')}:</strong> {(data as WarehouseManifest).manifest_type}</p>
                        <p><strong>{t('warehouse.totalParcels')}:</strong> {(data as WarehouseManifest).total_parcels}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <Badge variant={result.success ? 'default' : 'destructive'}>
                {result.type || 'unknown'}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                {result.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('warehouse.scanQR')}
                </h1>
                <p className="text-gray-600">
                  Scan QR codes for parcels and manifests
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Scan Result */}
        {currentScan && (
          <div className="mb-6">
            <Alert className={currentScan.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {currentScan.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className="font-medium">
                {currentScan.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                {t('warehouse.scanQR')} - Camera
              </CardTitle>
              <CardDescription>
                Use your device camera to scan QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!cameraActive ? (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Camera not active</p>
                      <Button onClick={startCamera}>
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full aspect-video bg-black rounded-lg"
                    />
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                    />
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-white rounded-lg shadow-lg">
                        <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {cameraActive && (
                  <div className="flex justify-center space-x-2">
                    <Button onClick={toggleFlashlight} variant="outline" size="sm">
                      {flashlightOn ? (
                        <FlashlightOff className="h-4 w-4 mr-2" />
                      ) : (
                        <Flashlight className="h-4 w-4 mr-2" />
                      )}
                      {flashlightOn ? 'Flash Off' : 'Flash On'}
                    </Button>
                    <Button onClick={stopCamera} variant="outline" size="sm">
                      Stop Camera
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                {t('warehouse.manualEntry')}
              </CardTitle>
              <CardDescription>
                Enter QR code or tracking number manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualScan} className="space-y-4">
                <div>
                  <Input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter QR code or tracking number"
                    className="text-lg"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={scanning || !manualCode.trim()}
                >
                  {scanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('warehouse.scanning')}...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      {t('warehouse.scan')}
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link to={ROUTE_PATHS.WAREHOUSE_SCAN_IN}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      Scan In
                    </Button>
                  </Link>
                  <Link to={ROUTE_PATHS.WAREHOUSE_SCAN_OUT}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      Scan Out
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan History */}
        {scanResults.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                {t('common.recent')} {t('warehouse.scan')} {t('common.results')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanResults.map(renderScanResult)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}