import { supabase } from '@/integrations/supabase/client';

// TypeScript interfaces for admin system
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'supervisor' | 'warehouse_staff' | 'rider' | 'accountant' | 'marketer' | 'customer_service' | 'merchant' | 'sub_station_manager' | 'vendor';
  status: 'active' | 'suspended' | 'pending';
  hub_assignment: string;
  phone?: string;
  must_change_password: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface BulkUpload {
  id: string;
  filename: string;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  status: 'processing' | 'completed' | 'failed';
  uploaded_by: string;
  upload_date: string;
  processed_date?: string;
  error_details?: any;
}

export interface BulkUploadItem {
  id: string;
  upload_id: string;
  row_number: number;
  receiver_name?: string;
  receiver_phone?: string;
  receiver_address?: string;
  sender_name?: string;
  sender_phone?: string;
  weight?: number;
  cod_amount?: number;
  special_instructions?: string;
  validation_status: 'valid' | 'error' | 'pending';
  validation_errors?: string[];
  created_shipment_id?: string;
  created_at: string;
}

export interface TariffRate {
  id: string;
  country: string;
  country_code?: string;
  region: string;
  weight_slab_min: number;
  weight_slab_max: number;
  price_mmk: number;
  price_usd?: number;
  effective_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface SystemConfig {
  id: string;
  config_key: string;
  config_value: any;
  description?: string;
  category: string;
  is_sensitive: boolean;
  updated_at: string;
  updated_by?: string;
}

export interface MarketerPerformance {
  id: string;
  marketer_id: string;
  month_year: string;
  leads_generated: number;
  conversions: number;
  revenue_generated: number;
  campaigns_run: number;
  customer_acquisition_cost: number;
  conversion_rate: number;
  created_at: string;
}

export interface CustomerServiceInteraction {
  id: string;
  agent_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  interaction_type: 'inquiry' | 'complaint' | 'support' | 'feedback' | 'refund_request' | 'tracking_help';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description?: string;
  resolution?: string;
  satisfaction_rating?: number;
  created_at: string;
  resolved_at?: string;
  response_time_minutes?: number;
}

// Admin Users API
export class AdminUsersAPI {
  static async list(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users_2026_02_04_16_00')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users_2026_02_04_16_00')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async create(user: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users_2026_02_04_16_00')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users_2026_02_04_16_00')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users_2026_02_04_16_00')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getByRole(role: string): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users_2026_02_04_16_00')
      .select('*')
      .eq('role', role)
      .order('full_name');
    
    if (error) throw error;
    return data || [];
  }

  static async getStats(): Promise<any> {
    const { data, error } = await supabase
      .from('admin_users_2026_02_04_16_00')
      .select('role, status');
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      active: data?.filter(u => u.status === 'active').length || 0,
      suspended: data?.filter(u => u.status === 'suspended').length || 0,
      pending: data?.filter(u => u.status === 'pending').length || 0,
      byRole: {} as Record<string, number>
    };
    
    data?.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    });
    
    return stats;
  }
}

// Bulk Upload API
export class BulkUploadAPI {
  static async list(): Promise<BulkUpload[]> {
    const { data, error } = await supabase
      .from('bulk_uploads_2026_02_04_16_00')
      .select('*')
      .order('upload_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async create(upload: Partial<BulkUpload>): Promise<BulkUpload> {
    const { data, error } = await supabase
      .from('bulk_uploads_2026_02_04_16_00')
      .insert([upload])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getItems(uploadId: string): Promise<BulkUploadItem[]> {
    const { data, error } = await supabase
      .from('bulk_upload_items_2026_02_04_16_00')
      .select('*')
      .eq('upload_id', uploadId)
      .order('row_number');
    
    if (error) throw error;
    return data || [];
  }

  static async createItems(items: Partial<BulkUploadItem>[]): Promise<BulkUploadItem[]> {
    const { data, error } = await supabase
      .from('bulk_upload_items_2026_02_04_16_00')
      .insert(items)
      .select();
    
    if (error) throw error;
    return data || [];
  }

  static async updateStatus(id: string, status: string, errorDetails?: any): Promise<BulkUpload> {
    const updates: any = { 
      status, 
      processed_date: new Date().toISOString() 
    };
    
    if (errorDetails) {
      updates.error_details = errorDetails;
    }
    
    const { data, error } = await supabase
      .from('bulk_uploads_2026_02_04_16_00')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Tariff Rates API
export class TariffRatesAPI {
  static async list(): Promise<TariffRate[]> {
    const { data, error } = await supabase
      .from('tariff_rates_2026_02_04_16_00')
      .select('*')
      .eq('is_active', true)
      .order('country');
    
    if (error) throw error;
    return data || [];
  }

  static async create(rate: Partial<TariffRate>): Promise<TariffRate> {
    const { data, error } = await supabase
      .from('tariff_rates_2026_02_04_16_00')
      .insert([rate])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<TariffRate>): Promise<TariffRate> {
    const { data, error } = await supabase
      .from('tariff_rates_2026_02_04_16_00')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tariff_rates_2026_02_04_16_00')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getByCountry(country: string): Promise<TariffRate[]> {
    const { data, error } = await supabase
      .from('tariff_rates_2026_02_04_16_00')
      .select('*')
      .eq('country', country)
      .eq('is_active', true)
      .order('weight_slab_min');
    
    if (error) throw error;
    return data || [];
  }
}

// System Configuration API
export class SystemConfigAPI {
  static async list(): Promise<SystemConfig[]> {
    const { data, error } = await supabase
      .from('system_config_2026_02_04_16_00')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getByKey(key: string): Promise<SystemConfig | null> {
    const { data, error } = await supabase
      .from('system_config_2026_02_04_16_00')
      .select('*')
      .eq('config_key', key)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(key: string, value: any, updatedBy?: string): Promise<SystemConfig> {
    const { data, error } = await supabase
      .from('system_config_2026_02_04_16_00')
      .update({ 
        config_value: value, 
        updated_at: new Date().toISOString(),
        updated_by: updatedBy 
      })
      .eq('config_key', key)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async create(config: Partial<SystemConfig>): Promise<SystemConfig> {
    const { data, error } = await supabase
      .from('system_config_2026_02_04_16_00')
      .insert([config])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Marketer Performance API
export class MarketerPerformanceAPI {
  static async list(): Promise<MarketerPerformance[]> {
    const { data, error } = await supabase
      .from('marketer_performance_2026_02_04_16_00')
      .select(`
        *,
        admin_users_2026_02_04_16_00!marketer_id (
          full_name,
          email
        )
      `)
      .order('month_year', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getByMarketer(marketerId: string): Promise<MarketerPerformance[]> {
    const { data, error } = await supabase
      .from('marketer_performance_2026_02_04_16_00')
      .select('*')
      .eq('marketer_id', marketerId)
      .order('month_year', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async create(performance: Partial<MarketerPerformance>): Promise<MarketerPerformance> {
    const { data, error } = await supabase
      .from('marketer_performance_2026_02_04_16_00')
      .insert([performance])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<MarketerPerformance>): Promise<MarketerPerformance> {
    const { data, error } = await supabase
      .from('marketer_performance_2026_02_04_16_00')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getStats(): Promise<any> {
    const { data, error } = await supabase
      .from('marketer_performance_2026_02_04_16_00')
      .select('*');
    
    if (error) throw error;
    
    const totalLeads = data?.reduce((sum, p) => sum + p.leads_generated, 0) || 0;
    const totalConversions = data?.reduce((sum, p) => sum + p.conversions, 0) || 0;
    const totalRevenue = data?.reduce((sum, p) => sum + p.revenue_generated, 0) || 0;
    const avgConversionRate = data?.length ? 
      data.reduce((sum, p) => sum + p.conversion_rate, 0) / data.length : 0;
    
    return {
      totalLeads,
      totalConversions,
      totalRevenue,
      avgConversionRate,
      totalMarketers: data?.length || 0
    };
  }
}

// Customer Service Interactions API
export class CustomerServiceAPI {
  static async list(): Promise<CustomerServiceInteraction[]> {
    const { data, error } = await supabase
      .from('customer_service_interactions_2026_02_04_16_00')
      .select(`
        *,
        admin_users_2026_02_04_16_00!agent_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getByAgent(agentId: string): Promise<CustomerServiceInteraction[]> {
    const { data, error } = await supabase
      .from('customer_service_interactions_2026_02_04_16_00')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async create(interaction: Partial<CustomerServiceInteraction>): Promise<CustomerServiceInteraction> {
    const { data, error } = await supabase
      .from('customer_service_interactions_2026_02_04_16_00')
      .insert([interaction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<CustomerServiceInteraction>): Promise<CustomerServiceInteraction> {
    const updateData = { ...updates };
    
    // Auto-calculate response time if resolving
    if (updates.status === 'resolved' && !updates.resolved_at) {
      updateData.resolved_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('customer_service_interactions_2026_02_04_16_00')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getStats(): Promise<any> {
    const { data, error } = await supabase
      .from('customer_service_interactions_2026_02_04_16_00')
      .select('*');
    
    if (error) throw error;
    
    const total = data?.length || 0;
    const open = data?.filter(i => i.status === 'open').length || 0;
    const resolved = data?.filter(i => i.status === 'resolved').length || 0;
    const avgRating = data?.filter(i => i.satisfaction_rating)
      .reduce((sum, i, _, arr) => sum + (i.satisfaction_rating || 0) / arr.length, 0) || 0;
    
    const byType = {} as Record<string, number>;
    data?.forEach(interaction => {
      byType[interaction.interaction_type] = (byType[interaction.interaction_type] || 0) + 1;
    });
    
    return {
      total,
      open,
      resolved,
      avgRating: Math.round(avgRating * 10) / 10,
      byType,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
    };
  }
}

// Dashboard Statistics API
export class AdminDashboardAPI {
  static async getOverviewStats(): Promise<any> {
    try {
      const [userStats, bulkUploads, tariffRates, interactions] = await Promise.all([
        AdminUsersAPI.getStats(),
        BulkUploadAPI.list(),
        TariffRatesAPI.list(),
        CustomerServiceAPI.getStats()
      ]);
      
      const recentUploads = bulkUploads.slice(0, 5);
      const completedUploads = bulkUploads.filter(u => u.status === 'completed').length;
      const processingUploads = bulkUploads.filter(u => u.status === 'processing').length;
      
      return {
        users: userStats,
        uploads: {
          total: bulkUploads.length,
          completed: completedUploads,
          processing: processingUploads,
          recent: recentUploads
        },
        tariffs: {
          total: tariffRates.length,
          countries: [...new Set(tariffRates.map(t => t.country))].length
        },
        customerService: interactions
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}