/**
 * Direct Supabase Forms Management API Service
 * Handles all form operations with real-time data synchronization
 */

import { supabase } from '@/integrations/supabase/client';

// Types
export interface SystemConfig {
  id?: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description?: string;
  min_value?: number;
  max_value?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Voucher {
  id?: string;
  voucher_number: string;
  voucher_type: 'income' | 'expense' | 'transfer';
  amount: number;
  description?: string;
  reference_number?: string;
  branch_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  transaction_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface CashAdvance {
  id?: string;
  advance_number: string;
  deliveryman_id: string;
  deliveryman_name: string;
  amount: number;
  purpose?: string;
  status: 'active' | 'repaid' | 'written_off';
  advance_date: string;
  due_date?: string;
  repaid_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// System Configuration API - Direct Supabase
export class SystemConfigAPI {
  static async getAll(): Promise<SystemConfig[]> {
    const { data, error } = await supabase
      .from('system_configuration')
      .select('*')
      .order('setting_key');

    if (error) {
      console.error('Error fetching system config:', error);
      throw new Error(`Failed to fetch system configuration: ${error.message}`);
    }

    return data || [];
  }

  static async update(configs: SystemConfig[]): Promise<void> {
    for (const config of configs) {
      const { error } = await supabase
        .from('system_configuration')
        .upsert({
          setting_key: config.setting_key,
          setting_value: config.setting_value,
          setting_type: config.setting_type,
          description: config.description,
          min_value: config.min_value,
          max_value: config.max_value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error updating system config:', error);
        throw new Error(`Failed to update system configuration: ${error.message}`);
      }
    }
  }

  static async resetToDefaults(): Promise<void> {
    const defaultConfigs: SystemConfig[] = [
      { setting_key: 'wayIdLength', setting_value: '6', setting_type: 'integer', description: 'Number of digits for Way ID generation (4-10)', min_value: 4, max_value: 10 },
      { setting_key: 'promotionCodeLength', setting_value: '8', setting_type: 'integer', description: 'Length of promotion codes (6-12 characters)', min_value: 6, max_value: 12 },
      { setting_key: 'contactPhone', setting_value: '+95 9 123 456789', setting_type: 'string', description: 'Customer support contact number' },
      { setting_key: 'maxStationDistance', setting_value: '5000', setting_type: 'integer', description: 'Maximum distance between stations in meters', min_value: 100, max_value: 50000 },
      { setting_key: 'companyName', setting_value: 'Britium Express Logistics', setting_type: 'string', description: 'Company name for documents and communications' },
      { setting_key: 'defaultCurrency', setting_value: 'MMK', setting_type: 'string', description: 'Default currency for transactions' },
      { setting_key: 'maxCashAdvance', setting_value: '500000', setting_type: 'decimal', description: 'Maximum cash advance amount per deliveryman' },
      { setting_key: 'autoApproveLimit', setting_value: '100000', setting_type: 'decimal', description: 'Auto-approve vouchers below this amount' }
    ];

    await this.update(defaultConfigs);
  }

  static async validate(config: any): Promise<ValidationResult> {
    const errors: Record<string, string> = {};

    if (config.wayIdLength && (parseInt(config.wayIdLength) < 4 || parseInt(config.wayIdLength) > 10)) {
      errors.wayIdLength = 'Way ID length must be between 4 and 10 digits';
    }
    
    if (config.promotionCodeLength && (parseInt(config.promotionCodeLength) < 6 || parseInt(config.promotionCodeLength) > 12)) {
      errors.promotionCodeLength = 'Promotion code length must be between 6 and 12 characters';
    }
    
    if (config.contactPhone && !/^\+?[\d\s\-\(\)]+$/.test(config.contactPhone)) {
      errors.contactPhone = 'Please enter a valid phone number';
    }

    if (config.maxStationDistance && (parseInt(config.maxStationDistance) < 100 || parseInt(config.maxStationDistance) > 50000)) {
      errors.maxStationDistance = 'Max station distance must be between 100 and 50000 meters';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}

// Vouchers API - Direct Supabase
export class VouchersAPI {
  static async create(voucher: Omit<Voucher, 'id' | 'voucher_number'>): Promise<Voucher> {
    // Generate voucher number
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const { count } = await supabase
      .from('vouchers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().slice(0, 10));
    
    const voucher_number = `VCH-${date}-${String((count || 0) + 1).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('vouchers')
      .insert({
        ...voucher,
        voucher_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating voucher:', error);
      throw new Error(`Failed to create voucher: ${error.message}`);
    }

    return data;
  }

  static async getAll(filters?: any): Promise<{ data: Voucher[], summary: any }> {
    let query = supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('voucher_type', filters.type);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.date_from) {
      query = query.gte('transaction_date', filters.date_from);
    }
    
    if (filters?.date_to) {
      query = query.lte('transaction_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching vouchers:', error);
      throw new Error(`Failed to fetch vouchers: ${error.message}`);
    }

    // Calculate summary statistics
    const vouchers = data || [];
    const totalIncome = vouchers.filter(v => v.voucher_type === 'income' && v.status === 'approved')
      .reduce((sum, v) => sum + v.amount, 0);
    
    const totalExpense = vouchers.filter(v => v.voucher_type === 'expense' && v.status === 'approved')
      .reduce((sum, v) => sum + v.amount, 0);
    
    const pendingAmount = vouchers.filter(v => v.status === 'pending')
      .reduce((sum, v) => sum + v.amount, 0);

    return {
      data: vouchers,
      summary: {
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense,
        pendingAmount,
        totalVouchers: vouchers.length
      }
    };
  }

  static async update(id: string, updates: Partial<Voucher>): Promise<Voucher> {
    const { data, error } = await supabase
      .from('vouchers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating voucher:', error);
      throw new Error(`Failed to update voucher: ${error.message}`);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting voucher:', error);
      throw new Error(`Failed to delete voucher: ${error.message}`);
    }
  }

  static async validate(voucher: any): Promise<ValidationResult> {
    const errors: Record<string, string> = {};

    if (!voucher.amount || parseFloat(voucher.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!voucher.voucher_type || !['income', 'expense', 'transfer'].includes(voucher.voucher_type)) {
      errors.voucher_type = 'Please select a valid voucher type';
    }
    
    if (!voucher.description || voucher.description.trim().length < 5) {
      errors.description = 'Description must be at least 5 characters long';
    }

    if (!voucher.transaction_date) {
      errors.transaction_date = 'Transaction date is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  static async export(filters?: any): Promise<string> {
    const result = await this.getAll(filters);
    const vouchers = result.data;

    if (vouchers.length === 0) {
      throw new Error('No data to export');
    }

    const headers = ['Voucher Number', 'Type', 'Amount', 'Description', 'Reference', 'Date', 'Status'];
    const rows = vouchers.map(v => [
      v.voucher_number,
      v.voucher_type,
      v.amount.toString(),
      v.description || '',
      v.reference_number || '',
      v.transaction_date,
      v.status
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csv;
  }
}

// Cash Advances API - Direct Supabase
export class CashAdvancesAPI {
  static async create(advance: Omit<CashAdvance, 'id' | 'advance_number'>): Promise<CashAdvance> {
    // Generate advance number
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const { count } = await supabase
      .from('cash_advances')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().slice(0, 10));
    
    const advance_number = `ADV-${date}-${String((count || 0) + 1).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('cash_advances')
      .insert({
        ...advance,
        advance_number,
        repaid_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating cash advance:', error);
      throw new Error(`Failed to create cash advance: ${error.message}`);
    }

    return data;
  }

  static async getAll(filters?: any): Promise<{ data: CashAdvance[], summary: any }> {
    let query = supabase
      .from('cash_advances')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.deliveryman_id) {
      query = query.eq('deliveryman_id', filters.deliveryman_id);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cash advances:', error);
      throw new Error(`Failed to fetch cash advances: ${error.message}`);
    }

    // Calculate summary
    const advances = data || [];
    const totalAdvanced = advances.reduce((sum, a) => sum + a.amount, 0);
    const totalRepaid = advances.reduce((sum, a) => sum + (a.repaid_amount || 0), 0);
    const outstanding = totalAdvanced - totalRepaid;

    return {
      data: advances,
      summary: {
        totalAdvanced,
        totalRepaid,
        outstanding,
        activeAdvances: advances.filter(a => a.status === 'active').length
      }
    };
  }

  static async update(id: string, updates: Partial<CashAdvance>): Promise<CashAdvance> {
    const { data, error } = await supabase
      .from('cash_advances')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cash advance:', error);
      throw new Error(`Failed to update cash advance: ${error.message}`);
    }

    return data;
  }

  static async repay(id: string, repaymentAmount: number): Promise<CashAdvance> {
    // Get current advance
    const { data: advance, error: fetchError } = await supabase
      .from('cash_advances')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching cash advance:', fetchError);
      throw new Error(`Failed to fetch cash advance: ${fetchError.message}`);
    }

    const newRepaidAmount = (advance.repaid_amount || 0) + repaymentAmount;
    const isFullyRepaid = newRepaidAmount >= advance.amount;

    const { data, error } = await supabase
      .from('cash_advances')
      .update({
        repaid_amount: newRepaidAmount,
        status: isFullyRepaid ? 'repaid' : 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating repayment:', error);
      throw new Error(`Failed to record repayment: ${error.message}`);
    }

    return data;
  }

  static async validate(advance: any): Promise<ValidationResult> {
    const errors: Record<string, string> = {};

    if (!advance.amount || parseFloat(advance.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (parseFloat(advance.amount) > 500000) {
      errors.amount = 'Amount cannot exceed 500,000 MMK';
    }
    
    if (!advance.deliveryman_id) {
      errors.deliveryman_id = 'Please select a deliveryman';
    }

    if (!advance.deliveryman_name || advance.deliveryman_name.trim().length < 2) {
      errors.deliveryman_name = 'Deliveryman name is required';
    }

    if (!advance.advance_date) {
      errors.advance_date = 'Advance date is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  static async export(filters?: any): Promise<string> {
    const result = await this.getAll(filters);
    const advances = result.data;

    if (advances.length === 0) {
      throw new Error('No data to export');
    }

    const headers = ['Advance Number', 'Deliveryman', 'Amount', 'Repaid', 'Outstanding', 'Purpose', 'Date', 'Status'];
    const rows = advances.map(a => [
      a.advance_number,
      a.deliveryman_name,
      a.amount.toString(),
      (a.repaid_amount || 0).toString(),
      (a.amount - (a.repaid_amount || 0)).toString(),
      a.purpose || '',
      a.advance_date,
      a.status
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csv;
  }
}

// Utility functions
export class FormUtils {
  static generateVoucherNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VCH-${date}-${random}`;
  }

  static generateAdvanceNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ADV-${date}-${random}`;
  }

  static formatCurrency(amount: number, currency: string = 'MMK'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ` ${currency}`;
  }

  static formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  static validateRequired(value: any, fieldName: string): string | null {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  }

  static validateNumber(value: any, fieldName: string, min?: number, max?: number): string | null {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} must be a valid number`;
    }
    if (min !== undefined && num < min) {
      return `${fieldName} must be at least ${min}`;
    }
    if (max !== undefined && num > max) {
      return `${fieldName} must not exceed ${max}`;
    }
    return null;
  }

  static validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  static validatePhone(phone: string): string | null {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid phone number';
    }
    return null;
  }
}