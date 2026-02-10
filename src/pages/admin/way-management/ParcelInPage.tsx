import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Scan,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  ArrowDownToLine,
  History,
  Filter,
  QrCode,
  X
} from 'lucide-react';
import { ROUTE_PATHS, SHIPMENT_STATUSES } from '@/lib/index';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ScannedParcel {
  id: string;
  trackingId: string;
  sender: string;
  receiver: string;
  destination: string;
  weight: string;
  scannedAt: string;
  status: 'pending' | 'received' | 'error';
}

const ParcelInPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const [scanInput, setScanInput] = useState('');
  const [scannedParcels, setScannedParcels] = useState<ScannedParcel[]>([
    {
      id: '1',
      trackingId: 'BRT-99281-2026',
      sender: 'Kyaw Kyaw Shop',
      receiver: 'Daw Hla',
      destination: 'Mandalay',
      weight: '1.5kg',
      scannedAt: '2026-02-04 09:15',
      status: 'received'
    },
    {
      id: '2',
      trackingId: 'BRT-10293-2026',
      sender: 'Global Trading',
      receiver: 'U Ba',
      destination: 'Yangon',
      weight: '0.8kg',
      scannedAt: '2026-02-04 09:12',
      status: 'received'
    }
  ]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const newParcel: ScannedParcel = {
      id: Math.random().toString(36).substr(2, 9),
      trackingId: scanInput.toUpperCase(),
      sender: 'Pending Look-up...',
      receiver: 'Pending Look-up...',
      destination: 'TBD',
      weight: '---',
      scannedAt: new Date().toLocaleString(),
      status: 'pending'
    };

    setScannedParcels([newParcel, ...scannedParcels]);
    setScanInput('');

    // Simulate API delay for status update
    setTimeout(() => {
      setScannedParcels(prev => 
        prev.map(p => p.id === newParcel.id 
          ? { ...p, status: 'received', sender: 'Auto-Merchant', receiver: 'John Doe', destination: 'Taunggyi', weight: '2.0kg' } 
          : p
        )
      );
    }, 1500);
  };

  const stats = useMemo(() => ({
    totalInbound: scannedParcels.length,
    pendingConfirm: scannedParcels.filter(p => p.status === 'pending').length,
    receivedToday: 142,
  }), [scannedParcels]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 flex items-center gap-2">
            <ArrowDownToLine className="h-8 w-8 text-gold-500" />
            {t('way.parcelIn')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Process incoming shipments and update warehouse inventory.' 
              : 'ဝင်ရောက်လာသော ပစ္စည်းများကို စစ်ဆေးပြီး ကုန်ပစ္စည်းစာရင်းကို အပ်ဒိတ်လုပ်ပါ။'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gold-400/50 text-navy-900">
            <History className="mr-2 h-4 w-4" />
            {t('broadcast.messageHistory')}
          </Button>
          <Button className="luxury-button">
            <QrCode className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Bulk Manifest In' : 'မန်နီဖက်စ်အများအပြားသွင်းရန်'}
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="lotus-card border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gold-400/80 uppercase tracking-wider">{t('common.total')}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.receivedToday}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-gold-400" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gold-300 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              +12 {language === 'en' ? 'from last hour' : 'နောက်ဆုံးတစ်နာရီအတွင်း'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('common.pending')}</p>
                <h3 className="text-3xl font-bold text-navy-900 mt-1">{stats.pendingConfirm}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-navy-600" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {language === 'en' ? 'Awaiting automated processing' : 'အလိုအလျောက်လုပ်ဆောင်မှုကို စောင့်ဆိုင်းနေသည်'}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('warehouse.itemsInStation')}</p>
                <h3 className="text-3xl font-bold text-navy-900 mt-1">1,204</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center">
                <Filter className="h-6 w-6 text-navy-600" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {language === 'en' ? 'Current warehouse capacity: 84%' : 'လက်ရှိကုန်လှောင်ရုံဆံ့မှု - ၈၄%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scanning Input */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-gold-500/20 shadow-lg">
            <CardHeader className="royal-navy rounded-t-lg">
              <CardTitle className="text-gold-400 flex items-center gap-2">
                <Scan className="h-5 w-5" />
                {language === 'en' ? 'Scanner Input' : 'စကင်နာ ထည့်သွင်းရန်'}
              </CardTitle>
              <CardDescription className="text-gold-200/60">
                {language === 'en' ? 'Scan barcode or enter tracking ID manually' : 'ဘားကုဒ်ဖတ်ပါ သို့မဟုတ် ခြေရာခံနံပါတ်ရိုက်ထည့်ပါ'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleScan} className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder={t('tracking.trackingNumber')}
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    className="pl-10 h-12 text-lg font-mono border-navy-200 focus:border-gold-500 focus:ring-gold-500/20"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
                <Button type="submit" className="w-full luxury-button h-12">
                  {t('common.confirm')}
                </Button>
                <div className="pt-4 border-t border-navy-100">
                  <p className="text-xs text-muted-foreground mb-2">{language === 'en' ? 'Recent Scans Status' : 'လတ်တလောစကင်ဖတ်ထားသောအခြေအနေ'}</p>
                  <div className="space-y-2">
                    {scannedParcels.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-sm bg-navy-50 p-2 rounded">
                        <span className="font-mono font-medium">{p.trackingId}</span>
                        <Badge variant={p.status === 'received' ? 'default' : 'outline'} className={p.status === 'received' ? 'bg-success text-white' : ''}>
                          {p.status === 'received' ? t('common.completed') : t('common.pending')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-gold-50 border-gold-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-gold-600 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-gold-900">{language === 'en' ? 'Pro-Tip' : 'အကြံပြုချက်'}</p>
                  <p className="text-gold-700">
                    {language === 'en' 
                      ? 'Ensure labels are flat and clean for faster barcode recognition.' 
                      : 'မြန်ဆန်စွာစကင်ဖတ်နိုင်ရန် လေဘယ်များ ပြန့်ပြူးပြီး သန့်ရှင်းနေပါစေ။'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Scanned List Table */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle>{language === 'en' ? 'Scanned Inbound Log' : 'စကင်ဖတ်ထားသော မှတ်တမ်း'}</CardTitle>
                <CardDescription>{t('common.date')}: 2026-02-04</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setScannedParcels([])}>
                  {t('common.reset')}
                </Button>
                <Button variant="outline" size="sm">
                  {t('common.export')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-[500px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="bg-navy-50/50 hover:bg-navy-50/50">
                      <TableHead className="w-[180px]">{t('tracking.trackingNumber')}</TableHead>
                      <TableHead>{t('order.merchant')}</TableHead>
                      <TableHead>{language === 'en' ? 'Destination' : 'ဦးတည်ရာ'}</TableHead>
                      <TableHead>{t('warehouse.status')}</TableHead>
                      <TableHead className="text-right">{t('common.action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode='popLayout'>
                      {scannedParcels.map((parcel) => (
                        <motion.tr
                          key={parcel.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="group transition-colors hover:bg-gold-50/30"
                        >
                          <TableCell className="font-mono font-medium text-navy-700">
                            {parcel.trackingId}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{parcel.sender}</div>
                            <div className="text-xs text-muted-foreground">{parcel.scannedAt}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">{parcel.destination}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={parcel.status === 'received' ? 'default' : 'secondary'}
                              className={parcel.status === 'received' ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' : ''}
                            >
                              {parcel.status === 'received' ? t('tracking.delivered') : t('common.pending')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-gold-600">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {scannedParcels.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-[400px] text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="h-20 w-20 rounded-full bg-navy-50 flex items-center justify-center">
                              <Scan className="h-10 w-10 text-navy-200 animate-pulse" />
                            </div>
                            <p className="text-muted-foreground font-medium">
                              {language === 'en' ? 'Ready for scanning...' : 'စကင်ဖတ်ရန် အဆင်သင့်ဖြစ်နေပါသည်...'}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inventory Location Mapping (Optional Visual) */}
      <Card className="border-navy-100">
        <CardHeader>
          <CardTitle className="text-lg">{language === 'en' ? 'Warehouse Allocation Preview' : 'ကုန်လှောင်ရုံ နေရာချထားမှု အစမ်းကြည့်ရှုခြင်း'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded border flex items-center justify-center text-[10px] font-bold transition-all ${ 
                  i % 3 === 0 ? 'bg-gold-500/10 border-gold-500/30 text-gold-700' : 'bg-navy-50 border-navy-100 text-navy-300'
                }`}
              >
                {String.fromCharCode(65 + Math.floor(i/4))}-{i%4 + 1}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-gold-500/20 border border-gold-500/30"></div>
              <span>{language === 'en' ? 'Incoming Load' : 'အသစ်ဝင်လာသော ဝန်'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-navy-50 border border-navy-100"></div>
              <span>{language === 'en' ? 'Available Space' : 'နေရာလွတ်'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParcelInPage;