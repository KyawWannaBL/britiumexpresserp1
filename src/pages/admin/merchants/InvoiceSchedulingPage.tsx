import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Search,
  Plus,
  Settings2,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle2,
  Filter,
  MoreVertical,
  ArrowRightLeft,
  Save
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import { ROUTE_PATHS } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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

const InvoiceSchedulingPage: React.FC = () => {
  const { language } = useLanguageContext();
  const t = (key: string) => translations[language][key as keyof (typeof translations)['en']] || key;

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data for scheduling
  const [schedules, setSchedules] = useState([
    {
      id: 'INV-SCH-001',
      merchantName: 'Royal Silk Textiles',
      cycle: 'Weekly',
      nextDate: '2026-02-09',
      lastInvoiced: '2026-02-02',
      status: 'Active',
      autoGenerate: true,
      paymentTerms: 'Net 7',
      dayOfWeek: 'Monday'
    },
    {
      id: 'INV-SCH-002',
      merchantName: 'Elite Electronics',
      cycle: 'Monthly',
      nextDate: '2026-03-01',
      lastInvoiced: '2026-02-01',
      status: 'Active',
      autoGenerate: true,
      paymentTerms: 'Net 15',
      dayOfMonth: 1
    },
    {
      id: 'INV-SCH-003',
      merchantName: 'Grace Fashion Hub',
      cycle: 'Bi-Weekly',
      nextDate: '2026-02-15',
      lastInvoiced: '2026-02-01',
      status: 'Paused',
      autoGenerate: false,
      paymentTerms: 'Net 3',
      dayOfWeek: 'Sunday'
    },
    {
      id: 'INV-SCH-004',
      merchantName: 'Myanmar Organic Foods',
      cycle: 'Daily',
      nextDate: '2026-02-05',
      lastInvoiced: '2026-02-04',
      status: 'Active',
      autoGenerate: true,
      paymentTerms: 'Due on Receipt',
      dayOfWeek: 'Everyday'
    }
  ]);

  const filteredSchedules = schedules.filter(s => 
    s.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-display">
            {t('merchant.invoiceScheduling')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Automate and manage recurring billing cycles for your merchants.' 
              : 'ကုန်သည်များအတွက် ပုံမှန်ငွေတောင်းခံလွှာများကို အလိုအလျောက် စီမံခန့်ခွဲပါ။'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="luxury-button group">
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                {t('common.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-gold-400/30 lotus-card">
              <DialogHeader>
                <DialogTitle className="text-gold-400">{t('merchant.addNew')} Schedule</DialogTitle>
                <DialogDescription className="text-navy-200">
                  Set up a new automated billing cycle for a merchant.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="merchant">Merchant Name</Label>
                  <Select>
                    <SelectTrigger className="bg-navy-900/50 border-navy-700">
                      <SelectValue placeholder="Select Merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Royal Silk Textiles</SelectItem>
                      <SelectItem value="2">Elite Electronics</SelectItem>
                      <SelectItem value="3">Grace Fashion Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cycle">Billing Cycle</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="bg-navy-900/50 border-navy-700">
                        <SelectValue placeholder="Select Cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="terms">Payment Terms</Label>
                    <Select defaultValue="net7">
                      <SelectTrigger className="bg-navy-900/50 border-navy-700">
                        <SelectValue placeholder="Select Terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due">Due on Receipt</SelectItem>
                        <SelectItem value="net3">Net 3</SelectItem>
                        <SelectItem value="net7">Net 7</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-navy-800/50 border border-gold-400/20">
                  <div className="space-y-0.5">
                    <Label>Auto-Generate Invoice</Label>
                    <p className="text-xs text-muted-foreground">Invoices will be created automatically on the due date.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>{t('common.cancel')}</Button>
                <Button className="bg-gold-500 hover:bg-gold-600 text-navy-900">{t('common.save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="lotus-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-gold-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-gold-500" />
              </div>
              <Badge variant="secondary" className="bg-gold-500/20 text-gold-400">Active</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Active Schedules</p>
              <h3 className="text-2xl font-bold text-foreground">42</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="lotus-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Next Run Date</p>
              <h3 className="text-2xl font-bold text-foreground">Feb 05, 2026</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="lotus-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Successfully Automated</p>
              <h3 className="text-2xl font-bold text-foreground">98.5%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="lotus-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Pending Manual Review</p>
              <h3 className="text-2xl font-bold text-foreground">03</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search') + " merchant or schedule ID..."}
            className="pl-10 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-gold-400/20">
          <Filter className="mr-2 h-4 w-4" />
          {t('common.filter')}
        </Button>
        <Button variant="outline" className="border-gold-400/20">
          <Settings2 className="mr-2 h-4 w-4" />
          Config
        </Button>
      </div>

      {/* Main Table */}
      <Card className="border-gold-400/10 shadow-xl bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px]">Schedule ID</TableHead>
              <TableHead>{t('merchant.name')}</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead>Auto-Gen</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead className="text-right">{t('warehouse.action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode='popLayout'>
              {filteredSchedules.map((schedule) => (
                <motion.tr
                  key={schedule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-semibold text-primary">{schedule.id}</TableCell>
                  <TableCell className="font-medium">{schedule.merchantName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-gold-500" />
                      {schedule.cycle}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{schedule.lastInvoiced}</TableCell>
                  <TableCell className="font-semibold">{schedule.nextDate}</TableCell>
                  <TableCell>
                    <Switch checked={schedule.autoGenerate} />
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={schedule.status === 'Active' 
                        ? "bg-success/10 text-success hover:bg-success/20" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"}
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gold-500/10 hover:text-gold-500">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>

      {/* Bottom Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="lotus-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gold-400">
              <ArrowRightLeft className="h-5 w-5" />
              Manual Override
            </CardTitle>
            <CardDescription>
              Instantly generate an invoice for a merchant outside the schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Select>
              <SelectTrigger className="bg-navy-900/50 border-navy-700 flex-1">
                <SelectValue placeholder="Select Merchant" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.merchantName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-gold-500 text-navy-900 hover:bg-gold-600">
              Generate Now
            </Button>
          </CardContent>
        </Card>

        <Card className="lotus-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gold-400">
              <Save className="h-5 w-5" />
              Global Billing Policy
            </CardTitle>
            <CardDescription>
              Update standard billing parameters across all merchants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-lock invoices after 24h</span>
              <Switch defaultChecked />
            </div>
            <div className="mt-4">
              <Button variant="link" className="p-0 text-gold-500 hover:text-gold-400 h-auto">
                Manage Global Settings <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceSchedulingPage;
