import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Download,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';

// Mock Merchant Data
const MOCK_MERCHANTS = [
  {
    id: 'M001',
    name: 'Glory Fashion Hub',
    owner: 'Daw Aye Aye',
    phone: '09-777123456',
    email: 'contact@gloryfashion.mm',
    address: 'No. 123, Pyay Road, Yangon',
    status: 'active',
    registrationDate: '2025-11-15',
    totalOrders: 1250,
    revenue: 15450000,
    performance: 'excellent',
  },
  {
    id: 'M002',
    name: 'Tech Zone Myanmar',
    owner: 'U Kyaw Zwa',
    phone: '09-444987654',
    email: 'info@techzone.com',
    address: '34th Street, Mandalay',
    status: 'active',
    registrationDate: '2026-01-10',
    totalOrders: 450,
    revenue: 8900000,
    performance: 'good',
  },
  {
    id: 'M003',
    name: 'Pure Organic Foods',
    owner: 'Ma Thida',
    phone: '09-222333444',
    email: 'pure@organic.mm',
    address: 'Bagan Road, Taunggyi',
    status: 'inactive',
    registrationDate: '2024-05-20',
    totalOrders: 2100,
    revenue: 45000000,
    performance: 'needs_review',
  },
  {
    id: 'M004',
    name: 'Home Decor Express',
    owner: 'U Min Hein',
    phone: '09-555666777',
    email: 'admin@homedecor.com',
    address: 'Kabar Aye Pagoda Rd, Yangon',
    status: 'active',
    registrationDate: '2026-02-01',
    totalOrders: 15,
    revenue: 1200000,
    performance: 'new',
  }
];

const MerchantListPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMerchants = useMemo(() => {
    return MOCK_MERCHANTS.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.phone.includes(searchQuery) ||
                            m.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const stats = [
    {
      title: t('common.total'),
      value: MOCK_MERCHANTS.length,
      icon: Users,
      color: 'text-navy-900',
      bg: 'bg-navy-50'
    },
    {
      title: t('common.active'),
      value: MOCK_MERCHANTS.filter(m => m.status === 'active').length,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      title: t('merchant.totalOrders'),
      value: MOCK_MERCHANTS.reduce((acc, curr) => acc + curr.totalOrders, 0).toLocaleString(),
      icon: ShoppingBag,
      color: 'text-gold-600',
      bg: 'bg-gold-50'
    },
    {
      title: t('merchant.revenue'),
      value: `${MOCK_MERCHANTS.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()} MMK`,
      icon: DollarSign,
      color: 'text-info',
      bg: 'bg-info/10'
    }
  ];

  const getPerformanceBadge = (perf: string) => {
    switch (perf) {
      case 'excellent':
        return <Badge className="bg-success/20 text-success border-success/30">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-info/20 text-info border-info/30">Good</Badge>;
      case 'needs_review':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Review Needed</Badge>;
      case 'new':
        return <Badge className="bg-gold-500/20 text-gold-600 border-gold-500/30">New</Badge>;
      default:
        return <Badge variant="outline">Standard</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">{t('merchant.list')}</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your business partners</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button 
            onClick={() => navigate(ROUTE_PATHS.MERCHANT_ADD_NEW)} 
            className="gap-2 bg-gold-500 text-navy-900 hover:bg-gold-600 border-none"
          >
            <Plus className="h-4 w-4" />
            {t('merchant.addNew')}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-gold-500/20 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-navy-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5 text-gold-500" />
            {t('common.filter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              className="pl-10 border-navy-100 focus:border-gold-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-navy-100">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-navy-100" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
            {t('common.reset')}
          </Button>
        </CardContent>
      </Card>

      {/* Merchant Table */}
      <Card className="border-navy-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-navy-50">
            <TableRow>
              <TableHead className="text-navy-900 font-bold w-[300px]">{t('merchant.name')}</TableHead>
              <TableHead className="text-navy-900 font-bold">{t('merchant.status')}</TableHead>
              <TableHead className="text-navy-900 font-bold">{t('merchant.totalOrders')}</TableHead>
              <TableHead className="text-navy-900 font-bold">{t('merchant.revenue')}</TableHead>
              <TableHead className="text-navy-900 font-bold">Performance</TableHead>
              <TableHead className="text-navy-900 font-bold text-right">{t('warehouse.action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMerchants.length > 0 ? (
              filteredMerchants.map((merchant) => (
                <TableRow key={merchant.id} className="hover:bg-navy-50/50 transition-colors group">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-navy-900 font-bold flex items-center gap-2">
                        {merchant.name}
                        <span className="text-[10px] bg-navy-100 px-1.5 py-0.5 rounded text-navy-500 font-mono">
                          {merchant.id}
                        </span>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{merchant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{merchant.address}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={merchant.status === 'active' ? 'default' : 'secondary'}
                      className={merchant.status === 'active' ? 'bg-success text-white' : 'bg-muted'}
                    >
                      {merchant.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-navy-300" />
                      <span className="font-semibold">{merchant.totalOrders.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-navy-900">{merchant.revenue.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground">MMK</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPerformanceBadge(merchant.performance)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`${ROUTE_PATHS.MERCHANT_LIST}/${merchant.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t('common.view')} Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.MERCHANT_FINANCIAL_CENTER)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          {t('merchant.financialCenter')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.MERCHANT_RECEIPTS)}>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          {t('merchant.receipts')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Deactivate Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No merchants found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredMerchants.length}</span> of <span className="font-medium">{MOCK_MERCHANTS.length}</span> merchants
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>{t('common.previous')}</Button>
          <Button variant="outline" size="sm" disabled>{t('common.next')}</Button>
        </div>
      </div>
    </div>
  );
};

export default MerchantListPage;