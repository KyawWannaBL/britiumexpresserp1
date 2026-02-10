import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  Calendar,
  Filter,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Search,
  Building2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data for 2026
const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { name: 'Feb', revenue: 52000, expenses: 34000, profit: 18000 },
  { name: 'Mar', revenue: 48000, expenses: 31000, profit: 17000 },
  { name: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { name: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { name: 'Jun', revenue: 67000, expenses: 40000, profit: 27000 },
];

const EXPENSE_BREAKDOWN = [
  { name: 'Rider Commissions', value: 45000, color: '#FFD700' },
  { name: 'Fuel & Maintenance', value: 15000, color: '#1A237E' },
  { name: 'Office Rent', value: 12000, color: '#3F51B5' },
  { name: 'Staff Salaries', value: 25000, color: '#7986CB' },
  { name: 'Marketing', value: 8000, color: '#C5CAE9' },
];

const RECENT_TRANSACTIONS = [
  { id: 'TX-9001', date: '2026-02-03', description: 'Monthly Rider Commission - Yangon', amount: -4500.00, type: 'Expense', category: 'Commission', status: 'Completed' },
  { id: 'TX-9002', date: '2026-02-03', description: 'Merchant COD Remittance - Lotus Shop', amount: -12400.00, type: 'Expense', category: 'Remittance', status: 'Completed' },
  { id: 'TX-9003', date: '2026-02-02', description: 'Service Fees Collection - Batch #442', amount: 8900.50, type: 'Income', category: 'Service Fee', status: 'Completed' },
  { id: 'TX-9004', date: '2026-02-02', description: 'New Warehouse Equipment Purchase', amount: -2100.00, type: 'Expense', category: 'Asset', status: 'Pending' },
  { id: 'TX-9005', date: '2026-02-01', description: 'Ad-hoc Delivery Surcharge', amount: 450.00, type: 'Income', category: 'Surcharge', status: 'Completed' },
];

const FinancialReportPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [dateRange, setDateRange] = useState('monthly');
  const [branch, setBranch] = useState('all');

  const stats = useMemo(() => ({
    totalRevenue: '328,000.00',
    totalExpenses: '211,000.00',
    netProfit: '117,000.00',
    codBalance: '45,620.00',
    growth: '+12.5%'
  }), []);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-gold-500">
            {t('reports.financialReport')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Comprehensive financial analysis and performance metrics for fiscal year 2026.' 
              : '၂၀၂၆ ဘဏ္ဍာရေးနှစ်အတွက် ပြည့်စုံသော ငွေကြေးခွဲခြမ်းစိတ်ဖြာမှုနှင့် စွမ်းဆောင်ရည်ပြကိန်းများ။'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gold-500/50 text-navy-900 dark:text-gold-500 hover:bg-gold-500/10">
            <Download className="w-4 h-4 mr-2" />
            {t('reports.exportPdf')}
          </Button>
          <Button className="luxury-button">
            <Download className="w-4 h-4 mr-2" />
            {t('reports.exportExcel')}
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="border-gold-400/20 shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium">{t('reports.dateRange')}:</span>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">{language === 'en' ? 'Last 7 Days' : 'လွန်ခဲ့သော ၇ ရက်'}</SelectItem>
                <SelectItem value="monthly">{t('accounting.monthlyReport')}</SelectItem>
                <SelectItem value="quarterly">{language === 'en' ? 'Quarterly' : 'သုံးလပတ်'}</SelectItem>
                <SelectItem value="yearly">{t('accounting.yearlyReport')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium">{t('accounting.branches')}:</span>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="ygn">Yangon HQ</SelectItem>
                <SelectItem value="mdy">Mandalay Branch</SelectItem>
                <SelectItem value="npt">Naypyidaw Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {t('common.filter')}
            </Button>
            <Button variant="ghost" size="sm">
              {t('common.reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="lotus-card border-l-4 border-l-gold-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gold-400 font-medium uppercase tracking-wider">{t('accounting.income')}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">${stats.totalRevenue}</h3>
                  <div className="flex items-center mt-2 text-success">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-xs font-semibold">{stats.growth}</span>
                  </div>
                </div>
                <div className="p-3 bg-gold-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-gold-400" />
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
          <Card className="lotus-card border-l-4 border-l-destructive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gold-400 font-medium uppercase tracking-wider">{t('accounting.expense')}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">${stats.totalExpenses}</h3>
                  <div className="flex items-center mt-2 text-destructive">
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                    <span className="text-xs font-semibold">+4.2%</span>
                  </div>
                </div>
                <div className="p-3 bg-destructive/20 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-destructive" />
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
          <Card className="lotus-card border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gold-400 font-medium uppercase tracking-wider">{t('accounting.profit')}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">${stats.netProfit}</h3>
                  <div className="flex items-center mt-2 text-success">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-xs font-semibold">+18.3%</span>
                  </div>
                </div>
                <div className="p-3 bg-success/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-success" />
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
          <Card className="lotus-card border-l-4 border-l-info">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gold-400 font-medium uppercase tracking-wider">COD Balance</p>
                  <h3 className="text-2xl font-bold text-white mt-1">${stats.codBalance}</h3>
                  <p className="text-xs text-navy-200 mt-2">Pending Remittance</p>
                </div>
                <div className="p-3 bg-info/20 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-gold-400/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-600" />
              {language === 'en' ? 'Revenue & Profit Trend' : 'ဝင်ငွေနှင့် အမြတ်အစွန်း လမ်းကြောင်း'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Monthly financial performance for 2026' : '၂၀၂၆ ခုနှစ်အတွက် လစဉ် ငွေကြေးစွမ်းဆောင်ရည်'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A237E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1A237E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.015 220)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FFD700" 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    strokeWidth={3}
                    name={t('accounting.income')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#1A237E" 
                    fillOpacity={1} 
                    fill="url(#colorProfit)" 
                    strokeWidth={3}
                    name={t('accounting.profit')}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold-400/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-gold-600" />
              {language === 'en' ? 'Expense Breakdown' : 'ကုန်ကျစရိတ် ခွဲခြမ်းစိတ်ဖြာမှု'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={EXPENSE_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {EXPENSE_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right" 
                    wrapperStyle={{ fontSize: '11px', paddingLeft: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table Section */}
      <Card className="border-gold-400/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">{t('accounting.transactions')}</CardTitle>
            <CardDescription>
              {language === 'en' ? 'Detailed ledger of recent financial activities' : 'လတ်တလော ငွေကြေးဆိုင်ရာ လုပ်ဆောင်ချက်များ၏ အသေးစိတ်မှတ်တမ်း'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('common.search')}
                className="pl-8 h-9 rounded-lg"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('common.filter')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{language === 'en' ? 'Reference' : 'ကိုးကားချက်'}</TableHead>
                  <TableHead>{language === 'en' ? 'Description' : 'အကြောင်းအရာ'}</TableHead>
                  <TableHead>{language === 'en' ? 'Category' : 'အမျိုးအစား'}</TableHead>
                  <TableHead className="text-right">{t('order.amount')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{tx.date}</TableCell>
                    <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{tx.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-navy-50/50">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold ${tx.type === 'Income' ? 'text-success' : 'text-destructive'}`}>
                      {tx.type === 'Income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={tx.status === 'Completed' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing 5 of 128 transactions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>{t('common.previous')}</Button>
              <Button variant="outline" size="sm">{t('common.next')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Analysis Tabs */}
      <Card className="border-gold-400/20 overflow-hidden">
        <Tabs defaultValue="branch-comparison" className="w-full">
          <div className="px-6 pt-4 border-b">
            <TabsList className="grid w-[400px] grid-cols-2 bg-muted/50">
              <TabsTrigger value="branch-comparison">Branch Performance</TabsTrigger>
              <TabsTrigger value="year-over-year">Year over Year</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="branch-comparison" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-lg font-semibold mb-4">Branch Revenue Distribution</h4>
                <div className="space-y-4">
                  {['Yangon HQ', 'Mandalay Branch', 'Naypyidaw Office', 'Taunggyi Station'].map((branch, idx) => (
                    <div key={branch} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{branch}</span>
                        <span className="font-bold">{45 - idx * 10}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${45 - idx * 10}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="h-full bg-gold-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted/30 rounded-2xl p-6 border border-dashed border-gold-400/30 flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-12 h-12 text-gold-400 mb-4" />
                <h5 className="font-bold text-navy-900 dark:text-gold-500">Advanced Analytics Available</h5>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect with our BI tool to see deeper insights into individual branch profitability and seasonal trends.
                </p>
                <Button variant="link" className="text-gold-600 mt-2">
                  Explore More Analytics <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="year-over-year" className="p-6">
             <div className="flex items-center justify-center h-48 text-muted-foreground">
                Comparative data for 2025 is being synchronized with the new 2026 ledger system.
             </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Report ID: FR-2026-002
          </span>
          <span>•</span>
          <span>Generated on: 2026-02-04 05:15:20</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">{t('common.cancel')}</Button>
          <Button className="luxury-button">{t('reports.generateReport')}</Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportPage;