import {
  User,
  Shipment,
  Branch,
  FinancialRecord,
  USER_ROLES,
  SHIPMENT_STATUSES
} from '@/lib/index';

/**
 * Mock Branches
 */
export const mockBranches: Branch[] = [
  {
    id: 'b-001',
    name: 'Britium Central Hub',
    code: 'BCH-01',
    address: '123 Logistics Way, London, UK',
    phone: '+44 20 7123 4567',
    city: 'London',
    coverageArea: ['London Central', 'Westminster', 'Camden', 'Islington'],
  },
  {
    id: 'b-002',
    name: 'North Station Hub',
    code: 'NSH-02',
    address: '45 Industrial Park, Manchester, UK',
    phone: '+44 16 1987 6543',
    city: 'Manchester',
    coverageArea: ['Manchester City', 'Salford', 'Trafford'],
  },
  {
    id: 'b-003',
    name: 'South Port Warehouse',
    code: 'SPW-03',
    address: '12 Dockside Road, Southampton, UK',
    phone: '+44 23 8012 3456',
    city: 'Southampton',
    coverageArea: ['Portsmouth', 'Southampton', 'Eastleigh'],
  },
];

/**
 * Mock Users
 */
export const mockUsers: User[] = [
  {
    id: 'u-001',
    email: 'admin@britium.com',
    fullName: 'Alexander Wright',
    role: USER_ROLES.SUPER_ADMIN,
    status: 'active',
    createdAt: '2026-01-01T08:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    id: 'u-002',
    email: 'sarah.merchant@gmail.com',
    fullName: 'Sarah Jenkins',
    role: USER_ROLES.MERCHANT,
    merchantId: 'm-5521',
    status: 'active',
    createdAt: '2026-01-15T10:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: 'u-003',
    email: 'mike.rider@britium.com',
    fullName: 'Mike Thompson',
    role: USER_ROLES.RIDER,
    branchId: 'b-001',
    phoneNumber: '+44 7700 900123',
    status: 'active',
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 'u-004',
    email: 'david.ops@britium.com',
    fullName: 'David Miller',
    role: USER_ROLES.WAREHOUSE,
    branchId: 'b-002',
    status: 'active',
    createdAt: '2026-01-10T14:20:00Z',
  },
  {
    id: 'u-005',
    email: 'accountant@britium.com',
    fullName: 'Elena Rodriguez',
    role: USER_ROLES.ACCOUNTANT,
    status: 'active',
    createdAt: '2026-01-05T11:00:00Z',
  },
];

/**
 * Mock Shipments
 */
export const mockShipments: Shipment[] = [
  {
    id: 's-101',
    trackingNumber: 'BRX-2026-0001',
    senderName: 'Sarah Jenkins',
    senderPhone: '+44 7700 900555',
    senderAddress: '15 High Street',
    senderCity: 'London',
    receiverName: 'Robert Ford',
    receiverPhone: '+44 7700 900888',
    receiverAddress: '22 Baker St',
    receiverCity: 'Manchester',
    status: SHIPMENT_STATUSES.DELIVERED,
    weight: 2.5,
    price: 15.50,
    codAmount: 0,
    paymentStatus: 'paid',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-02T14:30:00Z',
    branchId: 'b-001',
    riderId: 'u-003',
    merchantId: 'm-5521',
    trackingHistory: [
      {
        id: 't-1',
        status: SHIPMENT_STATUSES.PENDING,
        location: 'London Central',
        timestamp: '2026-02-01T10:00:00Z',
        description: 'Shipment created by merchant',
        updatedBy: 'u-002',
      },
      {
        id: 't-2',
        status: SHIPMENT_STATUSES.PICKED_UP,
        location: 'London Central',
        timestamp: '2026-02-01T14:00:00Z',
        description: 'Package picked up by rider Mike Thompson',
        updatedBy: 'u-003',
      },
      {
        id: 't-3',
        status: SHIPMENT_STATUSES.DELIVERED,
        location: 'Manchester',
        timestamp: '2026-02-02T14:30:00Z',
        description: 'Package delivered successfully',
        updatedBy: 'u-003',
      },
    ],
  },
  {
    id: 's-102',
    trackingNumber: 'BRX-2026-0002',
    senderName: 'Tech Solutions Ltd',
    senderPhone: '+44 20 8888 9999',
    senderAddress: '88 Innovation Park',
    senderCity: 'London',
    receiverName: 'Alice Cooper',
    receiverPhone: '+44 7700 900222',
    receiverAddress: '7A Ocean View',
    receiverCity: 'Southampton',
    status: SHIPMENT_STATUSES.IN_TRANSIT,
    weight: 1.2,
    price: 12.00,
    codAmount: 45.00,
    paymentStatus: 'pending',
    createdAt: '2026-02-03T09:00:00Z',
    updatedAt: '2026-02-03T16:45:00Z',
    branchId: 'b-001',
    trackingHistory: [
      {
        id: 't-4',
        status: SHIPMENT_STATUSES.PENDING,
        location: 'London Central',
        timestamp: '2026-02-03T09:00:00Z',
        description: 'Shipment created',
        updatedBy: 'u-001',
      },
      {
        id: 't-5',
        status: SHIPMENT_STATUSES.ARRIVED_AT_WAREHOUSE,
        location: 'London Central Hub',
        timestamp: '2026-02-03T16:45:00Z',
        description: 'Sorted at London Hub',
        updatedBy: 'u-004',
      },
    ],
  },
  {
    id: 's-103',
    trackingNumber: 'BRX-2026-0003',
    senderName: 'Fashion Forward',
    senderPhone: '+44 20 4444 5555',
    senderAddress: '10 Oxford Circus',
    senderCity: 'London',
    receiverName: 'John Smith',
    receiverPhone: '+44 7700 900333',
    receiverAddress: '55 Pine Avenue',
    receiverCity: 'Liverpool',
    status: SHIPMENT_STATUSES.OUT_FOR_DELIVERY,
    weight: 0.8,
    price: 8.50,
    codAmount: 0,
    paymentStatus: 'paid',
    createdAt: '2026-02-02T11:20:00Z',
    updatedAt: '2026-02-03T08:30:00Z',
    branchId: 'b-002',
    riderId: 'u-003',
    trackingHistory: [
      {
        id: 't-6',
        status: SHIPMENT_STATUSES.PENDING,
        location: 'London',
        timestamp: '2026-02-02T11:20:00Z',
        description: 'Label created',
        updatedBy: 'u-001',
      },
      {
        id: 't-7',
        status: SHIPMENT_STATUSES.OUT_FOR_DELIVERY,
        location: 'Liverpool Hub',
        timestamp: '2026-02-03T08:30:00Z',
        description: 'Package with rider for final delivery',
        updatedBy: 'u-003',
      },
    ],
  },
];

/**
 * Mock Financial Records
 */
export const mockFinancials: FinancialRecord[] = [
  {
    id: 'f-001',
    type: 'income',
    category: 'Delivery Fee',
    amount: 15.50,
    date: '2026-02-02T14:30:00Z',
    description: 'Revenue from shipment BRX-2026-0001',
    shipmentId: 's-101',
    branchId: 'b-001',
    referenceNumber: 'REF-88210',
  },
  {
    id: 'f-002',
    type: 'expense',
    category: 'Fuel',
    amount: 450.00,
    date: '2026-02-01T17:00:00Z',
    description: 'Weekly fuel top-up for London fleet',
    branchId: 'b-001',
    referenceNumber: 'REF-FUEL-01',
  },
  {
    id: 'f-003',
    type: 'income',
    category: 'COD Collection',
    amount: 120.00,
    date: '2026-02-03T12:00:00Z',
    description: 'Cash on delivery collection from route 12',
    branchId: 'b-002',
    referenceNumber: 'REF-COD-441',
  },
  {
    id: 'f-004',
    type: 'expense',
    category: 'Maintenance',
    amount: 215.00,
    date: '2026-02-02T09:00:00Z',
    description: 'Vehicle service for Van LV-55',
    branchId: 'b-002',
    referenceNumber: 'REF-MAINT-12',
  },
];

/**
 * Dashboard Analytics Mock
 */
export const mockAnalytics = {
  overview: {
    totalShipments: 1245,
    deliveredShipments: 1120,
    pendingShipments: 85,
    failedShipments: 40,
    totalRevenue: 24500.75,
    totalExpenses: 8200.50,
    activeRiders: 24,
    activeMerchants: 56,
  },
  dailyPerformance: [
    { date: '2026-01-28', delivered: 42, failed: 2, pending: 5 },
    { date: '2026-01-29', delivered: 38, failed: 1, pending: 8 },
    { date: '2026-01-30', delivered: 55, failed: 3, pending: 12 },
    { date: '2026-01-31', delivered: 20, failed: 0, pending: 4 },
    { date: '2026-02-01', delivered: 15, failed: 1, pending: 2 },
    { date: '2026-02-02', delivered: 48, failed: 2, pending: 15 },
    { date: '2026-02-03', delivered: 35, failed: 0, pending: 22 },
  ],
  revenueByBranch: [
    { name: 'London Central', value: 12500 },
    { name: 'Manchester Hub', value: 7800 },
    { name: 'South Port', value: 4200.75 },
  ]
};