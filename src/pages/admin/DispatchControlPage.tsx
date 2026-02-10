import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  MapPin, 
  Truck, 
  Clock, 
  AlertTriangle, 
  Play, 
  Pause, 
  RefreshCw, 
  Settings,
  Phone,
  MessageSquare,
  Zap,
  Users,
  Package,
  TrendingUp,
  Navigation,
  Fuel,
  Timer,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface FleetVehicle {
  id: string;
  type: 'rider' | 'driver';
  name: string;
  status: 'delivering' | 'loading' | 'break' | 'available' | 'offline';
  location: string;
  eta?: string;
  position: { x: number; y: number };
}

interface DispatchOrder {
  id: string;
  priority: 'high' | 'normal' | 'low';
  route: string;
  status: 'pending' | 'assigned' | 'in_progress';
}

interface SystemAlert {
  id: string;
  type: 'breakdown' | 'delay' | 'traffic' | 'emergency';
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

const DispatchControlPage: React.FC = () => {
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [systemStatus, setSystemStatus] = useState('online');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [activeFleet, setActiveFleet] = useState(127);
  const [inTransit, setInTransit] = useState(89);
  const [pendingOrders, setPendingOrders] = useState(23);
  const [activeAlerts, setActiveAlerts] = useState(3);

  const fleetVehicles: FleetVehicle[] = [
    { id: 'R001', type: 'rider', name: 'Rider R001', status: 'delivering', location: 'Downtown', eta: '15min', position: { x: 45, y: 30 } },
    { id: 'D003', type: 'driver', name: 'Driver D003', status: 'loading', location: 'Warehouse A', position: { x: 20, y: 60 } },
    { id: 'R007', type: 'rider', name: 'Rider R007', status: 'break', location: 'Central Hub', position: { x: 60, y: 45 } },
    { id: 'R005', type: 'rider', name: 'Rider R005', status: 'delivering', location: 'Airport Road', position: { x: 80, y: 20 } }
  ];

  const dispatchQueue: DispatchOrder[] = [
    { id: 'BE2026001', priority: 'high', route: 'Yangon → Mandalay', status: 'pending' },
    { id: 'BE2026002', priority: 'normal', route: 'Downtown → Airport', status: 'pending' }
  ];

  const systemAlerts: SystemAlert[] = [
    { id: 'alert1', type: 'breakdown', message: 'Vehicle R007 - Breakdown', severity: 'critical' },
    { id: 'alert2', type: 'delay', message: 'Delivery Delay - Order #BE001', severity: 'warning' },
    { id: 'alert3', type: 'traffic', message: 'Traffic Update - Route A', severity: 'info' }
  ];

  const liveUpdates = [
    { id: 1, type: 'delivery', message: 'R001 completed delivery #BE2026001', time: '2 minutes ago' },
    { id: 2, type: 'route', message: 'D003 assigned new optimized route', time: '5 minutes ago' },
    { id: 3, type: 'pickup', message: 'R005 assigned pickup #BE2026003', time: '8 minutes ago' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
    toast({
      title: emergencyMode ? "Emergency Mode Disabled" : "Emergency Mode Activated",
      description: emergencyMode ? "System returned to normal operation" : "All units notified of emergency protocol",
      variant: emergencyMode ? "default" : "destructive",
    });
  };

  const autoAssignOrder = (orderId: string) => {
    toast({
      title: "Order Assigned",
      description: `Order ${orderId} has been automatically assigned to available rider`,
    });
  };

  const broadcastMessage = () => {
    toast({
      title: "Message Broadcasted",
      description: "Alert sent to all active fleet members",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivering':
        return 'bg-success';
      case 'loading':
        return 'bg-info';
      case 'break':
        return 'bg-warning';
      case 'available':
        return 'bg-muted';
      case 'offline':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivering':
        return 'Delivering';
      case 'loading':
        return 'Loading';
      case 'break':
        return 'Break';
      case 'available':
        return 'Available';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-error text-white">HIGH</Badge>;
      case 'normal':
        return <Badge className="bg-info text-white">NORMAL</Badge>;
      case 'low':
        return <Badge className="bg-muted text-muted-foreground">LOW</Badge>;
      default:
        return <Badge variant="outline">{priority.toUpperCase()}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'breakdown':
        return <AlertTriangle className="w-4 h-4" />;
      case 'delay':
        return <Clock className="w-4 h-4" />;
      case 'traffic':
        return <Navigation className="w-4 h-4" />;
      case 'emergency':
        return <Shield className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gold-500/10 rounded-lg">
            <Radio className="h-6 w-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Dispatch Control Center</h1>
            <p className="text-muted-foreground">Real-time Operations Command</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-bold">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          <Button 
            onClick={toggleEmergencyMode}
            variant={emergencyMode ? "destructive" : "outline"}
            className={emergencyMode ? "animate-pulse" : ""}
          >
            <Shield className="w-4 h-4 mr-2" />
            EMERGENCY
          </Button>
        </div>
      </motion.div>

      {/* System Status Cards */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Fleet</p>
                <p className="text-2xl font-bold text-navy-900">{activeFleet}</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold text-navy-900">{inTransit}</p>
              </div>
              <Truck className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-navy-900">{pendingOrders}</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold text-navy-900">{activeAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fleetVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                      <div>
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(vehicle.status)} - {vehicle.eta ? `ETA ${vehicle.eta}` : vehicle.location}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dispatch Queue */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Dispatch Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dispatchQueue.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Order #{order.id}</span>
                      {getPriorityBadge(order.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{order.route}</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => autoAssignOrder(order.id)}
                    >
                      Auto Assign
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Communications */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" onClick={broadcastMessage}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Broadcast All
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Call
                </Button>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Send Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Map and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Map */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Live Fleet Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted/20 rounded-lg h-64 overflow-hidden">
                {/* Simplified map representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* Roads */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300"></div>
                  
                  {/* Vehicles */}
                  {fleetVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        left: `${vehicle.position.x}%`, 
                        top: `${vehicle.position.y}%` 
                      }}
                    >
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)} border-2 border-white shadow-lg`}></div>
                    </div>
                  ))}
                  
                  {/* Warehouses */}
                  <div className="absolute top-[60%] left-[20%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-purple-500 rounded border-2 border-white shadow-lg"></div>
                  </div>
                  <div className="absolute top-[40%] left-[80%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-purple-500 rounded border-2 border-white shadow-lg"></div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Active Delivery</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <span>En Route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>Pickup</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded"></div>
                      <span>Warehouse</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance & Alerts */}
        <motion.div variants={staggerItem} className="space-y-6">
          {/* Performance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                  <p className="text-xl font-bold">23 min</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold">98.5%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fleet Utilization</p>
                  <p className="text-xl font-bold">87%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Savings</p>
                  <p className="text-xl font-bold text-success">15%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`p-1 rounded ${
                      alert.severity === 'critical' ? 'bg-error/10 text-error' :
                      alert.severity === 'warning' ? 'bg-warning/10 text-warning' :
                      'bg-info/10 text-info'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Updates */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Live Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveUpdates.map((update) => (
                <div key={update.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{update.message}</p>
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DispatchControlPage;