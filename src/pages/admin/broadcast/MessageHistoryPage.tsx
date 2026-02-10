import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  Mail,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Eye,
  RotateCcw,
  Trash2,
  ArrowUpRight,
  Download,
  ChevronRight
} from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
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
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

// Mock Data for History
const MOCK_HISTORY = [
  {
    id: 'MSG-001',
    subject: 'New Service Zone: Mandalay North',
    recipients: 'All Riders',
    targetCount: 1250,
    deliveredCount: 1248,
    failedCount: 2,
    status: 'Sent',
    date: '2026-02-01 09:30 AM',
    type: 'Push Notification'
  },
  {
    id: 'MSG-002',
    subject: 'System Maintenance Schedule',
    recipients: 'All Users',
    targetCount: 15400,
    deliveredCount: 15390,
    failedCount: 10,
    status: 'Sent',
    date: '2026-01-28 11:00 PM',
    type: 'SMS & Email'
  },
  {
    id: 'MSG-003',
    subject: 'Special Chinese New Year Promotion',
    recipients: 'Merchants',
    targetCount: 840,
    deliveredCount: 0,
    failedCount: 0,
    status: 'Scheduled',
    date: '2026-02-05 08:00 AM',
    type: 'App Banner'
  },
  {
    id: 'MSG-004',
    subject: 'Urgent: Policy Update for COD',
    recipients: 'Sub-station Managers',
    targetCount: 45,
    deliveredCount: 45,
    failedCount: 0,
    status: 'Sent',
    date: '2026-01-25 02:15 PM',
    type: 'Email'
  },
  {
    id: 'MSG-005',
    subject: 'Delivery Performance Report Jan 2026',
    recipients: 'Deliverymen',
    targetCount: 3100,
    deliveredCount: 3050,
    failedCount: 50,
    status: 'Sent',
    date: '2026-01-20 10:00 AM',
    type: 'Push Notification'
  }
];

const MessageHistoryPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sent':
        return <Badge className="bg-success/10 text-success border-success/20">{t('common.completed')}</Badge>;
      case 'Scheduled':
        return <Badge className="bg-warning/10 text-warning border-warning/20">{t('broadcast.scheduledMessages')}</Badge>;
      case 'Failed':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">{t('common.error')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp} 
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            {t('broadcast.messageHistory')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' ? 'Review and track performance of sent broadcast messages' : 'ပေးပို့ပြီးသော ထုတ်လွှင့်မှု မက်ဆေ့ချ်များ၏ စွမ်းဆောင်ရည်ကို ပြန်လည်ကြည့်ရှုရန်'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-400/50 text-navy-900">
            <Download className="w-4 h-4 mr-2" />
            {t('common.export')}
          </Button>
          <Button className="luxury-button">
            <Mail className="w-4 h-4 mr-2" />
            {t('broadcast.sendMessage')}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <Card className="lotus-card border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold-400/80 text-sm font-medium">Total Broadcasts</p>
                  <h3 className="text-2xl font-bold text-white mt-1">142</h3>
                </div>
                <div className="p-3 bg-gold-500/10 rounded-xl">
                  <Mail className="w-6 h-6 text-gold-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-success">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>12% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="glass-card border-navy-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Reach</p>
                  <h3 className="text-2xl font-bold text-navy-900 mt-1">24.5k</h3>
                </div>
                <div className="p-3 bg-navy-100 rounded-xl">
                  <Users className="w-6 h-6 text-navy-900" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>Active users reached</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="glass-card border-navy-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Success Rate</p>
                  <h3 className="text-2xl font-bold text-navy-900 mt-1">99.4%</h3>
                </div>
                <div className="p-3 bg-success/10 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-success">
                <span>+0.2% increase</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="glass-card border-navy-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Scheduled</p>
                  <h3 className="text-2xl font-bold text-navy-900 mt-1">3</h3>
                </div>
                <div className="p-3 bg-warning/10 rounded-xl">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>Upcoming next 7 days</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content Card */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="border-none shadow-xl shadow-navy-900/5 overflow-hidden">
          <CardHeader className="bg-white border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-navy-900">{t('broadcast.messageHistory')}</CardTitle>
                <CardDescription>{language === 'en' ? 'Detailed logs of all broadcast communications' : 'ထုတ်လွှင့်မှု ဆက်သွယ်ရေး အားလုံး၏ အသေးစိတ် မှတ်တမ်းများ'}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder={t('common.search') + "..."} 
                    className="pl-10 bg-muted/50 border-none focus:ring-1 focus:ring-gold-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px] bg-muted/50 border-none">
                    <SelectValue placeholder={t('common.filter')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="sent">{t('common.completed')}</SelectItem>
                    <SelectItem value="scheduled">{t('broadcast.scheduledMessages')}</SelectItem>
                    <SelectItem value="failed">{t('common.error')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[120px] font-semibold text-navy-900 pl-6">ID</TableHead>
                    <TableHead className="font-semibold text-navy-900">{t('broadcast.messageContent')}</TableHead>
                    <TableHead className="font-semibold text-navy-900">{t('broadcast.recipients')}</TableHead>
                    <TableHead className="font-semibold text-navy-900">{t('common.date')}</TableHead>
                    <TableHead className="font-semibold text-navy-900">{t('common.status')}</TableHead>
                    <TableHead className="text-right pr-6 font-semibold text-navy-900">{t('warehouse.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_HISTORY.filter(item => 
                    item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.id.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((message) => (
                    <TableRow key={message.id} className="hover:bg-muted/20 transition-colors group">
                      <TableCell className="font-mono text-sm text-muted-foreground pl-6">
                        {message.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-navy-900">{message.subject}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{message.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-navy-50 text-navy-700">
                            {message.recipients}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({message.targetCount.toLocaleString()})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-navy-800">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                          {message.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(message.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-navy-700 hover:text-gold-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-navy-700 hover:text-gold-600">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>{t('warehouse.action')}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer">
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'View Analytics' : 'ခွဲခြမ်းစိတ်ဖြာချက်ကိုကြည့်ရန်'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Download Log' : 'မှတ်တမ်းထုတ်ယူရန်'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Placeholder */}
            <div className="p-6 border-t flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing 1 to 5 of 142 entries
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  {t('common.previous')}
                </Button>
                <Button variant="outline" size="sm" className="bg-gold-500/10 text-gold-600 border-gold-200">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  {t('common.next')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Insight Card */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card-dark border-none royal-navy">
            <CardHeader>
              <CardTitle className="text-gold-400">{language === 'en' ? 'Engagement Overview' : 'ထိတွေ့ဆက်ဆံမှု အနှစ်ချုပ်'}</CardTitle>
              <CardDescription className="text-gold-400/60">{language === 'en' ? 'Real-time monitoring of active broadcasts' : 'လက်ရှိ ထုတ်လွှင့်မှုများကို အချိန်နှင့်တပြေးညီ စောင့်ကြည့်ခြင်း'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Delivery Rate</span>
                  <span className="text-gold-400 font-bold">98.2%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 w-[98.2%] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Read Rate (Push)</span>
                  <span className="text-gold-400 font-bold">42.5%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 w-[42.5%] rounded-full" />
                </div>
              </div>
              <div className="pt-4 flex items-center gap-4">
                <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gold-400/60 uppercase tracking-wider font-bold">Total Opens</p>
                  <p className="text-xl font-bold text-white mt-1">10,432</p>
                </div>
                <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gold-400/60 uppercase tracking-wider font-bold">CTA Clicks</p>
                  <p className="text-xl font-bold text-white mt-1">1,204</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy-100">
            <CardHeader>
              <CardTitle className="text-navy-900">{language === 'en' ? 'Quick Actions & History' : 'မြန်ဆန်သော လုပ်ဆောင်ချက်များနှင့် မှတ်တမ်း'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 hover:bg-muted/30 rounded-lg transition-colors cursor-pointer group">
                <div className="p-2 bg-navy-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-navy-900" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900">Delivery Failure Alert</p>
                  <p className="text-xs text-muted-foreground">10 messages failed in Mandalay North campaign</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold-500 transition-colors" />
              </div>
              <div className="flex items-start gap-4 p-3 hover:bg-muted/30 rounded-lg transition-colors cursor-pointer group">
                <div className="p-2 bg-gold-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gold-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900">Next Scheduled Broadcast</p>
                  <p className="text-xs text-muted-foreground">Special Chinese New Year Promotion in 4 days</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold-500 transition-colors" />
              </div>
              <div className="flex items-start gap-4 p-3 hover:bg-muted/30 rounded-lg transition-colors cursor-pointer group">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Mail className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900">Daily Report Sent</p>
                  <p className="text-xs text-muted-foreground">All merchants received their morning summaries</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold-500 transition-colors" />
              </div>
              <Button variant="link" className="w-full text-gold-600 hover:text-gold-700 font-bold">
                {language === 'en' ? 'View Complete System Logs' : 'စနစ်မှတ်တမ်း အားလုံးကိုကြည့်ရန်'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageHistoryPage;