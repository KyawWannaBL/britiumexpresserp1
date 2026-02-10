import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Map, 
  Package, 
  Truck, 
  Wifi, 
  WifiOff, 
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Phone,
  MessageCircle,
  Star,
  Battery,
  Signal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { RiderAPI, type Rider, type RiderTask } from '@/lib/rider-api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const RiderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  // State management
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [rider, setRider] = useState<Rider | null>(null);
  const [tasks, setTasks] = useState<RiderTask[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    failed: 0,
    cod: 0,
    todayEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load rider data on component mount
  useEffect(() => {
    loadRiderData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateBatteryLevel();
    }, 30000); // Update every 30 seconds

    // Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadRiderData = async () => {
    try {
      setLoading(true);
      
      // Load rider profile
      const riderProfile = await RiderAPI.getRiderProfile();
      if (riderProfile) {
        setRider(riderProfile);
        setIsOnDuty(riderProfile.duty_status === 'on_duty');
        
        // Load rider tasks
        const riderTasks = await RiderAPI.getRiderTasks(riderProfile.id);
        setTasks(riderTasks);
        
        // Load statistics
        const riderStats = await RiderAPI.getRiderStats(riderProfile.id);
        setStats(riderStats);
      }
    } catch (error) {
      console.error('Error loading rider data:', error);
      toast({
        title: t('rider.error'),
        description: "Failed to load rider data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBatteryLevel = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
      } catch (error) {
        // Fallback for browsers that don't support battery API
        setBatteryLevel(Math.floor(Math.random() * 30) + 70); // 70-100%
      }
    }
  };

  const toggleDutyStatus = async () => {
    if (!rider) return;
    
    const newStatus = isOnDuty ? 'off_duty' : 'on_duty';
    const success = await RiderAPI.updateDutyStatus(rider.id, newStatus);
    
    if (success) {
      setIsOnDuty(!isOnDuty);
      toast({
        title: isOnDuty ? t('rider.offDuty') : t('rider.onDuty'),
        description: isOnDuty ? "You are now off duty" : "You are now on duty",
      });
    }
  };

  const getNextTask = () => {
    return tasks.find(task => task.status === 'assigned' || task.status === 'pending');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'my' ? 'my-MM' : 'en-MM', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('rider.morning');
    if (hour < 17) return t('rider.afternoon');
    if (hour < 20) return t('rider.evening');
    return t('rider.night');
  };

  const nextTask = getNextTask();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gold-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-navy-600">{t('rider.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-gradient-to-br from-navy-50 to-gold-50 pb-20"
    >
      {/* Header with Status */}
      <motion.div variants={staggerItem} className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-gold-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-navy-900">
                  {getGreeting()}, {rider?.full_name?.split(' ')[0] || 'Rider'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t('rider.zone')}: {rider?.zone || 'Downtown-A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Battery & Signal */}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Battery className={`w-4 h-4 ${batteryLevel > 20 ? 'text-success' : 'text-error'}`} />
                <span>{batteryLevel}%</span>
                <Signal className="w-4 h-4" />
              </div>
              
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/rider/notifications')}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full text-xs"></span>
              </Button>
            </div>
          </div>
          
          {/* Connectivity & Duty Status */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {isOnline ? <Wifi className="w-4 h-4 text-success" /> : <WifiOff className="w-4 h-4 text-error" />}
              <span className="text-sm font-medium">
                {isOnline ? t('rider.online') : t('rider.offline')}
              </span>
            </div>
            
            <Button
              onClick={toggleDutyStatus}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                isOnDuty 
                  ? 'bg-success text-white shadow-lg' 
                  : 'bg-muted text-muted-foreground hover:bg-gold-500 hover:text-white'
              }`}
            >
              {isOnDuty ? t('rider.onDuty') : t('rider.startRoute')}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
          <Card 
            className="glass-card cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/rider/tasks?filter=pending')}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-warning" />
              </div>
              <div className="text-2xl font-bold text-navy-900">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">{t('rider.pending')}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-navy-900">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">{t('rider.completed')}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              <div className="text-2xl font-bold text-navy-900">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">{t('rider.failed')}</div>
            </CardContent>
          </Card>

          <Card 
            className="glass-card cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/rider/wallet')}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-gold-500" />
              </div>
              <div className="text-lg font-bold text-navy-900">{formatCurrency(stats.cod)}</div>
              <div className="text-xs text-muted-foreground">{t('rider.codBalance')}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Earnings */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('rider.todayEarnings')}</p>
                  <p className="text-2xl font-bold text-gold-600">{formatCurrency(stats.todayEarnings)}</p>
                </div>
                <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-gold-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Task */}
        {nextTask && (
          <motion.div variants={staggerItem}>
            <Card className="glass-card border-info/20 bg-info/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-info" />
                  <span>{t('rider.nextTask')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">#{nextTask.task_code}</span>
                  <Badge className={`${
                    nextTask.priority === 'urgent' ? 'bg-error text-white' :
                    nextTask.priority === 'express' ? 'bg-warning text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {t(`rider.${nextTask.priority}`)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{nextTask.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{nextTask.delivery_address}</span>
                  </div>
                  {nextTask.cod_amount > 0 && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gold-500" />
                      <span className="text-sm font-medium text-gold-600">
                        {t('rider.cod')}: {formatCurrency(nextTask.cod_amount)}
                      </span>
                    </div>
                  )}
                  {nextTask.sla_time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="text-sm text-warning">
                        {t('rider.time')}: {new Date(nextTask.sla_time).toLocaleTimeString(language === 'my' ? 'my-MM' : 'en-MM', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => navigate(`/rider/job/${nextTask.id}`)}
                    className="flex-1 bg-info hover:bg-info/90"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {t('rider.start')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${nextTask.customer_phone}`)}
                    className="px-4"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextTask.delivery_address)}`)}
                    className="px-4"
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">{t('rider.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/rider/tasks')}
                  className="h-16 flex-col space-y-2"
                >
                  <Package className="w-6 h-6" />
                  <span className="text-sm">{t('rider.tasks')}</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/rider/map')}
                  className="h-16 flex-col space-y-2"
                >
                  <Map className="w-6 h-6" />
                  <span className="text-sm">{t('rider.map')}</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/rider/wallet')}
                  className="h-16 flex-col space-y-2"
                >
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm">{t('rider.wallet')}</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/rider/profile')}
                  className="h-16 flex-col space-y-2"
                >
                  <Truck className="w-6 h-6" />
                  <span className="text-sm">{t('rider.profile')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Summary */}
        {rider && (
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Star className="w-5 h-5 text-gold-500" />
                  <span>{t('rider.performance')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-navy-900">{rider.rating.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">{t('rider.rating')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-navy-900">{rider.total_deliveries}</div>
                    <div className="text-sm text-muted-foreground">{t('rider.totalJobs')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {rider.total_deliveries > 0 ? Math.round((rider.successful_deliveries / rider.total_deliveries) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">{t('rider.successRate')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RiderDashboard;