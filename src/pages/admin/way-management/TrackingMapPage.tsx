import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Search,
  Filter,
  Layers,
  Maximize2,
  MoreHorizontal,
  Truck,
  User,
  Clock,
  Battery,
  Signal,
  ChevronRight,
  Activity,
  Target,
  AlertCircle
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';
import { SHIPMENT_STATUSES } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

/**
 * Britium Express - Tracking Map Page
 * Real-time GPS simulation and route visualization
 * © 2026 Britium Express
 */

interface RiderLocation {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  battery: number;
  signal: number;
  lat: number;
  lng: number;
  lastUpdated: string;
  currentShipment?: string;
  speed: number;
}

const TrackingMapPage: React.FC = () => {
  const { language } = useLanguageContext();
  const t = (key: string) => translations[language][key as keyof typeof translations['en']] || key;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Mock Riders Data
  const riders: RiderLocation[] = [
    { id: 'R-1024', name: 'Aung Kyaw', status: 'active', battery: 85, signal: 4, lat: 40, lng: 30, lastUpdated: '2 mins ago', currentShipment: 'BRT-99283', speed: 35 },
    { id: 'R-2051', name: 'Kyaw Zeya', status: 'active', battery: 42, signal: 5, lat: 60, lng: 70, lastUpdated: 'Just now', currentShipment: 'BRT-88120', speed: 42 },
    { id: 'R-3092', name: 'Min Thu', status: 'idle', battery: 98, signal: 3, lat: 25, lng: 85, lastUpdated: '15 mins ago', speed: 0 },
    { id: 'R-4011', name: 'Htet Lin', status: 'active', battery: 67, signal: 5, lat: 75, lng: 45, lastUpdated: '1 min ago', currentShipment: 'BRT-77451', speed: 28 },
    { id: 'R-5520', name: 'Zarni', status: 'offline', battery: 12, signal: 0, lat: 10, lng: 10, lastUpdated: '2 hours ago', speed: 0 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsMapLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredRiders = useMemo(() => {
    return riders.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.currentShipment && r.currentShipment.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const selectedRider = riders.find(r => r.id === selectedRiderId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <h1 className="text-xl font-bold text-navy-900 dark:text-gold-400 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gold-500" />
            {t('way.trackingMap')}
          </h1>
          <div className="hidden lg:flex items-center gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
              34 Riders Online
            </Badge>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              12 Idle
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder={t('common.search') + "..."}
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Layers className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Rider List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card flex flex-col">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1">
                <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
                <TabsTrigger value="active">{t('common.active')}</TabsTrigger>
                <TabsTrigger value="idle">Idle</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <ScrollArea className="flex-1 p-4">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredRiders.map((rider) => (
                <motion.div
                  key={rider.id}
                  variants={staggerItem}
                  onClick={() => setSelectedRiderId(rider.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    selectedRiderId === rider.id 
                      ? 'border-gold-500 bg-gold-500/5 shadow-lg shadow-gold-500/10' 
                      : 'border-border hover:border-gold-400/50 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-navy-800" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                          rider.status === 'active' ? 'bg-success' : 
                          rider.status === 'idle' ? 'bg-warning' : 'bg-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-navy-950 dark:text-gold-200">{rider.name}</h3>
                        <p className="text-xs text-muted-foreground">ID: {rider.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                        <Battery className={`w-3 h-3 ${rider.battery < 20 ? 'text-destructive' : 'text-success'}`} />
                        {rider.battery}%
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                        <Signal className="w-3 h-3 text-gold-500" />
                        {rider.signal}/5
                      </div>
                    </div>
                  </div>

                  {rider.currentShipment && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3 h-3 text-gold-600" />
                        <span className="text-xs font-mono font-medium">{rider.currentShipment}</span>
                      </div>
                      <span className="text-[10px] font-medium bg-navy-50 text-navy-700 px-1.5 py-0.5 rounded">
                        {rider.speed} km/h
                      </span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rider.lastUpdated}
                    </span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-navy-50/30 overflow-hidden">
          {/* Stylized Simulated Map */}
          <div className="absolute inset-0">
            {isMapLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-muted/20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full"
                />
                <p className="text-muted-foreground font-medium animate-pulse">Initializing Live Map...</p>
              </div>
            ) : (
              <div className="relative w-full h-full bg-slate-100 dark:bg-navy-950 overflow-hidden">
                {/* Grid Background Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Simulated Map Paths (SVG) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,20 L100,20 M0,50 L100,50 M0,80 L100,80 M30,0 L30,100 M70,0 L70,100" stroke="currentColor" strokeWidth="0.1" className="text-navy-200 dark:text-navy-800" fill="none" />
                  {/* Simulated Route for selected rider */}
                  {selectedRider && selectedRider.status === 'active' && (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                      d={`M${selectedRider.lat - 10},${selectedRider.lng - 10} L${selectedRider.lat},${selectedRider.lng}`}
                      stroke="#D4AF37"
                      strokeWidth="0.8"
                      strokeDasharray="2,2"
                      fill="none"
                    />
                  )}
                </svg>

                {/* Animated Markers */}
                <AnimatePresence>
                  {riders.map((rider) => (
                    <motion.div
                      key={rider.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        left: `${rider.lat}%`, 
                        top: `${rider.lng}%` 
                      }}
                      whileHover={{ scale: 1.2, zIndex: 50 }}
                      onClick={() => setSelectedRiderId(rider.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                    >
                      <div className="relative">
                        {/* Pulsing Aura for active riders */}
                        {rider.status === 'active' && (
                          <motion.div
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-gold-500/40"
                          />
                        )}
                        <div className={`p-1.5 rounded-full border-2 border-white shadow-xl ${ 
                          rider.status === 'active' ? 'bg-gold-500 text-navy-900' : 
                          rider.status === 'idle' ? 'bg-warning text-warning-foreground' : 'bg-muted-foreground text-white'
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        
                        {/* Tooltip Overlay */}
                        {(selectedRiderId === rider.id || rider.status === 'active') && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap pointer-events-none">
                            <div className="bg-navy-900 text-gold-400 text-[10px] px-2 py-1 rounded shadow-lg border border-gold-400/30 flex items-center gap-2">
                              <span className="font-bold">{rider.name}</span>
                              <span className="opacity-60">|</span>
                              <span>{rider.speed} km/h</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Map Floating UI */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="icon" variant="secondary" className="shadow-lg bg-card/80 backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="shadow-lg bg-card/80 backdrop-blur-md">
                    <Activity className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="shadow-lg bg-card/80 backdrop-blur-md">
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>

                {/* Bottom Legend Overlay */}
                <div className="absolute bottom-4 left-4 p-3 bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-lg flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <div className="w-3 h-3 rounded-full bg-gold-500" />
                    <span>In Transit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span>Idle</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    <span>Offline</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Details Panel (Bottom Right) */}
          <AnimatePresence>
            {selectedRider && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-6 right-6 w-80 lg:w-96 bg-card/95 backdrop-blur-xl border border-gold-400/30 rounded-2xl shadow-2xl overflow-hidden z-30"
              >
                <div className="p-4 royal-navy flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-navy-900">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{selectedRider.name}</h4>
                      <p className="text-[10px] text-gold-400 uppercase tracking-widest font-mono">{selectedRider.id}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white" onClick={() => setSelectedRiderId(null)}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Current Status</p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-success" />
                        <span className="text-sm font-semibold capitalize">{selectedRider.status}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Live Speed</p>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gold-600" />
                        <span className="text-sm font-semibold">{selectedRider.speed} km/h</span>
                      </div>
                    </div>
                  </div>

                  {selectedRider.currentShipment ? (
                    <div className="p-3 rounded-lg bg-navy-50/50 border border-navy-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-navy-800 uppercase">Current Job</span>
                        <Badge variant="secondary" className="text-[10px] bg-gold-500/20 text-gold-700">In Progress</Badge>
                      </div>
                      <p className="text-sm font-mono font-bold text-navy-950 mb-1">{selectedRider.currentShipment}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>Downtown Business District</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <p className="text-xs font-medium text-warning-foreground">Currently not assigned to any delivery.</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1 luxury-button h-10">
                      Call Rider
                    </Button>
                    <Button variant="outline" className="flex-1 h-10 border-navy-200">
                      View History
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TrackingMapPage;
