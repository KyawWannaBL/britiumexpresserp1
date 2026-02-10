import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  Plus,
  Filter,
  TrendingUp,
  Wallet,
  ArrowRightLeft,
  MoreVertical,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Users,
  DollarSign,
  FileText
} from 'lucide-react';
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
  Line
} from 'recharts';

import { ROUTE_PATHS, Branch } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock Data for Branch Accounting
const BRANCH_STATS = [
  {
    id: 'B001',
    name: 'Yangon Central',
    city: 'Yangon',
    manager: 'U Kyaw Zeya',
    balance: 45250000,
    monthlyIncome: 12500000,
    monthlyExpense: 4200000,
    efficiency: 94,
    status: 'active'
  },
  {
    id: 'B002',
    name: 'Mandalay Hub',
    city: 'Mandalay',
    manager: 'Daw Aye Myint',
    balance: 32100000,
    monthlyIncome: 8400000,
    monthlyExpense: 3100000,
    efficiency: 88,
    status: 'active'
  },
  {
    id: 'B003',
    name: 'Naypyidaw Office',
    city: 'Naypyidaw',
    manager: 'U Soe Win',
    balance: 18500000,
    monthlyIncome: 4500000,
    monthlyExpense: 2200000,
    efficiency: 91,
    status: 'active'
  },
  {
    id: 'B004',
    name: 'Taunggyi Station',
    city: 'Taunggyi',
    manager: 'Daw Phyu Phyu',
    balance: 12400000,
    monthlyIncome: 3100000,
    monthlyExpense: 1800000,
    efficiency: 85,
    status: 'inactive'
  }
];

const PERFORMANCE_DATA = [
  { name: 'Jan', income: 45000, expense: 32000 },
  { name: 'Feb', income: 52000, expense: 34000 },
  { name: 'Mar', income: 48000, expense: 31000 },
  { name: 'Apr', income: 61000, expense: 38000 },
  { name: 'May', income: 55000, expense: 35000 },
  { name: 'Jun', income: 67000, expense: 41000 },
];

const BranchesPage: React.FC = () => {
  const { language } = useLanguageContext();
  const t = (key: string) => translations[language][key as keyof typeof translations['en']] || key;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-gold-400 font-myanmar">
            {t('accounting.branches')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Manage branch-level financial allocation and monitor performance metrics.' 
              : 'ဒါနခွဲအလိုက် ငွေကြေးခွဲဝေမှုနှင့် စွမ်းဆောင်ရည်များကို စီမံခန့်ခွဲပါ။'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="luxury-button">
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Inter-Branch Transfer' : 'ဒါနခွဲအချင်းချင်း ငွေလွှဲရန်'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] lotus-card text-foreground">
              <DialogHeader>
                <DialogTitle className="text-gold-500">{language === 'en' ? 'Transfer Funds' : 'ငွေလွှဲရန်'}</DialogTitle>
                <DialogDescription className="text-navy-200">
                  {language === 'en' ? 'Move operational funds between branch accounts.' : 'ဒါနခွဲအကောင့်များအကြား လုပ်ငန်းသုံးငွေများ လွှဲပြောင်းပါ။'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="from">{language === 'en' ? 'From Branch' : 'ပေးပို့မည့် ဒါနခွဲ'}</Label>
                  <Select>
                    <SelectTrigger id="from" className="bg-navy-800 border-gold-400/30">
                      <SelectValue placeholder="Select source branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCH_STATS.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to">{language === 'en' ? 'To Branch' : 'လက်ခံမည့် ဒါနခွဲ'}</Label>
                  <Select>
                    <SelectTrigger id="to" className="bg-navy-800 border-gold-400/30">
                      <SelectValue placeholder="Select target branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCH_STATS.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">{language === 'en' ? 'Amount (MMK)' : 'ပမာဏ (ကျပ်)'}</Label>
                  <Input id="amount" type="number" placeholder="0.00" className="bg-navy-800 border-gold-400/30" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="luxury-button w-full">{t('common.confirm')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-gold-400/50 text-gold-500 hover:bg-gold-500/10">
            <Plus className="w-4 h-4 mr-2" />
            {t('common.add')}
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="lotus-card overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-navy-300">{language === 'en' ? 'Total Branch Liquidity' : 'ဒါနခွဲစုစုပေါင်း လက်ကျန်ငွေ'}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gold-400 font-mono">108,250,000</h3>
                </div>
                <div className="p-3 rounded-xl bg-gold-500/10 text-gold-500 group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-success">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="lotus-card overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-navy-300">{language === 'en' ? 'Active Branches' : 'အသုံးပြုနေသော ဒါနခွဲများ'}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gold-400 font-mono">24</h3>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-navy-400">
                <Users className="w-4 h-4 mr-1" />
                <span>3 new stations in 2026</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="lotus-card overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-navy-300">{language === 'en' ? 'Avg Branch Margin' : 'ဒါနခွဲ ပျမ်းမျှအမြတ်'}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gold-400 font-mono">32.4%</h3>
                </div>
                <div className="p-3 rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-success">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>Steady growth</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="lotus-card overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-navy-300">{language === 'en' ? 'Pending Settlements' : 'စောင့်ဆိုင်းနေသော ငွေစာရင်းများ'}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gold-400 font-mono">14,200,000</h3>
                </div>
                <div className="p-3 rounded-xl bg-warning/10 text-warning group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-destructive">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                <span>5 high-value audits</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Branch List */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{language === 'en' ? 'Branch Financial Overview' : 'ဒါနခွဲ ငွေကြေးအနှစ်ချုပ်'}</CardTitle>
              <CardDescription>{language === 'en' ? 'Current standing and operational health of all branches.' : 'ဒါနခွဲအားလုံး၏ လက်ရှိအခြေအနေနှင့် ငွေကြေးကျန်းမာမှု။'}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('common.search')}
                  className="pl-9 w-[200px] bg-background border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{language === 'en' ? 'Branch Details' : 'ဒါနခွဲ အချက်အလက်'}</TableHead>
                  <TableHead>{language === 'en' ? 'Financial Status' : 'ငွေကြေး အခြေအနေ'}</TableHead>
                  <TableHead>{language === 'en' ? 'Monthly Flow' : 'လစဉ် စီးဆင်းမှု'}</TableHead>
                  <TableHead>{language === 'en' ? 'Efficiency' : 'စွမ်းဆောင်ရည်'}</TableHead>
                  <TableHead className="text-right">{t('warehouse.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BRANCH_STATS.map((branch) => (
                  <TableRow key={branch.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-navy-900 dark:text-gold-100">{branch.name}</span>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mr-1" /> {branch.city}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono font-medium">{branch.balance.toLocaleString()} MMK</span>
                        <Badge 
                          variant={branch.status === 'active' ? 'default' : 'secondary'}
                          className={branch.status === 'active' ? 'bg-success/20 text-success border-success/30 w-fit mt-1' : 'w-fit mt-1'}
                        >
                          {branch.status === 'active' ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-success">
                          <ArrowUpRight className="w-3 h-3 mr-1" /> {branch.monthlyIncome.toLocaleString()}
                        </div>
                        <div className="flex items-center text-xs text-destructive">
                          <ArrowDownRight className="w-3 h-3 mr-1" /> {branch.monthlyExpense.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-1.5 max-w-[60px]">
                          <div 
                            className="bg-gold-500 h-1.5 rounded-full" 
                            style={{ width: `${branch.efficiency}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{branch.efficiency}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-gold-500/10">
                            <MoreVertical className="h-4 w-4 text-gold-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="lotus-card border-gold-400/30">
                          <DropdownMenuLabel>{t('warehouse.action')}</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gold-400/20" />
                          <DropdownMenuItem className="hover:bg-gold-500/20">
                            <FileText className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'View Ledger' : 'စာရင်းစာအုပ်ကြည့်ရန်'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gold-500/20">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Profit Report' : 'အမြတ်အစွန်း အစီရင်ခံစာ'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/20">
                            <ChevronRight className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Deactivate Branch' : 'ဒါနခွဲရပ်ဆိုင်းရန်'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column: Performance Analytics */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Performance Trend' : 'စွမ်းဆောင်ရည် လမ်းကြောင်း'}</CardTitle>
              <CardDescription>{language === 'en' ? 'Income vs Expense (Last 6 Months)' : 'ဝင်ငွေနှင့် ကုန်ကျစရိတ် (နောက်ဆုံး ၆ လ)'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PERFORMANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(234, 179, 8, 0.3)', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Bar dataKey="income" fill="#EAB308" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" fill="#334155" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold-500" />
                  <span className="text-xs text-muted-foreground">{t('accounting.income')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-navy-800 dark:bg-navy-200" />
                  <span className="text-xs text-muted-foreground">{t('accounting.expense')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-navy-900 to-navy-800 text-gold-400 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{language === 'en' ? 'Top Branch' : 'အကောင်းဆုံး ဒါနခွဲ'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold-500 rounded-lg text-navy-900">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold">Yangon Central</p>
                    <p className="text-xs opacity-70">Branch #B001</p>
                  </div>
                </div>
                <Badge className="bg-gold-500/20 text-gold-400 border-gold-400/50">#1 Performance</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{language === 'en' ? 'Target Achievement' : 'ရည်မှန်းချက် ပြည့်မီမှု'}</span>
                  <span>98%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gold-500 h-2 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>
              <Button variant="outline" className="w-full border-gold-400/30 text-gold-400 hover:bg-gold-400/10 mt-2">
                {language === 'en' ? 'View Full Analytics' : 'အသေးစိတ် စာရင်းကြည့်ရန်'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BranchesPage;