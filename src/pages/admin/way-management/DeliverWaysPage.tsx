import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Eye, 
  Edit2, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Download
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';
import { deliveryWaysAPI, type DeliveryWay } from '@/lib/api';
// Mock Data for Delivery Ways
const MOCK_DELIVERY_WAYS = [
  {
    id: "WAY-2026-001",
    trackingId: "BR-9921882",
    merchant: "Global Electronics",
    recipient: "U Kyaw Zay Yar",
    destination: "Yangon, Hlaing Tsp",
    status: "in_transit",
    driver: "Ko Aung Gyi",
    scheduledDate: "2026-02-04",
    priority: "high",
    cod: "45,000 MMK"
  },
  {
    id: "WAY-2026-002",
    trackingId: "BR-9921883",
    merchant: "Lotus Fashion",
    recipient: "Daw Hla Hla",
    destination: "Mandalay, Chan Aye Thar San",
    status: "pending",
    driver: "Ko Min Min",
    scheduledDate: "2026-02-04",
    priority: "normal",
    cod: "12,500 MMK"
  },
  {
    id: "WAY-2026-003",
    trackingId: "BR-9921884",
    merchant: "K-Mart Mart",
    recipient: "Mg Zaw Win",
    destination: "Naypyidaw, Zabuthiri",
    status: "out_for_delivery",
    driver: "Ko Tun Tun",
    scheduledDate: "2026-02-04",
    priority: "urgent",
    cod: "89,000 MMK"
  },
  {
    id: "WAY-2026-004",
    trackingId: "BR-9921885",
    merchant: "Tech City",
    recipient: "Ma Phyu Phyu",
    destination: "Taunggyi, Southern Shan",
    status: "delivered",
    driver: "Ko Soe Lin",
    scheduledDate: "2026-02-03",
    priority: "normal",
    cod: "0 MMK"
  },
  {
    id: "WAY-2026-005",
    trackingId: "BR-9921886",
    merchant: "Beauty Secret",
    recipient: "Daw Khin Swe",
    destination: "Bago, Town Center",
    status: "failed",
    driver: "Ko Kyaw",
    scheduledDate: "2026-02-04",
    priority: "normal",
    cod: "23,000 MMK"
  }
];

const DeliverWaysPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryWays, setDeliveryWays] = useState<DeliveryWay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load delivery ways data
  useEffect(() => {
    const loadDeliveryWays = async () => {
      try {
        setLoading(true);
        const response = await deliveryWaysAPI.list();
        if (response.success && response.data) {
          setDeliveryWays(response.data);
        } else {
          setError(response.error || 'Failed to load delivery ways');
        }
      } catch (err) {
        setError('Failed to load delivery ways');
        console.error('Error loading delivery ways:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDeliveryWays();
  }, []);

  // Filter delivery ways based on search query
  const filteredDeliveryWays = deliveryWays.filter(way =>
    way.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    way.pickup_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    way.delivery_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (way.rider_name && way.rider_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-success/10 text-success border-success/20">{t('tracking.delivered')}</Badge>;
      case 'in_transit':
        return <Badge className="bg-info/10 text-info border-info/20">{t('tracking.inTransit')}</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-gold-500/10 text-gold-600 border-gold-500/20">{t('tracking.outForDelivery')}</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">{t('common.pending')}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{t('tracking.failed')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 bg-background">
      {/* Header Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            {t('way.deliverWays')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? "Manage active delivery routes and track real-time shipment status."
              : "လက်ရှိ ပို့ဆောင်မှု လမ်းကြောင်းများနှင့် အချိန်နှင့်တပြေးညီ အခြေအနေများကို စီမံခန့်ခွဲပါ။"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-400/50 text-gold-600 hover:bg-gold-50">
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button className="luxury-button">
            <Truck className="mr-2 h-4 w-4" />
            {t('way.createDeliveryPickup')}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={staggerItem}>
          <Card className="lotus-card border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gold-200/80 uppercase tracking-wider">{t('dashboard.totalOrders')}</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{deliveryWays.length.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-gold-500/20 rounded-xl">
                  <Truck className="h-6 w-6 text-gold-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gold-300/60">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                <span>+12% from yesterday</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="glass-card border-navy-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('dashboard.pendingDeliveries')}</p>
                  <h3 className="text-3xl font-bold text-navy-900 mt-1">{deliveryWays.filter(w => w.status === 'pending').length}</h3>
                </div>
                <div className="p-3 bg-warning/10 rounded-xl">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-warning">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>8 urgent deliveries</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="glass-card border-navy-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('tracking.inTransit')}</p>
                  <h3 className="text-3xl font-bold text-navy-900 mt-1">{deliveryWays.filter(w => w.status === 'in_transit').length}</h3>
                </div>
                <div className="p-3 bg-info/10 rounded-xl">
                  <MapPin className="h-6 w-6 text-info" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-info">
                <Truck className="h-3 w-3 mr-1" />
                <span>12 trucks active</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="glass-card border-navy-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('dashboard.completedDeliveries')}</p>
                  <h3 className="text-3xl font-bold text-navy-900 mt-1">{deliveryWays.filter(w => w.status === 'delivered').length}</h3>
                </div>
                <div className="p-3 bg-success/10 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                <span>{deliveryWays.length > 0 ? ((deliveryWays.filter(w => w.status === 'delivered').length / deliveryWays.length) * 100).toFixed(1) : 0}% success rate</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Table Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp}
        className="space-y-4"
      >
        <Card className="glass-card overflow-hidden border-navy-100">
          <CardHeader className="pb-3 border-b border-navy-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Truck className="mr-2 h-5 w-5 text-gold-500" />
                {t('way.management')}
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t('common.search') + "..."}
                    className="pl-10 bg-muted/30 border-navy-100 focus:border-gold-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  {t('common.filter')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-navy-50/50">
                  <TableRow>
                    <TableHead className="w-[150px]">{t('tracking.trackingNumber')}</TableHead>
                    <TableHead>{t('merchant.title')}</TableHead>
                    <TableHead>{t('order.customer')}</TableHead>
                    <TableHead>{t('tracking.location')}</TableHead>
                    <TableHead>{t('deliveryman.name')}</TableHead>
                    <TableHead>{t('tracking.status')}</TableHead>
                    <TableHead className="text-right">{t('common.total')}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
                          <span className="ml-2">{t('common.loading')}...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-destructive">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>{error}</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredDeliveryWays.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? t('common.noSearchResults') : t('common.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDeliveryWays.map((way) => (
                      <TableRow key={way.id} className="hover:bg-navy-50/30 transition-colors">
                        <TableCell className="font-mono font-medium text-navy-900">
                          {way.tracking_number}
                        </TableCell>
                        <TableCell className="font-medium">
                          {way.pickup_address.split(',')[0] || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{way.delivery_address.split(',')[0] || 'Customer'}</span>
                            <span className="text-xs text-muted-foreground">Delivery Address</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-gold-500" />
                            {way.delivery_address}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs">
                              {way.rider_name ? way.rider_name.split(' ').map(n => n[0]).join('') : 'N/A'}
                            </div>
                            <span className="text-sm">{way.rider_name || 'Unassigned'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(way.status)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-navy-700 font-semibold">
                          {way.cod_amount ? `${way.cod_amount.toLocaleString()} MMK` : `${way.delivery_fee.toLocaleString()} MMK`}
                        </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              {t('common.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                              <AlertCircle className="mr-2 h-4 w-4" />
                              {t('common.cancel')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Placeholder */}
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1-5</span> of <span className="font-medium">124</span> ways
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>{t('common.previous')}</Button>
            <Button variant="outline" size="sm" className="bg-gold-500 text-navy-900 border-gold-600">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">{t('common.next')}</Button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <Card className="glass-card col-span-1 border-navy-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gold-500" />
              {language === 'en' ? "Upcoming Pickups" : "လာမည့် ကောက်ယူမှုများ"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-navy-50/50 hover:bg-navy-100/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <MapPin className="h-4 w-4 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Sein Gay Har Center</p>
                    <p className="text-xs text-muted-foreground">14:30 PM • 5 items</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-navy-300" />
              </div>
            ))}
            <Button variant="link" className="w-full text-gold-600 font-semibold">
              {t('common.view')} {t('common.all')}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card col-span-1 lg:col-span-2 border-navy-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Truck className="mr-2 h-5 w-5 text-gold-500" />
              {language === 'en' ? "Fleet Status Overview" : "ယာဉ်အုပ်စု အခြေအနေ အနှစ်ချုပ်"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[ 
                { label: 'Active', val: 24, color: 'text-success' }, 
                { label: 'Idle', val: 5, color: 'text-muted-foreground' }, 
                { label: 'Repair', val: 2, color: 'text-destructive' }, 
                { label: 'Off-duty', val: 12, color: 'text-navy-400' } 
              ].map((status, idx) => (
                <div key={idx} className="text-center p-4 rounded-xl bg-white border border-navy-50">
                  <p className={`text-2xl font-bold ${status.color}`}>{status.val}</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase">{status.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-navy-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-gold-400 animate-float" />
                <div>
                  <p className="text-sm font-bold">Optimizing Routes...</p>
                  <p className="text-xs text-gold-300/60">AI-powered route optimization is active</p>
                </div>
              </div>
              <Button size="sm" className="bg-gold-500 text-navy-900 hover:bg-gold-600">
                {t('common.view')} Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliverWaysPage;