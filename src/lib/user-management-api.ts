import { supabase } from '@/integrations/supabase/client';

// Updated default password
export const DEFAULT_PASSWORD = 'P@ssw0rd1';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  branchLocation: string;
  phone: string;
  employeeId: string;
  permissions: Record<string, any>;
  mustChangePassword?: boolean;
  firstLogin?: boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  requiresPasswordChange?: boolean;
  dashboardUrl?: string;
}

export interface PasswordChangeRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message?: string;
  error?: string;
  dashboardUrl?: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  module: string;
  permissions: any;
}

export class UserManagementAPI {
  private static readonly PASSWORD_FUNCTION = 'password_management_2026_02_07_19_16';
  private static readonly USER_FUNCTION = 'user_management_2026_02_07_18_52';

  /**
   * Login user with email and password
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(this.PASSWORD_FUNCTION, {
        body: {
          action: 'login',
          email,
          password
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Login failed'
        };
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Change user password (required after first login)
   */
  static async changePassword(request: PasswordChangeRequest): Promise<PasswordChangeResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(this.PASSWORD_FUNCTION, {
        body: {
          action: 'change-password',
          email: request.email,
          oldPassword: request.oldPassword,
          newPassword: request.newPassword
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Password change failed'
        };
      }

      return data;
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Check if user needs to change password
   */
  static async checkPasswordChangeRequired(email: string): Promise<{ success: boolean; requiresPasswordChange: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.PASSWORD_FUNCTION, {
        body: {
          action: 'check-password-requirement',
          email
        }
      });

      if (error) {
        return {
          success: false,
          requiresPasswordChange: false,
          error: error.message || 'Check failed'
        };
      }

      return data;
    } catch (error) {
      console.error('Password check error:', error);
      return {
        success: false,
        requiresPasswordChange: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.USER_FUNCTION, {
        body: {
          action: 'get_user_profile',
          user_id: userId
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to get user profile'
        };
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<{ success: boolean; users?: UserProfile[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.USER_FUNCTION, {
        body: {
          action: 'get_all_users'
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to get users'
        };
      }

      return data;
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Update user status
   */
  static async updateUserStatus(userId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.USER_FUNCTION, {
        body: {
          action: 'update_user_status',
          user_id: userId,
          status
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to update user status'
        };
      }

      return data;
    } catch (error) {
      console.error('Update user status error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<{ success: boolean; users?: UserProfile[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.USER_FUNCTION, {
        body: {
          action: 'get_users_by_role',
          role
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to get users by role'
        };
      }

      return data;
    } catch (error) {
      console.error('Get users by role error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Verify user permissions
   */
  static async verifyPermissions(userId: string, module: string, action: string): Promise<{ success: boolean; hasPermission: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.USER_FUNCTION, {
        body: {
          action: 'verify_permissions',
          user_id: userId,
          module,
          permission_action: action
        }
      });

      if (error) {
        return {
          success: false,
          hasPermission: false,
          error: error.message || 'Failed to verify permissions'
        };
      }

      return data;
    } catch (error) {
      console.error('Verify permissions error:', error);
      return {
        success: false,
        hasPermission: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Log user action
   */
  static async logUserAction(userId: string, action: string, details?: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.USER_FUNCTION, {
        body: {
          action: 'log_user_action',
          user_id: userId,
          user_action: action,
          details
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to log action'
        };
      }

      return data;
    } catch (error) {
      console.error('Log user action error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Helper method to get dashboard URL based on role
   */
  static getDashboardUrl(role: string): string {
    const dashboardMap: Record<string, string> = {
      'super_admin': '/admin/dashboard',
      'admin': '/admin/dashboard',
      'manager': '/manager/dashboard',
      'accountant': '/accounting/dashboard',
      'warehouse': '/warehouse/dashboard',
      'rider': '/rider/dashboard',
      'customer_service': '/customer-service/dashboard',
      'marketer': '/marketer/dashboard',
      'hr': '/hr/dashboard',
      'qa': '/qa/dashboard',
      'dispatch': '/dispatch/dashboard',
      'bi_analyst': '/bi/dashboard'
    };
    
    return dashboardMap[role] || '/dashboard';
  }

  /**
   * Helper method to get role display name
   */
  static getRoleDisplayName(role: string): string {
    const roleNames: Record<string, string> = {
      'super_admin': 'Super Administrator',
      'admin': 'Administrator',
      'manager': 'Branch Manager',
      'accountant': 'Accountant',
      'warehouse': 'Warehouse Staff',
      'rider': 'Delivery Rider',
      'customer_service': 'Customer Service',
      'marketer': 'Marketing',
      'hr': 'Human Resources',
      'qa': 'Quality Assurance',
      'dispatch': 'Dispatch Controller',
      'bi_analyst': 'Business Intelligence'
    };
    
    return roleNames[role] || role;
  }

  /**
   * Helper method to get role permissions
   */
  static getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      'super_admin': ['all_modules', 'system_config', 'user_management', 'financial_reports', 'audit_logs'],
      'admin': ['user_management', 'operations', 'reports', 'settings', 'bulk_upload'],
      'manager': ['branch_operations', 'staff_management', 'local_reports', 'customer_service'],
      'accountant': ['financial_management', 'reports', 'voucher_management', 'audit_support'],
      'warehouse': ['warehouse_operations', 'inventory_management', 'qr_scanning', 'sorting'],
      'rider': ['delivery_operations', 'mobile_app', 'customer_interaction', 'cash_collection'],
      'customer_service': ['customer_support', 'complaint_management', 'service_quality'],
      'marketer': ['marketing_campaigns', 'analytics', 'social_media', 'partnerships'],
      'hr': ['hr_management', 'recruitment', 'payroll', 'employee_relations'],
      'qa': ['quality_control', 'testing', 'process_improvement', 'compliance'],
      'dispatch': ['dispatch_control', 'route_optimization', 'real_time_tracking', 'emergency_response'],
      'bi_analyst': ['data_analysis', 'reporting', 'dashboard_management', 'predictive_analytics']
    };
    
    return rolePermissions[role] || [];
  }
}

// Export constants
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  WAREHOUSE: 'warehouse',
  RIDER: 'rider',
  CUSTOMER_SERVICE: 'customer_service',
  MARKETER: 'marketer',
  HR: 'hr',
  QA: 'qa',
  DISPATCH: 'dispatch',
  BI_ANALYST: 'bi_analyst'
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
} as const;