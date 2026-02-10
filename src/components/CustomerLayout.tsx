import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Package, 
  Home,
  PlusCircle,
  History,
  User as UserIcon,
  LogOut,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ROUTE_PATHS } from '@/lib/index';
import { useAuth } from '@/hooks/useFirebaseAuth';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/assets/images';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTE_PATHS.CUSTOMER_DASHBOARD, icon: Home },
  { label: 'My Shipments', path: ROUTE_PATHS.CUSTOMER_SHIPMENTS, icon: History },
  { label: 'New Booking', path: ROUTE_PATHS.CUSTOMER_BOOKING, icon: PlusCircle },
  { label: 'Customer Hub', path: ROUTE_PATHS.CUSTOMER_EXPERIENCE, icon: Package },
  { label: 'Profile', path: ROUTE_PATHS.CUSTOMER_PROFILE, icon: UserIcon },
];

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.HOME);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-navy-900 text-white">
      <div className="p-6 flex items-center gap-3 border-b border-navy-700">
        <img 
          src={IMAGES.BRITIUM_LOGO_55} 
          alt="Britium Express Logo" 
          className="h-10 w-auto"
        />
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none">My Britium</h1>
          <p className="text-xs text-gold font-medium">Customer Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-gold text-navy-900 shadow-md font-medium" 
                  : "hover:bg-navy-800 text-navy-200 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-navy-700 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-navy-200 hover:text-white hover:bg-navy-800"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full h-16 border-b border-border bg-white shadow-sm">
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

              <div className="lg:hidden">
                <h1 className="font-bold text-lg text-navy-900">My Britium</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-100 rounded-full">
                    <span className="hidden sm:inline text-sm font-medium">{user?.full_name || 'Customer'}</span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'C'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-bold">{user?.full_name || 'Customer'}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.CUSTOMER_PROFILE)}>
                    <UserIcon className="mr-2 w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.CUSTOMER_DASHBOARD)}>
                    <Home className="mr-2 w-4 h-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}