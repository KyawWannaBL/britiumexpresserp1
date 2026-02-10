import { supabase } from '@/integrations/supabase/client';

// Report Types
export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  status?: string;
  region?: string;
  merchant?: string;
  rider?: string;
  branch?: string;
}

export interface OperationalReport {
  id: string;
  report_type: 'delivery' | 'pickup' | 'financial' | 'performance' | 'merchant' | 'rider' | 'warehouse';
  title: string;
  description: string;
  data: any;
  filters: ReportFilter;
  generated_at: string;
  generated_by: string;
  file_url?: string;
}

export interface KPIMetrics {
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  pendingDeliveries: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
  revenue: number;
  operatingCosts: number;
  profitMargin: number;
  activeRiders: number;
  activeMerchants: number;
  warehouseUtilization: number;
}

export interface DeliveryReport {
  date: string;
  totalOrders: number;
  completedOrders: number;
  failedOrders: number;
  pendingOrders: number;
  revenue: number;
  averageDeliveryTime: string;
  topPerformingRiders: Array<{
    name: string;
    deliveries: number;
    successRate: number;
  }>;
  regionBreakdown: Array<{
    region: string;
    orders: number;
    revenue: number;
  }>;
}

export interface MerchantReport {
  merchantId: string;
  merchantName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  successRate: number;
  topProducts: Array<{
    product: string;
    quantity: number;
    revenue: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  operatingExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  revenueByService: Array<{
    service: string;
    revenue: number;
    percentage: number;
  }>;
  expenseBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  cashFlow: Array<{
    date: string;
    inflow: number;
    outflow: number;
    balance: number;
  }>;
}

export interface RiderPerformanceReport {
  riderId: string;
  riderName: string;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  successRate: number;
  averageDeliveryTime: number;
  customerRating: number;
  totalEarnings: number;
  bonusEarned: number;
  areasServed: string[];
  performanceTrend: Array<{
    date: string;
    deliveries: number;
    successRate: number;
  }>;
}

export interface WarehouseReport {
  warehouseId: string;
  warehouseName: string;
  totalPackagesProcessed: number;
  packagesIn: number;
  packagesOut: number;
  currentInventory: number;
  utilizationRate: number;
  averageProcessingTime: number;
  staffEfficiency: number;
  equipmentStatus: Array<{
    equipment: string;
    status: 'operational' | 'maintenance' | 'offline';
    lastMaintenance: string;
  }>;
}

// Reports API Class
export class ReportsAPI {
  // Generate KPI Dashboard Report
  static async generateKPIReport(filters: ReportFilter = {}): Promise<KPIMetrics> {
    try {
      // Mock data for demonstration - replace with actual Supabase queries
      return {
        totalDeliveries: 15847,
        successfulDeliveries: 14523,
        failedDeliveries: 892,
        pendingDeliveries: 432,
        averageDeliveryTime: 2.4,
        customerSatisfaction: 4.7,
        revenue: 45200000,
        operatingCosts: 32800000,
        profitMargin: 27.4,
        activeRiders: 156,
        activeMerchants: 1247,
        warehouseUtilization: 78.5
      };
    } catch (error) {
      console.error('Error generating KPI report:', error);
      throw error;
    }
  }

  // Generate Delivery Operations Report
  static async generateDeliveryReport(filters: ReportFilter = {}): Promise<DeliveryReport> {
    try {
      const { data, error } = await supabase
        .from('delivery_ways_2026_02_04_05_03')
        .select('*')
        .gte('created_at', filters.startDate || '2026-01-01')
        .lte('created_at', filters.endDate || '2026-12-31');

      if (error) throw error;

      // Process data into report format
      const totalOrders = data?.length || 0;
      const completedOrders = data?.filter(d => d.status === 'delivered').length || 0;
      const failedOrders = data?.filter(d => d.status === 'failed').length || 0;
      const pendingOrders = data?.filter(d => d.status === 'pending').length || 0;

      return {
        date: new Date().toISOString().split('T')[0],
        totalOrders,
        completedOrders,
        failedOrders,
        pendingOrders,
        revenue: completedOrders * 3500, // Average delivery fee
        averageDeliveryTime: '2.4 hours',
        topPerformingRiders: [
          { name: 'Aung Kyaw', deliveries: 45, successRate: 96.8 },
          { name: 'Thant Zin', deliveries: 42, successRate: 95.2 },
          { name: 'Kyaw Min', deliveries: 38, successRate: 94.7 }
        ],
        regionBreakdown: [
          { region: 'Yangon Central', orders: Math.floor(totalOrders * 0.4), revenue: Math.floor(totalOrders * 0.4 * 3500) },
          { region: 'Yangon North', orders: Math.floor(totalOrders * 0.3), revenue: Math.floor(totalOrders * 0.3 * 3500) },
          { region: 'Yangon South', orders: Math.floor(totalOrders * 0.3), revenue: Math.floor(totalOrders * 0.3 * 3500) }
        ]
      };
    } catch (error) {
      console.error('Error generating delivery report:', error);
      throw error;
    }
  }

  // Generate Merchant Performance Report
  static async generateMerchantReport(merchantId?: string, filters: ReportFilter = {}): Promise<MerchantReport[]> {
    try {
      const { data, error } = await supabase
        .from('merchants_2026_02_04_05_03')
        .select('*')
        .eq(merchantId ? 'id' : 'status', merchantId || 'active');

      if (error) throw error;

      return data?.map(merchant => ({
        merchantId: merchant.id,
        merchantName: merchant.business_name,
        totalOrders: Math.floor(Math.random() * 500) + 100,
        totalRevenue: Math.floor(Math.random() * 5000000) + 1000000,
        averageOrderValue: Math.floor(Math.random() * 50000) + 25000,
        successRate: Math.floor(Math.random() * 10) + 90,
        topProducts: [
          { product: 'Electronics', quantity: 45, revenue: 2250000 },
          { product: 'Clothing', quantity: 32, revenue: 1600000 },
          { product: 'Books', quantity: 28, revenue: 840000 }
        ],
        monthlyTrend: [
          { month: 'Jan 2026', orders: 85, revenue: 4250000 },
          { month: 'Feb 2026', orders: 92, revenue: 4600000 },
          { month: 'Mar 2026', orders: 78, revenue: 3900000 }
        ]
      })) || [];
    } catch (error) {
      console.error('Error generating merchant report:', error);
      throw error;
    }
  }

  // Generate Financial Report
  static async generateFinancialReport(filters: ReportFilter = {}): Promise<FinancialReport> {
    try {
      return {
        period: `${filters.startDate || '2026-01-01'} to ${filters.endDate || '2026-12-31'}`,
        totalRevenue: 45200000,
        operatingExpenses: 32800000,
        grossProfit: 12400000,
        netProfit: 8950000,
        profitMargin: 19.8,
        revenueByService: [
          { service: 'Same Day Delivery', revenue: 18080000, percentage: 40 },
          { service: 'Next Day Delivery', revenue: 13560000, percentage: 30 },
          { service: 'Express Delivery', revenue: 9040000, percentage: 20 },
          { service: 'International', revenue: 4520000, percentage: 10 }
        ],
        expenseBreakdown: [
          { category: 'Fuel & Transportation', amount: 13120000, percentage: 40 },
          { category: 'Staff Salaries', amount: 9840000, percentage: 30 },
          { category: 'Warehouse Operations', amount: 4920000, percentage: 15 },
          { category: 'Technology & Systems', amount: 3280000, percentage: 10 },
          { category: 'Marketing & Admin', amount: 1640000, percentage: 5 }
        ],
        cashFlow: [
          { date: '2026-01', inflow: 3766667, outflow: 2733333, balance: 1033334 },
          { date: '2026-02', inflow: 3766667, outflow: 2733333, balance: 2066668 },
          { date: '2026-03', inflow: 3766667, outflow: 2733333, balance: 3100002 }
        ]
      };
    } catch (error) {
      console.error('Error generating financial report:', error);
      throw error;
    }
  }

  // Generate Rider Performance Report
  static async generateRiderReport(riderId?: string, filters: ReportFilter = {}): Promise<RiderPerformanceReport[]> {
    try {
      const { data, error } = await supabase
        .from('riders_2026_02_04_14_23')
        .select('*')
        .eq(riderId ? 'id' : 'status', riderId || 'active');

      if (error) throw error;

      return data?.map(rider => ({
        riderId: rider.id,
        riderName: rider.full_name,
        totalDeliveries: Math.floor(Math.random() * 200) + 50,
        successfulDeliveries: Math.floor(Math.random() * 180) + 45,
        failedDeliveries: Math.floor(Math.random() * 20) + 2,
        successRate: Math.floor(Math.random() * 10) + 90,
        averageDeliveryTime: Math.floor(Math.random() * 60) + 90,
        customerRating: Math.random() * 1 + 4,
        totalEarnings: Math.floor(Math.random() * 500000) + 200000,
        bonusEarned: Math.floor(Math.random() * 50000) + 10000,
        areasServed: ['Yangon Central', 'Bahan', 'Sanchaung'],
        performanceTrend: [
          { date: '2026-01', deliveries: 45, successRate: 94.5 },
          { date: '2026-02', deliveries: 52, successRate: 96.2 },
          { date: '2026-03', deliveries: 48, successRate: 95.8 }
        ]
      })) || [];
    } catch (error) {
      console.error('Error generating rider report:', error);
      throw error;
    }
  }

  // Generate Warehouse Operations Report
  static async generateWarehouseReport(warehouseId?: string, filters: ReportFilter = {}): Promise<WarehouseReport[]> {
    try {
      const { data, error } = await supabase
        .from('warehouse_stations')
        .select('*')
        .eq(warehouseId ? 'id' : 'status', warehouseId || 'active');

      if (error) throw error;

      return data?.map(warehouse => ({
        warehouseId: warehouse.id,
        warehouseName: warehouse.station_name,
        totalPackagesProcessed: Math.floor(Math.random() * 5000) + 1000,
        packagesIn: Math.floor(Math.random() * 2500) + 500,
        packagesOut: Math.floor(Math.random() * 2500) + 500,
        currentInventory: Math.floor(Math.random() * 1000) + 200,
        utilizationRate: Math.floor(Math.random() * 30) + 70,
        averageProcessingTime: Math.floor(Math.random() * 30) + 15,
        staffEfficiency: Math.floor(Math.random() * 20) + 80,
        equipmentStatus: [
          { equipment: 'Sorting Machine A', status: 'operational', lastMaintenance: '2026-01-15' },
          { equipment: 'Conveyor Belt 1', status: 'operational', lastMaintenance: '2026-01-20' },
          { equipment: 'Scanner System', status: 'maintenance', lastMaintenance: '2026-01-10' }
        ]
      })) || [];
    } catch (error) {
      console.error('Error generating warehouse report:', error);
      throw error;
    }
  }

  // Export Report to CSV
  static async exportToCSV(reportData: any[], filename: string): Promise<string> {
    try {
      if (!reportData || reportData.length === 0) {
        throw new Error('No data to export');
      }

      const headers = Object.keys(reportData[0]);
      const csvContent = [
        headers.join(','),
        ...reportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle nested objects and arrays
            if (typeof value === 'object' && value !== null) {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            // Escape commas and quotes in strings
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return url;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  // Export Report to Excel (using CSV format for simplicity)
  static async exportToExcel(reportData: any[], filename: string): Promise<string> {
    try {
      // For now, we'll use CSV format with .xlsx extension
      // In a real implementation, you'd use a library like xlsx or exceljs
      const csvUrl = await this.exportToCSV(reportData, filename);
      
      // Change the download to use .xlsx extension
      const link = document.createElement('a');
      link.setAttribute('href', csvUrl);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return csvUrl;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Save Report to Database
  static async saveReport(report: Omit<OperationalReport, 'id' | 'generated_at'>): Promise<OperationalReport> {
    try {
      const { data, error } = await supabase
        .from('operational_reports')
        .insert({
          ...report,
          generated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  }

  // Get Saved Reports
  static async getSavedReports(filters: ReportFilter = {}): Promise<OperationalReport[]> {
    try {
      let query = supabase
        .from('operational_reports')
        .select('*')
        .order('generated_at', { ascending: false });

      if (filters.startDate) {
        query = query.gte('generated_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('generated_at', filters.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching saved reports:', error);
      throw error;
    }
  }
}