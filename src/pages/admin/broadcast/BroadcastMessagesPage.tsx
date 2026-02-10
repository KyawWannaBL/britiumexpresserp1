import React from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  History,
  Bell,
  Users,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const BroadcastMessagesPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);

  // Mock data for recent broadcasts
  const recentBroadcasts = [
    {
      id: 'BC-001',
      title: 'New Service Zone: Mandalay',
      content: 'We are excited to announce our expansion into Mandalay...',
      recipients: t('broadcast.allUsers'),
      status: 'Sent',
      date: '2026-02-03 14:30',
      reach: '1,240',
    },
    {
      id: 'BC-002',
      title: 'Merchant System Maintenance',
      content: 'Scheduled maintenance for the merchant portal tonight...',
      recipients: t('broadcast.merchants'),
      status: 'Scheduled',
      date: '2026-02-05 22:00',
      reach: '450',
    },
    {
      id: 'BC-003',
      title: 'Rider Incentive Program Update',
      content: 'New commission rates for express deliveries starting...',
      recipients: t('broadcast.deliverymen'),
      status: 'Sent',
      date: '2026-02-01 09:15',
      reach: '890',
    },
    {
      id: 'BC-004',
      title: 'Chinese New Year Holiday Notice',
      content: 'Operational hours during the upcoming holiday period...',
      recipients: t('broadcast.customers'),
      status: 'Draft',
      date: '2026-02-04 05:15',
      reach: '0',
    },
  ];

  const stats = [
    {
      label: t('broadcast.title'),
      value: '156',
      icon: Bell,
      color: 'text-gold-500',
      bg: 'bg-gold-500/10',
    },
    {
      label: t('broadcast.scheduledMessages'),
      value: '12',
      icon: Clock,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Total Recipients',
      value: '12.4k',
      icon: Users,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Success Rate',
      value: '99.8%',
      icon: CheckCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">{t('broadcast.title')}</h1>
          <p className="text-muted-foreground">{t('broadcast.messageContent')} & Notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="border-gold-500 text-gold-600 hover:bg-gold-50">
            <Link to={ROUTE_PATHS.BROADCAST_MESSAGE_HISTORY}>
              <History className="mr-2 h-4 w-4" />
              {t('broadcast.messageHistory')}
            </Link>
          </Button>
          <Button asChild className="luxury-button">
            <Link to={ROUTE_PATHS.BROADCAST_SEND_MESSAGE}>
              <Plus className="mr-2 h-4 w-4" />
              {t('broadcast.sendMessage')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="lotus-glow transition-all duration-300 hover:shadow-lg border-gold-400/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1 text-navy-900">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{t('broadcast.messageHistory')}</CardTitle>
              <CardDescription>Review and manage your system-wide announcements</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-10 bg-muted/50 border-none focus-visible:ring-gold-500"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-navy-50/50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>{t('common.date')}</TableHead>
                <TableHead>{t('broadcast.messageContent')}</TableHead>
                <TableHead>{t('broadcast.recipients')}</TableHead>
                <TableHead>{t('tracking.status')}</TableHead>
                <TableHead className="text-right">Reach</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBroadcasts.map((bc) => (
                <TableRow key={bc.id} className="hover:bg-navy-50/30 transition-colors">
                  <TableCell className="font-mono text-xs font-bold">{bc.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {bc.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-navy-900">{bc.title}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[300px]">{bc.content}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-navy-50 text-navy-700 border-navy-200">
                      {bc.recipients}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`
                        ${
                          bc.status === 'Sent'
                            ? 'bg-success/10 text-success border-success/20'
                            : bc.status === 'Scheduled'
                            ? 'bg-info/10 text-info border-info/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }
                      `}
                    >
                      {bc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {bc.reach}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          {t('common.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Send className="mr-2 h-4 w-4" />
                          Resend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing 1 to 4 of 156 entries</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              {t('common.previous')}
            </Button>
            <Button variant="outline" size="sm">
              {t('common.next')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Tips / Help Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="lotus-card overflow-hidden">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold-500/20">
              <Bell className="h-6 w-6 text-gold-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gold-400 mb-1">Broadcast Best Practices</h4>
              <p className="text-navy-100 text-sm opacity-80">
                Keep your messages concise and actionable. Use clear subject lines to improve open rates across the network.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="lotus-card overflow-hidden">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-full bg-navy-500/20">
              <Users className="h-6 w-6 text-navy-200" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-navy-200 mb-1">Segmentation Power</h4>
              <p className="text-navy-100 text-sm opacity-80">
                Target specific user groups to ensure high relevance. Deliverymen care about route updates, while merchants care about billing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BroadcastMessagesPage;