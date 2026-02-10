import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  CreditCard,
  Wallet,
  History,
  FileText,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { ROUTE_PATHS } from '@/lib/index';

// Mock Data
const FINANCIAL_SUMMARY = {
  totalRevenue: 45280000,
  pendingPayouts: 12450000,
  totalPaid: 32830000,
  outstandingBalance: 5200000,
  serviceFees: 4800000,
  growthRate: 12.5,
};

const REVENUE_DATA = [
  { name: 'Sep', revenue: 4200000, payout: 3800000 },
  { name: 'Oct', revenue: 5100000, payout: 4500000 },
  { name: 'Nov', revenue: 4800000, payout: 4200000 },
  { name: 'Dec', revenue: 6200000, payout: 5500000 },
  { name: 'Jan', revenue: 7500000, payout: 6800000 },
  { name: 'Feb', revenue: 8200000, payout: 7200000 },
];

const RECENT_TRANSACTIONS = [
  { id: 'TXN-9021', merchant: 'Global Shop', date: '2026-02-01', amount: 1250000, status: 'Completed', type: 'Payout' },
  { id: 'TXN-9022', merchant: 'Electro Mart', date: '2026-02-02', amount: 850000, status: 'Pending', type: 'Payout' },
  { id: 'TXN-9023', merchant: 'Beauty Hub', date: '2026-02-02', amount: 450000, status: 'Completed', type: 'COD Collection' },
  { id: 'TXN-9024', merchant: 'Global Shop', date: '2026-02-03', amount: 2100000, status: 'Processing', type: 'Payout' },
  { id: 'TXN-9025', merchant: 'Tech World', date: '2026-02-04', amount: 320000, status: 'Failed', type: 'Payout' },
];

const MerchantFinancialCenterPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-gold-400 font-myanmar">
            {t('merchant.financialCenter')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Comprehensive overview of merchant financial performance and payouts.' 
              : 'ကုန်သည်များ၏ ငွေကြေးဆိုင်ရာ စွမ်းဆောင်ရည်နှင့် ငွေပေးချေမှုများအား အနှစ်ချုပ်ကြည့်ရှုရန်။'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-400/50 text-navy-900 dark:text-gold-400">
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button className="luxury-button">
            <CreditCard className="mr-2 h-4 w-4" />
            {t('merchant.invoiceScheduling')}
          </Button>
        </div>
      </div>

      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="lotus-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gold-400 uppercase tracking-wider">{t('merchant.revenue')}</p>
                  <h3 className="text-2xl font-bold text-white mt-2 font-mono">
                    {formatCurrency(FINANCIAL_SUMMARY.totalRevenue)}
                  </h3>
                </div>
                <div className="p-2 bg-gold-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-gold-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-success">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>{FINANCIAL_SUMMARY.growthRate}% {language === 'en' ? 'from last month' : 'ပြီးခဲ့သည့်လထက်'}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/50 dark:bg-navy-900/50 backdrop-blur border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('common.pending')}</p>
                  <h3 className="text-2xl font-bold text-navy-900 dark:text-white mt-2 font-mono">
                    {formatCurrency(FINANCIAL_SUMMARY.pendingPayouts)}
                  </h3>
                </div>
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>12 {language === 'en' ? 'payouts awaiting processing' : 'ငွေထုတ်ယူမှုများ စောင့်ဆိုင်းနေသည်'}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/50 dark:bg-navy-900/50 backdrop-blur border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('common.completed')}</p>
                  <h3 className="text-2xl font-bold text-navy-900 dark:text-white mt-2 font-mono">
                    {formatCurrency(FINANCIAL_SUMMARY.totalPaid)}
                  </h3>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>{language === 'en' ? 'Successfully disbursed this year' : 'ယခုနှစ်အတွင်း အောင်မြင်စွာ ပေးချေပြီး'}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/50 dark:bg-navy-900/50 backdrop-blur border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('accounting.expense')}</p>
                  <h3 className="text-2xl font-bold text-navy-900 dark:text-white mt-2 font-mono">
                    {formatCurrency(FINANCIAL_SUMMARY.serviceFees)}
                  </h3>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>{language === 'en' ? 'Total commission & fees collected' : 'ကမ်မီရှင်နှင့် အခကြေးငွေ စုစုပေါင်း'}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics Chart */}
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-bold">{t('accounting.monthlyReport')}</CardTitle>
              <CardDescription>{language === 'en' ? 'Revenue vs Payout trends' : 'ဝင်ငွေနှင့် ငွေပေးချေမှု အလားအလာများ'}</CardDescription>
            </div>
            <Tabs defaultValue="6m">
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="1m" className="text-[10px]">1M</TabsTrigger>
                <TabsTrigger value="6m" className="text-[10px]">6M</TabsTrigger>
                <TabsTrigger value="1y" className="text-[10px]">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.75 0.15 45)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.75 0.15 45)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.015 220)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="oklch(0.75 0.15 45)" 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="payout" 
                    stroke="oklch(0.22 0.15 220)" 
                    fillOpacity={0} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Balance & Actions */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{t('accounting.balance')}</CardTitle>
            <CardDescription>{language === 'en' ? 'Settlement details' : 'ရှင်းလင်းရန် ကျန်ရှိသော အသေးစိတ်'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700">
              <p className="text-sm text-muted-foreground mb-1">{language === 'en' ? 'Current Outstanding' : 'လက်ရှိ ပေးရန်ကျန်'}</p>
              <h2 className="text-3xl font-bold text-navy-900 dark:text-gold-400 font-mono">
                {formatCurrency(FINANCIAL_SUMMARY.outstandingBalance)}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{language === 'en' ? 'COD Collected' : 'COD ကောက်ခံရရှိမှု'}</span>
                <span className="font-semibold">{formatCurrency(18200000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{language === 'en' ? 'Delivery Fees' : 'ပို့ဆောင်ခ'}</span>
                <span className="font-semibold text-destructive">- {formatCurrency(2400000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{language === 'en' ? 'Insurance' : 'အာမခံ'}</span>
                <span className="font-semibold text-destructive">- {formatCurrency(120000)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between text-base font-bold">
                <span>{t('common.total')}</span>
                <span className="text-gold-600">{formatCurrency(15680000)}</span>
              </div>
            </div>

            <Button className="w-full luxury-button mt-4 group">
              {language === 'en' ? 'Process Mass Payout' : 'အစုလိုက် ငွေပေးချေမှု လုပ်ဆောင်ရန်'}
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table Section */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
            <TabsTrigger value="payout">{language === 'en' ? 'Payouts' : 'ငွေပေးချေမှုများ'}</TabsTrigger>
            <TabsTrigger value="cod">{language === 'en' ? 'COD' : 'COD'}</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('common.search')}
                className="pl-10 h-9 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              {t('common.filter')}
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card className="border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">{language === 'en' ? 'TXN ID' : 'လွှဲပြောင်းမှု ID'}</TableHead>
                  <TableHead>{t('merchant.name')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{language === 'en' ? 'Type' : 'အမျိုးအစား'}</TableHead>
                  <TableHead>{t('order.amount')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Action' : 'လုပ်ဆောင်ချက်'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_TRANSACTIONS.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-semibold">{txn.id}</TableCell>
                    <TableCell className="font-medium">{txn.merchant}</TableCell>
                    <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {txn.type === 'Payout' ? (
                          <Wallet className="mr-2 h-3 w-3 text-gold-500" />
                        ) : (
                          <History className="mr-2 h-3 w-3 text-navy-500" />
                        )}
                        <span className="text-xs">{txn.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-bold">
                      {formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={txn.status === 'Completed' ? 'default' : txn.status === 'Pending' ? 'outline' : 'destructive'}
                        className={txn.status === 'Completed' ? 'bg-success hover:bg-success/90' : ''}
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="payout">
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            {language === 'en' ? 'Filtered view for payouts' : 'ငွေပေးချေမှုများအတွက် စစ်ထုတ်ထားသော မြင်ကွင်း'}
          </div>
        </TabsContent>

        <TabsContent value="cod">
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            {language === 'en' ? 'Filtered view for COD collections' : 'COD ကောက်ခံရရှိမှုများအတွက် စစ်ထုတ်ထားသော မြင်ကွင်း'}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantFinancialCenterPage;