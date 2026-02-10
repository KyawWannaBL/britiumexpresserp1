import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Input 
} from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fadeInUp, staggerContainer, hoverLift } from '@/lib/motion';

// Mock Data
const RECEIPT_DATA = [
  {
    id: "RCP-2026-001",
    merchant: "Golden Mandalay Shop",
    date: "2026-02-01",
    amount: 1250000,
    status: "paid",
    type: "COD Settlement",
    invoiceRef: "INV-2026-442"
  },
  {
    id: "RCP-2026-002",
    merchant: "Yangon Tech Hub",
    date: "2026-02-02",
    amount: 450000,
    status: "pending",
    type: "Shipping Fees",
    invoiceRef: "INV-2026-445"
  },
  {
    id: "RCP-2026-003",
    merchant: "Elite Fashion MM",
    date: "2026-01-28",
    amount: 890000,
    status: "paid",
    type: "COD Settlement",
    invoiceRef: "INV-2026-430"
  },
  {
    id: "RCP-2026-004",
    merchant: "Organic Bites",
    date: "2026-02-03",
    amount: 120000,
    status: "overdue",
    type: "Monthly Subscription",
    invoiceRef: "INV-2026-448"
  },
  {
    id: "RCP-2026-005",
    merchant: "Star Electronics",
    date: "2026-02-04",
    amount: 2300000,
    status: "paid",
    type: "COD Settlement",
    invoiceRef: "INV-2026-450"
  }
];

const MerchantReceiptsPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/30">{t('common.completed')}</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning border-warning/30 hover:bg-warning/30">{t('common.pending')}</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReceipts = RECEIPT_DATA.filter(r => 
    r.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 p-6 md:p-8">
      {/* Header Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-gold-400 font-myanmar">
            {t('merchant.receipts')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage merchant payments, generated invoices, and digital receipts for © 2026 operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-500/50 text-gold-600 hover:bg-gold-50">
            <Printer className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button className="luxury-button">
            <Plus className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </motion.div>

      {/* Statistics Overview */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeInUp}>
          <Card className="lotus-card border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gold-400/80 uppercase tracking-wider">Total Paid</p>
                  <h3 className="text-2xl font-bold text-white mt-1">4.44M Ks</h3>
                </div>
                <div className="p-3 bg-gold-500/20 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-gold-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gold-300">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-white dark:bg-navy-900 border border-border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</p>
                  <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-1">0.45M Ks</h3>
                </div>
                <div className="p-3 bg-warning/10 rounded-xl">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>4 invoices awaiting payment</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-white dark:bg-navy-900 border border-border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overdue</p>
                  <h3 className="text-2xl font-bold text-destructive mt-1">0.12M Ks</h3>
                </div>
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-destructive">
                <span>Urgent attention required</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-white dark:bg-navy-900 border border-border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Receipts Today</p>
                  <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-1">24</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-success">
                <span>System synchronized</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <Card className="border-border/50 shadow-xl">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{t('merchant.receipts')} History</CardTitle>
              <CardDescription>Search and manage all merchant financial documentation</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('common.search') + "..."}
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 py-2 border-b border-border/50">
              <TabsList className="bg-transparent gap-6 h-12">
                <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold-500 rounded-none px-0">{t('common.all')}</TabsTrigger>
                <TabsTrigger value="paid" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold-500 rounded-none px-0">{t('common.completed')}</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold-500 rounded-none px-0">{t('common.pending')}</TabsTrigger>
                <TabsTrigger value="overdue" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold-500 rounded-none px-0">Overdue</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/20">
                    <TableHead className="w-[150px]">Receipt ID</TableHead>
                    <TableHead>{t('merchant.name')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Invoice Ref</TableHead>
                    <TableHead className="text-right">{t('order.amount')}</TableHead>
                    <TableHead>{t('merchant.status')}</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell className="font-mono text-sm font-semibold text-primary">{receipt.id}</TableCell>
                      <TableCell className="font-medium">{receipt.merchant}</TableCell>
                      <TableCell className="text-muted-foreground">{receipt.date}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 bg-primary/5 text-primary rounded-md border border-primary/10">
                          {receipt.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-blue-600 hover:underline cursor-pointer">{receipt.invoiceRef}</TableCell>
                      <TableCell className="text-right font-bold">{receipt.amount.toLocaleString()} Ks</TableCell>
                      <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gold-50 hover:text-gold-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gold-50 hover:text-gold-600">
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Send via Email</DropdownMenuItem>
                              <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Void Receipt</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
          {filteredReceipts.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No receipts found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Documentation Links */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={hoverLift}>
          <Card className="bg-navy-900 text-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-gold-400">Invoicing Schedule</h4>
                  <p className="text-sm text-navy-200">Configure automated invoice generation cycles for merchants.</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gold-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <Button variant="link" className="text-gold-500 p-0 mt-4 hover:text-gold-400">
                Configure Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={hoverLift}>
          <Card className="bg-white dark:bg-navy-900 border border-border shadow-sm group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-navy-950 dark:text-white">Financial Audit Logs</h4>
                  <p className="text-sm text-muted-foreground">View all modifications to financial documents and records.</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <Button variant="link" className="text-primary p-0 mt-4">
                View Logs
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={hoverLift}>
          <Card className="bg-white dark:bg-navy-900 border border-border shadow-sm group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-navy-950 dark:text-white">Bank Integration</h4>
                  <p className="text-sm text-muted-foreground">Manage connections with local banks for automated settlement.</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <Button variant="link" className="text-primary p-0 mt-4">
                Manage Banks
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <footer className="text-center py-6 border-t border-border/30">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
          © 2026 Britium Express Logistics System. All financial documentation is cryptographically signed and stored securely.
        </p>
      </footer>
    </div>
  );
};

export default MerchantReceiptsPage;