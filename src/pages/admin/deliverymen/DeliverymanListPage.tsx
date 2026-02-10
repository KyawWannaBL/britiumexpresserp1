import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Phone,
  MapPin,
  Bike,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Edit3,
  DollarSign,
  UserX
} from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

// Mock Data for Deliverymen
const MOCK_DELIVERYMEN = [
  {
    id: 'DM001',
    name: 'Aung Kyaw',
    phone: '09-778899001',
    vehicle: 'Motorcycle (YGN-1A/1234)',
    zone: 'Kamayut',
    status: 'active',
    onDuty: true,
    rating: 4.8,
    completedDeliveries: 1240,
    successRate: '98.5%',
    lastActive: '2026-02-04 10:15',
  },
  {
    id: 'DM002',
    name: 'Min Thu',
    phone: '09-778899002',
    vehicle: 'Motorcycle (YGN-2B/5678)',
    zone: 'Sanchaung',
    status: 'active',
    onDuty: false,
    rating: 4.5,
    completedDeliveries: 850,
    successRate: '96.2%',
    lastActive: '2026-02-03 18:30',
  },
  {
    id: 'DM003',
    name: 'Kyaw Zin',
    phone: '09-778899003',
    vehicle: 'Van (YGN-3C/9012)',
    zone: 'Hlaing',
    status: 'inactive',
    onDuty: false,
    rating: 4.2,
    completedDeliveries: 420,
    successRate: '94.0%',
    lastActive: '2026-01-28 14:20',
  },
  {
    id: 'DM004',
    name: 'Thura Tun',
    phone: '09-778899004',
    vehicle: 'Motorcycle (YGN-4D/3456)',
    zone: 'Mayangone',
    status: 'active',
    onDuty: true,
    rating: 4.9,
    completedDeliveries: 2100,
    successRate: '99.1%',
    lastActive: '2026-02-04 11:05',
  },
  {
    id: 'DM005',
    name: 'Zayar Myo',
    phone: '09-778899005',
    vehicle: 'Motorcycle (YGN-5E/7890)',
    zone: 'Kamayut',
    status: 'active',
    onDuty: true,
    rating: 4.7,
    completedDeliveries: 1560,
    successRate: '97.8%',
    lastActive: '2026-02-04 09:45',
  }
];

const DeliverymanListPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');

  const filteredDeliverymen = useMemo(() => {
    return MOCK_DELIVERYMEN.filter(dm => {
      const matchesSearch = dm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            dm.phone.includes(searchQuery) || 
                            dm.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || dm.status === statusFilter;
      const matchesZone = zoneFilter === 'all' || dm.zone === zoneFilter;
      return matchesSearch && matchesStatus && matchesZone;
    });
  }, [searchQuery, statusFilter, zoneFilter]);

  const stats = {
    total: MOCK_DELIVERYMEN.length,
    active: MOCK_DELIVERYMEN.filter(dm => dm.status === 'active').length,
    onDuty: MOCK_DELIVERYMEN.filter(dm => dm.onDuty).length,
    avgRating: (MOCK_DELIVERYMEN.reduce((acc, curr) => acc + curr.rating, 0) / MOCK_DELIVERYMEN.length).toFixed(1)
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-gold-400 font-display">
            {t('deliveryman.list')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' ? 'Manage and monitor your delivery personnel performance' : 'ပို့ဆောင်သူများ၏ စွမ်းဆောင်ရည်ကို စီမံခန့်ခွဲပြီး စောင့်ကြည့်ပါ'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-navy-200 text-navy-700 hover:bg-navy-50"
            onClick={() => { /* Export logic */ }}
          >
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={() => navigate(ROUTE_PATHS.DELIVERYMAN_ADD_NEW)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('deliveryman.addNew')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Riders</p>
                  <h3 className="text-2xl font-bold text-navy-900">{stats.total}</h3>
                </div>
                <div className="p-3 bg-navy-100 rounded-xl text-navy-600">
                  <Bike className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                  <h3 className="text-2xl font-bold text-success">{stats.active}</h3>
                </div>
                <div className="p-3 bg-success/10 rounded-xl text-success">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On Duty</p>
                  <h3 className="text-2xl font-bold text-info">{stats.onDuty}</h3>
                </div>
                <div className="p-3 bg-info/10 rounded-xl text-info">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                  <h3 className="text-2xl font-bold text-gold-600">{stats.avgRating} / 5.0</h3>
                </div>
                <div className="p-3 bg-gold-100 rounded-xl text-gold-600">
                  <Star className="h-6 w-6 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters Section */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search') + "..."}
                className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-muted/30 border-none">
                  <SelectValue placeholder={t('deliveryman.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')} Status</SelectItem>
                  <SelectItem value="active">{t('common.active')}</SelectItem>
                  <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-[150px] bg-muted/30 border-none">
                  <SelectValue placeholder={t('deliveryman.zone')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')} Zones</SelectItem>
                  <SelectItem value="Kamayut">Kamayut</SelectItem>
                  <SelectItem value="Sanchaung">Sanchaung</SelectItem>
                  <SelectItem value="Hlaing">Hlaing</SelectItem>
                  <SelectItem value="Mayangone">Mayangone</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-none bg-muted/30 hover:bg-muted/50">
                <Filter className="h-4 w-4 mr-2" />
                {t('common.filter')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-none shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-navy-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px] font-semibold text-navy-900">{t('deliveryman.name')}</TableHead>
                <TableHead className="font-semibold text-navy-900">{t('deliveryman.vehicle')}</TableHead>
                <TableHead className="font-semibold text-navy-900">{t('deliveryman.zone')}</TableHead>
                <TableHead className="font-semibold text-navy-900">{t('deliveryman.status')}</TableHead>
                <TableHead className="font-semibold text-navy-900">Rating</TableHead>
                <TableHead className="font-semibold text-navy-900 text-right">{t('deliveryman.completedDeliveries')}</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredDeliverymen.map((dm) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={dm.id}
                    className="group hover:bg-navy-50/30 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center font-bold text-navy-700 shadow-inner">
                          {dm.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-navy-900">{dm.name}</div>
                          <div className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {dm.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bike className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{dm.vehicle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{dm.zone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={dm.status === 'active' ? 'outline' : 'secondary'}
                          className={`w-fit rounded-md ${
                            dm.status === 'active' 
                              ? 'border-success/30 bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {dm.status === 'active' ? t('common.active') : t('common.inactive')}
                        </Badge>
                        {dm.onDuty && (
                          <span className="flex items-center gap-1.5 text-[10px] text-info font-bold uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
                            On Duty
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                        <span className="font-medium">{dm.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({dm.successRate})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono font-bold">{dm.completedDeliveries.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            {t('common.view')} Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                            <Edit3 className="mr-2 h-4 w-4" />
                            {t('common.edit')} Info
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.DELIVERYMAN_CASH_ADVANCE)} className="cursor-pointer text-gold-600 focus:text-gold-600 focus:bg-gold-50">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Manage Cash Advance
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {}} className="cursor-pointer text-destructive focus:text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate Account
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
        
        {/* Pagination */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-navy-900">{filteredDeliverymen.length}</span> of <span className="font-medium text-navy-900">{stats.total}</span> deliverymen
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="h-8">
              {t('common.previous')}
            </Button>
            <Button variant="outline" size="sm" disabled className="h-8">
              {t('common.next')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Performance Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_DELIVERYMEN.sort((a, b) => b.rating - a.rating).slice(0, 3).map((dm, idx) => (
              <div key={dm.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-navy-400">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold text-navy-900">{dm.name}</p>
                    <p className="text-xs text-muted-foreground">{dm.zone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold-600">{dm.rating} Stars</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{dm.successRate} Success</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Status Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10">
              <Clock className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-warning-foreground">Inactive Rider: Kyaw Zin</p>
                <p className="text-xs text-muted-foreground">Last active 7 days ago. Consider deactivating or re-engaging.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/10">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-success-foreground">High Traffic: Kamayut Zone</p>
                <p className="text-xs text-muted-foreground">3 riders currently on duty. Operations running smoothly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliverymanListPage;