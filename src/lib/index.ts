/**
 * Britium Express - Core Constants and Types
 * © 2026 Britium Express Logistics System
 */

export const ROUTE_PATHS = {
  // Public Pages
  HOME: '/',
  SERVICES: '/services',
  GET_QUOTE: '/get-quote',
  SHIPPING_CALCULATOR: '/quote',
  MERCHANT_REGISTRATION: '/merchant-register',
  ABOUT: '/about',
  NEWS: '/news',
  CONTACT: '/contact',
  PUBLIC_TRACKING: '/track',
  SUPPORT: '/support',
  SYSTEM_STATUS: '/system-status',
  
  // Advanced Pages - World-Class Delivery App
  REAL_TIME_TRACKING: '/tracking/live',
  ADVANCED_DASHBOARD: '/dashboard/advanced',
  MOBILE_DELIVERY: '/mobile/delivery',
  CUSTOMER_EXPERIENCE: '/customer/experience',
  
  // Authentication
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Customer Pages
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_BOOKING: '/customer/booking',
  CUSTOMER_SHIPMENTS: '/customer/shipments',
  CUSTOMER_PROFILE: '/customer/profile',
  
  // Admin Pages
  ADMIN_DASHBOARD: '/admin/dashboard',
  DASHBOARD: '/admin/dashboard', // Keep for backward compatibility
  SHIPMENTS: '/admin/shipments',
  CREATE_SHIPMENT: '/admin/shipments/create',
  TRACKING: '/admin/tracking',
  WAREHOUSE: '/admin/warehouse',
  ACCOUNTING: '/admin/accounting',
  USERS: '/admin/users',
  REPORTS: '/admin/reports',
  REPORTS_CENTER: '/admin/reports-center',
  SETTINGS: '/admin/settings',
  WAY_MANAGEMENT: '/admin/way-management',
  MERCHANTS: '/admin/merchants',
  DELIVERYMEN: '/admin/deliverymen',
  
  // Rider Pages - User-Friendly Routes
  RIDER_DASHBOARD: '/rider/dashboard',
  RIDER_TASKS: '/rider/tasks',
  RIDER_WALLET: '/rider/wallet',
  RIDER_PROFILE: '/rider/profile',
  RIDER_JOB_DETAIL: '/rider/job/:jobId',
  RIDER_DELIVERY_CONFIRM: '/rider/delivery-confirm/:taskId',
  RIDER_PICKUP_CONFIRM: '/rider/pickup-confirm/:taskId',
  RIDER_EXCEPTION: '/rider/exception/:taskId',
  RIDER_MAP: '/rider/map',
  RIDER_NOTIFICATIONS: '/rider/notifications',
  
  // Merchant Pages
  MERCHANT_DASHBOARD: '/merchant/dashboard',
  MERCHANT_ORDERS: '/merchant/orders',
  MERCHANT_TRACKING: '/merchant/tracking',
  MERCHANT_PROFILE: '/merchant/profile',
  MERCHANT_BILLING: '/merchant/billing',
  
  // Accounting Pages
  ACCOUNTING_HOME: '/admin/accounting',
  ACCOUNTING_TRANSACTIONS: '/admin/accounting/simple-transaction',
  ACCOUNTING_JOURNAL: '/admin/accounting/journal-voucher-entry',
  ACCOUNTING_JOURNAL_LIST: '/admin/accounting/journal-voucher-list',
  ACCOUNTING_CASH: '/admin/accounting/cash-voucher-entry',
  ACCOUNTING_CASH_LIST: '/admin/accounting/cash-voucher-list',
  ACCOUNTING_CHART: '/admin/accounting/chart-of-accounts',
  ACCOUNTING_BALANCE: '/admin/accounting/account-balance',
  ACCOUNTING_BANKS: '/admin/accounting/bank-list',
  ACCOUNTING_BRANCH: '/admin/accounting/branch-accounting',
  
  // Reports Pages
  REPORTS_HOME: '/admin/reports',
  REPORTS_DELIVERYMAN: '/admin/reports/by-deliveryman',
  REPORTS_MERCHANT: '/admin/reports/by-merchant',
  REPORTS_TOWN: '/admin/reports/by-town',
  REPORTS_AUDIT: '/admin/reports/audit-logs',
  REPORTS_DELIVERY_WAYS: '/admin/reports/ways-to-deliver',
  REPORTS_BALANCE_SHEET: '/admin/reports/balance-sheet',
  REPORTS_GENERAL_LEDGER: '/admin/reports/general-ledger',
  REPORTS_INCOME_STATEMENT: '/admin/reports/income-statement',
  REPORTS_PROFIT_LOSS: '/admin/reports/profit-loss',
  REPORTS_TRIAL_BALANCE: '/admin/reports/trial-balance',
  REPORTS_TICKETS_OPEN: '/admin/reports/tickets-open',
  REPORTS_TICKETS_CLOSED: '/admin/reports/tickets-closed',
  
  // Settings Pages
  SETTINGS_BRANCHES: '/admin/settings/branches',
  SETTINGS_BROADCAST: '/admin/settings/broadcast',
  SETTINGS_CONTACTS: '/admin/settings/contacts',
  SETTINGS_COVERAGE_AREAS: '/admin/settings/coverage-areas',
  SETTINGS_CUSTOM_ROLES: '/admin/settings/custom-roles',
  SETTINGS_FACEBOOK_PAGES: '/admin/settings/facebook-pages',
  SETTINGS_INTEGRATIONS: '/admin/settings/integrations',
  SETTINGS_PACKAGE_POLICY: '/admin/settings/package-policy',
  SETTINGS_PERMISSIONS: '/admin/settings/permissions',
  SETTINGS_PRICE_PACKAGES: '/admin/settings/price-packages',
  SETTINGS_PROMO_CODES: '/admin/settings/promo-codes',
  SETTINGS_ROLE_GROUPS: '/admin/settings/role-groups',
  SETTINGS_SERVICE_ZONES: '/admin/settings/service-zones',
  SETTINGS_STATION_COVERAGE: '/admin/settings/station-coverage',
  SETTINGS_STATION_NETWORK: '/admin/settings/station-network',
  SETTINGS_VIBER_BOTS: '/admin/settings/viber-bots',
  SETTINGS_TARIFF: '/admin/settings/tariff',
  
  // Advanced System Pages
  QA_TESTING: '/admin/qa-testing',
  DISPATCH_CONTROL: '/admin/dispatch-control',
  HR_MANAGEMENT: '/admin/hr-management',
  FINANCIAL_MANAGEMENT: '/admin/financial-management',
  WAREHOUSE_OPERATIONS: '/warehouse/operations',
  SYSTEM_ADMINISTRATION: '/admin/system-administration',
  BUSINESS_INTELLIGENCE: '/admin/business-intelligence',
  MOBILE_CUSTOMER_APP: '/customer/mobile-app',
  
  // Comprehensive Warehouse System
  WAREHOUSE_DASHBOARD: '/warehouse/dashboard',
  WAREHOUSE_SCAN_IN: '/warehouse/scan-in',
  WAREHOUSE_SCAN_OUT: '/warehouse/scan-out',
  WAREHOUSE_QR_SCANNER: '/warehouse/qr-scanner',
  WAREHOUSE_SORTING: '/warehouse/sorting',
  WAREHOUSE_INVENTORY: '/warehouse/inventory',
  WAREHOUSE_MANIFESTS: '/warehouse/manifests',
  WAREHOUSE_RECEIVING: '/warehouse/receiving',
  WAREHOUSE_STAGING: '/warehouse/staging',
  WAREHOUSE_STORAGE: '/warehouse/storage',
  WAREHOUSE_SHIPPING: '/warehouse/shipping',
  WAREHOUSE_REPORTS: '/warehouse/reports',
  WAREHOUSE_CUSTOMER_ACKNOWLEDGMENT: '/warehouse/customer-acknowledgment',
  
  // Additional Warehouse Operation Pages
  WAREHOUSE_RETURNS: '/warehouse/returns',
  WAREHOUSE_LOAD_MANIFEST: '/warehouse/load-manifest',
  WAREHOUSE_TRANSIT_ROUTES: '/warehouse/transit-routes',
  
  // Admin Management Pages
  ADMIN_BULK_UPLOAD: '/admin/bulk-upload',
  ADMIN_DEBUG_AUTH: '/admin/debug-auth',
  ADMIN_SHIPMENT_DETAILS: '/admin/shipments/:id',
  
  // Way Management Pages (from BE_app_pages)
  WAY_DELIVER_WAYS: '/admin/way-management/deliver-ways',
  WAY_FAILED_WAYS: '/admin/way-management/failed-ways',
  WAY_RETURN_WAYS: '/admin/way-management/return-ways',
  WAY_PARCEL_IN: '/admin/way-management/parcel-in',
  WAY_PARCEL_OUT: '/admin/way-management/parcel-out',
  WAY_TRANSIT_ROUTE: '/admin/way-management/transit-route',
  WAY_TRACKING_MAP: '/admin/way-management/tracking-map',
  WAY_CREATE_DELIVERY_PICKUP: '/admin/way-management/create-delivery-pickup',
  WAY_IN_OFFICE_RECEIVE: '/admin/way-management/in-office-receive',
  
  // Merchant Management Pages (from BE_app_pages)
  MERCHANT_ADD_NEW: '/admin/merchants/add-new',
  MERCHANT_LIST: '/admin/merchants/list',
  MERCHANT_RECEIPTS: '/admin/merchants/receipts',
  MERCHANT_FINANCIAL_CENTER: '/admin/merchants/financial-center',
  MERCHANT_INVOICE_SCHEDULING: '/admin/merchants/invoice-scheduling',
  MERCHANT_BANK_ACCOUNTS: '/admin/merchants/bank-accounts',
  
  // Deliveryman Management Pages (from BE_app_pages)
  DELIVERYMAN_CASH_ADVANCE: '/admin/deliverymen/cash-advance',
  DELIVERYMAN_ADD_NEW: '/admin/deliverymen/add-new',
  DELIVERYMAN_LIST: '/admin/deliverymen/list',
  
  // Accounting Pages (from BE_app_pages)
  ACCOUNTING_ACCOUNTS: '/admin/accounting/accounts',
  ACCOUNTING_TRANSACTIONS_LIST: '/admin/accounting/transactions',
  ACCOUNTING_FINANCIAL_REPORTS: '/admin/accounting/financial-reports',
  ACCOUNTING_BRANCHES: '/admin/accounting/branches',
  
  // Reporting Pages (from BE_app_pages)
  REPORTS_DELIVERY_REPORT: '/admin/reports/delivery-report',
  REPORTS_MERCHANT_REPORT: '/admin/reports/merchant-report',
  REPORTS_FINANCIAL_REPORT: '/admin/reports/financial-report',
  REPORTS_PERFORMANCE_REPORT: '/admin/reports/performance-report',
  REPORTS_CUSTOM_REPORT: '/admin/reports/custom-report',
  
  // Broadcast Messages (from BE_app_pages)
  BROADCAST_MESSAGES: '/admin/broadcast-messages',
  BROADCAST_SEND_MESSAGE: '/admin/broadcast-messages/send',
  BROADCAST_MESSAGE_HISTORY: '/admin/broadcast-messages/history',
  
  // Settings Pages (from BE_app_pages)
  SETTINGS_GENERAL: '/admin/settings/general',
  SETTINGS_NOTIFICATIONS: '/admin/settings/notifications',
  SETTINGS_SECURITY: '/admin/settings/security',
  SETTINGS_BACKUP: '/admin/settings/backup',
  SETTINGS_SYSTEM_CONFIG: '/admin/settings/system-config',
  SETTINGS_USER_PREFERENCES: '/admin/settings/user-preferences',
  SETTINGS_API_SETTINGS: '/admin/settings/api-settings',
  
  // Comprehensive Admin System Routes
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_SYSTEM_OVERVIEW: '/admin/system-overview',
  MARKETER_DASHBOARD: '/marketer/dashboard',
  CS_DASHBOARD: '/customer-service/dashboard'
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUB_STATION_MANAGER: 'sub_station_manager',
  SUPERVISOR: 'supervisor',
  WAREHOUSE: 'warehouse',
  RIDER: 'rider',
  MERCHANT: 'merchant',
  VENDOR: 'vendor',
  ACCOUNTANT: 'accountant',
  MARKETER: 'marketer',
  CUSTOMER_SERVICE: 'customer_service',
  CUSTOMER: 'customer',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const SHIPMENT_STATUSES = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  ARRIVED_AT_WAREHOUSE: 'arrived_at_warehouse',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

export type ShipmentStatus = typeof SHIPMENT_STATUSES[keyof typeof SHIPMENT_STATUSES];

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  managerId?: string;
  city: string;
  coverageArea: string[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  branchId?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  merchantId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  location: string;
  timestamp: string;
  description: string;
  updatedBy: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  status: ShipmentStatus;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  price: number;
  codAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  branchId: string;
  riderId?: string;
  merchantId?: string;
  trackingHistory: TrackingEvent[];
  notes?: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  shipmentId?: string;
  branchId: string;
  referenceNumber: string;
}

export interface AnalyticsSummary {
  totalShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
  failedShipments: number;
  totalRevenue: number;
  totalExpenses: number;
  activeRiders: number;
  activeMerchants: number;
}

// Add comprehensive admin system routes to ROUTE_PATHS
export const ADMIN_ROUTES = {
  // Comprehensive Admin System Routes
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_BULK_UPLOAD: '/admin/bulk-upload',
  ADMIN_TARIFF_SETTING: '/admin/tariff-setting',
  ADMIN_SYSTEM_OVERVIEW: '/admin/system-overview',
  ADMIN_DEBUG_AUTH: '/admin/debug-auth',
  ADMIN_SHIPMENT_DETAILS: '/admin/shipment-details',
  ADMIN_SHIPMENTS: '/admin/shipments',
  
  // Marketer Dashboard Routes
  MARKETER_DASHBOARD: '/marketer/dashboard',
  MARKETER_PERFORMANCE: '/marketer/performance',
  MARKETER_CAMPAIGNS: '/marketer/campaigns',
  MARKETER_LEADS: '/marketer/leads',
  MARKETER_REPORTS: '/marketer/reports',
  
  // Customer Service Dashboard Routes
  CS_DASHBOARD: '/customer-service/dashboard',
  CS_INTERACTIONS: '/customer-service/interactions',
  CS_TICKETS: '/customer-service/tickets',
  CS_KNOWLEDGE_BASE: '/customer-service/knowledge-base',
  CS_REPORTS: '/customer-service/reports'
};

// Merge admin routes with main ROUTE_PATHS
Object.assign(ROUTE_PATHS, ADMIN_ROUTES);