import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, Phone, Mail, MapPin, Clock, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROUTE_PATHS, USER_ROLES } from '@/lib/index';
import { useAuth } from '@/hooks/useFirebaseAuth';
import { useLanguageContext, LanguageToggle, CompactLanguageToggle } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/assets/images';
interface NavItem {
  label: string;
  path: string;
}
export function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const {
    t
  } = useLanguageContext();
  const NAV_ITEMS: NavItem[] = [{
    label: t('public.track'),
    path: ROUTE_PATHS.PUBLIC_TRACKING
  }, {
    label: t('public.services'),
    path: ROUTE_PATHS.SERVICES
  }, {
    label: t('public.getQuote'),
    path: ROUTE_PATHS.GET_QUOTE
  }, {
    label: t('public.about'),
    path: ROUTE_PATHS.ABOUT
  }, {
    label: t('public.support'),
    path: ROUTE_PATHS.SUPPORT
  }, {
    label: t('public.contact'),
    path: ROUTE_PATHS.CONTACT
  }];
  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.HOME);
  };
  const isCustomerUser = user && user.role === USER_ROLES.CUSTOMER;
  const isAdminUser = user && [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.WAREHOUSE, USER_ROLES.RIDER, USER_ROLES.MERCHANT, USER_ROLES.VENDOR, USER_ROLES.ACCOUNTANT].includes(user.role as any);
  const HeaderContent = () => <>
      <div className="flex items-center gap-3 lotus-glow">
        <div className="relative">
          <img src={IMAGES.BRITIUM_LOGO_55} alt="Britium Express" className="w-12 h-12 object-contain" />
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-400/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight leading-none bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">
            Britium Express
          </h1>
          <p className="text-xs text-gold-600 font-medium">
            Delivering Confidence in Motion
          </p>
        </div>
      </div>

      <nav className="hidden lg:flex items-center space-x-6">
        {NAV_ITEMS.map(item => <Link key={item.path} to={item.path} className={cn("nav-item text-sm font-medium myanmar-text", location.pathname === item.path ? "active" : "text-muted-foreground hover:text-gold-600")}>
            {item.label}
          </Link>)}
        
        {/* Language Toggle */}
        <LanguageToggle className="ml-4" />
        {user ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-100 rounded-full">
                <span className="hidden sm:inline text-sm font-medium">{user.full_name || 'User'}</span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-bold">{user.full_name || 'User'}</span>
                <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isCustomerUser && <>
                  <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.CUSTOMER_DASHBOARD)}>
                    <User className="mr-2 w-4 h-4" />
                    {t('nav.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.CUSTOMER_PROFILE)}>
                    <User className="mr-2 w-4 h-4" />
                    {t('contact.name')}
                  </DropdownMenuItem>
                </>}
              {isAdminUser && <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>
                  <User className="mr-2 w-4 h-4" />
                  {t('nav.dashboard')}
                </DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 w-4 h-4" />
                {t('public.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <Button asChild variant="outline" size="sm">
            <Link to={ROUTE_PATHS.LOGIN}>
              <LogIn className="w-4 h-4 mr-2" />
              {t('public.login')}
            </Link>
          </Button>}
        
        {/* Language Toggle */}
        <LanguageToggle className="ml-2" />
      </nav>
    </>;
  return <div className="min-h-screen bg-background">
      {/* Top Contact Bar - Golden Lotus Design */}
      <div className="royal-navy py-2 text-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gold-400">
              <Phone className="w-4 h-4" />
              <span className="myanmar-text">+95 9 897 4477 44</span>
            </div>
            <div className="flex items-center gap-2 text-gold-400">
              <Mail className="w-4 h-4" />
              <span>info@britiumexpress.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gold-300">
            <Clock className="w-4 h-4" />
            <span className="myanmar-text">Mon-Sat: 9:00am - 5:30pm</span>
          </div>
        </div>
      </div>

      {/* Main Header - Grandeur Design */}
      <header className="sticky top-0 z-50 w-full border-b border-gold-400/20 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-xl shadow-lg shadow-gold-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-4 lotus-glow group">
              <div className="relative">
                <img src={IMAGES.BRITIUM_LOGO_55} alt="Britium Express Logo" className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-400/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div>
                <h1 className="font-bold text-2xl tracking-tight leading-none bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 bg-clip-text text-transparent">
                  Britium Express
                </h1>
                <p className="text-sm text-gold-600 font-medium">
                  Delivering Confidence in Motion
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_ITEMS.map(item => <Link key={item.path} to={item.path} className="text-sm font-medium transition-colors hover:text-primary text-[rgb(0,0,0)]">
                  {item.label}
                </Link>)}
              
              {/* Language Toggle */}
              <LanguageToggle className="" />
              
              {user ? <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{user.full_name || 'User'}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div> : <Button asChild variant="outline" size="sm">
                  <Link to={ROUTE_PATHS.LOGIN} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-[rgb(0,0,0)]">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>}
            </nav>

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 pb-6 border-b border-gold-400/20">
                    <div className="relative lotus-glow">
                      <img src={IMAGES.BRITIUM_LOGO_55} alt="Britium Express Logo" className="h-12 w-auto" />
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-400/10 rounded-xl blur opacity-50" />
                    </div>
                    <div>
                      <h1 className="font-bold text-xl tracking-tight leading-none bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">
                        Britium Express
                      </h1>
                      <p className="text-sm text-gold-600 font-medium">
                        Delivering Confidence in Motion
                      </p>
                    </div>
                  </div>
                  
                  <nav className="flex flex-col space-y-4 py-6">
                    {NAV_ITEMS.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileOpen(false)} className={cn("text-sm font-medium transition-colors hover:text-primary py-2", location.pathname === item.path ? "text-primary" : "text-muted-foreground")}>
                        {item.label}
                      </Link>)}
                    {user ? <div className="mt-4 space-y-2">
                        <div className="text-sm font-medium text-foreground">
                          Welcome, {user.full_name || 'User'}
                        </div>
                        {isCustomerUser && <Button asChild variant="outline" className="w-full">
                            <Link to={ROUTE_PATHS.CUSTOMER_DASHBOARD} onClick={() => setIsMobileOpen(false)}>
                              <User className="w-4 h-4 mr-2" />
                              {t('nav.dashboard')}
                            </Link>
                          </Button>}
                        {isAdminUser && <Button asChild variant="outline" className="w-full">
                            <Link to={ROUTE_PATHS.DASHBOARD} onClick={() => setIsMobileOpen(false)}>
                              <User className="w-4 h-4 mr-2" />
                              {t('nav.dashboard')}
                            </Link>
                          </Button>}
                        <Button variant="outline" className="w-full" onClick={() => {
                      handleLogout();
                      setIsMobileOpen(false);
                    }}>
                          <LogOut className="w-4 h-4 mr-2" />
                          {t('public.logout')}
                        </Button>
                      </div> : <Button asChild variant="outline" className="mt-4">
                        <Link to={ROUTE_PATHS.LOGIN} onClick={() => setIsMobileOpen(false)}>
                          <LogIn className="w-4 h-4 mr-2" />
                          {t('public.login')}
                        </Link>
                      </Button>}
                    
                    {/* Mobile Language Toggle */}
                    <div className="mt-6 pt-4 border-t border-gold-400/20">
                      <CompactLanguageToggle className="w-full justify-center" />
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                  <Package className="text-navy-900 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Britium Express</h3>
                </div>
              </div>
              <p className="text-navy-200 text-sm">
                A dedicated delivery arm of Britium Ventures Company Limited.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <div className="space-y-2">
                <Link to={ROUTE_PATHS.PUBLIC_TRACKING} className="block text-navy-200 hover:text-white text-sm">Track Package</Link>
                <Link to={ROUTE_PATHS.SERVICES} className="block text-navy-200 hover:text-white text-sm">Services</Link>
                <Link to={ROUTE_PATHS.CONTACT} className="block text-navy-200 hover:text-white text-sm">Contact</Link>
                <Link to={ROUTE_PATHS.SYSTEM_STATUS} className="block text-navy-200 hover:text-white text-sm">System Status</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm text-navy-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+95 9 897 4477 44</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>No. 277, East Dagon Township, Yangon.</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Business Hours</h4>
              <div className="space-y-2 text-sm text-navy-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Sat: 9:00am - 5:30pm</span>
                </div>
                <p>Closed on Sundays</p>
              </div>
            </div>
          </div>

          <div className="border-t border-navy-700 mt-12 pt-8 text-center text-sm text-navy-300">
            <p>© 2026 Britium Ventures Company Limited.</p>
          </div>
        </div>
      </footer>
    </div>;
}