/**
 * Britium Express API Service
 * Comprehensive API integration for all BE app pages functionality
 * © 2026 Britium Express Logistics System
 */

import { supabase } from '@/integrations/supabase/client';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DeliveryWay {
  id: string;
  tracking_number: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
  pickup_address: string;
  delivery_address: string;
  pickup_date?: string;
  delivery_date?: string;
  rider_name?: string;
  vehicle_type?: string;
  priority: number;
  cod_amount: number;
  delivery_fee: number;
  weight?: number;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  business_name: string;
  business_type?: string;
  registration_number?: string;
  contact_person: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  credit_limit: number;
  current_balance: number;
  payment_terms: number;
  total_orders: number;
  total_revenue: number;
  registration_date: string;
  last_order_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Deliveryman {
  id: string;
  employee_id: string;
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  date_of_birth?: string;
  hire_date: string;
  employment_status: 'active' | 'inactive' | 'suspended' | 'terminated';
  vehicle_type?: string;
  vehicle_number?: string;
  license_number?: string;
  zone_assignment?: string;
  base_salary: number;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  total_earnings: number;
  current_cash_advance: number;
  performance_rating: number;
  last_active?: string;
  created_at: string;
  updated_at: string;
}

export interface BroadcastMessage {
  id: string;
  message_title: string;
  message_content: string;
  message_type: 'general' | 'urgent' | 'maintenance' | 'promotion' | 'system';
  target_audience: 'all_users' | 'merchants' | 'deliverymen' | 'customers' | 'admins' | 'custom';
  delivery_method: 'in_app' | 'email' | 'sms' | 'push' | 'all';
  scheduled_send_time?: string;
  sent_time?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  total_recipients: number;
  successful_deliveries: number;
  failed_deliveries: number;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  setting_category: string;
  setting_key: string;
  setting_value?: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface FailedDelivery {
  id: string;
  tracking_number: string;
  failure_reason: string;
  failure_date: string;
  retry_count: number;
  next_retry_date?: string;
  notes?: string;
  resolved: boolean;
  resolved_date?: string;
  created_at: string;
}

export interface ReturnShipment {
  id: string;
  original_tracking_number: string;
  return_reason: string;
  return_date: string;
  return_status: 'initiated' | 'in_transit' | 'completed' | 'cancelled';
  refund_amount?: number;
  refund_status: 'pending' | 'processed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CashAdvance {
  id: string;
  deliveryman_id: string;
  amount: number;
  advance_type: 'regular' | 'emergency' | 'salary_advance';
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
  disbursement_date?: string;
  remaining_balance?: number;
  interest_rate: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Base API class
class BaseAPI {
  protected async callEdgeFunction(functionName: string, path: string, options: any = {}) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          path,
          method: options.method || 'GET',
          ...options.body
        }
      });

      if (error) {
        console.error(`Edge function error (${functionName}):`, error);
        return { success: false, error: error.message };
      }

      return data;
    } catch (error) {
      console.error(`API call failed (${functionName}):`, error);
      return { success: false, error: (error as Error).message };
    }
  }
}

// Delivery Ways API
export class DeliveryWaysAPI extends BaseAPI {
  async list(): Promise<ApiResponse<DeliveryWay[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'delivery-ways/list');
  }

  async get(id: string): Promise<ApiResponse<DeliveryWay>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `delivery-ways/get/${id}`);
  }

  async create(data: Partial<DeliveryWay>): Promise<ApiResponse<DeliveryWay>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'delivery-ways/create', {
      method: 'POST',
      body: data
    });
  }

  async update(id: string, data: Partial<DeliveryWay>): Promise<ApiResponse<DeliveryWay>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `delivery-ways/update/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async delete(id: string): Promise<ApiResponse> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `delivery-ways/delete/${id}`, {
      method: 'DELETE'
    });
  }
}

// Merchants API
export class MerchantsAPI extends BaseAPI {
  async list(): Promise<ApiResponse<Merchant[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'merchants/list');
  }

  async get(id: string): Promise<ApiResponse<Merchant>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `merchants/get/${id}`);
  }

  async create(data: Partial<Merchant>): Promise<ApiResponse<Merchant>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'merchants/create', {
      method: 'POST',
      body: data
    });
  }

  async update(id: string, data: Partial<Merchant>): Promise<ApiResponse<Merchant>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `merchants/update/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async delete(id: string): Promise<ApiResponse> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `merchants/delete/${id}`, {
      method: 'DELETE'
    });
  }
}

// Deliverymen API
export class DeliverymenAPI extends BaseAPI {
  async list(): Promise<ApiResponse<Deliveryman[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'deliverymen/list');
  }

  async get(id: string): Promise<ApiResponse<Deliveryman>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `deliverymen/get/${id}`);
  }

  async create(data: Partial<Deliveryman>): Promise<ApiResponse<Deliveryman>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'deliverymen/create', {
      method: 'POST',
      body: data
    });
  }

  async update(id: string, data: Partial<Deliveryman>): Promise<ApiResponse<Deliveryman>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `deliverymen/update/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async delete(id: string): Promise<ApiResponse> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `deliverymen/delete/${id}`, {
      method: 'DELETE'
    });
  }
}

// Broadcast Messages API
export class BroadcastMessagesAPI extends BaseAPI {
  async list(): Promise<ApiResponse<BroadcastMessage[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'broadcast-messages/list');
  }

  async get(id: string): Promise<ApiResponse<BroadcastMessage>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `broadcast-messages/get/${id}`);
  }

  async create(data: Partial<BroadcastMessage>): Promise<ApiResponse<BroadcastMessage>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'broadcast-messages/create', {
      method: 'POST',
      body: data
    });
  }

  async update(id: string, data: Partial<BroadcastMessage>): Promise<ApiResponse<BroadcastMessage>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `broadcast-messages/update/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async send(id: string, totalRecipients?: number): Promise<ApiResponse> {
    return this.callEdgeFunction('be_notifications_2026_02_04_05_03', 'send-broadcast', {
      method: 'POST',
      body: { messageId: id, total_recipients: totalRecipients }
    });
  }

  async delete(id: string): Promise<ApiResponse> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `broadcast-messages/delete/${id}`, {
      method: 'DELETE'
    });
  }
}

// System Settings API
export class SystemSettingsAPI extends BaseAPI {
  async list(): Promise<ApiResponse<SystemSetting[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'system-settings/list');
  }

  async get(id: string): Promise<ApiResponse<SystemSetting>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `system-settings/get/${id}`);
  }

  async update(id: string, data: Partial<SystemSetting>): Promise<ApiResponse<SystemSetting>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `system-settings/update/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async create(data: Partial<SystemSetting>): Promise<ApiResponse<SystemSetting>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'system-settings/create', {
      method: 'POST',
      body: data
    });
  }
}

// Failed Deliveries API
export class FailedDeliveriesAPI extends BaseAPI {
  async list(): Promise<ApiResponse<FailedDelivery[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'failed-deliveries/list');
  }

  async resolve(id: string, resolutionNotes?: string): Promise<ApiResponse<FailedDelivery>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `failed-deliveries/resolve/${id}`, {
      method: 'PUT',
      body: { resolution_notes: resolutionNotes }
    });
  }
}

// Return Shipments API
export class ReturnShipmentsAPI extends BaseAPI {
  async list(): Promise<ApiResponse<ReturnShipment[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'return-shipments/list');
  }

  async updateStatus(id: string, returnStatus: string, refundStatus?: string): Promise<ApiResponse<ReturnShipment>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `return-shipments/update-status/${id}`, {
      method: 'PUT',
      body: { return_status: returnStatus, refund_status: refundStatus }
    });
  }
}

// Cash Advances API
export class CashAdvancesAPI extends BaseAPI {
  async list(): Promise<ApiResponse<CashAdvance[]>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'cash-advances/list');
  }

  async create(data: Partial<CashAdvance>): Promise<ApiResponse<CashAdvance>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', 'cash-advances/create', {
      method: 'POST',
      body: data
    });
  }

  async approve(id: string): Promise<ApiResponse<CashAdvance>> {
    return this.callEdgeFunction('be_data_management_2026_02_04_05_03', `cash-advances/approve/${id}`, {
      method: 'PUT'
    });
  }
}

// Reporting API
export class ReportingAPI extends BaseAPI {
  async generateDeliveryReport(filters: any = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(filters).toString();
    return this.callEdgeFunction('be_reporting_2026_02_04_05_03', `delivery/generate?${queryParams}`);
  }

  async generateMerchantReport(filters: any = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(filters).toString();
    return this.callEdgeFunction('be_reporting_2026_02_04_05_03', `merchant/generate?${queryParams}`);
  }

  async generateFinancialReport(filters: any = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(filters).toString();
    return this.callEdgeFunction('be_reporting_2026_02_04_05_03', `financial/generate?${queryParams}`);
  }

  async generatePerformanceReport(filters: any = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(filters).toString();
    return this.callEdgeFunction('be_reporting_2026_02_04_05_03', `performance/generate?${queryParams}`);
  }

  async generateCustomReport(reportConfig: any): Promise<ApiResponse> {
    return this.callEdgeFunction('be_reporting_2026_02_04_05_03', 'custom/generate', {
      method: 'POST',
      body: { reportConfig }
    });
  }

  async getDashboardData(filters: any = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams(filters).toString();
    return this.callEdgeFunction('be_reporting_2026_02_04_05_03', `dashboard/generate?${queryParams}`);
  }
}

// Notifications API
export class NotificationsAPI extends BaseAPI {
  async sendEmail(emailData: { to: string; subject: string; html: string; text?: string }): Promise<ApiResponse> {
    return this.callEdgeFunction('be_notifications_2026_02_04_05_03', 'send-email', {
      method: 'POST',
      body: emailData
    });
  }

  async sendNotification(notificationData: { recipients: any[]; subject: string; content: string; type?: string }): Promise<ApiResponse> {
    return this.callEdgeFunction('be_notifications_2026_02_04_05_03', 'send-notification', {
      method: 'POST',
      body: notificationData
    });
  }

  async getTemplates(): Promise<ApiResponse> {
    return this.callEdgeFunction('be_notifications_2026_02_04_05_03', 'get-templates');
  }

  async createTemplate(templateData: { name: string; subject: string; content: string; variables?: string[] }): Promise<ApiResponse> {
    return this.callEdgeFunction('be_notifications_2026_02_04_05_03', 'create-template', {
      method: 'POST',
      body: templateData
    });
  }
}

// Export API instances
export const deliveryWaysAPI = new DeliveryWaysAPI();
export const merchantsAPI = new MerchantsAPI();
export const deliverymenAPI = new DeliverymenAPI();
export const broadcastMessagesAPI = new BroadcastMessagesAPI();
export const systemSettingsAPI = new SystemSettingsAPI();
export const failedDeliveriesAPI = new FailedDeliveriesAPI();
export const returnShipmentsAPI = new ReturnShipmentsAPI();
export const cashAdvancesAPI = new CashAdvancesAPI();
export const reportingAPI = new ReportingAPI();
export const notificationsAPI = new NotificationsAPI();

// Export all APIs as a single object
export const api = {
  deliveryWays: deliveryWaysAPI,
  merchants: merchantsAPI,
  deliverymen: deliverymenAPI,
  broadcastMessages: broadcastMessagesAPI,
  systemSettings: systemSettingsAPI,
  failedDeliveries: failedDeliveriesAPI,
  returnShipments: returnShipmentsAPI,
  cashAdvances: cashAdvancesAPI,
  reporting: reportingAPI,
  notifications: notificationsAPI
};

export default api;