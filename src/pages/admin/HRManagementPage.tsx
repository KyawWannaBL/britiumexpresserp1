import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  GraduationCap,
  Shield,
  Calendar,
  Search,
  Filter,
  Download,
  Edit,
  Award,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  status: 'active' | 'training' | 'probation' | 'suspended';
  joinDate: string;
  avatar?: string;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  status: 'active' | 'urgent' | 'closed';
  applications: number;
}

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  enrolled: number;
  status: 'scheduled' | 'active' | 'completed';
  completion: number;
}

const HRManagementPage: React.FC = () => {
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [totalEmployees, setTotalEmployees] = useState(1247);
  const [openPositions, setOpenPositions] = useState(23);
  const [attendanceRate, setAttendanceRate] = useState(94.2);
  const [trainingCompletion, setTrainingCompletion] = useState(87);
  const [searchQuery, setSearchQuery] = useState('');

  const employees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@britium.com',
      role: 'Rider',
      branch: 'Yangon Central',
      status: 'active',
      joinDate: 'Jan 15, 2024'
    },
    {
      id: '2',
      name: 'Mary Smith',
      email: 'mary.smith@britium.com',
      role: 'Driver',
      branch: 'Mandalay Hub',
      status: 'training',
      joinDate: 'Jan 20, 2024'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.j@britium.com',
      role: 'Warehouse',
      branch: 'Yangon Central',
      status: 'probation',
      joinDate: 'Dec 10, 2023'
    }
  ];

  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Delivery Driver',
      department: 'Yangon Central Branch',
      location: 'Yangon',
      salary: '500,000 - 700,000 MMK',
      type: 'Full-time',
      status: 'active',
      applications: 12
    },
    {
      id: '2',
      title: 'Warehouse Supervisor',
      department: 'Mandalay Hub',
      location: 'Mandalay',
      salary: '800,000 - 1,200,000 MMK',
      type: 'Full-time',
      status: 'urgent',
      applications: 8
    }
  ];

  const trainingPrograms: TrainingProgram[] = [
    {
      id: '1',
      title: 'Safety & Security Training',
      description: 'Mandatory for all delivery staff',
      date: 'Jan 30, 2024',
      duration: '2 hours',
      enrolled: 45,
      status: 'scheduled',
      completion: 78
    },
    {
      id: '2',
      title: 'Customer Service Excellence',
      description: 'For all customer-facing roles',
      date: 'Feb 5, 2024',
      duration: '4 hours',
      enrolled: 67,
      status: 'active',
      completion: 92
    }
  ];

  const roleDistribution = [
    { role: 'Riders', count: 456, percentage: 37 },
    { role: 'Drivers', count: 234, percentage: 19 },
    { role: 'Warehouse', count: 189, percentage: 15 },
    { role: 'Supervisors', count: 67, percentage: 5 },
    { role: 'Management', count: 45, percentage: 4 }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'hire',
      message: 'New Employee Onboarded',
      description: 'John Doe joined as Rider - Yangon Branch',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'review',
      message: 'Performance Review Completed',
      description: 'Q4 reviews completed for 45 employees',
      time: '5 hours ago'
    },
    {
      id: '3',
      type: 'training',
      message: 'Training Session Scheduled',
      description: 'Safety Training for all Drivers - Jan 30',
      time: '1 day ago'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'training':
        return <Badge className="bg-info/10 text-info border-info/20">Training</Badge>;
      case 'probation':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Probation</Badge>;
      case 'suspended':
        return <Badge className="bg-error/10 text-error border-error/20">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'urgent':
        return <Badge className="bg-error/10 text-error border-error/20">Urgent</Badge>;
      case 'closed':
        return <Badge className="bg-muted text-muted-foreground">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTrainingStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-info/10 text-info border-info/20">Scheduled</Badge>;
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'completed':
        return <Badge className="bg-muted text-muted-foreground">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'hire':
        return <UserPlus className="w-4 h-4 text-success" />;
      case 'review':
        return <Award className="w-4 h-4 text-info" />;
      case 'training':
        return <GraduationCap className="w-4 h-4 text-warning" />;
      default:
        return <Users className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const addEmployee = () => {
    toast({
      title: "Add Employee",
      description: "Employee creation form would open here",
    });
  };

  const generateReport = () => {
    toast({
      title: "Generating Report",
      description: "HR report is being generated...",
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
            <Users className="h-6 w-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Britium Express</h1>
            <p className="text-muted-foreground">Human Resources Management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">HR Manager</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold text-navy-900">{totalEmployees.toLocaleString()}</p>
                <p className="text-xs text-success">+12 this month</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                <p className="text-2xl font-bold text-navy-900">{openPositions}</p>
                <p className="text-xs text-warning">5 urgent</p>
              </div>
              <Briefcase className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-navy-900">{attendanceRate}%</p>
                <p className="text-xs text-success">+2.1% vs last month</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Training Completion</p>
                <p className="text-2xl font-bold text-navy-900">{trainingCompletion}%</p>
                <p className="text-xs text-info">156 completed</p>
              </div>
              <GraduationCap className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Employee Distribution */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Employee Distribution by Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roleDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{item.role}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                          <div className="w-20">
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent HR Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-1 bg-muted/50 rounded">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={addEmployee} className="h-20 flex-col">
                    <UserPlus className="w-6 h-6 mb-2" />
                    Add Employee
                  </Button>
                  <Button onClick={generateReport} variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="w-6 h-6 mb-2" />
                    Schedule Training
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="w-6 h-6 mb-2" />
                    Process Payroll
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            {/* Employee Management */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employee Management</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button onClick={addEmployee} className="btn-premium">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Employee</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Branch</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Join Date</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-sm text-muted-foreground">{employee.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">{employee.role}</td>
                          <td className="p-3">{employee.branch}</td>
                          <td className="p-3">{getStatusBadge(employee.status)}</td>
                          <td className="p-3">{employee.joinDate}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Shield className="w-4 h-4" />
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

          <TabsContent value="recruitment" className="space-y-6">
            {/* Job Postings */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Job Postings</CardTitle>
                  <Button className="btn-premium">
                    <Plus className="w-4 h-4 mr-2" />
                    New Posting
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.department}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>📍 {job.location}</span>
                            <span>💰 {job.salary}</span>
                            <span>⏰ {job.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {getJobStatusBadge(job.status)}
                          <p className="text-sm text-muted-foreground mt-1">
                            {job.applications} applications
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-4">
                        <Button size="sm">View Applications</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            {/* Training Programs */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Training Programs</CardTitle>
                  <Button className="btn-premium">
                    <Plus className="w-4 h-4 mr-2" />
                    New Program
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingPrograms.map((program) => (
                    <div key={program.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold">{program.title}</h4>
                          <p className="text-sm text-muted-foreground">{program.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>📅 {program.date}</span>
                            <span>⏰ {program.duration}</span>
                            <span>👥 {program.enrolled} enrolled</span>
                          </div>
                        </div>
                        {getTrainingStatusBadge(program.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Completion Rate</span>
                            <span>{program.completion}%</span>
                          </div>
                          <Progress value={program.completion} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
            {/* Payroll Management */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Payroll Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900 mb-2">₹ 45.2M</div>
                    <p className="text-sm text-muted-foreground">Total Payroll</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900 mb-2">1,247</div>
                    <p className="text-sm text-muted-foreground">Employees Paid</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-navy-900 mb-2">₹ 36,285</div>
                    <p className="text-sm text-muted-foreground">Average Salary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-navy-900 mb-2">8.4/10</div>
                    <p className="text-sm text-muted-foreground">Overall Performance Score</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">On-time Delivery</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Rating</span>
                      <span className="font-semibold">4.7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            {/* Compliance Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-success mb-2">94%</div>
                      <p className="text-sm text-muted-foreground">Compliance Score</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Labor Law Compliance</span>
                        <span className="text-success font-semibold">100%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Safety Regulations</span>
                        <span className="text-success font-semibold">96%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Documentation</span>
                        <span className="text-warning font-semibold">87%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Required Actions</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 border rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-warning mt-1" />
                        <div>
                          <p className="font-medium text-sm">License Renewal Required</p>
                          <p className="text-xs text-muted-foreground">12 driver licenses expire within 30 days</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Clock className="w-4 h-4 text-info mt-1" />
                        <div>
                          <p className="font-medium text-sm">Training Overdue</p>
                          <p className="text-xs text-muted-foreground">Safety training overdue for 8 employees</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default HRManagementPage;