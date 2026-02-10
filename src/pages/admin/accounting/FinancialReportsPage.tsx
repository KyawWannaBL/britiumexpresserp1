import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  PieChart,
  ArrowDownToLine,
  Calendar,
  Filter,
  Download,
  Printer,
  ChevronRight,
  Wallet,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

const FinancialReportsPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('profit-loss');

  // Mock Data for Reports
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 45000, expenses: 32000 },
    { name: 'Feb', revenue: 52000, expenses: 34000 },
    { name: 'Mar', revenue: 48000, expenses: 31000 },
    { name: 'Apr', revenue: 61000, expenses: 38000 },
    { name: 'May', revenue: 55000, expenses: 36000 },
    { name: 'Jun', revenue: 67000, expenses: 41000 },
  ];

  const expenseBreakdown = [
    { name: 'Rider Salaries', value: 15000, color: '#0f172a' },
    { name: 'Fuel & Maintenance', value: 8000, color: '#eab308' },
    { name: 'Warehouse Rent', value: 12000, color: '#334155' },
    { name: 'Marketing', value: 4000, color: '#94a3b8' },
    { name: 'Others', value: 2000, color: '#cbd5e1' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 mb-1">
            {t('accounting.financialReports')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Comprehensive financial analysis and statement reporting for fiscal year 2026.' 
              : '၂၀၂၆ ဘဏ္ဍာနှစ်အတွက် ပြည့်စုံသော ငွေကြေးခွဲခြမ်းစိတ်ဖြာမှုနှင့် အစီရင်ခံစာများ။'}
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-400/50 text-navy-900">
            <Calendar className="mr-2 h-4 w-4" />
            {t('reports.dateRange')}
          </Button>
          <Button className="luxury-button">
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[ 
          { label: t('accounting.income'), value: '$328,000', icon: ArrowUpRight, trend: '+12.5%', color: 'text-success' },
          { label: t('accounting.expense'), value: '$212,000', icon: ArrowDownRight, trend: '+4.2%', color: 'text-destructive' },
          { label: t('accounting.profit'), value: '$116,000', icon: TrendingUp, trend: '+18.1%', color: 'text-gold-600' },
          { label: t('accounting.cashFlow'), value: '$94,500', icon: Wallet, trend: '+5.4%', color: 'text-navy-600' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-gold-400/20 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-navy-50 rounded-lg">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-none">
                    {stat.trend}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="profit-loss" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-navy-50/50 p-1 rounded-xl">
          <TabsTrigger value="profit-loss" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:shadow-sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('accounting.profit')} & {t('accounting.loss')}
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:shadow-sm">
            <Briefcase className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Balance Sheet' : 'လက်ကျန်ရှင်းတမ်း'}
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:shadow-sm">
            <Wallet className="mr-2 h-4 w-4" />
            {t('accounting.cashFlow')}
          </TabsTrigger>
        </TabsList>

        {/* Profit & Loss Content */}
        <TabsContent value="profit-loss">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-gold-400/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{language === 'en' ? 'Income Statement (Monthly)' : 'လစဉ်ဝင်ငွေရှင်းတမ်း' }</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" /> Print</Button>
                  </div>
                </CardTitle>
                <CardDescription>January - June 2026 Overview</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#0f172a" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="#eab308" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-gold-400/20">
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Expense Breakdown' : 'အသုံးစရိတ်ခွဲခြမ်းစိတ်ဖြာမှု'}</CardTitle>
                <CardDescription>Current Period Allocation</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {expenseBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-gold-400/20 overflow-hidden">
               <Table>
                <TableHeader className="bg-navy-50">
                  <TableRow>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{language === 'en' ? 'Category' : 'အမျိုးအစား'}</TableHead>
                    <TableHead>{language === 'en' ? 'Reference' : 'ကိုးကားချက်'}</TableHead>
                    <TableHead className="text-right">{t('accounting.income')}</TableHead>
                    <TableHead className="text-right">{t('accounting.expense')}</TableHead>
                    <TableHead className="text-right">{t('accounting.balance')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">2026-02-{10 + i}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {i % 2 === 0 ? 'Delivery Revenue' : 'Operational Cost'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">REF-2026-00{i}</TableCell>
                      <TableCell className="text-right font-medium text-success">{i % 2 === 0 ? `$${(1500 * i).toLocaleString()}` : '-'}</TableCell>
                      <TableCell className="text-right font-medium text-destructive">{i % 2 !== 0 ? `$${(400 * i).toLocaleString()}` : '-'}</TableCell>
                      <TableCell className="text-right font-bold text-navy-900">$42,350.00</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
               </Table>
            </Card>
          </div>
        </TabsContent>

        {/* Balance Sheet Content */}
        <TabsContent value="balance-sheet">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-gold-400/20">
              <CardHeader className="bg-navy-900 text-gold-400 rounded-t-lg">
                <CardTitle className="flex items-center">
                  <ArrowUpRight className="mr-2" />
                  {language === 'en' ? 'Assets' : 'ရရန်ပိုင်ခွင့်များ'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  <div className="p-4">
                    <h4 className="font-bold mb-3 text-navy-900">Current Assets</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cash and Cash Equivalents</span>
                        <span className="font-medium">$145,200</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Accounts Receivable</span>
                        <span className="font-medium">$68,400</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Prepaid Expenses</span>
                        <span className="font-medium">$12,500</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-3 text-navy-900">Fixed Assets</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Delivery Vehicles</span>
                        <span className="font-medium">$320,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Warehouse Equipment</span>
                        <span className="font-medium">$85,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Office Property</span>
                        <span className="font-medium">$1,200,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-navy-50 flex justify-between items-center">
                    <span className="font-bold text-navy-900">Total Assets</span>
                    <span className="font-bold text-navy-900 text-lg">$1,831,100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold-400/20">
              <CardHeader className="bg-gold-500 text-navy-900 rounded-t-lg">
                <CardTitle className="flex items-center">
                  <ArrowDownRight className="mr-2" />
                  {language === 'en' ? 'Liabilities & Equity' : 'ပေးရန်တာဝန်နှင့် အစုရှယ်ယာ'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  <div className="p-4">
                    <h4 className="font-bold mb-3 text-navy-900">Current Liabilities</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accounts Payable</span>
                        <span className="font-medium">$42,300</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Accrued Payroll</span>
                        <span className="font-medium">$28,900</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Short-term Loans</span>
                        <span className="font-medium">$50,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-3 text-navy-900">Equity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Retained Earnings</span>
                        <span className="font-medium">$459,900</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Owner Capital</span>
                        <span className="font-medium">$1,250,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gold-50 flex justify-between items-center">
                    <span className="font-bold text-navy-900">Total Liabilities & Equity</span>
                    <span className="font-bold text-navy-900 text-lg">$1,831,100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Flow Content */}
        <TabsContent value="cash-flow">
          <Card className="border-gold-400/20">
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Cash Flow Statement' : 'ငွေကြေးစီးဆင်းမှုရှင်းတမ်း'}</CardTitle>
              <CardDescription>Quarterly Cash Movement Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-navy-50 border border-navy-100">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Operating Activities</p>
                    <p className="text-2xl font-bold text-navy-900">+$84,200</p>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-50 border border-navy-100">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Investing Activities</p>
                    <p className="text-2xl font-bold text-destructive">-$120,000</p>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-50 border border-navy-100">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Financing Activities</p>
                    <p className="text-2xl font-bold text-success">+$45,000</p>
                  </div>
                </div>

                <div className="h-[300px] mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-gold-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Net Cash Increase for Period</p>
                      <p className="text-xl font-bold text-navy-900">$9,200</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Closing Cash Balance</p>
                      <p className="text-xl font-bold text-gold-600">$145,200</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Branding */}
      <div className="mt-12 text-center text-muted-foreground text-xs">
        <p>© 2026 Britium Express Logistics System. All financial data is encrypted and audit-compliant.</p>
      </div>
    </div>
  );
};

export default FinancialReportsPage;
