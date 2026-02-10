import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  RotateCcw,
  PackageMinus,
  Search,
  Filter,
  Eye,
  MoreVertical,
  ChevronRight,
  Calendar,
  User,
  MapPin,
  Phone,
  ArrowUpRight,
  Download,
  History
} from 'lucide-react';
import { SHIPMENT_STATUSES, ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

// Mock Data for Failed Deliveries
const MOCK_FAILED_WAYS = [
  {
    id: 'FW-10293',
    trackingId: 'BRT-2026-0001',
    merchant: 'Elite Electronics',
    customer: 'Daw Myint Myint',
    phone: '09-777888999',
    address: 'No. 123, Pyay Road, Kamayut Tsp, Yangon',
    failedReason: 'Customer Unavailable',
    failedAttempts: 2,
    lastAttempt: '2026-02-04 09:30 AM',
    codAmount: 45000,
    status: SHIPMENT_STATUSES.FAILED,
  },
  {
    id: 'FW-10294',
    trackingId: 'BRT-2026-0005',
    merchant: 'Fashion Hub MM',
    customer: 'U Kyaw Swar',
    phone: '09-444555666',
    address: 'Bldg 5, Room 102, Hledan, Yangon',
    failedReason: 'Wrong Address',
    failedAttempts: 1,
    lastAttempt: '2026-02-04 10:15 AM',
    codAmount: 28000,
    status: SHIPMENT_STATUSES.FAILED,
  },
  {
    id: 'FW-10295',
    trackingId: 'BRT-2026-0012',
    merchant: 'Nature Beauty',
    customer: 'Ma Su Mon',
    phone: '09-111222333',
    address: '34th Street, Kyauktada Tsp, Yangon',
    failedReason: 'Rejected by Customer',
    failedAttempts: 1,
    lastAttempt: '2026-02-03 04:45 PM',
    codAmount: 15500,
    status: SHIPMENT_STATUSES.FAILED,
  },
  {
    id: 'FW-10296',
    trackingId: 'BRT-2026-0018',
    merchant: 'Tech Zone',
    customer: 'U Ba Maung',
    phone: '09-999000111',
    address: 'No. 45, Insein Road, Hlaing Tsp, Yangon',
    failedReason: 'Incomplete Address',
    failedAttempts: 3,
    lastAttempt: '2026-02-04 11:00 AM',
    codAmount: 125000,
    status: SHIPMENT_STATUSES.FAILED,
  },
];

const FailedWaysPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [selectedWay, setSelectedWay] = useState<any>(null);
  const [isRetryDialogOpen, setIsRetryDialogOpen] = useState(false);

  const filteredWays = useMemo(() => {
    return MOCK_FAILED_WAYS.filter((way) => {
      const matchesSearch = 
        way.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        way.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        way.merchant.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesReason = reasonFilter === 'all' || way.failedReason === reasonFilter;
      
      return matchesSearch && matchesReason;
    });
  }, [searchQuery, reasonFilter]);

  const stats = [
    { 
      label: language === 'en' ? 'Total Failed Today' : 'ယနေ့ မအောင်မြင်မှု စုစုပေါင်း', 
      value: '24', 
      icon: AlertCircle, 
      color: 'text-destructive', 
      bg: 'bg-destructive/10' 
    },
    { 
      label: language === 'en' ? 'Retries in Progress' : 'ပြန်လည်ပို့ဆောင်ဆဲ', 
      value: '12', 
      icon: RotateCcw, 
      color: 'text-info', 
      bg: 'bg-info/10' 
    },
    { 
      label: language === 'en' ? 'Returned to Merchant' : 'ကုန်သည်ထံ ပြန်ပို့ပြီး', 
      value: '08', 
      icon: PackageMinus, 
      color: 'text-warning', 
      bg: 'bg-warning/10' 
    },
    { 
      label: language === 'en' ? 'Success Rate After Retry' : 'ပြန်ပို့ပြီး အောင်မြင်မှုနှုန်း', 
      value: '68%', 
      icon: ArrowUpRight, 
      color: 'text-success', 
      bg: 'bg-success/10' 
    },
  ];

  const handleRetry = (way: any) => {
    setSelectedWay(way);
    setIsRetryDialogOpen(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 bg-background">
      {/* Header */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
            {t('way.failedWays')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Manage failed delivery attempts and schedule retries or returns.' 
              : 'မအောင်မြင်သော ပို့ဆောင်မှုများကို စီမံခန့်ခွဲပြီး ပြန်လည်ပို့ဆောင်ရန် သို့မဟုတ် ပြန်ပို့ရန် စီစဉ်ပါ။'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
          <Button className="luxury-button gap-2">
            <History className="w-4 h-4" />
            {language === 'en' ? 'Retry All' : 'အားလုံးကို ပြန်ပို့ရန်'}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={staggerItem}>
            <Card className="lotus-card overflow-hidden group hover:scale-[1.02] transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-gold-500/10 text-gold-600 border-gold-400/20">
                    +12% {language === 'en' ? 'Today' : 'ယနေ့'}
                  </Badge>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('common.search') + " (ID, Merchant, Customer)..."}
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger className="w-full md:w-[200px] h-11">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder={t('common.filter')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="Customer Unavailable">Customer Unavailable</SelectItem>
                  <SelectItem value="Wrong Address">Wrong Address</SelectItem>
                  <SelectItem value="Rejected by Customer">Rejected by Customer</SelectItem>
                  <SelectItem value="Incomplete Address">Incomplete Address</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-11 px-6 border-gold-500/30 text-gold-600">
                {t('common.filter')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="overflow-hidden border-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[150px]">{t('tracking.trackingNumber')}</TableHead>
                <TableHead>{t('order.merchant')}</TableHead>
                <TableHead>{t('order.customer')}</TableHead>
                <TableHead>{language === 'en' ? 'Failure Reason' : 'မအောင်မြင်ရသည့်အကြောင်းအရင်း'}</TableHead>
                <TableHead>{language === 'en' ? 'Attempts' : 'ကြိုးစားမှုအကြိမ်ရေ'}</TableHead>
                <TableHead>{t('common.date')}</TableHead>
                <TableHead className="text-right">{t('common.view')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredWays.map((way) => (
                  <motion.tr 
                    key={way.id} 
                    layout 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono font-bold text-navy-900">
                      {way.trackingId}
                    </TableCell>
                    <TableCell className="font-medium">{way.merchant}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{way.customer}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {way.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">
                        {way.failedReason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full ${i < way.failedAttempts ? 'bg-destructive' : 'bg-muted'}`} 
                          />
                        ))}
                        <span className="text-xs ml-1">{way.failedAttempts}/3</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {way.lastAttempt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>{t('common.view')}</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'View Details' : 'အသေးစိတ်ကြည့်ရန်'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleRetry(way)}>
                            <RotateCcw className="w-4 h-4 mr-2 text-success" />
                            {language === 'en' ? 'Retry Delivery' : 'ပြန်လည်ပို့ဆောင်ရန်'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10">
                            <PackageMinus className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Return to Sender' : 'ပေးပို့သူထံပြန်ပို့ရန်'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
        {filteredWays.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{language === 'en' ? 'No records found' : 'ရှာဖွေမှုမတွေ့ရှိပါ'}</h3>
            <p className="text-muted-foreground">{language === 'en' ? 'Try adjusting your search or filters.' : 'ရှာဖွေမှု သို့မဟုတ် စစ်ထုတ်မှုများကို ပြင်ဆင်ကြည့်ပါ။'}</p>
          </div>
        )}
      </Card>

      {/* Retry Delivery Dialog */}
      <Dialog open={isRetryDialogOpen} onOpenChange={setIsRetryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-success" />
              {language === 'en' ? 'Schedule Retry Delivery' : 'ပို့ဆောင်မှု ပြန်လည်စီစဉ်ရန်'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? `Assign a new slot or rider for ${selectedWay?.trackingId}` 
                : `${selectedWay?.trackingId} အတွက် ပို့ဆောင်သူအသစ် သို့မဟုတ် အချိန်အသစ် သတ်မှတ်ပါ။`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWay && (
            <div className="space-y-6 py-4">
              <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 mt-1 text-gold-600" />
                  <div>
                    <p className="text-sm font-semibold">{selectedWay.customer}</p>
                    <p className="text-xs text-muted-foreground">{selectedWay.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-gold-600" />
                  <p className="text-xs">{selectedWay.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'en' ? 'Retry Date' : 'ပြန်ပို့မည့်ရက်'}</label>
                  <Input type="date" className="w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'en' ? 'Time Slot' : 'အချိန်အပိုင်းအခြား'}</label>
                  <Select defaultValue="morning">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (13:00 - 17:00)</SelectItem>
                      <SelectItem value="evening">Evening (18:00 - 21:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'en' ? 'Assign Rider' : 'ပို့ဆောင်သူ သတ်မှတ်ရန်'}</label>
                <Select defaultValue="rider-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rider-1">U Kyaw Gyi (Yangon Central)</SelectItem>
                    <SelectItem value="rider-2">Ko Zaw (Kamayut District)</SelectItem>
                    <SelectItem value="rider-3">Maung Maung (Hledan Area)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsRetryDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button className="luxury-button" onClick={() => setIsRetryDialogOpen(false)}>
              {language === 'en' ? 'Confirm Retry' : 'ပြန်ပို့ရန် အတည်ပြုသည်'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FailedWaysPage;
