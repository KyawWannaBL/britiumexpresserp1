import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Users, 
  Package,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings,
  Zap,
  Globe,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface KPI {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  target?: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RegionData {
  region: string;
  deliveries: number;
  revenue: number;
  growth: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  percentage: number;
}

const BusinessIntelligencePage: React.FC = () => {
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const keyMetrics: KPI[] = [
    { name: 'Total Revenue', value: '₹ 45.2M', change: 12.5, trend: 'up', target: '₹ 50M' },
    { name: 'Active Customers', value: '12,847', change: 8.3, trend: 'up', target: '15,000' },
    { name: 'Delivery Success Rate', value: '98.5%', change: 2.1, trend: 'up', target: '99%' },
    { name: 'Average Delivery Time', value: '23 min', change: -5.2, trend: 'down', target: '20 min' },
    { name: 'Customer Satisfaction', value: '4.7/5', change: 3.8, trend: 'up', target: '4.8/5' },
    { name: 'Market Share', value: '34.2%', change: 1.9, trend: 'up', target: '40%' }
  ];

  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 3200000, expenses: 2400000, profit: 800000 },
    { month: 'Feb', revenue: 3800000, expenses: 2600000, profit: 1200000 },
    { month: 'Mar', revenue: 4100000, expenses: 2800000, profit: 1300000 },
    { month: 'Apr', revenue: 3900000, expenses: 2700000, profit: 1200000 },
    { month: 'May', revenue: 4500000, expenses: 3000000, profit: 1500000 },
    { month: 'Jun', revenue: 4800000, expenses: 3200000, profit: 1600000 }
  ];

  const regionData: RegionData[] = [
    { region: 'Yangon', deliveries: 45678, revenue: 18500000, growth: 15.2 },
    { region: 'Mandalay', deliveries: 23456, revenue: 9800000, growth: 12.8 },
    { region: 'Naypyidaw', deliveries: 12345, revenue: 5200000, growth: 18.5 },
    { region: 'Bagan', deliveries: 8901, revenue: 3700000, growth: 22.1 },
    { region: 'Taunggyi', deliveries: 6789, revenue: 2800000, growth: 8.9 }
  ];

  const customerSegments: CustomerSegment[] = [
    { segment: 'Enterprise', count: 234, revenue: 15600000, percentage: 34.5 },
    { segment: 'SME', count: 1567, revenue: 18900000, percentage: 41.8 },
    { segment: 'Individual', count: 11046, revenue: 10700000, percentage: 23.7 }
  ];

  const topPerformers = [
    { name: 'Rider R001', deliveries: 456, rating: 4.9, revenue: 234000 },
    { name: 'Driver D003', deliveries: 234, rating: 4.8, revenue: 189000 },
    { name: 'Rider R007', deliveries: 389, rating: 4.7, revenue: 201000 }
  ];

  const insights = [
    {
      type: 'opportunity',
      title: 'Peak Hour Optimization',
      description: 'Delivery demand peaks at 2-4 PM. Consider increasing fleet during these hours.',
      impact: 'High',
      action: 'Schedule more riders'
    },
    {
      type: 'risk',
      title: 'Customer Churn Risk',
      description: '15% of customers haven\'t placed orders in 30 days.',
      impact: 'Medium',
      action: 'Launch retention campaign'
    },
    {
      type: 'trend',
      title: 'Express Delivery Growth',
      description: 'Express delivery requests increased by 45% this month.',
      impact: 'High',
      action: 'Expand express service'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-error" />;
      case 'trend':
        return <BarChart3 className="w-4 h-4 text-info" />;
      default:
        return <Eye className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return <Badge className="bg-error/10 text-error border-error/20">High Impact</Badge>;
      case 'Medium':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium Impact</Badge>;
      case 'Low':
        return <Badge className="bg-info/10 text-info border-info/20">Low Impact</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };

  const exportReport = (type: string) => {
    toast({
      title: "Exporting Report",
      description: `${type} report is being generated...`,
    });
  };

  const refreshData = () => {
    toast({
      title: "Refreshing Data",
      description: "Business intelligence data is being updated...",
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gold-500/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Business Intelligence</h1>
            <p className="text-muted-foreground">Analytics & Strategic Insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">Business Analyst</p>
            <p className="text-xs text-muted-foreground">analytics@britium.com</p>
          </div>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => exportReport('Executive Summary')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Performance Indicators */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {keyMetrics.map((kpi, index) => (
          <Card key={index} className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
                <div className={`flex items-center space-x-1 ${kpi.trend === 'up' ? 'text-success' : 'text-error'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="text-xs font-medium">{Math.abs(kpi.change)}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-navy-900 mb-1">{kpi.value}</p>
              {kpi.target && (
                <p className="text-xs text-muted-foreground">Target: {kpi.target}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Revenue Trend</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">6M</Button>
                      <Button variant="outline" size="sm">1Y</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <TrendingUp className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Regional Performance */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionData.slice(0, 4).map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gold-500/10 rounded flex items-center justify-center">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{region.region}</p>
                            <p className="text-sm text-muted-foreground">{region.deliveries.toLocaleString()} deliveries</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(region.revenue)}</p>
                          <p className="text-xs text-success">+{region.growth}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business Insights */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Strategic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start space-x-3 mb-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{insight.title}</h4>
                            {getImpactBadge(insight.impact)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                          <Button size="sm" variant="outline" className="w-full">
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <BarChart3 className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Revenue by Service Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <PieChart className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Monthly Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Month</th>
                        <th className="text-left p-3">Revenue</th>
                        <th className="text-left p-3">Expenses</th>
                        <th className="text-left p-3">Profit</th>
                        <th className="text-left p-3">Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((data, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{data.month}</td>
                          <td className="p-3">{formatCurrency(data.revenue)}</td>
                          <td className="p-3">{formatCurrency(data.expenses)}</td>
                          <td className="p-3 font-semibold text-success">{formatCurrency(data.profit)}</td>
                          <td className="p-3">{((data.profit / data.revenue) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            {/* Operational Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Deliveries</p>
                      <p className="text-2xl font-bold text-navy-900">156,789</p>
                      <p className="text-xs text-success">+18% this month</p>
                    </div>
                    <Package className="h-8 w-8 text-info" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Delivery Time</p>
                      <p className="text-2xl font-bold text-navy-900">23 min</p>
                      <p className="text-xs text-success">-5% improvement</p>
                    </div>
                    <Clock className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-navy-900">98.5%</p>
                      <p className="text-xs text-success">+2.1% improvement</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fleet Utilization</p>
                      <p className="text-2xl font-bold text-navy-900">87%</p>
                      <p className="text-xs text-info">Optimal range</p>
                    </div>
                    <Target className="h-8 w-8 text-info" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Operational Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Delivery Performance by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <BarChart3 className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Route Optimization Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Distance Saved</span>
                      <span className="font-semibold">2,345 km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time Saved</span>
                      <span className="font-semibold">156 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fuel Saved</span>
                      <span className="font-semibold">₹ 234,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CO2 Reduced</span>
                      <span className="font-semibold">1.2 tons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            {/* Customer Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegments.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-gold-500 rounded"></div>
                          <div>
                            <p className="font-medium">{segment.segment}</p>
                            <p className="text-sm text-muted-foreground">{segment.count.toLocaleString()} customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(segment.revenue)}</p>
                          <p className="text-xs text-muted-foreground">{segment.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Customer Satisfaction Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <TrendingUp className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-info mx-auto mb-2" />
                  <p className="text-2xl font-bold">12,847</p>
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">₹ 3,524</p>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.7</p>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-info mx-auto mb-2" />
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Retention Rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Analytics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Deliveries</th>
                        <th className="text-left p-3">Rating</th>
                        <th className="text-left p-3">Revenue</th>
                        <th className="text-left p-3">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPerformers.map((performer, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gold-500/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold">{index + 1}</span>
                              </div>
                              <span className="font-medium">{performer.name}</span>
                            </div>
                          </td>
                          <td className="p-3">{performer.deliveries}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4 text-warning" />
                              <span>{performer.rating}</span>
                            </div>
                          </td>
                          <td className="p-3 font-semibold">{formatCurrency(performer.revenue)}</td>
                          <td className="p-3">
                            <Badge className="bg-success/10 text-success border-success/20">Excellent</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* AI-Powered Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight, index) => (
                <Card key={index} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      {getImpactBadge(insight.impact)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{insight.description}</p>
                    <Button className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      {insight.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Predictive Analytics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">+23%</div>
                    <p className="text-sm text-muted-foreground">Predicted Revenue Growth</p>
                    <p className="text-xs text-muted-foreground">Next Quarter</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-info mb-2">15,600</div>
                    <p className="text-sm text-muted-foreground">Expected New Customers</p>
                    <p className="text-xs text-muted-foreground">Next 3 Months</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">18 min</div>
                    <p className="text-sm text-muted-foreground">Target Delivery Time</p>
                    <p className="text-xs text-muted-foreground">With Optimization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            {/* Forecasting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <TrendingUp className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Demand Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <BarChart3 className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Forecast Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Forecast Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900 mb-2">₹ 58.5M</div>
                    <p className="text-sm text-muted-foreground">Q2 Revenue Forecast</p>
                    <p className="text-xs text-success">+29% growth</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900 mb-2">189,456</div>
                    <p className="text-sm text-muted-foreground">Q2 Delivery Forecast</p>
                    <p className="text-xs text-success">+21% growth</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900 mb-2">16,890</div>
                    <p className="text-sm text-muted-foreground">New Customer Forecast</p>
                    <p className="text-xs text-success">+31% growth</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900 mb-2">98.8%</div>
                    <p className="text-sm text-muted-foreground">Success Rate Target</p>
                    <p className="text-xs text-success">+0.3% improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default BusinessIntelligencePage;