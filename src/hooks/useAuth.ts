import { useState, useEffect, useCallback } from 'react';
import { User, UserRole, USER_ROLES } from '@/lib/index';

const MOCK_ADMIN: User = {
  id: 'admin-001',
  email: 'admin@britium.express',
  fullName: 'System Administrator',
  role: USER_ROLES.SUPER_ADMIN,
  status: 'active',
  createdAt: '2026-01-01T08:00:00Z',
  branchId: 'main-hq',
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('britium_session');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(MOCK_ADMIN);
          localStorage.setItem('britium_session', JSON.stringify(MOCK_ADMIN));
        }
      } catch (error) {
        console.error('Session restoration failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, role: UserRole) => {
    setIsLoading(true);
    const newUser: User = {
      ...MOCK_ADMIN,
      email,
      role,
      fullName: role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    };
    
    setUser(newUser);
    localStorage.setItem('britium_session', JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setUser(null);
    localStorage.removeItem('britium_session');
    setIsLoading(false);
  }, []);

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  const isAuthorized = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === USER_ROLES.SUPER_ADMIN) return true;
    return requiredRoles.includes(user.role);
  }, [user]);

  const getPermissions = useCallback(() => {
    if (!user) return [];
    
    switch (user.role) {
      case USER_ROLES.SUPER_ADMIN:
      case USER_ROLES.ADMIN:
        return ['all'];
      case USER_ROLES.MERCHANT:
        return ['create_shipment', 'view_own_shipments', 'track_shipment'];
      case USER_ROLES.RIDER:
        return ['update_shipment_status', 'view_assigned_tasks'];
      case USER_ROLES.WAREHOUSE:
        return ['manage_inventory', 'scan_packages', 'update_warehouse_status'];
      case USER_ROLES.ACCOUNTANT:
        return ['view_financials', 'manage_vouchers', 'generate_reports'];
      default:
        return ['view_dashboard'];
    }
  }, [user]);

  return {
    user,
    isLoading,
    login,
    logout,
    hasRole,
    isAuthorized,
    permissions: getPermissions(),
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === USER_ROLES.SUPER_ADMIN,
    isAdmin: user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN,
    isMerchant: user?.role === USER_ROLES.MERCHANT,
    isRider: user?.role === USER_ROLES.RIDER,
    isWarehouse: user?.role === USER_ROLES.WAREHOUSE,
    isAccountant: user?.role === USER_ROLES.ACCOUNTANT,
  };
};