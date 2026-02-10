import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface BankAccount {
  id: string;
  merchantName: string;
  merchantId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  type: 'Bank' | 'Wallet';
  status: 'Active' | 'Inactive' | 'Pending';
  isDefault: boolean;
  verifiedAt?: string;
}

const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: 'BA-001',
    merchantName: 'Golden Lotus Trading',
    merchantId: 'M-1029',
    bankName: 'KBZ Bank',
    accountName: 'U Kyaw Zeya',
    accountNumber: '102-301-445920192',
    branch: 'Yangon Main',
    type: 'Bank',
    status: 'Active',
    isDefault: true,
    verifiedAt: '2026-01-15',
  },
  {
    id: 'BA-002',
    merchantName: 'Royal Silk Fashion',
    merchantId: 'M-5521',
    bankName: 'CB Bank',
    accountName: 'Daw Aye Aye Myint',
    accountNumber: '0012-6005-0012-9988',
    branch: 'Mandalay Central',
    type: 'Bank',
    status: 'Active',
    isDefault: true,
    verifiedAt: '2025-12-20',
  },
  {
    id: 'BA-003',
    merchantName: 'Smart Gadgets MM',
    merchantId: 'M-8843',
    bankName: 'Wave Money',
    accountName: 'U Hla Win',
    accountNumber: '09798822114',
    branch: 'Digital Wallet',
    type: 'Wallet',
    status: 'Pending',
    isDefault: true,
  },
  {
    id: 'BA-004',
    merchantName: 'Smart Gadgets MM',
    merchantId: 'M-8843',
    bankName: 'AYA Bank',
    accountName: 'Smart Gadgets Co., Ltd.',
    accountNumber: '200-112-990088',
    branch: 'Hledan Branch',
    type: 'Bank',
    status: 'Inactive',
    isDefault: false,
  },
  {
    id: 'BA-005',
    merchantName: 'Elite Organics',
    merchantId: 'M-3321',
    bankName: 'KBZPay',
    accountName: 'Elite Organics Business',
    accountNumber: '09445566778',
    branch: 'Digital Wallet',
    type: 'Wallet',
    status: 'Active',
    isDefault: true,
    verifiedAt: '2026-02-01',
  }
];

const BankAccountListPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter(acc => {
      const matchesSearch = 
        acc.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.accountNumber.includes(searchQuery) ||
        acc.bankName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || acc.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status: BankAccount['status']) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-success/15 text-success border-success/30">{t('common.active')}</Badge>;
      case 'Inactive':
        return <Badge className="bg-destructive/15 text-destructive border-destructive/30">{t('common.inactive')}</Badge>;
      case 'Pending':
        return <Badge className="bg-warning/15 text-warning border-warning/30">{t('common.pending')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-950">
            {t('merchant.bankAccountList')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage financial profiles and disbursement channels for all registered merchants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-500/50 text-gold-600 hover:bg-gold-50">
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="luxury-button">
                <Plus className="mr-2 h-4 w-4" />
                {t('common.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] lotus-card text-white border-gold-400/30">
              <DialogHeader>
                <DialogTitle className="text-gold-400 text-xl font-bold">Add New Bank Account</DialogTitle>
                <DialogDescription className="text-navy-200">
                  Enter the banking details for the merchant to enable financial settlements.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="merchant" className="text-right text-navy-100">Merchant</Label>
                  <div className="col-span-3">
                    <Select>
                      <SelectTrigger className="w-full bg-navy-800 border-gold-400/20">
                        <SelectValue placeholder="Select Merchant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m1">Golden Lotus Trading</SelectItem>
                        <SelectItem value="m2">Royal Silk Fashion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bank" className="text-right text-navy-100">Bank Name</Label>
                  <Input id="bank" placeholder="e.g. KBZ Bank" className="col-span-3 bg-navy-800 border-gold-400/20" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accName" className="text-right text-navy-100">Account Name</Label>
                  <Input id="accName" className="col-span-3 bg-navy-800 border-gold-400/20" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accNum" className="text-right text-navy-100">Account Number</Label>
                  <Input id="accNum" className="col-span-3 bg-navy-800 border-gold-400/20" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="luxury-button w-full">{t('common.save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-navy-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Accounts</p>
                <p className="text-2xl font-bold text-navy-950">1,248</p>
              </div>
              <div className="p-3 bg-navy-50 rounded-full text-navy-800">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verified Banks</p>
                <p className="text-2xl font-bold text-navy-950">1,192</p>
              </div>
              <div className="p-3 bg-success/10 rounded-full text-success">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Verification</p>
                <p className="text-2xl font-bold text-navy-950">56</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-full text-warning">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Table Section */}
      <Card className="shadow-sm border-navy-100">
        <CardHeader className="border-b border-navy-50">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="active">{t('common.active')}</SelectItem>
                  <SelectItem value="pending">{t('common.pending')}</SelectItem>
                  <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-navy-50/50">
              <TableRow>
                <TableHead className="w-[250px] font-semibold text-navy-900">{t('merchant.name')}</TableHead>
                <TableHead className="font-semibold text-navy-900">Bank / Provider</TableHead>
                <TableHead className="font-semibold text-navy-900">Account Details</TableHead>
                <TableHead className="font-semibold text-navy-900">Type</TableHead>
                <TableHead className="font-semibold text-navy-900">{t('common.status')}</TableHead>
                <TableHead className="text-right font-semibold text-navy-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode='popLayout'>
                {filteredAccounts.map((account) => (
                  <motion.tr
                    key={account.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-navy-50/30 transition-colors border-b border-navy-50"
                  >
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-navy-950">{account.merchantName}</span>
                        <span className="text-xs text-muted-foreground font-mono">{account.merchantId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-navy-100 rounded-lg text-navy-700">
                          {account.type === 'Bank' ? <Building2 className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{account.bankName}</span>
                          <span className="text-xs text-muted-foreground">{account.branch}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-semibold">{account.accountNumber}</span>
                        <span className="text-xs text-muted-foreground">{account.accountName}</span>
                        {account.isDefault && (
                          <span className="inline-flex items-center mt-1 text-[10px] text-gold-600 font-bold uppercase tracking-tighter">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Default
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {account.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(account.status)}
                      {account.verifiedAt && (
                        <p className="text-[10px] text-muted-foreground mt-1">Verified: {account.verifiedAt}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-navy-100">
                            <MoreHorizontal className="h-4 w-4 text-navy-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ShieldCheck className="mr-2 h-4 w-4" /> Verify Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ExternalLink className="mr-2 h-4 w-4" /> View Merchant
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          
          {filteredAccounts.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-navy-950">No bank accounts found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
              <Button 
                variant="link" 
                className="mt-2 text-gold-600 font-semibold"
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Connectivity Links */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="font-semibold">Related Management:</span>
        <a href={ROUTE_PATHS.MERCHANT_LIST} className="hover:text-gold-600 transition-colors flex items-center gap-1">
          <MoreHorizontal className="h-3 w-3" /> Merchant Directory
        </a>
        <a href={ROUTE_PATHS.MERCHANT_FINANCIAL_CENTER} className="hover:text-gold-600 transition-colors flex items-center gap-1">
          <Wallet className="h-3 w-3" /> Financial Center
        </a>
        <a href={ROUTE_PATHS.ACCOUNTING_BANKS} className="hover:text-gold-600 transition-colors flex items-center gap-1">
          <Building2 className="h-3 w-3" /> Corporate Banks
        </a>
      </div>
    </div>
  );
};

export default BankAccountListPage;