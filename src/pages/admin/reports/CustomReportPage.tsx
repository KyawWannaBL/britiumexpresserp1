import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Settings,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Download,
  Save,
  Filter,
  Calendar as CalendarIcon,
  ChevronRight,
  RefreshCcw,
  Table as TableIcon,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { ROUTE_PATHS } from '@/lib/index';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

// Mock Data for Visualization
const MOCK_CHART_DATA = [
  { name: 'Jan', value: 400, revenue: 2400, orders: 120 },
  { name: 'Feb', value: 300, revenue: 1398, orders: 98 },
  { name: 'Mar', value: 600, revenue: 9800, orders: 150 },
  { name: 'Apr', value: 800, revenue: 3908, orders: 190 },
  { name: 'May', value: 500, revenue: 4800, orders: 110 },
  { name: 'Jun', value: 900, revenue: 3800, orders: 210 },
];

const PIE_DATA = [
  { name: 'Delivered', value: 400 },
  { name: 'In Transit', value: 300 },
  { name: 'Pending', value: 300 },
  { name: 'Failed', value: 200 },
];

const COLORS = ['#D4AF37', '#1A237E', '#4CAF50', '#F44336', '#9C27B0'];

export default function CustomReportPage() {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);

  const [reportType, setReportType] = useState('shipments');
  const [chartType, setChartType] = useState('bar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <FileText className="w-8 h-8 text-gold" />
            </div>
            {t('reports.customReport')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'my' 
              ? 'စိတ်ကြိုက်အစီရင်ခံစာများဖန်တီးပြီး ဒေတာများကိုစစ်ဆေးပါ' 
              : 'Build and analyze tailored reports for your logistics operations.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-gold/30 hover:border-gold/50">
            <Save className="w-4 h-4" />
            {language === 'my' ? 'ပုံစံသိမ်းရန်' : 'Save Template'}
          </Button>
          <Button className="luxury-button gap-2">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Configuration */}
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-1 space-y-6"
        >
          <Card className="border-gold/20 shadow-xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-gold" />
                {language === 'my' ? 'အစီရင်ခံစာဖွဲ့စည်းမှု' : 'Report Config'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Report Type */}
              <div className="space-y-2">
                <Label>{language === 'my' ? 'အစီရင်ခံစာအမျိုးအစား' : 'Report Category'}</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipments">{t('nav.services')}</SelectItem>
                    <SelectItem value="financial">{t('accounting.title')}</SelectItem>
                    <SelectItem value="merchants">{t('merchant.title')}</SelectItem>
                    <SelectItem value="performance">{t('reports.performanceReport')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>{t('reports.dateRange')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" className="bg-muted/30" />
                  <Input type="date" className="bg-muted/30" />
                </div>
              </div>

              {/* Chart Preference */}
              <div className="space-y-2">
                <Label>{language === 'my' ? 'ဇယားပုံစံ' : 'Visual Type'}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    className={chartType === 'bar' ? 'bg-primary' : 'border-gold/20'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    className={chartType === 'line' ? 'bg-primary' : 'border-gold/20'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <LineChartIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={chartType === 'pie' ? 'default' : 'outline'}
                    className={chartType === 'pie' ? 'bg-primary' : 'border-gold/20'}
                    size="sm"
                    onClick={() => setChartType('pie')}
                  >
                    <PieChartIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Columns Selection */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {language === 'my' ? 'ရွေးချယ်ထားသောဒေတာများ' : 'Included Metrics'}
                </Label>
                {[ 
                  { id: 'revenue', label: t('dashboard.revenue') },
                  { id: 'orders', label: t('dashboard.totalOrders') },
                  { id: 'cod', label: 'COD Amount' },
                  { id: 'weight', label: t('order.weight') },
                  { id: 'status', label: t('tracking.status') }
                ].map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox id={metric.id} defaultChecked />
                    <label 
                      htmlFor={metric.id} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {metric.label}
                    </label>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleGenerate} 
                className="w-full luxury-button mt-4"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCcw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                {t('reports.generateReport')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary text-gold p-4 border-none">
            <div className="flex items-start gap-3">
              <Plus className="w-10 h-10 opacity-50" />
              <div>
                <p className="font-bold">{language === 'my' ? 'အကူအညီလိုပါသလား?' : 'Need Advanced Analysis?'}</p>
                <p className="text-xs text-gold/70 mt-1">
                  {language === 'my' 
                    ? 'ကျွန်ုပ်တို့၏ Data Team ထံသို့ ဆက်သွယ်မေးမြန်းနိုင်ပါသည်။' 
                    : 'Contact our data team for enterprise-grade custom SQL reporting.'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {!reportGenerated && !isGenerating ? (
            <div className="h-[600px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-muted/10">
              <div className="p-6 bg-muted rounded-full mb-4">
                <Filter className="w-12 h-12 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-xl font-bold">{language === 'my' ? 'အစီရင်ခံစာစတင်ရန်' : 'Start Your Analysis'}</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                {language === 'my' 
                  ? 'ဘယ်ဘက်ရှိ Configuration များကိုရွေးချယ်ပြီး အစီရင်ခံစာထုတ်လုပ်ပါ။' 
                  : 'Select your parameters on the left and click generate to visualize your data.'}
              </p>
            </div>
          ) : isGenerating ? (
            <div className="h-[600px] flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-medium animate-pulse">{t('common.loading')}</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springPresets.gentle}
              className="space-y-6"
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[ 
                  { label: 'Total Value', value: '45,200,000 MMK', trend: '+12.5%' },
                  { label: 'Sample Size', value: '1,248 Shipments', trend: '+5.2%' },
                  { label: 'Success Rate', value: '94.2%', trend: '+0.8%' }
                ].map((stat, i) => (
                  <Card key={i} className="lotus-card border-none">
                    <CardContent className="p-6">
                      <p className="text-gold/70 text-sm font-medium uppercase tracking-widest">{stat.label}</p>
                      <div className="flex items-baseline justify-between mt-2">
                        <h3 className="text-2xl font-bold text-gold">{stat.value}</h3>
                        <span className="text-success text-xs font-bold">{stat.trend}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Visualization & Table Tabs */}
              <Card className="border-gold/20">
                <Tabs defaultValue="visual" className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
                    <TabsList className="grid w-[400px] grid-cols-2">
                      <TabsTrigger value="visual" className="gap-2">
                        <BarChart2 className="w-4 h-4" />
                        {language === 'my' ? 'မြင်ကွင်းပုံစံ' : 'Visual View'}
                      </TabsTrigger>
                      <TabsTrigger value="data" className="gap-2">
                        <TableIcon className="w-4 h-4" />
                        {language === 'my' ? 'ဒေတာစာရင်း' : 'Data Sheet'}
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gold/30 text-gold">Live Preview</Badge>
                    </div>
                  </CardHeader>

                  <TabsContent value="visual" className="p-6 h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={MOCK_CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Legend verticalAlign="top" align="right" height={36} />
                          <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Revenue" />
                          <Bar dataKey="orders" fill="#1A237E" radius={[4, 4, 0, 0]} name="Orders" />
                        </BarChart>
                      ) : chartType === 'line' ? (
                        <LineChart data={MOCK_CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend verticalAlign="top" align="right" />
                          <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{ r: 6 }} name="Revenue" />
                          <Line type="monotone" dataKey="orders" stroke="#1A237E" strokeWidth={3} dot={{ r: 6 }} name="Orders" />
                        </LineChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={PIE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={140}
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {PIE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="data" className="p-0">
                    <div className="max-h-[500px] overflow-auto">
                      <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead>{language === 'my' ? 'ရက်စွဲ' : 'Period'}</TableHead>
                            <TableHead>{t('dashboard.revenue')}</TableHead>
                            <TableHead>{t('dashboard.totalOrders')}</TableHead>
                            <TableHead>{language === 'my' ? 'တိုးတက်မှု' : 'Growth'}</TableHead>
                            <TableHead className="text-right">{t('warehouse.action')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {MOCK_CHART_DATA.map((row, i) => (
                            <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-semibold">{row.name} 2026</TableCell>
                              <TableCell>{row.revenue.toLocaleString()} MMK</TableCell>
                              <TableCell>{row.orders}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-success/10 text-success">
                                  +{(Math.random() * 20).toFixed(1)}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Recommendations Card */}
              <Card className="border-gold/20 bg-gold/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/20 rounded-full">
                      <BarChart2 className="w-6 h-6 text-gold-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900">
                        {language === 'my' ? 'AI အနှစ်ချုပ် သုံးသပ်ချက်' : 'AI-Powered Insights'}
                      </h4>
                      <p className="text-sm text-navy-800/70 mt-1">
                        {language === 'my' 
                          ? 'ဇွန်လတွင် Revenue ၁၈% တိုးတက်လာသည်ကို တွေ့ရပါသည်။ ညနေပိုင်း ပို့ဆောင်မှုများကို ပိုမိုအာရုံစိုက်ရန် အကြံပြုအပ်ပါသည်။' 
                          : 'Revenue increased by 18% in June. We detected a 25% higher efficiency in evening transit routes. Consider reallocating riders for night shifts.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
