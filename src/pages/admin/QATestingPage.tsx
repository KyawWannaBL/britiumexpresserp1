import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  Bug, 
  Shield, 
  Zap,
  TrendingUp,
  Clock,
  Users,
  Database,
  Globe,
  Settings,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface TestSuite {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'warning';
  testsTotal: number;
  testsPassed: number;
  coverage: number;
  duration: string;
  icon: React.ElementType;
}

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration: string;
  coverage: number;
}

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timeAgo: string;
}

const QATestingPage: React.FC = () => {
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [systemHealth, setSystemHealth] = useState('operational');
  const [testCoverage, setTestCoverage] = useState(94.2);
  const [testsPassed, setTestsPassed] = useState(2847);
  const [activeBugs, setActiveBugs] = useState(23);
  const [performanceScore, setPerformanceScore] = useState(87);

  const testSuites: TestSuite[] = [
    {
      id: 'auth',
      name: 'Authentication & Authorization',
      status: 'passed',
      testsTotal: 47,
      testsPassed: 47,
      coverage: 100,
      duration: '2.3s',
      icon: Shield
    },
    {
      id: 'rbac',
      name: 'Role-Based Access Control',
      status: 'running',
      testsTotal: 25,
      testsPassed: 23,
      coverage: 92,
      duration: '1.8s',
      icon: Users
    },
    {
      id: 'orders',
      name: 'Order Management System',
      status: 'warning',
      testsTotal: 158,
      testsPassed: 156,
      coverage: 98.7,
      duration: '12.4s',
      icon: Database
    },
    {
      id: 'payment',
      name: 'Payment Processing',
      status: 'failed',
      testsTotal: 36,
      testsPassed: 34,
      coverage: 94.4,
      duration: '5.7s',
      icon: Zap
    },
    {
      id: 'fleet',
      name: 'Fleet Management',
      status: 'passed',
      testsTotal: 89,
      testsPassed: 89,
      coverage: 100,
      duration: '8.2s',
      icon: Globe
    }
  ];

  const integrationMatrix = [
    { service: 'Admin Dashboard', auth: 'passed', order: 'passed', payment: 'warning', fleet: 'passed', notification: 'passed' },
    { service: 'Mobile Fleet App', auth: 'passed', order: 'passed', payment: 'passed', fleet: 'passed', notification: 'warning' },
    { service: 'Customer Portal', auth: 'passed', order: 'warning', payment: 'failed', fleet: 'na', notification: 'passed' },
    { service: 'Merchant Portal', auth: 'passed', order: 'passed', payment: 'passed', fleet: 'na', notification: 'passed' }
  ];

  const bugReports: BugReport[] = [
    {
      id: 'BUG-2024-001',
      title: 'Payment gateway timeout',
      description: 'Users unable to complete payments during peak hours',
      severity: 'critical',
      timeAgo: '2h ago'
    },
    {
      id: 'BUG-2024-002',
      title: 'GPS tracking lag',
      description: 'Delivery tracking shows 2-3 minute delay',
      severity: 'high',
      timeAgo: '4h ago'
    },
    {
      id: 'BUG-2024-003',
      title: 'UI alignment issue',
      description: 'Mobile dashboard buttons misaligned on iOS',
      severity: 'medium',
      timeAgo: '1d ago'
    }
  ];

  const runAllTests = async () => {
    setIsRunningTests(true);
    toast({
      title: "Running Tests",
      description: "Executing full test suite...",
    });

    // Simulate test execution
    setTimeout(() => {
      setIsRunningTests(false);
      toast({
        title: "Tests Completed",
        description: "All test suites have been executed successfully",
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 animate-spin text-info" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-success/10 text-success border-success/20">PASSED</Badge>;
      case 'failed':
        return <Badge className="bg-error/10 text-error border-error/20">FAILED</Badge>;
      case 'warning':
        return <Badge className="bg-warning/10 text-warning border-warning/20">WARNING</Badge>;
      case 'running':
        return <Badge className="bg-info/10 text-info border-info/20">RUNNING</Badge>;
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-error text-white">CRITICAL</Badge>;
      case 'high':
        return <Badge className="bg-warning text-white">HIGH</Badge>;
      case 'medium':
        return <Badge className="bg-info text-white">MEDIUM</Badge>;
      case 'low':
        return <Badge className="bg-muted text-muted-foreground">LOW</Badge>;
      default:
        return <Badge variant="outline">{severity.toUpperCase()}</Badge>;
    }
  };

  const getIntegrationStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'failed':
        return '❌';
      case 'na':
        return '➖';
      default:
        return '❓';
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
            <TestTube className="h-6 w-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Britium Express QA</h1>
            <p className="text-muted-foreground">Integration Testing & Quality Assurance</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-success">All Systems Operational</span>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Test Coverage</p>
                <p className="text-2xl font-bold text-navy-900">{testCoverage}%</p>
                <p className="text-xs text-success">+2.1% from last week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tests Passed</p>
                <p className="text-2xl font-bold text-navy-900">{testsPassed.toLocaleString()}</p>
                <p className="text-xs text-success">98.7% success rate</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bugs</p>
                <p className="text-2xl font-bold text-navy-900">{activeBugs}</p>
                <p className="text-xs text-warning">5 critical, 18 minor</p>
              </div>
              <Bug className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
                <p className="text-2xl font-bold text-navy-900">{performanceScore}</p>
                <p className="text-xs text-info">Good performance</p>
              </div>
              <Zap className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="execution" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="execution">Test Execution</TabsTrigger>
            <TabsTrigger value="integration">Integration Matrix</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="execution" className="space-y-6">
            {/* Test Execution Dashboard */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Test Execution Dashboard</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={runAllTests} 
                      disabled={isRunningTests}
                      className="btn-premium"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run All Tests
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testSuites.map((suite) => {
                    const IconComponent = suite.icon;
                    return (
                      <div key={suite.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-semibold">{suite.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {suite.testsPassed}/{suite.testsTotal} tests
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(suite.status)}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Coverage: {suite.coverage}% | Duration: {suite.duration}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            {/* Integration Testing Matrix */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Integration Testing Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Service</th>
                        <th className="text-center p-3">Auth API</th>
                        <th className="text-center p-3">Order API</th>
                        <th className="text-center p-3">Payment API</th>
                        <th className="text-center p-3">Fleet API</th>
                        <th className="text-center p-3">Notification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {integrationMatrix.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium">{row.service}</td>
                          <td className="text-center p-3">{getIntegrationStatusIcon(row.auth)}</td>
                          <td className="text-center p-3">{getIntegrationStatusIcon(row.order)}</td>
                          <td className="text-center p-3">{getIntegrationStatusIcon(row.payment)}</td>
                          <td className="text-center p-3">{getIntegrationStatusIcon(row.fleet)}</td>
                          <td className="text-center p-3">{getIntegrationStatusIcon(row.notification)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Passing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Warning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>Failing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>➖</span>
                    <span>Not Applicable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Monitoring */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900 mb-2">245ms</div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-xs text-success">Target: &lt;300ms</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900 mb-2">1.2K</div>
                    <p className="text-sm text-muted-foreground">Requests/sec</p>
                    <p className="text-xs text-info">Peak: 2.1K</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900 mb-2">0.3%</div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-xs text-success">Target: &lt;1%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Issues */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Issues</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bugReports.map((bug) => (
                    <div key={bug.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getSeverityBadge(bug.severity)}
                          <span className="text-sm font-mono text-muted-foreground">#{bug.id}</span>
                        </div>
                        <h4 className="font-semibold mb-1">{bug.title}</h4>
                        <p className="text-sm text-muted-foreground">{bug.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{bug.timeAgo}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Assessment */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Security Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Vulnerability Scan</span>
                    <Badge className="bg-success/10 text-success border-success/20">PASSED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Authentication Tests</span>
                    <Badge className="bg-success/10 text-success border-success/20">PASSED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Data Encryption</span>
                    <Badge className="bg-success/10 text-success border-success/20">PASSED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>SQL Injection</span>
                    <Badge className="bg-success/10 text-success border-success/20">PASSED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>XSS Protection</span>
                    <Badge className="bg-warning/10 text-warning border-warning/20">WARNING</Badge>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Security Score: 94/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Last scan: 2 hours ago</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default QATestingPage;