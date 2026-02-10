import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  AlertCircle, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Package,
  DollarSign,
  Phone,
  Navigation,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { RiderAPI, type RiderTask, type Rider } from '@/lib/rider-api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

type TaskType = 'pickup' | 'delivery' | 'return';

const RiderTaskList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<TaskType>('delivery');
  const [tasks, setTasks] = useState<RiderTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<RiderTask[]>([]);
  const [rider, setRider] = useState<Rider | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
    
    // Check for filter from URL params
    const filter = searchParams.get('filter');
    if (filter === 'pending') {
      setStatusFilter('pending');
    }
  }, [searchParams]);

  useEffect(() => {
    filterTasks();
  }, [tasks, activeTab, searchQuery, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load rider profile
      const riderProfile = await RiderAPI.getRiderProfile();
      if (riderProfile) {
        setRider(riderProfile);
        
        // Load all tasks
        const allTasks = await RiderAPI.getRiderTasks(riderProfile.id);
        setTasks(allTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: t('rider.error'),
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks.filter(task => task.type === activeTab);
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        filtered = filtered.filter(task => ['pending', 'assigned'].includes(task.status));
      } else {
        filtered = filtered.filter(task => task.status === statusFilter);
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.task_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.delivery_address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by priority and time
    filtered.sort((a, b) => {
      // Priority order: urgent > express > normal
      const priorityOrder = { urgent: 3, express: 2, normal: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by SLA time
      if (a.sla_time && b.sla_time) {
        return new Date(a.sla_time).getTime() - new Date(b.sla_time).getTime();
      }
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    setFilteredTasks(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'assigned':
        return <Badge className="bg-warning/10 text-warning border-warning/20">{t('rider.pending')}</Badge>;
      case 'in_progress':
        return <Badge className="bg-info/10 text-info border-info/20">{t('rider.inProgress')}</Badge>;
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success/20">{t('rider.completed')}</Badge>;
      case 'failed':
        return <Badge className="bg-error/10 text-error border-error/20">{t('rider.failed')}</Badge>;
      case 'cancelled':
        return <Badge className="bg-muted text-muted-foreground">{t('rider.cancelled')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-error text-white animate-pulse">{t('rider.urgent')}</Badge>;
      case 'express':
        return <Badge className="bg-warning text-white">{t('rider.express')}</Badge>;
      case 'normal':
        return <Badge className="bg-muted text-muted-foreground">{t('rider.normal')}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === 'my' ? 'my-MM' : 'en-MM', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <ArrowUpCircle className="w-5 h-5 text-info" />;
      case 'delivery':
        return <ArrowDownCircle className="w-5 h-5 text-success" />;
      case 'return':
        return <RefreshCw className="w-5 h-5 text-warning" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTaskCounts = () => {
    const counts = {
      pickup: tasks.filter(t => t.type === 'pickup' && ['pending', 'assigned', 'in_progress'].includes(t.status)).length,
      delivery: tasks.filter(t => t.type === 'delivery' && ['pending', 'assigned', 'in_progress'].includes(t.status)).length,
      return: tasks.filter(t => t.type === 'return' && ['pending', 'assigned', 'in_progress'].includes(t.status)).length
    };
    return counts;
  };

  const taskCounts = getTaskCounts();

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
      {/* Header */}
      <motion.div variants={staggerItem} className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-navy-900">{t('rider.tasks')}</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredTasks.length} {t('rider.tasks').toLowerCase()}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Search and Filter */}
        <motion.div variants={staggerItem} className="space-y-4">
          <div className="relative">
            <Input
              placeholder={`${t('rider.search')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              {t('rider.all')}
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              {t('rider.pending')}
            </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('in_progress')}
            >
              {t('rider.inProgress')}
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              {t('rider.completed')}
            </Button>
          </div>
        </motion.div>

        {/* Task Type Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TaskType)}>
            <TabsList className="grid w-full grid-cols-3 bg-white">
              <TabsTrigger value="pickup" className="flex items-center space-x-2">
                <ArrowUpCircle className="w-4 h-4" />
                <span>{t('rider.pickup')}</span>
                {taskCounts.pickup > 0 && (
                  <Badge className="ml-1 bg-info text-white text-xs">{taskCounts.pickup}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex items-center space-x-2">
                <ArrowDownCircle className="w-4 h-4" />
                <span>{t('rider.delivery')}</span>
                {taskCounts.delivery > 0 && (
                  <Badge className="ml-1 bg-success text-white text-xs">{taskCounts.delivery}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="return" className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>{t('rider.return')}</span>
                {taskCounts.return > 0 && (
                  <Badge className="ml-1 bg-warning text-white text-xs">{taskCounts.return}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="glass-card cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-gold-500"
                      onClick={() => navigate(`/rider/job/${task.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getTaskIcon(task.type)}
                            <div>
                              <h3 className="font-bold text-navy-900">#{task.task_code}</h3>
                              <p className="text-sm text-muted-foreground">{task.customer_name}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-1">
                            {getPriorityBadge(task.priority)}
                            {getStatusBadge(task.status)}
                          </div>
                        </div>

                        {/* Special Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.cod_amount > 0 && (
                            <Badge className="bg-gold-500/10 text-gold-600 border-gold-200">
                              {t('rider.cod')}: {formatCurrency(task.cod_amount)}
                            </Badge>
                          )}
                          {task.is_fragile && (
                            <Badge className="bg-error/10 text-error border-error/20">
                              {t('rider.fragile')}
                            </Badge>
                          )}
                          {task.delivery_fee > 0 && (
                            <Badge className="bg-success/10 text-success border-success/20">
                              +{formatCurrency(task.delivery_fee)}
                            </Badge>
                          )}
                        </div>

                        {/* Address */}
                        <div className="flex items-start space-x-2 mb-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground flex-1">
                            {task.type === 'pickup' ? task.pickup_address : task.delivery_address}
                          </p>
                        </div>

                        {/* Time and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            {task.sla_time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(task.sla_time)}</span>
                              </div>
                            )}
                            {task.weight_kg && (
                              <span>{task.weight_kg}kg</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${task.customer_phone}`);
                              }}
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const address = task.type === 'pickup' ? task.pickup_address : task.delivery_address;
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
                              }}
                            >
                              <Navigation className="w-4 h-4" />
                            </Button>
                            
                            {/* Status-specific action button */}
                            {task.status === 'assigned' && (
                              <Button size="sm" className="bg-info hover:bg-info/90">
                                {t('rider.start')}
                              </Button>
                            )}
                            {task.status === 'in_progress' && (
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                {t('rider.finish')}
                              </Button>
                            )}
                            {task.status === 'completed' && (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            )}
                            {task.status === 'failed' && (
                              <XCircle className="w-5 h-5 text-error" />
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        {task.notes && (
                          <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                            <p className="text-muted-foreground">"{task.notes}"</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {filteredTasks.length === 0 && (
                  <motion.div variants={staggerItem}>
                    <Card className="glass-card">
                      <CardContent className="p-8 text-center">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-navy-900 mb-2">
                          {t('rider.noTasks')}
                        </h3>
                        <p className="text-muted-foreground">
                          {statusFilter === 'all' 
                            ? `No ${activeTab} tasks available.`
                            : `No ${statusFilter} ${activeTab} tasks found.`
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RiderTaskList;