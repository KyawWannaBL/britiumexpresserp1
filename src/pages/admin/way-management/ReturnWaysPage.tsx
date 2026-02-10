import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  Package,
  ArrowLeftRight,
  MoreHorizontal,
  Eye,
  FileText,
  Undo2,
  AlertCircle
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import { ROUTE_PATHS } from '@/lib/index';
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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const ReturnWaysPage: React.FC = () => {
  const { language } = useLanguageContext();
  const t = (key: string) => translations[language][key as keyof typeof translations['en']] || key;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock Data for Return Shipments
  const returnParcels = [
    {
      id: 'RET-2026-001',
      trackingNo: 'BE88492011',
      merchant: 'Elite Electronics',
      customer: 'Kyaw Zayar',
      reason: 'Damaged Item',
      returnDate: '2026-02-01',
      status: 'pending',
      amount: 45000,
      branch: 'Yangon Central'
    },
    {
      id: 'RET-2026-002',
      trackingNo: 'BE88492015',
      merchant: 'Beauty Bloom',
      customer: 'Su Su Lwin',
      reason: 'Wrong Color',
      returnDate: '2026-02-02',
      status: 'processing',
      amount: 12500,
      branch: 'Mandalay Station'
    },
    {
      id: 'RET-2026-003',
      trackingNo: 'BE88492022',
      merchant: 'Urban Fashion',
      customer: 'Min Thu',
      reason: 'Customer Refused',
      returnDate: '2026-02-03',
      status: 'completed',
      amount: 32000,
      branch: 'Yangon Central'
    },
    {
      id: 'RET-2026-004',
      trackingNo: 'BE88492030',
      merchant: 'Tech Zone',
      customer: 'Aung Myo',
      reason: 'Function Failure',
      returnDate: '2026-02-03',
      status: 'returned_to_merchant',
      amount: 158000,
      branch: 'Nay Pyi Taw'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">{t('common.pending')}</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">{language === 'en' ? 'Processing' : 'လုပ်ဆောင်နေဆဲ'}</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">{t('common.completed')}</Badge>;
      case 'returned_to_merchant':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">{language === 'en' ? 'Returned to Merchant' : 'ကုန်သည်ထံပြန်ပို့ပြီး'}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 myanmar-text">
            {t('way.returnWays')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Manage and track returned parcels and merchant refunds.' : 'ပြန်ပို့ပါဆယ်များနှင့် ကုန်သည်ငွေပြန်အမ်းမှုများကို စီမံခန့်ခွဲရန်။'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gold-400 text-navy-900">
            <Download className="mr-2 h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button className="luxury-button">
            <Undo2 className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Process Batch Return' : 'အုပ်စုလိုက်ပြန်ပို့ရန်'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="lotus-card border-none shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gold-400">{language === 'en' ? 'Total Returns' : 'စုစုပေါင်း ပြန်ပို့မှု'}</p>
                  <h3 className="text-2xl font-bold text-white">128</h3>
                </div>
                <div className="p-3 bg-gold-500/20 rounded-xl">
                  <RotateCcw className="h-6 w-6 text-gold-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-400">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                <span>+5% {language === 'en' ? 'from last month' : 'ပြီးခဲ့သောလထက်'}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-navy-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{language === 'en' ? 'Pending Processing' : 'လုပ်ဆောင်ရန်ကျန်'}</p>
                  <h3 className="text-2xl font-bold text-navy-900">14</h3>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">{language === 'en' ? 'Action required for 5 items' : '၅ ခုအတွက် လုပ်ဆောင်ရန်လိုအပ်သည်'}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-navy-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{language === 'en' ? 'In Warehouse' : 'ဂိုဒေါင်ရောက်'}</p>
                  <h3 className="text-2xl font-bold text-navy-900">42</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">{language === 'en' ? 'Awaiting merchant pickup' : 'ကုန်သည်ကောက်ယူရန် စောင့်ဆိုင်းနေသည်'}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border-navy-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{language === 'en' ? 'Completed Returns' : 'ပြီးစီးသော ပြန်ပို့မှု'}</p>
                  <h3 className="text-2xl font-bold text-navy-900">72</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">{language === 'en' ? 'Successfully returned to merchant' : 'ကုန်သည်ထံ အောင်မြင်စွာပြန်ပို့ပြီး'}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <Card className="border-navy-100 shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-navy-50">
                <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
                <TabsTrigger value="pending">{t('common.pending')}</TabsTrigger>
                <TabsTrigger value="processing">{language === 'en' ? 'In Progress' : 'ဆောင်ရွက်ဆဲ'}</TabsTrigger>
                <TabsTrigger value="returned">{language === 'en' ? 'Returned' : 'ပြန်ပို့ပြီး'}</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-9 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4 text-navy-900" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border border-navy-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-navy-50">
                <TableRow>
                  <TableHead className="font-bold">{t('tracking.trackingNumber')}</TableHead>
                  <TableHead className="font-bold">{t('merchant.name')}</TableHead>
                  <TableHead className="font-bold">{language === 'en' ? 'Reason' : 'အကြောင်းပြချက်'}</TableHead>
                  <TableHead className="font-bold">{language === 'en' ? 'Return Date' : 'ပြန်ပို့သည့်ရက်'}</TableHead>
                  <TableHead className="font-bold">{t('order.amount')}</TableHead>
                  <TableHead className="font-bold">{t('tracking.status')}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Actions' : 'လုပ်ဆောင်ချက်'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnParcels.map((parcel) => (
                  <TableRow key={parcel.id} className="hover:bg-navy-50/30 transition-colors">
                    <TableCell className="font-mono font-medium">{parcel.trackingNo}</TableCell>
                    <TableCell>{parcel.merchant}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1.5 text-destructive" />
                        {parcel.reason}
                      </div>
                    </TableCell>
                    <TableCell>{parcel.returnDate}</TableCell>
                    <TableCell className="font-semibold">{parcel.amount.toLocaleString()} Ks</TableCell>
                    <TableCell>{getStatusBadge(parcel.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>{t('common.view')}</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> {language === 'en' ? 'Details' : 'အသေးစိတ်'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> {language === 'en' ? 'Print Return Label' : 'ပြန်ပို့လိပ်စာထုတ်ရန်'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-gold-600">
                            <ArrowLeftRight className="mr-2 h-4 w-4" /> {language === 'en' ? 'Process Refund' : 'ငွေပြန်အမ်းရန်'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> {language === 'en' ? 'Mark as Returned' : 'ပြန်ပို့ပြီးအဖြစ်သတ်မှတ်'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? `Showing ${returnParcels.length} of 128 results` 
                : `ရလဒ် ၁၂၈ ခုအနက် ${returnParcels.length} ခုကို ပြသနေသည်`}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>{t('common.previous')}</Button>
              <Button variant="outline" size="sm">{t('common.next')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Return Dialog (Example) */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="hidden">
             {/* This would be triggered by an action button usually */}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="myanmar-text">
              {language === 'en' ? 'Confirm Return Delivery' : 'ပြန်ပို့မှု ပို့ဆောင်ခြင်းကို အတည်ပြုရန်'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' ? 'Verify parcel details before handing over to the merchant.' : 'ကုန်သည်ထံသို့ မလွှဲပြောင်းမီ ပါဆယ်အသေးစိတ်ကို စစ်ဆေးပါ။'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="merchant" className="text-right">{t('merchant.name')}</Label>
              <Input id="merchant" value="Elite Electronics" className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tracking" className="text-right">{t('tracking.trackingNumber')}</Label>
              <Input id="tracking" value="BE88492011" className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">{language === 'en' ? 'Condition' : 'အခြေအနေ'}</Label>
              <Select defaultValue="good">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good / Original</SelectItem>
                  <SelectItem value="opened">Opened Box</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="luxury-button w-full">{t('common.confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Branding */}
      <div className="text-center pt-8">
        <p className="text-xs text-muted-foreground opacity-50">
          © 2026 Britium Express Logistics System. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default ReturnWaysPage;
