import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import {
  Download,
  FileText,
  Filter,
  Search,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import { ROUTE_PATHS } from '@/lib/index';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data
const MERCHANT_PERFORMANCE_DATA = [
  { id: 'M001', name: 'Fashion Hub', orders: 1245, delivered: 1180, cancelled: 65, revenue: 24500000, successRate: 94.7, region: 'Yangon' },
  { id: 'M002', name: 'Tech Store MM', orders: 890, delivered: 850, cancelled: 40, revenue: 15600000, successRate: 95.5, region: 'Mandalay' },
  { id: 'M003', name: 'Home Essentials', orders: 1560, delivered: 1420, cancelled: 140, revenue: 32000000, successRate: 91.0, region: 'Yangon' },
  { id: 'M004', name: 'Gourmet Express', orders: 670, delivered: 640, cancelled: 30, revenue: 8900000, successRate: 95.5, region: 'Naypyidaw' },
  { id: 'M005', name: 'Book Worm', orders: 430, delivered: 415, cancelled: 15, revenue: 3400000, successRate: 96.5, region: 'Yangon' },
  { id: 'M006', name: 'Beauty Myanmar', orders: 1100, delivered: 1020, cancelled: 80, revenue: 18700000, successRate: 92.7, region: 'Bago' },
];

const REVENUE_TREND_DATA = [
  { name: 'Jan', revenue: 45000000, orders: 4200 },
  { name: 'Feb', revenue: 52000000, orders: 4800 },
  { name: 'Mar', revenue: 48000000, orders: 4500 },
  { name: 'Apr', revenue: 61000000, orders: 5600 },
  { name: 'May', revenue: 58000000, orders: 5300 },
  { name: 'Jun', revenue: 72000000, orders: 6800 },
];

const REGION_DISTRIBUTION = [
  { name: 'Yangon', value: 45 },
  { name: 'Mandalay', value: 25 },
  { name: 'Naypyidaw', value: 15 },
  { name: 'Others', value: 15 },
];

const COLORS = ['#D4AF37', '#0F172A', '#1E293B', '#334155'];

const MerchantReportPage: React.FC = () => {
  const { language } = useLanguageContext();
  const t = (key: string) => translations[language][key as keyof typeof translations['en']] || key;
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');

  const filteredMerchants = useMemo(() => {
    return MERCHANT_PERFORMANCE_DATA.filter(merchant => 
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('reports.merchantReport')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? "Analyze merchant growth, order fulfillment, and revenue performance." 
              : "ကုန်သည်များ၏ ကြီးထွားမှု၊ အော်ဒါဖြည့်ဆည်းမှုနှင့် ဝင်ငွေစွမ်းဆောင်ရည်ကို လေ့လာပါ။"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-500/50 text-gold-600 hover:bg-gold-50">
            <Download className="mr-2 h-4 w-4" />
            {t('reports.exportExcel')}
          </Button>
          <Button className="luxury-button">
            <FileText className="mr-2 h-4 w-4" />
            {t('reports.exportPdf')}
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="lotus-card border-none text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-gold-200/80 text-sm font-medium">{t('merchant.title')}</p>
                  <h3 className="text-2xl font-bold text-white font-mono">1,284</h3>
                  <div className="flex items-center text-xs text-green-400 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12% this month</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gold-500/20 ring-1 ring-gold-400/30">
                  <Users className="h-6 w-6 text-gold-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="lotus-card border-none text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-gold-200/80 text-sm font-medium">{t('dashboard.totalOrders')}</p>
                  <h3 className="text-2xl font-bold text-white font-mono">45,200</h3>
                  <div className="flex items-center text-xs text-green-400 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+8.4% this month</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gold-500/20 ring-1 ring-gold-400/30">
                  <Package className="h-6 w-6 text-gold-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="lotus-card border-none text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-gold-200/80 text-sm font-medium">{t('dashboard.revenue')}</p>
                  <h3 className="text-2xl font-bold text-white font-mono">845.2M</h3>
                  <div className="flex items-center text-xs text-green-400 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+15.2% this month</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gold-500/20 ring-1 ring-gold-400/30">
                  <DollarSign className="h-6 w-6 text-gold-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="lotus-card border-none text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-gold-200/80 text-sm font-medium">Success Rate</p>
                  <h3 className="text-2xl font-bold text-white font-mono">94.2%</h3>
                  <div className="flex items-center text-xs text-red-400 font-medium">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>-0.5% vs last week</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gold-500/20 ring-1 ring-gold-400/30">
                  <TrendingUp className="h-6 w-6 text-gold-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <Card className="lg:col-span-2 shadow-xl border-navy-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-navy-900">Revenue & Order Trends</CardTitle>
              <CardDescription>Visual overview of merchant activities</CardDescription>
            </div>
            <Tabs defaultValue="monthly" onValueChange={setTimeRange}>
              <TabsList className="bg-navy-50">
                <TabsTrigger value="weekly" className="data-[state=active]:bg-navy-800 data-[state=active]:text-gold-400">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-navy-800 data-[state=active]:text-gold-400">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="data-[state=active]:bg-navy-800 data-[state=active]:text-gold-400">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_TREND_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#D4AF37" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution Pie Chart */}
        <Card className="shadow-xl border-navy-100">
          <CardHeader>
            <CardTitle className="text-navy-900">Merchant Distribution</CardTitle>
            <CardDescription>By Region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={REGION_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {REGION_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-4">
              {REGION_DISTRIBUTION.map((region, idx) => (
                <div key={region.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-sm text-slate-600 font-medium">{region.name}</span>
                  </div>
                  <span className="text-sm font-bold text-navy-900">{region.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Table Section */}
        <Card className="lg:col-span-3 shadow-xl border-navy-100">
          <CardHeader className="border-b border-navy-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-navy-900">Merchant Performance Ledger</CardTitle>
                <CardDescription>Comprehensive metrics for all registered merchants</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={t('common.search')}
                    className="pl-10 bg-slate-50 border-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="border-slate-200">
                  <Filter className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-navy-50/50">
                <TableRow>
                  <TableHead className="text-navy-900 font-bold">{t('merchant.name')}</TableHead>
                  <TableHead className="text-navy-900 font-bold text-center">Region</TableHead>
                  <TableHead className="text-navy-900 font-bold text-center">Total Orders</TableHead>
                  <TableHead className="text-navy-900 font-bold text-center">Delivered</TableHead>
                  <TableHead className="text-navy-900 font-bold text-center">Success Rate</TableHead>
                  <TableHead className="text-navy-900 font-bold text-right">{t('merchant.revenue')}</TableHead>
                  <TableHead className="text-navy-900 font-bold text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-navy-900">{merchant.name}</span>
                        <span className="text-xs text-slate-400 font-mono">{merchant.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-white border-navy-200 text-navy-700">
                        {merchant.region}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">{merchant.orders}</TableCell>
                    <TableCell className="text-center font-mono text-green-600">{merchant.delivered}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${merchant.successRate > 94 ? 'bg-gold-500' : 'bg-navy-600'}`}
                            style={{ width: `${merchant.successRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{merchant.successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-navy-900">
                      {formatCurrency(merchant.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:bg-gold-100/50">
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMerchants.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Users className="h-12 w-12 mb-4 opacity-20" />
                <p>No merchants found matching your search</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-navy-100">
        <div className="text-sm text-slate-500">
          Showing {filteredMerchants.length} of {MERCHANT_PERFORMANCE_DATA.length} merchants
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Last sync: Today, 05:15 AM
          </span>
          <span className="px-2 py-1 rounded bg-green-100 text-green-700">
            System Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default MerchantReportPage;