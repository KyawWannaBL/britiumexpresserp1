import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useFirebaseAuth";
import { LanguageProvider } from "@/lib/LanguageContext";
import LoginPage from "@/pages/LoginPage";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { ROUTE_PATHS, USER_ROLES } from "@/lib/index";
import { Layout } from "@/components/Layout";
import { PublicLayout } from "@/components/PublicLayout";
import { CustomerLayout } from "@/components/CustomerLayout";

// Public Pages
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import GetQuotePage from "@/pages/GetQuotePage";
import ShippingCalculator from "@/pages/ShippingCalculator";
import MerchantRegistration from "@/pages/MerchantRegistration";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import SupportPage from "@/pages/SupportPage";
import SystemStatusPage from "@/pages/SystemStatusPage";
import PublicTracking from "@/pages/PublicTracking";

// Advanced Pages - World-Class Delivery App

import MobileDeliveryInterface from "@/pages/MobileDeliveryInterface";
import CustomerExperiencePage from "@/pages/CustomerExperiencePage";
// Customer Pages
import CustomerDashboard from "@/pages/CustomerDashboard";
import CustomerBooking from "@/pages/CustomerBooking";
import CustomerShipments from "@/pages/CustomerShipments";
import CustomerProfile from "@/pages/CustomerProfile";

// Admin Pages
import Shipments from "@/pages/Shipments";
import CreateShipment from "@/pages/CreateShipment";
import Tracking from "@/pages/Tracking";
import Warehouse from "@/pages/Warehouse";
import Accounting from "@/pages/Accounting";
import Users from "@/pages/Users";
import Reports from "@/pages/Reports";
import ReportsCenter from "@/pages/admin/ReportsCenter";
import Settings from "@/pages/Settings";
import WayManagement from "@/pages/WayManagement";
import Merchants from "@/pages/Merchants";
import Deliverymen from "@/pages/Deliverymen";

// Import comprehensive admin system pages
import AdminManagement from "@/pages/admin/AdminManagement";
import BulkUpload from "@/pages/admin/BulkUpload";
import TariffSetting from "@/pages/admin/TariffSetting";
import AdminDashboard from "@/pages/admin/Dashboard";
import MarketerDashboard from "@/pages/marketer/MarketerDashboard";
import CustomerServiceDashboard from "@/pages/customer-service/CustomerServiceDashboard";
// Warehouse Components
import WarehouseDashboard from "@/pages/warehouse/WarehouseDashboard";
import QRScanner from "@/pages/warehouse/QRScanner";
import WarehouseScanIn from "@/pages/warehouse/WarehouseScanIn";
import WarehouseSorting from "@/pages/warehouse/WarehouseSorting";

// Role-based Pages
import MerchantDashboard from "@/pages/MerchantDashboard";

// Admin Management Pages (already imported above)
// Accounting Pages
import AccountingHome from "@/pages/AccountingHome";
import AccountBalancePage from "@/pages/AccountBalancePage";
import SimpleTransactionPage from "@/pages/SimpleTransactionPage";

// Reports Pages
import ReportsHome from "@/pages/ReportsHome";

// Way Management Pages (from BE_app_pages)
import DeliverWaysPage from "@/pages/admin/way-management/DeliverWaysPage";
import FailedWaysPage from "@/pages/admin/way-management/FailedWaysPage";
import ReturnWaysPage from "@/pages/admin/way-management/ReturnWaysPage";
import ParcelInPage from "@/pages/admin/way-management/ParcelInPage";
import ParcelOutPage from "@/pages/admin/way-management/ParcelOutPage";
import TransitRoutePage from "@/pages/admin/way-management/TransitRoutePage";
import TrackingMapPage from "@/pages/admin/way-management/TrackingMapPage";
import CreateDeliveryPickupPage from "@/pages/admin/way-management/CreateDeliveryPickupPage";
import InOfficeReceivePage from "@/pages/admin/way-management/InOfficeReceivePage";

// Merchant Management Pages (from BE_app_pages)
import AddNewMerchantPage from "@/pages/admin/merchants/AddNewMerchantPage";
import MerchantListPage from "@/pages/admin/merchants/MerchantListPage";
import MerchantReceiptsPage from "@/pages/admin/merchants/MerchantReceiptsPage";
import MerchantFinancialCenterPage from "@/pages/admin/merchants/MerchantFinancialCenterPage";
import InvoiceSchedulingPage from "@/pages/admin/merchants/InvoiceSchedulingPage";
import BankAccountListPage from "@/pages/admin/merchants/BankAccountListPage";

// Deliveryman Management Pages (from BE_app_pages)
import CashAdvancePage from "@/pages/admin/deliverymen/CashAdvancePage";
import AddNewDeliverymanPage from "@/pages/admin/deliverymen/AddNewDeliverymanPage";
import DeliverymanListPage from "@/pages/admin/deliverymen/DeliverymanListPage";

// Enhanced Rider Pages - User-Friendly Interface
import RiderDashboard from "@/pages/rider/RiderDashboard";
import RiderTaskList from "@/pages/rider/RiderTaskList";
import RiderWallet from "@/pages/rider/RiderWallet";
import JobDetailScreen from "@/pages/rider/JobDetailScreen";

// Accounting Pages (from BE_app_pages)
import AccountsPage from "@/pages/admin/accounting/AccountsPage";
import TransactionsListPage from "@/pages/admin/accounting/TransactionsListPage";
import FinancialReportsPage from "@/pages/admin/accounting/FinancialReportsPage";
import BranchesPage from "@/pages/admin/accounting/BranchesPage";

// Reporting Pages (from BE_app_pages)
import DeliveryReportPage from "@/pages/admin/reports/DeliveryReportPage";
import MerchantReportPage from "@/pages/admin/reports/MerchantReportPage";
import FinancialReportPage from "@/pages/admin/reports/FinancialReportPage";
import PerformanceReportPage from "@/pages/admin/reports/PerformanceReportPage";
import CustomReportPage from "@/pages/admin/reports/CustomReportPage";

// Broadcast Messages (from BE_app_pages)
import BroadcastMessagesPage from "@/pages/admin/broadcast/BroadcastMessagesPage";
import SendMessagePage from "@/pages/admin/broadcast/SendMessagePage";
import MessageHistoryPage from "@/pages/admin/broadcast/MessageHistoryPage";

// Settings Pages (from BE_app_pages)
import GeneralSettingsPage from "@/pages/admin/settings/GeneralSettingsPage";
import NotificationsPage from "@/pages/admin/settings/NotificationsPage";


import SecurityPage from "@/pages/admin/settings/SecurityPage";
import BackupPage from "@/pages/admin/settings/BackupPage";
import SystemConfigPage from "@/pages/admin/settings/SystemConfigPage";
import UserPreferencesPage from "@/pages/admin/settings/UserPreferencesPage";
import ApiSettingsPage from "@/pages/admin/settings/ApiSettingsPage";

// Advanced System Pages
import QATestingPage from "@/pages/admin/QATestingPage";
import DispatchControlPage from "@/pages/admin/DispatchControlPage";
import HRManagementPage from "@/pages/admin/HRManagementPage";
import FinancialManagementPage from "@/pages/admin/FinancialManagementPage";
import SystemAdministrationPage from "@/pages/admin/SystemAdministrationPage";
import BusinessIntelligencePage from "@/pages/admin/BusinessIntelligencePage";
import WarehouseOperationsPage from "@/pages/warehouse/WarehouseOperationsPage";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Only show login for protected routes
    const currentPath = window.location.hash.replace('#', '') || '/';
    const publicPaths = [ROUTE_PATHS.HOME, ROUTE_PATHS.SERVICES, ROUTE_PATHS.GET_QUOTE, ROUTE_PATHS.SHIPPING_CALCULATOR, ROUTE_PATHS.MERCHANT_REGISTRATION, ROUTE_PATHS.ABOUT, ROUTE_PATHS.NEWS, ROUTE_PATHS.CONTACT, ROUTE_PATHS.PUBLIC_TRACKING, ROUTE_PATHS.SUPPORT];
    const isPublicPath = publicPaths.includes(currentPath as any);
    
    if (!user && !isPublicPath) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [user]);

  const isAdminUser = user && [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.WAREHOUSE, USER_ROLES.RIDER, USER_ROLES.MERCHANT, USER_ROLES.VENDOR, USER_ROLES.ACCOUNTANT].includes(user.role as any);
  const isCustomerUser = user && user.role === USER_ROLES.CUSTOMER;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading Britium Express...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your dashboard</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showLogin ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route
                path={ROUTE_PATHS.HOME}
                element={
                  <PublicLayout>
                    <HomePage />
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.PUBLIC_TRACKING}
                element={
                  <PublicLayout>
                    <PublicTracking />
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.SERVICES}
                element={
                  <PublicLayout>
                    <ServicesPage />
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.GET_QUOTE}
                element={
                  <PublicLayout>
                    <GetQuotePage />
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.SHIPPING_CALCULATOR}
                element={
                  <ShippingCalculator />
                }
              />
              <Route
                path={ROUTE_PATHS.MERCHANT_REGISTRATION}
                element={
                  <MerchantRegistration />
                }
              />
              <Route
                path={ROUTE_PATHS.ABOUT}
                element={
                  <PublicLayout>
                    <AboutPage />
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.NEWS}
                element={
                  <PublicLayout>
                    <div className="min-h-screen flex items-center justify-center">
                      <h1 className="text-2xl font-bold">News Page - Coming Soon</h1>
                    </div>
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.CONTACT}
                element={
                  <PublicLayout>
                    <ContactPage />
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.SUPPORT}
                element={
                  <PublicLayout>
                    <SupportPage />
                  </PublicLayout>
                }
              />
              <Route
                path={ROUTE_PATHS.SYSTEM_STATUS}
                element={<SystemStatusPage />}
              />
              <Route
                path={ROUTE_PATHS.LOGIN}
                element={<LoginPage />}
              />
              
              {/* Customer Routes */}
              {isCustomerUser && (
                <>
                  <Route
                    path={ROUTE_PATHS.CUSTOMER_DASHBOARD}
                    element={
                      <CustomerLayout>
                        <CustomerDashboard />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.CUSTOMER_BOOKING}
                    element={
                      <CustomerLayout>
                        <CustomerBooking />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.CUSTOMER_SHIPMENTS}
                    element={
                      <CustomerLayout>
                        <CustomerShipments />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.CUSTOMER_PROFILE}
                    element={
                      <CustomerLayout>
                        <CustomerProfile />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.CUSTOMER_EXPERIENCE}
                    element={
                      <CustomerLayout>
                        <CustomerExperiencePage />
                      </CustomerLayout>
                    }
                  />
                </>
              )}

              {/* Admin Routes */}
              {isAdminUser && (
                <>
                  <Route
                    path={ROUTE_PATHS.DASHBOARD}
                    element={
                      <Layout>
                        <AdminDashboard />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ADMIN_DASHBOARD}
                    element={
                      <Layout>
                        <AdminDashboard />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SHIPMENTS}
                    element={
                      <Layout>
                        <Shipments />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.CREATE_SHIPMENT}
                    element={
                      <Layout>
                        <CreateShipment />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.TRACKING}
                    element={
                      <Layout>
                        <Tracking />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAREHOUSE}
                    element={
                      <Layout>
                        <Warehouse />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING}
                    element={
                      <Layout>
                        <Accounting />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.USERS}
                    element={
                      <Layout>
                        <Users />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.REPORTS}
                    element={
                      <Layout>
                        <Reports />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.REPORTS_CENTER}
                    element={
                      <Layout>
                        <ReportsCenter />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS}
                    element={
                      <Layout>
                        <Settings />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_MANAGEMENT}
                    element={
                      <Layout>
                        <WayManagement />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.MERCHANTS}
                    element={
                      <Layout>
                        <Merchants />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.DELIVERYMEN}
                    element={
                      <Layout>
                        <Deliverymen />
                      </Layout>
                    }
                  />
                  
                  {/* Accounting Sub-routes */}
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING_HOME}
                    element={
                      <Layout>
                        <AccountingHome />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING_TRANSACTIONS}
                    element={
                      <Layout>
                        <SimpleTransactionPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING_BALANCE}
                    element={
                      <Layout>
                        <AccountBalancePage />
                      </Layout>
                    }
                  />
                  
                  {/* Reports Sub-routes */}
                  <Route
                    path={ROUTE_PATHS.REPORTS_HOME}
                    element={
                      <Layout>
                        <ReportsHome />
                      </Layout>
                    }
                  />
                  
                  {/* Admin Management Routes */}
                  <Route
                    path={ROUTE_PATHS.ADMIN_BULK_UPLOAD}
                    element={
                      <Layout>
                        <BulkUpload />
                      </Layout>
                    }
                  />
                  
                  {/* Comprehensive Admin System Routes */}
                  <Route
                    path={ROUTE_PATHS.ADMIN_USER_MANAGEMENT}
                    element={
                      <Layout>
                        <AdminManagement />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ADMIN_SYSTEM_OVERVIEW}
                    element={
                      <Layout>
                        <AdminDashboard />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS_TARIFF}
                    element={
                      <Layout>
                        <TariffSetting />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.USERS}
                    element={
                      <Layout>
                        <AdminManagement />
                      </Layout>
                    }
                  />
                  
                  {/* Marketer Dashboard Routes */}
                  <Route
                    path={ROUTE_PATHS.MARKETER_DASHBOARD}
                    element={
                      <Layout>
                        <MarketerDashboard />
                      </Layout>
                    }
                  />
                  
                  {/* Customer Service Dashboard Routes */}
                  <Route
                    path={ROUTE_PATHS.CS_DASHBOARD}
                    element={
                      <Layout>
                        <CustomerServiceDashboard />
                      </Layout>
                    }
                  />
                  
                  {/* Way Management Routes */}
                  <Route
                    path={ROUTE_PATHS.WAY_DELIVER_WAYS}
                    element={
                      <Layout>
                        <DeliverWaysPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_FAILED_WAYS}
                    element={
                      <Layout>
                        <FailedWaysPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_RETURN_WAYS}
                    element={
                      <Layout>
                        <ReturnWaysPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_PARCEL_IN}
                    element={
                      <Layout>
                        <ParcelInPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_PARCEL_OUT}
                    element={
                      <Layout>
                        <ParcelOutPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_TRANSIT_ROUTE}
                    element={
                      <Layout>
                        <TransitRoutePage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_TRACKING_MAP}
                    element={
                      <Layout>
                        <TrackingMapPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_CREATE_DELIVERY_PICKUP}
                    element={
                      <Layout>
                        <CreateDeliveryPickupPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.WAY_IN_OFFICE_RECEIVE}
                    element={
                      <Layout>
                        <InOfficeReceivePage />
                      </Layout>
                    }
                  />
                  
                  {/* Merchant Management Routes */}
                  <Route
                    path={ROUTE_PATHS.MERCHANT_ADD_NEW}
                    element={
                      <Layout>
                        <AddNewMerchantPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.MERCHANT_LIST}
                    element={
                      <Layout>
                        <MerchantListPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.MERCHANT_RECEIPTS}
                    element={
                      <Layout>
                        <MerchantReceiptsPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.MERCHANT_FINANCIAL_CENTER}
                    element={
                      <Layout>
                        <MerchantFinancialCenterPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.MERCHANT_INVOICE_SCHEDULING}
                    element={
                      <Layout>
                        <InvoiceSchedulingPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.MERCHANT_BANK_ACCOUNTS}
                    element={
                      <Layout>
                        <BankAccountListPage />
                      </Layout>
                    }
                  />
                  
                  {/* Deliveryman Management Routes */}
                  <Route
                    path={ROUTE_PATHS.DELIVERYMAN_CASH_ADVANCE}
                    element={
                      <Layout>
                        <CashAdvancePage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.DELIVERYMAN_ADD_NEW}
                    element={
                      <Layout>
                        <AddNewDeliverymanPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.DELIVERYMAN_LIST}
                    element={
                      <Layout>
                        <DeliverymanListPage />
                      </Layout>
                    }
                  />
                  
                  {/* Accounting Routes */}
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING_ACCOUNTS}
                    element={
                      <Layout>
                        <AccountsPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING_TRANSACTIONS_LIST}
                    element={
                      <Layout>
                        <TransactionsListPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING_FINANCIAL_REPORTS}
                    element={
                      <Layout>
                        <FinancialReportsPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.ACCOUNTING_BRANCHES}
                    element={
                      <Layout>
                        <BranchesPage />
                      </Layout>
                    }
                  />
                  
                  {/* Reporting Routes */}
                  <Route
                    path={ROUTE_PATHS.REPORTS_DELIVERY_REPORT}
                    element={
                      <Layout>
                        <DeliveryReportPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.REPORTS_MERCHANT_REPORT}
                    element={
                      <Layout>
                        <MerchantReportPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.REPORTS_FINANCIAL_REPORT}
                    element={
                      <Layout>
                        <FinancialReportPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.REPORTS_PERFORMANCE_REPORT}
                    element={
                      <Layout>
                        <PerformanceReportPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.REPORTS_CUSTOM_REPORT}
                    element={
                      <Layout>
                        <CustomReportPage />
                      </Layout>
                    }
                  />
                  
                  {/* Broadcast Messages Routes */}
                  <Route
                    path={ROUTE_PATHS.BROADCAST_MESSAGES}
                    element={
                      <Layout>
                        <BroadcastMessagesPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.BROADCAST_SEND_MESSAGE}
                    element={
                      <Layout>
                        <SendMessagePage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.BROADCAST_MESSAGE_HISTORY}
                    element={
                      <Layout>
                        <MessageHistoryPage />
                      </Layout>
                    }
                  />
                  
                  {/* Settings Routes */}
                  <Route
                    path={ROUTE_PATHS.SETTINGS_GENERAL}
                    element={
                      <Layout>
                        <GeneralSettingsPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS_NOTIFICATIONS}
                    element={
                      <Layout>
                        <NotificationsPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS_SECURITY}
                    element={
                      <Layout>
                        <SecurityPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS_BACKUP}
                    element={
                      <Layout>
                        <BackupPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS_SYSTEM_CONFIG}
                    element={
                      <Layout>
                        <SystemConfigPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS_USER_PREFERENCES}
                    element={
                      <Layout>
                        <UserPreferencesPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SETTINGS_API_SETTINGS}
                    element={
                      <Layout>
                        <ApiSettingsPage />
                      </Layout>
                    }
                  />
                  
                  {/* Advanced System Pages */}
                  <Route
                    path={ROUTE_PATHS.QA_TESTING}
                    element={
                      <Layout>
                        <QATestingPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.DISPATCH_CONTROL}
                    element={
                      <Layout>
                        <DispatchControlPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.HR_MANAGEMENT}
                    element={
                      <Layout>
                        <HRManagementPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.FINANCIAL_MANAGEMENT}
                    element={
                      <Layout>
                        <FinancialManagementPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.SYSTEM_ADMINISTRATION}
                    element={
                      <Layout>
                        <SystemAdministrationPage />
                      </Layout>
                    }
                  />
                  <Route
                    path={ROUTE_PATHS.BUSINESS_INTELLIGENCE}
                    element={
                      <Layout>
                        <BusinessIntelligencePage />
                      </Layout>
                    }
                  />
                </>
              )}
              
              {/* Merchant Routes */}
              {user && (user.role === USER_ROLES.MERCHANT || user.role === 'merchant') && (
                <>
                  <Route
                    path={ROUTE_PATHS.MERCHANT_DASHBOARD}
                    element={<MerchantDashboard />}
                  />
                </>
              )}
              
              {/* Rider Routes */}
              {user && (user.role === USER_ROLES.RIDER || user.role === 'rider') && (
                <>
                  <Route
                    path={ROUTE_PATHS.RIDER_DASHBOARD}
                    element={<RiderDashboard />}
                  />
                  <Route
                    path={ROUTE_PATHS.RIDER_TASKS}
                    element={<RiderTaskList />}
                  />
                  <Route
                    path={ROUTE_PATHS.RIDER_WALLET}
                    element={<RiderWallet />}
                  />
                  <Route
                    path={ROUTE_PATHS.MOBILE_DELIVERY}
                    element={<MobileDeliveryInterface />}
                  />
                  <Route
                    path={ROUTE_PATHS.RIDER_JOB_DETAIL}
                    element={<JobDetailScreen />}
                  />
                </>
              )}
              
              {/* Warehouse Routes */}
              {user && (user.role === USER_ROLES.WAREHOUSE || user.role === 'warehouse') && (
                <>
                  <Route
                    path={ROUTE_PATHS.WAREHOUSE_DASHBOARD}
                    element={<WarehouseDashboard />}
                  />
                  <Route
                    path={ROUTE_PATHS.WAREHOUSE_QR_SCANNER}
                    element={<QRScanner />}
                  />
                  <Route
                    path={ROUTE_PATHS.WAREHOUSE_SCAN_IN}
                    element={<WarehouseScanIn />}
                  />
                  <Route
                    path={ROUTE_PATHS.WAREHOUSE_SORTING}
                    element={<WarehouseSorting />}
                  />
                  <Route
                    path={ROUTE_PATHS.WAREHOUSE_OPERATIONS}
                    element={<WarehouseOperationsPage />}
                  />
                </>
              )}

              {/* Redirect based on user role */}
              <Route 
                path="*" 
                element={
                  <Navigate 
                    to={
                      isCustomerUser 
                        ? ROUTE_PATHS.CUSTOMER_DASHBOARD 
                        : isAdminUser 
                        ? ROUTE_PATHS.DASHBOARD 
                        : user?.role === 'merchant'
                        ? ROUTE_PATHS.MERCHANT_DASHBOARD
                        : user?.role === 'rider'
                        ? ROUTE_PATHS.RIDER_DASHBOARD
                        : user?.role === 'warehouse'
                        ? ROUTE_PATHS.WAREHOUSE_DASHBOARD
                        : ROUTE_PATHS.HOME
                    } 
                    replace 
                  />
                } 
              />
            </Routes>
          </HashRouter>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;