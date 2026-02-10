import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Truck, 
  Plus, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ArrowRightLeft, 
  MapPin, 
  ScanLine,
  Trash2,
  ChevronRight,
  ClipboardList,
  History,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { SHIPMENT_STATUSES, ROUTE_PATHS } from '@/lib/index';
import { useNavigate } from 'react-router-dom';

interface ParcelItem {
  id: string;
  trackingNumber: string;
  receiver: string;
  destination: string;
  weight: string;
  scannedAt: string;
}

interface Manifest {
  id: string;
  manifestCode: string;
  route: string;
  vehicle: string;
  driver: string;
  parcelCount: number;
  status: 'In Preparation' | 'Dispatched' | 'Delivered';
  createdAt: string;
}

const ParcelOutPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [scanInput, setScanInput] = useState('');
  const [scannedParcels, setScannedParcels] = useState<ParcelItem[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for routes and drivers
  const routes = [
    { id: 'rt-01', name: 'Yangon - Mandalay Express' },
    { id: 'rt-02', name: 'Yangon - Naypyidaw Main' },
    { id: 'rt-03', name: 'Mandalay - Pyin Oo Lwin Local' },
  ];

  const drivers = [
    { id: 'dr-01', name: 'U Maung Maung', vehicle: 'Hino 500 (YGN-5L/1234)' },
    { id: 'dr-02', name: 'Ko Kyaw Zay Yar', vehicle: 'Toyota Dyna (MDY-2M/5678)' },
  ];

  const activeManifests: Manifest[] = [
    {
      id: 'mn-101',
      manifestCode: 'MF-2026-02-001',
      route: 'Yangon - Mandalay Express',
      vehicle: 'Hino 500',
      driver: 'U Maung Maung',
      parcelCount: 45,
      status: 'Dispatched',
      createdAt: '2026-02-04 03:20 AM'
    },
    {
      id: 'mn-102',
      manifestCode: 'MF-2026-02-002',
      route: 'Yangon - Naypyidaw Main',
      vehicle: 'Toyota Dyna',
      driver: 'Ko Kyaw Zay Yar',
      parcelCount: 28,
      status: 'In Preparation',
      createdAt: '2026-02-04 05:10 AM'
    }
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    // Simulate adding a scanned parcel
    const newParcel: ParcelItem = {
      id: Math.random().toString(36).substr(2, 9),
      trackingNumber: scanInput.toUpperCase(),
      receiver: 'Daw Khin Khin',
      destination: 'Mandalay Main Station',
      weight: '2.5 kg',
      scannedAt: new Date().toLocaleTimeString()
    };

    setScannedParcels([newParcel, ...scannedParcels]);
    setScanInput('');
    inputRef.current?.focus();
  };

  const removeParcel = (id: string) => {
    setScannedParcels(scannedParcels.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Truck className="w-8 h-8 text-gold" />
            {t('way.parcelOut')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Dispatch parcels, generate manifests, and assign routes for outgoing shipments.'
              : 'ထွက်ခွာမည့် ပါဆယ်များအတွက် လမ်းကြောင်းသတ်မှတ်ခြင်းနှင့် မန်နီးဖက်စ် ထုတ်ယူခြင်း။'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="border-gold/30 hover:bg-gold/10 text-gold-700"
            onClick={() => navigate(ROUTE_PATHS.WAY_TRANSIT_ROUTE)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {t('way.transitRoute')}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(ROUTE_PATHS.WAY_PARCEL_IN)}
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            {t('way.parcelIn')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-navy-50/50 p-1 border border-navy-100">
          <TabsTrigger value="scan" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <ScanLine className="w-4 h-4 mr-2" />
            {t('common.add')}
          </TabsTrigger>
          <TabsTrigger value="manifests" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <ClipboardList className="w-4 h-4 mr-2" />
            {t('common.active')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scan Controls */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="lotus-card">
                <CardHeader>
                  <CardTitle className="text-gold-400">{t('warehouse.action')}</CardTitle>
                  <CardDescription className="text-navy-200/70">Configure route and dispatch details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-navy-100">{t('way.transitRoute')}</label>
                    <Select onValueChange={setSelectedRoute} value={selectedRoute}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select Route" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes.map(route => (
                          <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-navy-100">{t('deliveryman.title')}</label>
                    <Select onValueChange={setSelectedDriver} value={selectedDriver}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select Driver/Vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - {driver.vehicle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <form onSubmit={handleScan} className="space-y-2">
                      <label className="text-sm font-medium text-navy-100">{t('tracking.trackingNumber')}</label>
                      <div className="relative">
                        <Input
                          ref={inputRef}
                          placeholder="Scan tracking code..."
                          className="pl-10 bg-white border-navy-200"
                          value={scanInput}
                          onChange={(e) => setScanInput(e.target.value)}
                        />
                        <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 luxury-button">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </form>
                  </div>

                  <Button 
                    className="w-full bg-gold hover:bg-gold-600 text-navy-950 font-bold"
                    disabled={scannedParcels.length === 0 || !selectedRoute || !selectedDriver}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('reports.generateReport')} (Manifest)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-navy-50/50 border-navy-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-navy-900">Scan Summary</h3>
                    <Badge variant="secondary" className="bg-gold-100 text-gold-700 font-mono">
                      {scannedParcels.length} Items
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Weight</span>
                      <span className="font-medium">145.5 kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Volume</span>
                      <span className="font-medium">0.85 m³</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Insurance Value</span>
                      <span className="font-medium">4,500,000 MMK</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scanned Items Table */}
            <div className="lg:col-span-2">
              <Card className="border-navy-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{t('warehouse.itemsInStation')}</CardTitle>
                    <CardDescription>Recently scanned items for this dispatch batch</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setScannedParcels([])} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('common.reset')}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-navy-50">
                      <TableRow>
                        <TableHead className="w-[150px]">{t('tracking.trackingNumber')}</TableHead>
                        <TableHead>{t('order.customer')}</TableHead>
                        <TableHead>{t('tracking.location')}</TableHead>
                        <TableHead className="text-right">{t('common.time')}</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {scannedParcels.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-48 text-center">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Package className="w-12 h-12 mb-2 opacity-20" />
                                <p>No parcels scanned yet.</p>
                                <p className="text-xs">Scan tracking numbers to add to manifest.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          scannedParcels.map((parcel) => (
                            <motion.tr
                              key={parcel.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="group hover:bg-navy-50/50 transition-colors"
                            >
                              <TableCell className="font-mono font-medium text-navy-800">
                                {parcel.trackingNumber}
                              </TableCell>
                              <TableCell className="text-sm">
                                {parcel.receiver}
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gold-600" />
                                  {parcel.destination}
                                </div>
                              </TableCell>
                              <TableCell className="text-right text-xs text-muted-foreground">
                                {parcel.scannedAt}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => removeParcel(parcel.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manifests" className="mt-6">
          <Card className="border-navy-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">{t('broadcast.scheduledMessages')}</CardTitle>
                <CardDescription>Track and manage dispatched manifests</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search manifest..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('common.filter')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-navy-50">
                  <TableRow>
                    <TableHead>{t('order.orderNumber')}</TableHead>
                    <TableHead>{t('way.transitRoute')}</TableHead>
                    <TableHead>{t('deliveryman.name')}</TableHead>
                    <TableHead className="text-center">{t('common.total')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead className="text-right">{t('warehouse.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeManifests.map((manifest) => (
                    <TableRow key={manifest.id} className="hover:bg-navy-50/50">
                      <TableCell className="font-mono font-bold text-primary">
                        {manifest.manifestCode}
                      </TableCell>
                      <TableCell className="text-sm">
                        {manifest.route}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">{manifest.driver}</span>
                          <span className="text-xs text-muted-foreground">{manifest.vehicle}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gold-700">
                        {manifest.parcelCount}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={manifest.status === 'Dispatched' 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200'
                          }
                        >
                          {manifest.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {manifest.createdAt}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Printer className="w-4 h-4 text-navy-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="w-4 h-4 text-navy-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-navy-100 hover:border-gold/50 transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-navy-50 rounded-xl text-navy-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dispatched Today</p>
              <p className="text-2xl font-bold text-navy-950">128</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-navy-100 hover:border-gold/50 transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gold-50 rounded-xl text-gold-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Manifest Fill</p>
              <p className="text-2xl font-bold text-navy-950">84%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-navy-100 hover:border-gold/50 transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Routes</p>
              <p className="text-2xl font-bold text-navy-950">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-navy-100 hover:border-gold/50 transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Waiting for Load</p>
              <p className="text-2xl font-bold text-navy-950">342</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParcelOutPage;