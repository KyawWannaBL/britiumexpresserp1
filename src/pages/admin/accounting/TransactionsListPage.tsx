import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Calendar,
  FileText,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  Building2
} from 'lucide-react';
import { 
  FinancialRecord, 
  ROUTE_PATHS 
} from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
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
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Mock Data for 2026 Financial Transactions
const MOCK_TRANSACTIONS: FinancialRecord[] = [
  {
    id: 'TX-2026-001',
    type: 'income',
    category: 'Delivery Fees',
    amount: 1250000,
    date: '2026-02-03T10:30:00Z',
    description: 'Bulk delivery payment from Merchant: Elite Fashion',
    referenceNumber: 'INV-78921',
    branchId: 'Yangon North',
  },
  {
    id: 'TX-2026-002',
    type: 'expense',
    category: 'Fuel',
    amount: 450000,
    date: '2026-02-03T14:15:00Z',
    description: 'Weekly fuel allowance for Rider Team A',
    referenceNumber: 'EXP-4401',
    branchId: 'Mandalay Central',
  },
  {
    id: 'TX-2026-003',
    type: 'income',
    category: 'COD Commission',
    amount: 85000,
    date: '2026-02-02T09:00:00Z',
    description: 'Commission from Batch #445 COD collections',
    referenceNumber: 'COD-REC-002',
    branchId: 'Yangon South',
  },
  {
    id: 'TX-2026-004',
    type: 'expense',
    category: 'Maintenance',
    amount: 120000,
    date: '2026-02-01T16:45:00Z',
    description: 'Vehicle repair - Plate No. YGN-9902',
    referenceNumber: 'MAINT-092',
    branchId: 'Bago Station',
  },
  {
    id: 'TX-2026-005',
    type: 'income',
    category: 'Warehouse Storage',
    amount: 3200000,
    date: '2026-02-01T11:20:00Z',
    description: 'Monthly storage fee - Global Electronics',
    referenceNumber: 'INV-78955',
    branchId: 'Yangon North',
  },
  {
    id: 'TX-2026-006',
    type: 'expense',
    category: 'Utilities',
    amount: 280000,
    date: '2026-01-31T10:00:00Z',
    description: 'Electricity bill for Mandalay Hub',
    referenceNumber: 'UTIL-JAN-02',
    branchId: 'Mandalay Central',
  }
];

const TransactionsListPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<FinancialRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      const matchesSearch = 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || tx.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const stats = useMemo(() => {
    const income = MOCK_TRANSACTIONS
      .filter(tx => tx.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = MOCK_TRANSACTIONS
      .filter(tx => tx.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'my' ? 'my-MM' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (tx: FinancialRecord) => {
    setSelectedTx(tx);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            {t('accounting.transactions')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.overview')} — Financial Records for Feb 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-400 text-gold-600 hover:bg-gold-50">
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button className="bg-navy-900 text-gold-400 hover:bg-navy-800">
            <Plus className="mr-2 h-4 w-4" />
            {t('common.add')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-success shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {t('accounting.income')}
                  </p>
                  <h2 className="text-2xl font-bold text-success mt-1">
                    {formatCurrency(stats.income)}
                  </h2>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <ArrowUpRight className="h-6 w-6 text-success" />
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
          <Card className="border-l-4 border-l-destructive shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {t('accounting.expense')}
                  </p>
                  <h2 className="text-2xl font-bold text-destructive mt-1">
                    {formatCurrency(stats.expense)}
                  </h2>
                </div>
                <div className="p-3 bg-destructive/10 rounded-full">
                  <ArrowDownLeft className="h-6 w-6 text-destructive" />
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
          <Card className="border-l-4 border-l-gold-500 shadow-sm bg-navy-900 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gold-300/80 uppercase tracking-wider">
                    {t('accounting.balance')}
                  </p>
                  <h2 className="text-2xl font-bold text-gold-400 mt-1">
                    {formatCurrency(stats.balance)}
                  </h2>
                </div>
                <div className="p-3 bg-gold-400/20 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-gold-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search') + " (ID, Reference, Description)..."}
              className="pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px] h-10">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="income">{t('accounting.income')}</SelectItem>
                <SelectItem value="expense">{t('accounting.expense')}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-10">
              <Calendar className="mr-2 h-4 w-4" />
              {t('reports.dateRange')}
            </Button>

            <Button variant="ghost" className="h-10 text-muted-foreground" onClick={() => {setSearchTerm(''); setFilterType('all');}}>
              {t('common.reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[150px]">{t('common.date')}</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">{t('accounting.branches')}</TableHead>
                <TableHead>{t('tracking.status')}</TableHead>
                <TableHead className="text-right">{t('order.amount')}</TableHead>
                <TableHead className="text-center w-[80px]">{t('warehouse.action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-navy-600">{tx.id}</span>
                        <span className="text-sm text-muted-foreground">{tx.referenceNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-navy-50 text-navy-700 border-navy-100">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building2 className="mr-1.5 h-3 w-3" />
                        {tx.branchId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={tx.type === 'income' 
                          ? "bg-success/15 text-success hover:bg-success/20 border-none"
                          : "bg-destructive/15 text-destructive hover:bg-destructive/20 border-none"
                        }
                      >
                        {tx.type === 'income' ? t('accounting.income') : t('accounting.expense')}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${tx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('warehouse.action')}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(tx)}>
                            <Eye className="mr-2 h-4 w-4" /> {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> {t('reports.exportPdf')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Clock className="h-10 w-10 mb-2 opacity-20" />
                      <p>{t('common.none')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {MOCK_TRANSACTIONS.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>{t('common.previous')}</Button>
            <Button variant="outline" size="sm" className="bg-navy-900 text-white">1</Button>
            <Button variant="outline" size="sm">{t('common.next')}</Button>
          </div>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px] border-gold-400/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold-500" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Complete breakdown of financial record {selectedTx?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Type</p>
                  <Badge className={selectedTx.type === 'income' ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                    {selectedTx.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Reference No.</p>
                  <p className="font-mono font-semibold">{selectedTx.referenceNumber}</p>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className={`text-lg font-bold ${selectedTx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(selectedTx.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium">{formatDate(selectedTx.date)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Branch</span>
                  <span className="text-sm font-medium">{selectedTx.branchId}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedTx.description}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Category</p>
                <div className="flex gap-2">
                   <Badge variant="secondary">{selectedTx.category}</Badge>
                   {selectedTx.shipmentId && <Badge variant="outline">Shipment: {selectedTx.shipmentId}</Badge>}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="w-full sm:w-auto">
              {t('common.close')}
            </Button>
            <Button className="bg-navy-900 text-gold-400 hover:bg-navy-800 w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> {t('reports.exportPdf')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Branding */}
      <div className="pt-10 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; 2026 Britium Express Logistics System. All rights reserved. Myanmar &bull; Singapore &bull; Thailand
        </p>
      </div>
    </div>
  );
};

export default TransactionsListPage;