import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Server, 
  Database, 
  Users, 
  Settings, 
  Lock, 
  Key, 
  Monitor,
  HardDrive,
  Cpu,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  RefreshCw,
  Download,
  Upload,
  Terminal,
  FileText,
  Zap,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface Service {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  memory: number;
  cpu: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'locked';
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'permission_change' | 'data_access';
  user: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const SystemAdministrationPage: React.FC = () => {
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [systemUptime, setSystemUptime] = useState('15 days, 7 hours');
  const [activeUsers, setActiveUsers] = useState(127);
  const [systemLoad, setSystemLoad] = useState(68);
  const [securityScore, setSecurityScore] = useState(94);

  const systemMetrics: SystemMetric[] = [
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Memory Usage', value: 72, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Disk Usage', value: 34, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Network I/O', value: 156, unit: 'MB/s', status: 'healthy', trend: 'up' },
    { name: 'Database Connections', value: 89, unit: 'active', status: 'healthy', trend: 'stable' },
    { name: 'API Response Time', value: 245, unit: 'ms', status: 'healthy', trend: 'down' }
  ];

  const services: Service[] = [
    { id: '1', name: 'Web Server (Nginx)', status: 'running', uptime: '15d 7h', memory: 128, cpu: 12 },
    { id: '2', name: 'Database (PostgreSQL)', status: 'running', uptime: '15d 7h', memory: 2048, cpu: 25 },
    { id: '3', name: 'Redis Cache', status: 'running', uptime: '15d 7h', memory: 512, cpu: 8 },
    { id: '4', name: 'Message Queue', status: 'running', uptime: '15d 7h', memory: 256, cpu: 15 },
    { id: '5', name: 'File Storage', status: 'running', uptime: '15d 7h', memory: 64, cpu: 3 },
    { id: '6', name: 'Backup Service', status: 'stopped', uptime: '0h', memory: 0, cpu: 0 }
  ];

  const systemUsers: User[] = [
    { id: '1', username: 'admin', email: 'admin@britium.com', role: 'Super Admin', lastLogin: '2026-01-27 09:30', status: 'active' },
    { id: '2', username: 'manager1', email: 'manager@britium.com', role: 'Manager', lastLogin: '2026-01-27 08:45', status: 'active' },
    { id: '3', username: 'operator1', email: 'operator@britium.com', role: 'Operator', lastLogin: '2026-01-26 17:20', status: 'inactive' },
    { id: '4', username: 'guest', email: 'guest@britium.com', role: 'Guest', lastLogin: 'Never', status: 'locked' }
  ];

  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'failed_login',
      user: 'unknown',
      timestamp: '2026-01-27 09:45:23',
      severity: 'medium',
      description: 'Multiple failed login attempts from IP 192.168.1.100'
    },
    {
      id: '2',
      type: 'permission_change',
      user: 'admin',
      timestamp: '2026-01-27 09:30:15',
      severity: 'low',
      description: 'User permissions updated for manager1'
    },
    {
      id: '3',
      type: 'data_access',
      user: 'operator1',
      timestamp: '2026-01-27 08:15:42',
      severity: 'low',
      description: 'Accessed sensitive customer data'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
      case 'healthy':
        return <Badge className="bg-success/10 text-success border-success/20">Running</Badge>;
      case 'stopped':
      case 'inactive':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Stopped</Badge>;
      case 'error':
      case 'locked':
      case 'critical':
        return <Badge className="bg-error/10 text-error border-error/20">Error</Badge>;
      case 'warning':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-error text-white">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-white">Medium</Badge>;
      case 'low':
        return <Badge className="bg-info text-white">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cpu usage':
        return <Cpu className="w-4 h-4" />;
      case 'memory usage':
        return <Monitor className="w-4 h-4" />;
      case 'disk usage':
        return <HardDrive className="w-4 h-4" />;
      case 'network i/o':
        return <Wifi className="w-4 h-4" />;
      case 'database connections':
        return <Database className="w-4 h-4" />;
      case 'api response time':
        return <Activity className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const restartService = (serviceId: string) => {
    toast({
      title: "Service Restart",
      description: `Restarting service ${serviceId}...`,
    });
  };

  const backupSystem = () => {
    toast({
      title: "System Backup",
      description: "System backup initiated...",
    });
  };

  const generateReport = () => {
    toast({
      title: "Generating Report",
      description: "System administration report is being generated...",
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
            <Shield className="h-6 w-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">System Administration</h1>
            <p className="text-muted-foreground">Server Management & Security Control</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">System Administrator</p>
            <p className="text-xs text-muted-foreground">admin@britium.com</p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* System Overview */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-navy-900">{systemUptime}</p>
                <p className="text-xs text-success">99.8% availability</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-navy-900">{activeUsers}</p>
                <p className="text-xs text-info">Peak: 156 users</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Load</p>
                <p className="text-2xl font-bold text-navy-900">{systemLoad}%</p>
                <p className="text-xs text-warning">Moderate load</p>
              </div>
              <Activity className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-navy-900">{securityScore}%</p>
                <p className="text-xs text-success">Excellent</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* System Metrics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon(metric.name)}
                          <span className="font-medium text-sm">{metric.name}</span>
                        </div>
                        {getStatusBadge(metric.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-sm text-muted-foreground">{metric.unit}</span>
                      </div>
                      <Progress value={typeof metric.value === 'number' && metric.unit === '%' ? metric.value : 50} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button onClick={backupSystem} className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Create System Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restart Services
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Terminal className="w-4 h-4 mr-2" />
                      Open Terminal
                    </Button>
                    <Button onClick={generateReport} variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-warning/5 border border-warning/20 rounded">
                      <AlertTriangle className="w-4 h-4 text-warning mt-1" />
                      <div>
                        <p className="font-medium text-sm">High Memory Usage</p>
                        <p className="text-xs text-muted-foreground">Memory usage at 72% - consider optimization</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-info/5 border border-info/20 rounded">
                      <Clock className="w-4 h-4 text-info mt-1" />
                      <div>
                        <p className="font-medium text-sm">Scheduled Maintenance</p>
                        <p className="text-xs text-muted-foreground">System maintenance scheduled for tonight 2:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-success/5 border border-success/20 rounded">
                      <CheckCircle2 className="w-4 h-4 text-success mt-1" />
                      <div>
                        <p className="font-medium text-sm">Backup Completed</p>
                        <p className="text-xs text-muted-foreground">Daily backup completed successfully at 1:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {/* Services Management */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Services</CardTitle>
                  <Button className="btn-premium">
                    <Zap className="w-4 h-4 mr-2" />
                    Start All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Service</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Uptime</th>
                        <th className="text-left p-3">Memory</th>
                        <th className="text-left p-3">CPU</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <Server className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{service.name}</span>
                            </div>
                          </td>
                          <td className="p-3">{getStatusBadge(service.status)}</td>
                          <td className="p-3">{service.uptime}</td>
                          <td className="p-3">{service.memory} MB</td>
                          <td className="p-3">{service.cpu}%</td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant={service.status === 'running' ? 'outline' : 'default'}
                                onClick={() => restartService(service.id)}
                              >
                                {service.status === 'running' ? 'Restart' : 'Start'}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
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

          <TabsContent value="users" className="space-y-6">
            {/* User Management */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Users</CardTitle>
                  <Button className="btn-premium">
                    <Users className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Username</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Last Login</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-3 font-medium">{user.username}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.role}</td>
                          <td className="p-3">{user.lastLogin}</td>
                          <td className="p-3">{getStatusBadge(user.status)}</td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Key className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Lock className="w-4 h-4" />
                              </Button>
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

          <TabsContent value="security" className="space-y-6">
            {/* Security Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="p-1 bg-muted/50 rounded">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm capitalize">{event.type.replace('_', ' ')}</span>
                            {getSeverityBadge(event.severity)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{event.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>User: {event.user}</span>
                            <span>{event.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Whitelist</p>
                        <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Audit Logging</p>
                        <p className="text-sm text-muted-foreground">Log all system activities</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button className="w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Run Security Scan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {/* System Monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Performance Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <Activity className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-sm">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-sm">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Disk Usage</span>
                        <span className="text-sm">34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Network Usage</span>
                        <span className="text-sm">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            {/* Backup Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Backup Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Daily Backup</p>
                        <p className="text-sm text-muted-foreground">Last: 2026-01-27 01:00 AM</p>
                      </div>
                      <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Weekly Backup</p>
                        <p className="text-sm text-muted-foreground">Last: 2026-01-21 02:00 AM</p>
                      </div>
                      <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Monthly Backup</p>
                        <p className="text-sm text-muted-foreground">Next: 2026-02-01 03:00 AM</p>
                      </div>
                      <Badge className="bg-info/10 text-info border-info/20">Scheduled</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button onClick={backupSystem} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Create Manual Backup
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore from Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Backup Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Backup Schedule</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Daily at 1:00 AM</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Weekly on Sunday</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Monthly on 1st</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Retention Policy</label>
                      <div className="mt-2 space-y-2">
                        <Input placeholder="Daily backups (days)" defaultValue="7" />
                        <Input placeholder="Weekly backups (weeks)" defaultValue="4" />
                        <Input placeholder="Monthly backups (months)" defaultValue="12" />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            {/* System Logs */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Logs</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  <div>[2026-01-27 09:45:23] INFO: User admin logged in from 192.168.1.50</div>
                  <div>[2026-01-27 09:44:15] INFO: Database backup completed successfully</div>
                  <div>[2026-01-27 09:43:02] WARN: High memory usage detected (72%)</div>
                  <div>[2026-01-27 09:42:18] INFO: Service nginx restarted</div>
                  <div>[2026-01-27 09:41:45] ERROR: Failed login attempt from 192.168.1.100</div>
                  <div>[2026-01-27 09:40:32] INFO: System health check completed</div>
                  <div>[2026-01-27 09:39:28] INFO: Cache cleared successfully</div>
                  <div>[2026-01-27 09:38:15] WARN: Disk usage approaching 80%</div>
                  <div>[2026-01-27 09:37:42] INFO: Scheduled task executed</div>
                  <div>[2026-01-27 09:36:58] INFO: API response time: 245ms</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default SystemAdministrationPage;