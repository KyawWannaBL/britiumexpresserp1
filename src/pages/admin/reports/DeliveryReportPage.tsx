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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronRight,
  Printer,
  FileSpreadsheet,
  Package,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { SHIPMENT_STATUSES } from '@/lib/index';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

// Mock Data for 2026 Analytics
const MOCK_STATS = [
  { label: 'Total Shipments', value: '12,840', change: '+12.5%', icon: Package, color: 'text-blue-600' },
  { label: 'Success Rate', value: '94.2%', change: '+2.1%', icon: CheckCircle2, color: 'text-success' },
  { label: 'Failed Attempts', value: '412', change: '-5.4%', icon: XCircle, color: 'text-destructive' },
  { label: 'Avg. Delivery Time', value: '1.4 Days', change: '-0.2 Days', icon: Clock, color: 'text-gold-600' },
];

const MONTHLY_TREND = [
  { name: 'Jan', delivered: 1200, failed: 45, pending: 100 },
  { name: 'Feb', delivered: 1400, failed: 50, pending: 120 },
  { name: 'Mar', delivered: 1100, failed: 30, pending: 80 },
  { name: 'Apr', delivered: 1600, failed: 60, pending: 150 },
  { name: 'May', delivered: 1800, failed: 40, pending: 110 },
  { name: 'Jun', delivered: 2100, failed: 55, pending: 130 },
];

const STATUS_DISTRIBUTION = [
  { name: 'Delivered', value: 85, color: 'oklch(0.65 0.15 150)' },
  { name: 'In Transit', value: 10, color: 'oklch(0.65 0.15 240)' },
  { name: 'Failed', value: 3, color: 'oklch(0.58 0.18 15)' },
  { name: 'Cancelled', value: 2, color: 'oklch(0.42 0.05 220)' },
];

const RECENT_DELIVERIES = [
  { id: 'BR-2026-9041', recipient: 'Kyaw Kyaw', status: 'delivered', date: '2026-02-04', time: '10:30 AM', rider: 'Aung Ko', branch: 'Yangon' },
  { id: 'BR-2026-9042', recipient: 'Mya Mya', status: 'delivered', date: '2026-02-04', time: '11:15 AM', rider: 'Min Min', branch: 'Mandalay' },
  { id: 'BR-2026-9043', recipient: 'Hla Hla', status: 'failed', date: '2026-02-04', time: '01:45 PM', rider: 'Zaw Zaw', branch: 'Yangon' },
  { id: 'BR-2026-9044', recipient: 'Than Than', status: 'in_transit', date: '2026-02-04', time: '02:20 PM', rider: 'Aung Ko', branch: 'Yangon' },
  { id: 'BR-2026-9045', recipient: 'Win Win', status: 'delivered', date: '2026-02-04', time: '03:10 PM', rider: 'Min Min', branch: 'Naypyidaw' },
];

const DeliveryReportPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('7d');

  const filteredDeliveries = useMemo(() => {
    return RECENT_DELIVERIES.filter(delivery =>
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.rider.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            {t('reports.deliveryReport')}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('reports.dateRange')}: 2026-01-28 - 2026-02-04
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 border-gold-400/30 text-navy-800">
            <Printer className="w-4 h-4" />
            {t('reports.exportPdf')}
          </Button>
          <Button className="luxury-button flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t('reports.exportExcel')}
          </Button>
        </div>
      </motion.div>

      {/* Summary Statistics Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {MOCK_STATS.map((stat, index) => (
          <motion.div key={index} variants={staggerItem}>
            <Card className="lotus-card overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gold-500/10">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gold-400/70 font-medium uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white font-mono">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Performance Trend */}
        <Card className="lg:col-span-2 shadow-xl border-navy-200/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-500" />
              {t('reports.performanceReport')}
            </CardTitle>
            <CardDescription>
              Delivery volume and success trends for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND}>
                <defs>
                  <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.15 150)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="oklch(0.65 0.15 150)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #eee', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="delivered" 
                  stroke="oklch(0.65 0.15 150)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDelivered)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="oklch(0.58 0.18 15)" 
                  strokeWidth={2}
                  fill="transparent"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie */}
        <Card className="shadow-xl border-navy-200/20">
          <CardHeader>
            <CardTitle>{t('tracking.status')}</CardTitle>
            <CardDescription>Shipment status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={STATUS_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-3 mt-6">
              {STATUS_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card className="shadow-xl border-navy-200/20 overflow-hidden">
        <CardHeader className="border-b border-navy-100/10 bg-navy-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>{t('reports.deliveryReport')}</CardTitle>
              <CardDescription>Detailed transaction logs for the selected period</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder={t('common.search')}
                  className="pl-10 h-10 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-10 rounded-xl flex items-center gap-2 border-navy-200">
                <Filter className="w-4 h-4" />
                {t('common.filter')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-navy-50/50">
              <TableRow>
                <TableHead className="w-[150px] font-bold text-navy-800">Tracking ID</TableHead>
                <TableHead className="font-bold text-navy-800">{t('order.customer')}</TableHead>
                <TableHead className="font-bold text-navy-800">{t('deliveryman.name')}</TableHead>
                <TableHead className="font-bold text-navy-800">{t('accounting.branches')}</TableHead>
                <TableHead className="font-bold text-navy-800">{t('common.date')}</TableHead>
                <TableHead className="font-bold text-navy-800">{t('tracking.status')}</TableHead>
                <TableHead className="text-right font-bold text-navy-800">{t('warehouse.action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id} className="hover:bg-navy-50/30 transition-colors group">
                  <TableCell className="font-mono font-medium text-navy-900">
                    {delivery.id}
                  </TableCell>
                  <TableCell>{delivery.recipient}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 font-bold text-xs">
                        {delivery.rider.charAt(0)}
                      </div>
                      {delivery.rider}
                    </div>
                  </TableCell>
                  <TableCell>{delivery.branch}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{delivery.date}</span>
                      <span className="text-xs text-muted-foreground">{delivery.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`capitalize rounded-full px-3 py-1 ${
                        delivery.status === 'delivered' ? 'bg-success/10 text-success border-success/20' : 
                        delivery.status === 'failed' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                        'bg-info/10 text-info border-info/20'
                      }`}
                    >
                      {t(`tracking.${delivery.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="hover:text-gold-600">
                      {t('common.view')}
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDeliveries.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p>No results found for "{searchTerm}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
          Showing <strong>5</strong> of <strong>{MOCK_STATS[0].value}</strong> total records
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>{t('common.previous')}</Button>
          <Button variant="outline" size="sm" className="bg-gold-500 text-navy-900 border-gold-500">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">{t('common.next')}</Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReportPage;