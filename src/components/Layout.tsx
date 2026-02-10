import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  MapPin, 
  Warehouse, 
  BadgeDollarSign, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  User as UserIcon,
  Languages,
  Upload,
  Globe,
  DollarSign,
  Shield,
  MessageSquare
} from 'lucide-react';
import { ROUTE_PATHS, USER_ROLES, UserRole } from '@/lib/index';
import { useAuth } from '@/hooks/useFirebaseAuth';
import { useLanguageContext } from '@/lib/LanguageContext';
import { IMAGES } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    labelKey: 'nav.dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    labelKey: 'nav.wayManagement',
    path: ROUTE_PATHS.WAY_MANAGEMENT,
    icon: Package,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MERCHANT, USER_ROLES.RIDER, USER_ROLES.WAREHOUSE, USER_ROLES.MANAGER],
  },
  {
    labelKey: 'nav.createDelivery',
    path: ROUTE_PATHS.CREATE_SHIPMENT,
    icon: PlusCircle,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MERCHANT],
  },
  {
    labelKey: 'way.trackingMap',
    path: ROUTE_PATHS.TRACKING,
    icon: MapPin,
  },
  {
    labelKey: 'nav.merchants',
    path: ROUTE_PATHS.MERCHANTS,
    icon: Warehouse,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE],
  },
  {
    labelKey: 'nav.deliverymen',
    path: ROUTE_PATHS.DELIVERYMEN,
    icon: Users,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    labelKey: 'nav.accounting',
    path: ROUTE_PATHS.ACCOUNTING,
    icon: BadgeDollarSign,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ACCOUNTANT],
  },
  {
    labelKey: 'nav.reporting',
    path: ROUTE_PATHS.REPORTS,
    icon: BarChart3,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.ACCOUNTANT],
  },
  {
    labelKey: 'Reports Center',
    path: ROUTE_PATHS.REPORTS_CENTER,
    icon: BarChart3,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.ACCOUNTANT],
  },
  {
    labelKey: 'nav.settings',
    path: ROUTE_PATHS.SETTINGS,
    icon: Settings,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  
  // Comprehensive Admin System Navigation
  {
    labelKey: 'admin.userManagement',
    path: ROUTE_PATHS.ADMIN_USER_MANAGEMENT,
    icon: Users,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    labelKey: 'bulk.orderUpload',
    path: ROUTE_PATHS.ADMIN_BULK_UPLOAD,
    icon: Upload,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    labelKey: 'tariff.mmkConfiguration',
    path: ROUTE_PATHS.SETTINGS_TARIFF,
    icon: Globe,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    labelKey: 'admin.systemOverview',
    path: ROUTE_PATHS.ADMIN_SYSTEM_OVERVIEW,
    icon: LayoutDashboard,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    labelKey: 'QA Testing',
    path: ROUTE_PATHS.QA_TESTING,
    icon: Settings,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    labelKey: 'Dispatch Control',
    path: ROUTE_PATHS.DISPATCH_CONTROL,
    icon: Settings,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    labelKey: 'HR Management',
    path: ROUTE_PATHS.HR_MANAGEMENT,
    icon: Users,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  },
  {
    labelKey: 'Financial Management',
    path: ROUTE_PATHS.FINANCIAL_MANAGEMENT,
    icon: DollarSign,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT],
  },
  {
    labelKey: 'System Administration',
    path: ROUTE_PATHS.SYSTEM_ADMINISTRATION,
    icon: Shield,
    roles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    labelKey: 'Business Intelligence',
    path: ROUTE_PATHS.BUSINESS_INTELLIGENCE,
    icon: BarChart3,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  
  // Marketer Navigation
  {
    labelKey: 'marketer.dashboard',
    path: ROUTE_PATHS.MARKETER_DASHBOARD,
    icon: BarChart3,
    roles: [USER_ROLES.MARKETER],
  },
  
  // Customer Service Navigation
  {
    labelKey: 'cs.dashboard',
    path: ROUTE_PATHS.CS_DASHBOARD,
    icon: MessageSquare,
    roles: [USER_ROLES.CUSTOMER_SERVICE],
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthorized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguageContext();

  const filteredNavItems = NAV_ITEMS.filter((item) => 
    !item.roles || isAuthorized(item.roles)
  );

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.HOME);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6 flex items-center gap-3">
        <img 
          src={IMAGES.BRITIUM_LOGO_55} 
          alt="Britium Express Logo" 
          className="h-10 w-auto"
        />
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none">Britium</h1>
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mt-1">Express Logistics</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">{t(item.labelKey)}</span>
              {location.pathname === item.path && (
                <ChevronRight className="ml-auto w-4 h-4" />
              )}
            </NavLink>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-sidebar-accent/50">
          <Avatar className="w-9 h-9 border-2 border-sidebar-border">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {user?.full_name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.full_name}</p>
            <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-tighter truncate">
              {user?.role.replace('_', ' ')}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-sidebar-foreground/40 hover:text-destructive transition-colors hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-border">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full h-16 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between h-full px-4 md:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-none">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div className="relative hidden md:flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search shipments, tracking IDs..."
                  className="pl-9 pr-4 py-1.5 bg-muted/50 border-none rounded-full text-sm w-64 lg:w-80 focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* Language Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLanguage}
                className="relative hover:bg-muted/50"
                title={language === 'en' ? 'Switch to Myanmar' : 'Switch to English'}
              >
                <Languages className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                  {language.toUpperCase()}
                </span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
              </Button>

              <Separator orientation="vertical" className="h-6 hidden sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1 pl-2 hover:bg-muted/50 rounded-full">
                    <span className="hidden sm:inline text-sm font-medium">{user?.full_name}</span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {user?.full_name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-bold">{user?.full_name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.SETTINGS)}>
                    <UserIcon className="mr-2 w-4 h-4" />
                    {t('nav.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>
                    <LayoutDashboard className="mr-2 w-4 h-4" />
                    {t('nav.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 w-4 h-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer Info */}
        <footer className="p-4 md:p-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>{t('company.copyright')} - {t('company.name')}</p>
        </footer>
      </div>
    </div>
  );
}
