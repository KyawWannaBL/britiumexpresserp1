import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Download,
  ArrowUpDown,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';

// Mock Data for Chart of Accounts
const MOCK_ACCOUNTS = [
  { id: '1', code: '1010', name: 'Main Cash Account', category: 'Asset', subCategory: 'Cash', balance: 12500000, status: 'active', myName: 'ပင်မ ငွေသား အကောင့်' },
  { id: '2', code: '1020', name: 'KBZ Bank - Operations', category: 'Asset', subCategory: 'Bank', balance: 45000000, status: 'active', myName: 'ကမ္ဘောဇဘဏ် - လုပ်ငန်းလည်ပတ်မှု' },
  { id: '3', code: '2010', name: 'Accounts Payable', category: 'Liability', subCategory: 'Current Liability', balance: 5200000, status: 'active', myName: 'ပေးရန်ရှိ အကောင့်များ' },
  { id: '4', code: '3010', name: "Owner's Equity", category: 'Equity', subCategory: 'Capital', balance: 100000000, status: 'active', myName: 'ပိုင်ရှင်၏ အစုရှယ်ယာ' },
  { id: '5', code: '4010', name: 'Delivery Service Revenue', category: 'Revenue', subCategory: 'Operating Revenue', balance: 85400000, status: 'active', myName: 'ပို့ဆောင်မှု ဝန်ဆောင်မှု ဝင်ငွေ' },
  { id: '6', code: '5010', name: 'Rider Commissions', category: 'Expense', subCategory: 'Direct Expense', balance: 12400000, status: 'active', myName: 'ပို့ဆောင်သူ ကော်မရှင်များ' },
  { id: '7', code: '5020', name: 'Office Rent', category: 'Expense', subCategory: 'Administrative', balance: 2500000, status: 'active', myName: 'ရုံးခန်းငှားရမ်းခ' },
  { id: '8', code: '1030', name: 'CB Bank - Savings', category: 'Asset', subCategory: 'Bank', balance: 15000000, status: 'active', myName: 'စီဘီဘဏ် - စုငွေ' },
];

const AccountsPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter(account => {
      const matchesSearch = 
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.myName.includes(searchQuery) ||
        account.code.includes(searchQuery);
      
      const matchesCategory = categoryFilter === 'all' || account.category.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const totals = useMemo(() => {
    return {
      assets: MOCK_ACCOUNTS.filter(a => a.category === 'Asset').reduce((sum, a) => sum + a.balance, 0),
      liabilities: MOCK_ACCOUNTS.filter(a => a.category === 'Liability').reduce((sum, a) => sum + a.balance, 0),
      revenue: MOCK_ACCOUNTS.filter(a => a.category === 'Revenue').reduce((sum, a) => sum + a.balance, 0),
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight royal-navy bg-clip-text text-transparent">
            {t('accounting.accounts')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Manage your chart of accounts and monitor real-time balances.' 
              : 'သင့်စာရင်းဇယားများကို စီမံခန့်ခွဲပြီး လက်ကျန်ငွေများကို အချိန်နှင့်တပြေးညီ စောင့်ကြည့်ပါ။'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-400/50 text-gold-600 hover:bg-gold-50">
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button className="luxury-button">
            <Plus className="mr-2 h-4 w-4" />
            {t('common.add')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="lotus-card border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold-300/80 text-sm font-medium">{language === 'en' ? 'Total Assets' : 'စုစုပေါင်း ပိုင်ဆိုင်မှု'}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(totals.assets)}</h3>
              </div>
              <div className="p-3 bg-gold-500/20 rounded-xl">
                <Wallet className="h-6 w-6 text-gold-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gold-300/60">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              <span>+4.5% {language === 'en' ? 'from last month' : 'ယခင်လထက်' }</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-navy-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{language === 'en' ? 'Total Liabilities' : 'စုစုပေါင်း ပေးရန်တာဝန်'}</p>
                <h3 className="text-2xl font-bold text-navy-900 mt-1">{formatCurrency(totals.liabilities)}</h3>
              </div>
              <div className="p-3 bg-destructive/10 rounded-xl">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <span className="text-destructive font-medium">-1.2%</span>
              <span className="ml-1">{language === 'en' ? 'reduction this week' : 'ယခုအပတ် လျော့ကျမှု'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-navy-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{t('dashboard.revenue')}</p>
                <h3 className="text-2xl font-bold text-navy-900 mt-1">{formatCurrency(totals.revenue)}</h3>
              </div>
              <div className="p-3 bg-success/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <span className="text-success font-medium">+12.8%</span>
              <span className="ml-1">{language === 'en' ? 'above target' : 'သတ်မှတ်ချက်ထက် ကျော်လွန်'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="glass-card border-navy-100 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('common.search')}
                className="pl-10 bg-white/50 border-navy-100 focus:border-gold-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-white/50 border-navy-100">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder={t('common.filter')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="asset">Asset</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-navy-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-navy-50/50">
                <TableRow>
                  <TableHead className="w-[100px] font-bold text-navy-900">{language === 'en' ? 'Code' : 'ကုဒ်'}</TableHead>
                  <TableHead className="font-bold text-navy-900">{language === 'en' ? 'Account Name' : 'အကောင့်အမည်'}</TableHead>
                  <TableHead className="font-bold text-navy-900">{language === 'en' ? 'Category' : 'အမျိုးအစား'}</TableHead>
                  <TableHead className="text-right font-bold text-navy-900">{t('accounting.balance')}</TableHead>
                  <TableHead className="text-center font-bold text-navy-900">{t('merchant.status')}</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-navy-50/30 transition-colors group">
                    <TableCell className="font-mono font-medium text-navy-700">{account.code}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-navy-900">{account.name}</span>
                        <span className="text-xs text-muted-foreground myanmar-text">{account.myName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{account.category}</span>
                        <span className="text-[10px] text-muted-foreground">{account.subCategory}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-navy-900">
                      {formatCurrency(account.balance)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {t('common.active')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>{language === 'en' ? 'Actions' : 'လုပ်ဆောင်ချက်များ'}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-info" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4 text-gold-600" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4 text-navy-600" />
                            {language === 'en' ? 'Statement' : 'စာရင်းရှင်းတမ်း'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAccounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Search className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground font-medium">
                          {language === 'en' ? 'No accounts found matching your criteria.' : 'ရှာဖွေမှုနှင့် ကိုက်ညီသော အကောင့်များ မရှိပါ။'}
                        </p>
                        <Button variant="link" className="text-gold-600" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}>
                          {t('common.reset')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>© 2026 Britium Express. {language === 'en' ? 'All rights reserved.' : 'မူပိုင်ခွင့်များအားလုံး လက်ဝယ်ရှိသည်။'}</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gold-600 transition-colors">{language === 'en' ? 'Help Center' : 'အကူအညီဌာန'}</a>
          <a href="#" className="hover:text-gold-600 transition-colors">{language === 'en' ? 'Privacy Policy' : 'ကိုယ်ရေးအချက်အလက် မူဝါဒ'}</a>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
