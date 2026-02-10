import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronRight,
  ArrowRight,
  Activity,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TransitRoutePage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for transit routes
  const transitRoutes = [
    {
      id: 'TR-2026-001',
      name: 'Yangon - Mandalay Express',
      origin: 'Yangon Main Hub',
      destination: 'Mandalay Distribution Center',
      vehicle: 'HINO-500 (YGN-1A/4582)',
      driver: 'Kyaw Zeya',
      status: 'In Transit',
      departure: '2026-02-04 06:00 AM',
      arrival: '2026-02-04 04:00 PM',
      loadFactor: 85,
    },
    {
      id: 'TR-2026-002',
      name: 'Naypyidaw Connector',
      origin: 'Yangon Main Hub',
      destination: 'Naypyidaw Station',
      vehicle: 'ISUZU-FTR (YGN-2B/9912)',
      driver: 'Aung Myo',
      status: 'Scheduled',
      departure: '2026-02-05 08:00 AM',
      arrival: '2026-02-05 02:00 PM',
      loadFactor: 0,
    },
    {
      id: 'TR-2026-003',
      name: 'Bago Region Distribution',
      origin: 'Yangon Main Hub',
      destination: 'Bago Branch',
      vehicle: 'TOYOTA-DYNA (YGN-3C/1123)',
      driver: 'Min Thant',
      status: 'Active',
      departure: 'Daily 09:00 AM',
      arrival: 'Daily 12:00 PM',
      loadFactor: 92,
    },
    {
      id: 'TR-2026-004',
      name: 'Taunggyi Highlands',
      origin: 'Mandalay Hub',
      destination: 'Taunggyi Station',
      vehicle: 'HINO-700 (MDY-4D/7788)',
      driver: 'Zaw Win',
      status: 'Maintenance',
      departure: 'Tues/Fri 05:00 AM',
      arrival: 'Tues/Fri 06:00 PM',
      loadFactor: 0,
    },
  ];

  const stats = [
    { label: 'Active Routes', value: '12', icon: Navigation, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Vehicles in Transit', value: '8', icon: Truck, color: 'text-gold-500', bg: 'bg-gold-500/10' },
    { label: 'Average Load Factor', value: '78%', icon: Activity, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Safety Incidents', value: '0', icon: ShieldCheck, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900">
            {t('way.transitRoute')}
          </h1>
          <p className="text-muted-foreground">
            Manage long-haul transit lines, vehicle assignments, and schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gold-400 text-navy-900">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold">
            <Plus className="mr-2 h-4 w-4" />
            {t('common.add')} New Route
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none shadow-sm lotus-card overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gold-400/80 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1 font-mono">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes, vehicles, or drivers..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="transit">In Transit</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {t('common.filter')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table Content */}
      <Card className="border-border shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gold-600" />
            Linehaul Route Registry
          </CardTitle>
          <CardDescription>Comprehensive list of all branch-to-branch transit connections</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Route & ID</TableHead>
                <TableHead className="font-bold">Connection Path</TableHead>
                <TableHead className="font-bold">Vehicle & Driver</TableHead>
                <TableHead className="font-bold">Schedule</TableHead>
                <TableHead className="font-bold text-center">Load</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transitRoutes.map((route) => (
                <TableRow key={route.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-navy-900">{route.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{route.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{route.origin}</span>
                      <ArrowRight className="h-3 w-3 text-gold-600" />
                      <span className="font-semibold">{route.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                        <span>{route.vehicle}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Driver: {route.driver}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{route.departure}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">ETA: {route.arrival}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold-500"
                          style={{ width: `${route.loadFactor}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold">{route.loadFactor}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`rounded-md font-semibold ${
                        route.status === 'In Transit' ? 'bg-info/20 text-info border-info/30' : 
                        route.status === 'Active' ? 'bg-success/20 text-success border-success/30' : 
                        route.status === 'Scheduled' ? 'bg-warning/20 text-warning border-warning/30' :
                        'bg-destructive/20 text-destructive border-destructive/30'
                      }`}
                      variant="outline"
                    >
                      {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gold-500/10">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                          <Activity className="mr-2 h-4 w-4" /> Tracking Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Plus className="mr-2 h-4 w-4" /> Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Truck className="mr-2 h-4 w-4" /> Change Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          Deactivate Route
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

      {/* Planning Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Regional Route Network</CardTitle>
            <CardDescription>Real-time visualization of transit corridor performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-b-xl border-t">
            <div className="text-center space-y-2">
              <Navigation className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
              <p className="text-sm text-muted-foreground">Interactive Transit Map Loading...</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Maintenance</CardTitle>
            <CardDescription>Scheduled vehicle service alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-semibold">HINO-700 (MDY-4D/7788)</p>
                  <p className="text-xs text-muted-foreground">Engine diagnostics required by 2026-02-10</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-gold-600 text-xs">
                    Schedule Now <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransitRoutePage;