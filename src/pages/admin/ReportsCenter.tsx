import React, { useState, useEffect } from "react";
import { useLanguageContext } from "@/lib/LanguageContext";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Save,
  Truck,
  Users,
  DollarSign,
  Package,
  Clock,
  Star,
  MapPin,
  Building2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ReportsAPI, 
  KPIMetrics, 
  DeliveryReport, 
  MerchantReport, 
  FinancialReport,
  RiderPerformanceReport,
  WarehouseReport,
  ReportFilter 
} from "@/lib/reports-api";

export default function ReportsCenter() {
  const { t } = useLanguageContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  });

  // Report Data States
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics | null>(null);
  const [deliveryReport, setDeliveryReport] = useState<DeliveryReport | null>(null);
  const [merchantReports, setMerchantReports] = useState<MerchantReport[]>([]);
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [riderReports, setRiderReports] = useState<RiderPerformanceReport[]>([]);
  const [warehouseReports, setWarehouseReports] = useState<WarehouseReport[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [kpi, delivery, merchants, financial, riders, warehouses] = await Promise.all([
        ReportsAPI.generateKPIReport(filters),
        ReportsAPI.generateDeliveryReport(filters),
        ReportsAPI.generateMerchantReport(undefined, filters),
        ReportsAPI.generateFinancialReport(filters),
        ReportsAPI.generateRiderReport(undefined, filters),
        ReportsAPI.generateWarehouseReport(undefined, filters)
      ]);

      setKpiMetrics(kpi);
      setDeliveryReport(delivery);
      setMerchantReports(merchants);
      setFinancialReport(financial);
      setRiderReports(riders);
      setWarehouseReports(warehouses);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async (reportType: string, data: any[]) => {
    try {
      await ReportsAPI.exportToCSV(data, `${reportType}_report`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportExcel = async (reportType: string, data: any[]) => {
    try {
      await ReportsAPI.exportToExcel(data, `${reportType}_report`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('MMK', 'MMK ');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-navy mr-3" />
          <span className="text-lg font-medium text-brand-navy">
            {t('reports.generating')} / အစီရင်ခံစာများ ပြုစုနေသည်...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-navy-50 to-gold-50 min-h-screen">
      {/* Header */}
      <div className="surface-elevated p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient-navy mb-2">
              {t('reports.center')} / အစီရင်ခံစာ ဗဟိုချက်
            </h1>
            <p className="text-navy-600">
              Comprehensive analytics and operational reports for Britium Express
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="form-elegant"
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="form-elegant"
              />
            </div>
            <Button onClick={loadReports} className="btn-primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('common.refresh')} / ပြန်လည်ရယူရန်
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      {kpiMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-brand-navy to-brand-royal rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="stat-value text-brand-navy">{formatNumber(kpiMetrics.totalDeliveries)}</div>
            <div className="stat-label">Total Deliveries / စုစုပေါင်း ပို့ဆောင်မှုများ</div>
            <div className="mt-2 text-sm text-success font-medium">
              ↑ {((kpiMetrics.successfulDeliveries / kpiMetrics.totalDeliveries) * 100).toFixed(1)}% Success Rate
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-brand-gold to-brand-amber rounded-xl">
                <DollarSign className="w-6 h-6 text-brand-navy" />
              </div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="stat-value text-brand-gold">{formatCurrency(kpiMetrics.revenue)}</div>
            <div className="stat-label">Total Revenue / စုစုပေါင်း ဝင်ငွေ</div>
            <div className="mt-2 text-sm text-success font-medium">
              ↑ {kpiMetrics.profitMargin}% Profit Margin
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-info to-blue-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="stat-value text-info">{formatNumber(kpiMetrics.activeRiders)}</div>
            <div className="stat-label">Active Riders / လက်ရှိ ရိုင်ဒါများ</div>
            <div className="mt-2 text-sm text-navy-600 font-medium">
              {formatNumber(kpiMetrics.activeMerchants)} Active Merchants
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-warning to-orange-600 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="stat-value text-warning">{kpiMetrics.customerSatisfaction}</div>
            <div className="stat-label">Customer Rating / ဖောက်သည် အဆင့်သတ်မှတ်ချက်</div>
            <div className="mt-2 text-sm text-navy-600 font-medium">
              {kpiMetrics.averageDeliveryTime}h Avg Delivery Time
            </div>
          </div>
        </div>
      )}

      {/* Report Tabs */}
      <div className="surface-elevated">
        <div className="border-b border-navy-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview / အနှစ်ချုပ်', icon: BarChart3 },
              { id: 'delivery', label: 'Delivery / ပို့ဆောင်မှု', icon: Truck },
              { id: 'financial', label: 'Financial / ငွေကြေး', icon: DollarSign },
              { id: 'merchants', label: 'Merchants / ကုန်သည်များ', icon: Building2 },
              { id: 'riders', label: 'Riders / ရိုင်ဒါများ', icon: Users },
              { id: 'warehouse', label: 'Warehouse / ကုန်ရုံ', icon: Package }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-navy-600 hover:text-brand-navy hover:border-navy-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && kpiMetrics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="text-brand-navy">Performance Metrics / စွမ်းဆောင်ရည် မက်ထရစ်များ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-navy-50 rounded-lg">
                        <span className="font-medium">Success Rate</span>
                        <span className="font-bold text-success">
                          {((kpiMetrics.successfulDeliveries / kpiMetrics.totalDeliveries) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gold-50 rounded-lg">
                        <span className="font-medium">Warehouse Utilization</span>
                        <span className="font-bold text-brand-gold">{kpiMetrics.warehouseUtilization}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-navy-50 rounded-lg">
                        <span className="font-medium">Average Delivery Time</span>
                        <span className="font-bold text-brand-navy">{kpiMetrics.averageDeliveryTime}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="text-brand-navy">Financial Summary / ငွေကြေး အနှစ်ချုပ်</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gold-50 rounded-lg">
                        <span className="font-medium">Total Revenue</span>
                        <span className="font-bold text-brand-gold">{formatCurrency(kpiMetrics.revenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-navy-50 rounded-lg">
                        <span className="font-medium">Operating Costs</span>
                        <span className="font-bold text-brand-navy">{formatCurrency(kpiMetrics.operatingCosts)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                        <span className="font-medium">Profit Margin</span>
                        <span className="font-bold text-success">{kpiMetrics.profitMargin}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Delivery Tab */}
          {activeTab === 'delivery' && deliveryReport && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-brand-navy">
                  Delivery Operations Report / ပို့ဆောင်မှု လုပ်ငန်း အစီရင်ခံစာ
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleExportCSV('delivery', [deliveryReport])}
                    className="btn-outline-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => handleExportExcel('delivery', [deliveryReport])}
                    className="btn-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card">
                  <div className="stat-value text-brand-navy">{formatNumber(deliveryReport.totalOrders)}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-success">{formatNumber(deliveryReport.completedOrders)}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-warning">{formatNumber(deliveryReport.pendingOrders)}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-error">{formatNumber(deliveryReport.failedOrders)}</div>
                  <div className="stat-label">Failed</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle>Top Performing Riders / အကောင်းဆုံး ရိုင်ဒါများ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deliveryReport.topPerformingRiders.map((rider, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
                          <div>
                            <div className="font-medium text-brand-navy">{rider.name}</div>
                            <div className="text-sm text-navy-600">{rider.deliveries} deliveries</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-success">{rider.successRate}%</div>
                            <div className="text-xs text-navy-500">Success Rate</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle>Regional Breakdown / ဒေသအလိုက် ခွဲခြမ်းစိတ်ဖြာမှု</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deliveryReport.regionBreakdown.map((region, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                          <div>
                            <div className="font-medium text-brand-navy">{region.region}</div>
                            <div className="text-sm text-navy-600">{formatNumber(region.orders)} orders</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-brand-gold">{formatCurrency(region.revenue)}</div>
                            <div className="text-xs text-navy-500">Revenue</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && financialReport && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-brand-navy">
                  Financial Report / ငွေကြေး အစီရင်ခံစာ
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleExportCSV('financial', [financialReport])}
                    className="btn-outline-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => handleExportExcel('financial', [financialReport])}
                    className="btn-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card">
                  <div className="stat-value text-brand-gold">{formatCurrency(financialReport.totalRevenue)}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-brand-navy">{formatCurrency(financialReport.operatingExpenses)}</div>
                  <div className="stat-label">Operating Expenses</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-success">{formatCurrency(financialReport.grossProfit)}</div>
                  <div className="stat-label">Gross Profit</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-success">{financialReport.profitMargin}%</div>
                  <div className="stat-label">Profit Margin</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle>Revenue by Service / ဝန်ဆောင်မှုအလိုက် ဝင်ငွေ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {financialReport.revenueByService.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                          <div>
                            <div className="font-medium text-brand-navy">{service.service}</div>
                            <div className="text-sm text-navy-600">{service.percentage}% of total</div>
                          </div>
                          <div className="font-bold text-brand-gold">{formatCurrency(service.revenue)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle>Expense Breakdown / ကုန်ကျစရိတ် ခွဲခြမ်းစိတ်ဖြာမှု</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {financialReport.expenseBreakdown.map((expense, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
                          <div>
                            <div className="font-medium text-brand-navy">{expense.category}</div>
                            <div className="text-sm text-navy-600">{expense.percentage}% of total</div>
                          </div>
                          <div className="font-bold text-brand-navy">{formatCurrency(expense.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Merchants Tab */}
          {activeTab === 'merchants' && merchantReports.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-brand-navy">
                  Merchant Performance Report / ကုန်သည် စွမ်းဆောင်ရည် အစီရင်ခံစာ
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleExportCSV('merchants', merchantReports)}
                    className="btn-outline-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => handleExportExcel('merchants', merchantReports)}
                    className="btn-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>

              <div className="table-elegant">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Merchant Name / ကုန်သည် အမည်</th>
                      <th>Total Orders / စုစုပေါင်း အော်ဒါများ</th>
                      <th>Revenue / ဝင်ငွေ</th>
                      <th>Avg Order Value / ပျမ်းမျှ အော်ဒါ တန်ဖိုး</th>
                      <th>Success Rate / အောင်မြင်မှု နှုန်း</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantReports.slice(0, 10).map((merchant) => (
                      <tr key={merchant.merchantId}>
                        <td className="font-medium text-brand-navy">{merchant.merchantName}</td>
                        <td>{formatNumber(merchant.totalOrders)}</td>
                        <td className="font-bold text-brand-gold">{formatCurrency(merchant.totalRevenue)}</td>
                        <td>{formatCurrency(merchant.averageOrderValue)}</td>
                        <td>
                          <span className={`badge-${merchant.successRate >= 95 ? 'success' : merchant.successRate >= 90 ? 'warning' : 'error'}`}>
                            {merchant.successRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Riders Tab */}
          {activeTab === 'riders' && riderReports.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-brand-navy">
                  Rider Performance Report / ရိုင်ဒါ စွမ်းဆောင်ရည် အစီရင်ခံစာ
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleExportCSV('riders', riderReports)}
                    className="btn-outline-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => handleExportExcel('riders', riderReports)}
                    className="btn-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>

              <div className="table-elegant">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Rider Name / ရိုင်ဒါ အမည်</th>
                      <th>Total Deliveries / စုစုပေါင်း ပို့ဆောင်မှုများ</th>
                      <th>Success Rate / အောင်မြင်မှု နှုန်း</th>
                      <th>Avg Time / ပျမ်းမျှ အချိန်</th>
                      <th>Rating / အဆင့်သတ်မှတ်ချက်</th>
                      <th>Earnings / ဝင်ငွေ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riderReports.slice(0, 10).map((rider) => (
                      <tr key={rider.riderId}>
                        <td className="font-medium text-brand-navy">{rider.riderName}</td>
                        <td>{formatNumber(rider.totalDeliveries)}</td>
                        <td>
                          <span className={`badge-${rider.successRate >= 95 ? 'success' : rider.successRate >= 90 ? 'warning' : 'error'}`}>
                            {rider.successRate}%
                          </span>
                        </td>
                        <td>{rider.averageDeliveryTime} min</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-brand-gold fill-current" />
                            <span className="font-medium">{rider.customerRating}</span>
                          </div>
                        </td>
                        <td className="font-bold text-brand-gold">{formatCurrency(rider.totalEarnings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Warehouse Tab */}
          {activeTab === 'warehouse' && warehouseReports.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-brand-navy">
                  Warehouse Operations Report / ကုန်ရုံ လုပ်ငန်း အစီရင်ခံစာ
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleExportCSV('warehouse', warehouseReports)}
                    className="btn-outline-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => handleExportExcel('warehouse', warehouseReports)}
                    className="btn-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {warehouseReports.map((warehouse) => (
                  <Card key={warehouse.warehouseId} className="surface-card">
                    <CardHeader>
                      <CardTitle className="text-brand-navy flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {warehouse.warehouseName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-navy-600">Packages Processed</span>
                          <span className="font-bold text-brand-navy">{formatNumber(warehouse.totalPackagesProcessed)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-navy-600">Utilization Rate</span>
                          <span className="font-bold text-brand-gold">{warehouse.utilizationRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-navy-600">Avg Processing Time</span>
                          <span className="font-bold text-info">{warehouse.averageProcessingTime} min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-navy-600">Staff Efficiency</span>
                          <span className="font-bold text-success">{warehouse.staffEfficiency}%</span>
                        </div>
                        <div className="pt-2 border-t border-navy-200">
                          <div className="text-xs text-navy-500 mb-2">Equipment Status</div>
                          <div className="space-y-1">
                            {warehouse.equipmentStatus.slice(0, 3).map((equipment, index) => (
                              <div key={index} className="flex justify-between items-center text-xs">
                                <span>{equipment.equipment}</span>
                                <span className={`badge-${equipment.status === 'operational' ? 'success' : equipment.status === 'maintenance' ? 'warning' : 'error'}`}>
                                  {equipment.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}