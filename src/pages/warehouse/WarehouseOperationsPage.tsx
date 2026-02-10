import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Warehouse, 
  Package, 
  Scan, 
  TruckIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BarChart3,
  Search,
  Filter,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  Users,
  Target,
  Zap,
  Settings,
  RefreshCw,
  Camera,
  Upload,
  Download,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface PackageItem {
  id: string;
  trackingNumber: string;
  destination: string;
  weight: string;
  status: 'pending' | 'scanned' | 'sorted' | 'dispatched';
  priority: 'normal' | 'express' | 'urgent';
  scanTime?: string;
}

interface Shipment {
  id: string;
  origin: string;
  packages: number;
  arrivalTime: string;
  status: 'processing' | 'completed' | 'in_transit';
}

interface StorageSection {
  id: string;
  name: string;
  capacity: number;
  used: number;
  status: 'available' | 'partial' | 'full';
}

const WarehouseOperationsPage: React.FC = () => {
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [packagesToday, setPackagesToday] = useState(1247);
  const [scannedItems, setScannedItems] = useState(892);
  const [storageCapacity, setStorageCapacity] = useState(78);
  const [qualityScore, setQualityScore] = useState(96.2);
  const [scannerActive, setScannerActive] = useState(false);
  const [manualEntry, setManualEntry] = useState('');

  const recentScans: PackageItem[] = [
    {
      id: '1',
      trackingNumber: 'PKG-2024-001247',
      destination: 'Yangon → Mandalay',
      weight: '2.5kg',
      status: 'scanned',
      priority: 'normal',
      scanTime: '09:45:23'
    },
    {
      id: '2',
      trackingNumber: 'PKG-2024-001246',
      destination: 'Yangon → Naypyidaw',
      weight: '1.2kg',
      status: 'scanned',
      priority: 'express',
      scanTime: '09:44:15'
    },
    {
      id: '3',
      trackingNumber: 'PKG-2024-001245',
      destination: 'Invalid barcode',
      weight: '',
      status: 'pending',
      priority: 'normal',
      scanTime: '09:43:02'
    }
  ];

  const incomingShipments: Shipment[] = [
    { id: 'SHP-001247', origin: 'Mandalay Hub', packages: 125, arrivalTime: '09:30 AM', status: 'processing' },
    { id: 'SHP-001246', origin: 'Naypyidaw Hub', packages: 87, arrivalTime: '08:45 AM', status: 'completed' },
    { id: 'SHP-001245', origin: 'Bagan Hub', packages: 203, arrivalTime: 'Expected 11:00 AM', status: 'in_transit' }
  ];

  const storageSections: StorageSection[] = [
    { id: 'A1', name: 'A1', capacity: 100, used: 45, status: 'partial' },
    { id: 'A2', name: 'A2', capacity: 100, used: 89, status: 'partial' },
    { id: 'A3', name: 'A3', capacity: 100, used: 100, status: 'full' },
    { id: 'A4', name: 'A4', capacity: 100, used: 23, status: 'available' },
    { id: 'A5', name: 'A5', capacity: 100, used: 67, status: 'partial' },
    { id: 'A6', name: 'A6', capacity: 100, used: 0, status: 'available' },
    { id: 'B1', name: 'B1', capacity: 100, used: 78, status: 'partial' },
    { id: 'B2', name: 'B2', capacity: 100, used: 100, status: 'full' },
    { id: 'B3', name: 'B3', capacity: 100, used: 34, status: 'available' },
    { id: 'B4', name: 'B4', capacity: 100, used: 91, status: 'partial' },
    { id: 'B5', name: 'B5', capacity: 100, used: 56, status: 'partial' },
    { id: 'B6', name: 'B6', capacity: 100, used: 12, status: 'available' }
  ];

  const activeTasks = [
    { id: '1', title: 'Inbound Processing', description: 'Truck YGN-001 arrived', priority: 'in_progress' },
    { id: '2', title: 'Batch Sorting', description: '125 packages pending', priority: 'urgent' },
    { id: '3', title: 'Quality Check', description: '45 items to inspect', priority: 'normal' }
  ];

  const recentActivity = [
    { time: '09:45', message: 'Completed scanning batch #1247' },
    { time: '09:32', message: 'Started inbound processing' },
    { time: '09:15', message: 'Quality issue reported - PKG-8901' },
    { time: '08:58', message: 'Outbound batch dispatched' },
    { time: '08:30', message: 'Shift started - Morning crew' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'scanned':
      case 'dispatched':
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case 'processing':
      case 'in_progress':
        return <Badge className="bg-info/10 text-info border-info/20">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'urgent':
        return <Badge className="bg-error/10 text-error border-error/20">Urgent</Badge>;
      case 'in_transit':
        return <Badge className="bg-info/10 text-info border-info/20">In Transit</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-error text-white">Urgent</Badge>;
      case 'express':
        return <Badge className="bg-warning text-white">Express</Badge>;
      case 'normal':
        return <Badge className="bg-muted text-muted-foreground">Normal</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStorageColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success/20 border-success/40';
      case 'partial':
        return 'bg-warning/20 border-warning/40';
      case 'full':
        return 'bg-error/20 border-error/40';
      default:
        return 'bg-muted/20 border-muted/40';
    }
  };

  const startScanning = () => {
    setScannerActive(true);
    toast({
      title: "Scanner Activated",
      description: "Camera is now ready for barcode scanning",
    });
  };

  const processBatch = () => {
    toast({
      title: "Processing Batch",
      description: "3 packages are being processed...",
    });
  };

  const optimizeStorage = () => {
    toast({
      title: "Optimizing Storage",
      description: "Storage layout optimization in progress...",
    });
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
            <Warehouse className="h-6 w-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Warehouse Operations</h1>
            <p className="text-muted-foreground">Station: YGN-001 | Shift: Morning</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">Maung Maung</p>
            <p className="text-xs text-muted-foreground">Warehouse Operator</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Packages Today</p>
                <p className="text-2xl font-bold text-navy-900">{packagesToday.toLocaleString()}</p>
                <p className="text-xs text-success">+12% from yesterday</p>
              </div>
              <Package className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scanned Items</p>
                <p className="text-2xl font-bold text-navy-900">{scannedItems}</p>
                <p className="text-xs text-info">71% completion</p>
              </div>
              <Scan className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Capacity</p>
                <p className="text-2xl font-bold text-navy-900">{storageCapacity}%</p>
                <p className="text-xs text-warning">Near capacity</p>
              </div>
              <Warehouse className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quality Score</p>
                <p className="text-2xl font-bold text-navy-900">{qualityScore}%</p>
                <p className="text-xs text-success">Excellent</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="scanning">Scanning</TabsTrigger>
            <TabsTrigger value="inbound">Inbound</TabsTrigger>
            <TabsTrigger value="outbound">Outbound</TabsTrigger>
            <TabsTrigger value="sorting">Sorting</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Tasks */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Active Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-1 bg-muted/50 rounded">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(task.priority)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.time}</p>
                          <p className="text-xs text-muted-foreground">{activity.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" onClick={startScanning}>
                      <Scan className="w-4 h-4 mr-2" />
                      Start Scanning
                    </Button>
                    <Button variant="outline" className="w-full">
                      <TruckIcon className="w-4 h-4 mr-2" />
                      Process Inbound
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Package className="w-4 h-4 mr-2" />
                      Sort Packages
                    </Button>
                    <Button variant="outline" className="w-full">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Quality Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scanning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Barcode Scanner */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Barcode & QR Scanning</CardTitle>
                  <p className="text-sm text-muted-foreground">Scan packages for processing</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/20 rounded-lg p-8 text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-2">Scanner Ready</p>
                      <p className="text-sm text-muted-foreground mb-4">Point camera at barcode or QR code</p>
                      <Button onClick={startScanning} className="btn-premium">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Manual Entry</p>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter tracking number..."
                          value={manualEntry}
                          onChange={(e) => setManualEntry(e.target.value)}
                        />
                        <Button>
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Scans */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentScans.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-1 bg-muted/50 rounded">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{scan.trackingNumber}</p>
                            <p className="text-xs text-muted-foreground">{scan.destination}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{scan.scanTime}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={processBatch} className="flex-1">
                        Process Batch (3)
                      </Button>
                      <Button variant="outline">Clear</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scanning Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Scan className="w-8 h-8 text-info mx-auto mb-2" />
                  <p className="text-2xl font-bold">{scannedItems}</p>
                  <p className="text-sm text-muted-foreground">Scans Today</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">2.3s</p>
                  <p className="text-sm text-muted-foreground">Avg. Scan Time</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inbound" className="space-y-6">
            {/* Incoming Shipments */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Incoming Shipments</CardTitle>
                  <Button className="btn-premium">
                    <TruckIcon className="w-4 h-4 mr-2" />
                    New Shipment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Shipment ID</th>
                        <th className="text-left p-3">Origin</th>
                        <th className="text-left p-3">Packages</th>
                        <th className="text-left p-3">Arrival Time</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomingShipments.map((shipment) => (
                        <tr key={shipment.id} className="border-b">
                          <td className="p-3 font-medium">{shipment.id}</td>
                          <td className="p-3">{shipment.origin}</td>
                          <td className="p-3">
                            <Badge variant="outline">{shipment.packages}</Badge>
                          </td>
                          <td className="p-3">{shipment.arrivalTime}</td>
                          <td className="p-3">{getStatusBadge(shipment.status)}</td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button size="sm">Process</Button>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            {/* Storage Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Warehouse Layout - Section A</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Section A</Button>
                      <Button variant="outline" size="sm">Section B</Button>
                      <Button variant="outline" size="sm">Section C</Button>
                      <Button onClick={optimizeStorage} size="sm">Optimize</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {storageSections.map((section) => (
                      <div
                        key={section.id}
                        className={`aspect-square border-2 rounded-lg flex items-center justify-center text-xs font-medium ${getStorageColor(section.status)}`}
                      >
                        {section.name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success/20 border border-success/40 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-warning/20 border border-warning/40 rounded"></div>
                      <span>Partially Full</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-error/20 border border-error/40 rounded"></div>
                      <span>Full</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Find Package Location
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Move Package
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Optimize Storage
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold">Storage Alerts</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2 p-2 bg-error/5 border border-error/20 rounded">
                        <AlertTriangle className="w-4 h-4 text-error mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">High Priority</p>
                          <p className="text-xs text-muted-foreground">Section C approaching capacity limit (95%)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 p-2 bg-warning/5 border border-warning/20 rounded">
                        <Clock className="w-4 h-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Overdue Items</p>
                          <p className="text-xs text-muted-foreground">12 packages stored over 7 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            {/* Quality Control */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quality Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Excellent</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <span className="text-sm font-semibold">847</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Good</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-info h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-sm font-semibold">156</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fair</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-warning h-2 rounded-full" style={{ width: '2%' }}></div>
                        </div>
                        <span className="text-sm font-semibold">23</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Poor</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-error h-2 rounded-full" style={{ width: '1%' }}></div>
                        </div>
                        <span className="text-sm font-semibold">8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Damaged</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-error h-2 rounded-full" style={{ width: '0.3%' }}></div>
                        </div>
                        <span className="text-sm font-semibold">3</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quality Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-success mb-2">{qualityScore}%</div>
                    <p className="text-sm text-muted-foreground">Overall Quality Score</p>
                    <p className="text-xs text-success">+2.1% from last week</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Recent Issues</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Damaged packaging</span>
                        <span className="text-error">3 cases</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Missing labels</span>
                        <span className="text-warning">2 cases</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Incorrect weight</span>
                        <span className="text-info">1 case</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Quality Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Daily Throughput</p>
                      <p className="text-2xl font-bold text-navy-900">{packagesToday.toLocaleString()}</p>
                      <p className="text-xs text-success">+15% vs yesterday</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-info" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Processing Speed</p>
                      <p className="text-2xl font-bold text-navy-900">2.3</p>
                      <p className="text-xs text-muted-foreground">min/package avg</p>
                    </div>
                    <Zap className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold text-navy-900">0.8%</p>
                      <p className="text-xs text-success">-0.3% improvement</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
                      <p className="text-2xl font-bold text-navy-900">94.2%</p>
                      <p className="text-xs text-success">Excellent</p>
                    </div>
                    <Target className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default WarehouseOperationsPage;