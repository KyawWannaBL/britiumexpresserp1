import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Activity,
  Clock,
  Truck,
  Target,
  Download,
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  MapPin,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';

import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const PerformanceReportPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [dateRange, setDateRange] = useState('last30');

  // Mock Data for 2026 Performance
  const performanceTrends = [
    { name: 'Jan', success: 94, target: 95, time: 22 },
    { name: 'Feb', success: 96, target: 95, time: 20 },
    { name: 'Mar', success: 93, target: 95, time: 24 },
    { name: 'Apr', success: 95, target: 95, time: 21 },
    { name: 'May', success: 97, target: 95, time: 19 },
    { name: 'Jun', success: 98, target: 95, time: 18 },
  ];

  const branchPerformance = [
    { name: 'Yangon Central', score: 98, efficiency: 95, volume: 12400 },
    { name: 'Mandalay Hub', score: 92, efficiency: 88, volume: 8500 },
    { name: 'Naypyidaw East', score: 89, efficiency: 84, volume: 4200 },
    { name: 'Taunggyi Station', score: 94, efficiency: 91, volume: 3100 },
    { name: 'Bago Branch', score: 86, efficiency: 79, volume: 2800 },
  ];

  const efficiencyMetrics = [
    { name: 'Sorting', value: 85, color: 'var(--gold-500)' },
    { name: 'Dispatch', value: 92, color: 'var(--navy-600)' },
    { name: 'Transit', value: 78, color: 'var(--gold-400)' },
    { name: 'Last Mile', value: 96, color: 'var(--navy-800)' },
  ];

  const kpis = [
    {
      title: 'Delivery Success Rate',
      value: '95.8%',
      change: '+2.4%',
      trend: 'up',
      icon: CheckCircle2,
      description: 'Percentage of successful first-attempt deliveries',
      color: 'text-success'
    },
    {
      title: 'Avg. Delivery Time',
      value: '18.4 hrs',
      change: '-1.2 hrs',
      trend: 'up',
      icon: Clock,
      description: 'Average time from pickup to final delivery',
      color: 'text-info'
    },
    {
      title: 'Fleet Utilization',
      value: '88.2%',
      change: '+5.1%',
      trend: 'up',
      icon: Truck,
      description: 'Active vehicle capacity usage across all zones',
      color: 'text-gold'
    },
    {
      title: 'On-Time Pickup',
      value: '92.5%',
      change: '-0.8%',
      trend: 'down',
      icon: Target,
      description: 'Percentage of pickups completed within window',
      color: 'text-warning'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={staggerContainer}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-gold-400">
            {t('reports.performanceReport')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time operational KPIs and system efficiency metrics for 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gold-400/50 hover:bg-gold-50">
                <Download className="w-4 h-4 mr-2" />
                {t('common.export')}
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                {t('reports.exportPdf')}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                {t('reports.exportExcel')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="luxury-button">
            <Filter className="w-4 h-4 mr-2" />
            {t('common.filter')}
          </Button>
        </div>
      </motion.div>

      {/* Quick Filter Bar */}
      <Card className="border-gold-400/20 shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t('reports.dateRange')}:</span>
            <span className="sr-only">Date Range Selector</span>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] h-9 border-none bg-muted/50">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7">Last 7 Days</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="last90">Last 3 Months</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-8 hidden md:block" />

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Branch:</span>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] h-9 border-none bg-muted/50">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="yangon">Yangon Hub</SelectItem>
                <SelectItem value="mandalay">Mandalay Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto hidden lg:flex items-center gap-2 text-xs text-muted-foreground italic">
            <Activity className="w-3 h-3 text-gold-500 animate-pulse" />
            Last updated: 2026-02-04 05:15:20
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpis.map((kpi, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="lotus-card border-none overflow-hidden group hover:scale-[1.02] transition-transform">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl bg-white/10 text-gold-400 group-hover:bg-gold-500/20 transition-colors`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`border-none bg-white/5 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-sm font-medium text-gold-200/70">{kpi.title}</h3>
                  <p className="text-3xl font-bold text-white font-mono tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-gold-100/40 line-clamp-1">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Performance Chart */}
        <Card className="lg:col-span-2 border-gold-400/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.overview')}</CardTitle>
              <CardDescription>Monthly success rate vs Target performance</CardDescription>
            </div>
            <Tabs defaultValue="success" className="w-[200px]">
              <TabsList className="grid grid-cols-2 h-8">
                <TabsTrigger value="success" className="text-xs">Success</TabsTrigger>
                <TabsTrigger value="time" className="text-xs">Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="h-[400px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  unit="%"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#eab308" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#eab308' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Delivery Success"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#1e293b" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                  name="Benchmark Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Distribution */}
        <Card className="border-gold-400/20">
          <CardHeader>
            <CardTitle>Operational Efficiency</CardTitle>
            <CardDescription>Department-wise performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {efficiencyMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{metric.name}</span>
                  <span className="font-mono font-bold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
            
            <Separator className="my-6" />
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold">Performance Insight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Last mile efficiency is at an all-time high of 96%. Warehouse sorting needs optimization in Mandalay branch to meet the 90% benchmark.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Branch Rankings & Service Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        {/* Branch Ranking Table */}
        <Card className="border-gold-400/20 overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Branch Performance Ranking</CardTitle>
              <BarChart3 className="w-5 h-5 text-gold-500" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left">Branch Name</th>
                    <th className="px-6 py-4 text-center">Volume</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {branchPerformance.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{branch.name}</td>
                      <td className="px-6 py-4 text-center font-mono">{branch.volume.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${branch.score > 90 ? 'bg-success' : branch.score > 85 ? 'bg-warning' : 'bg-destructive'}`}
                              style={{ width: `${branch.score}%` }}
                            />
                          </div>
                          <span className="font-bold w-8">{branch.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge 
                          variant="outline"
                          className={branch.score > 90 ? 'border-success text-success' : 'border-warning text-warning'}
                        >
                          {branch.score > 90 ? 'Excellent' : branch.score > 85 ? 'Good' : 'Review'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Service Type Performance */}
        <Card className="border-gold-400/20">
          <CardHeader>
            <CardTitle className="text-lg">Service Volume Distribution</CardTitle>
            <CardDescription>Allocation of shipments by service category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={[
                  { name: 'Domestic Express', value: 4500 },
                  { name: 'International', value: 1200 },
                  { name: 'Same Day', value: 2800 },
                  { name: 'COD Service', value: 3900 },
                ]}
                layout="vertical"
                margin={{ left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {[
                    { name: 'Domestic Express', value: 4500 },
                    { name: 'International', value: 1200 },
                    { name: 'Same Day', value: 2800 },
                    { name: 'COD Service', value: 3900 },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e293b' : '#eab308'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-navy-50 dark:bg-navy-900/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Volume</p>
                <p className="text-xl font-bold font-mono">12,400</p>
              </div>
              <div className="p-3 bg-gold-50 dark:bg-gold-900/10 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Market Share</p>
                <p className="text-xl font-bold font-mono text-gold-600">+12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceReportPage;