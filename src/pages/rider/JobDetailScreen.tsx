import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  Navigation, 
  ChevronLeft, 
  Package, 
  AlertTriangle,
  MapPin,
  Clock,
  DollarSign,
  User,
  FileText,
  Camera,
  CheckCircle2,
  XCircle,
  Star,
  Weight,
  Ruler
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { RiderAPI, type RiderTask } from '@/lib/rider-api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const JobDetailScreen: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [task, setTask] = useState<RiderTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadTaskDetails();
    }
  }, [jobId]);

  const loadTaskDetails = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const taskData = await RiderAPI.getTask(jobId);
      if (taskData) {
        setTask(taskData);
      } else {
        toast({
          title: t('rider.error'),
          description: "Task not found",
          variant: "destructive",
        });
        navigate('/rider/tasks');
      }
    } catch (error) {
      console.error('Error loading task:', error);
      toast({
        title: t('rider.error'),
        description: "Failed to load task details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (task?.customer_phone) {
      window.open(`tel:${task.customer_phone}`);
    }
  };

  const handleSMS = () => {
    if (task?.customer_phone) {
      const message = `Hello ${task.customer_name}, I am your Britium Express rider. I will be delivering your package #${task.task_code} soon.`;
      window.open(`sms:${task.customer_phone}?body=${encodeURIComponent(message)}`);
    }
  };

  const handleMap = () => {
    if (task) {
      const address = task.type === 'pickup' ? task.pickup_address : task.delivery_address;
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
    }
  };

  const handleStartTask = async () => {
    if (!task) return;
    
    try {
      setUpdating(true);
      const success = await RiderAPI.updateTaskStatus(task.id, 'in_progress');
      if (success) {
        setTask({ ...task, status: 'in_progress', started_at: new Date().toISOString() });
        toast({
          title: t('rider.success'),
          description: "Task started successfully",
        });
      }
    } catch (error) {
      toast({
        title: t('rider.error'),
        description: "Failed to start task",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteTask = () => {
    if (!task) return;
    
    if (task.type === 'delivery') {
      navigate(`/rider/delivery-confirm/${task.id}`);
    } else if (task.type === 'pickup') {
      navigate(`/rider/pickup-confirm/${task.id}`);
    }
  };

  const handleReportProblem = () => {
    if (task) {
      navigate(`/rider/exception/${task.id}`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'assigned':
        return 'text-warning';
      case 'in_progress':
        return 'text-info';
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-error text-white';
      case 'express':
        return 'bg-warning text-white';
      case 'normal':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gold-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-navy-600">Task not found</p>
          <Button onClick={() => navigate('/rider/tasks')} className="mt-4">
            {t('rider.back')}
          </Button>
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
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-navy-900">
                {t('rider.job')} #{task.task_code}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getPriorityColor(task.priority)}>
                  {t(`rider.${task.priority}`)}
                </Badge>
                <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                  {t(`rider.${task.status}`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Map Placeholder */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Interactive Map View</p>
              </div>
              <Button
                onClick={handleMap}
                className="absolute bottom-4 right-4 bg-white/90 text-navy-900 hover:bg-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t('rider.navigate')}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Customer Info */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gold-500" />
                <span>{t('rider.customer')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-navy-900">{task.customer_name}</h3>
                <p className="text-muted-foreground">{task.customer_phone}</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {task.type === 'pickup' ? task.pickup_address : task.delivery_address}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleCall} className="flex-1 bg-success hover:bg-success/90">
                  <Phone className="w-4 h-4 mr-2" />
                  {t('rider.phone')}
                </Button>
                <Button onClick={handleSMS} variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('rider.sms')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Package Details */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gold-500" />
                <span>{t('rider.packageDetails')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* COD Amount */}
              {task.cod_amount > 0 && (
                <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg border border-gold-200">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-gold-600" />
                    <span className="font-medium">{t('rider.cod')}</span>
                  </div>
                  <span className="text-xl font-bold text-gold-600">
                    {formatCurrency(task.cod_amount)}
                  </span>
                </div>
              )}

              {/* Delivery Fee */}
              {task.delivery_fee > 0 && (
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-success" />
                    <span className="font-medium">{t('rider.earnings')}</span>
                  </div>
                  <span className="text-lg font-bold text-success">
                    +{formatCurrency(task.delivery_fee)}
                  </span>
                </div>
              )}

              {/* SLA Time */}
              {task.sla_time && (
                <div className="flex items-center justify-between p-3 bg-info/10 rounded-lg border border-info/20">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-info" />
                    <span className="font-medium">{t('rider.time')}</span>
                  </div>
                  <span className="text-lg font-bold text-info">
                    {formatTime(task.sla_time)}
                  </span>
                </div>
              )}

              {/* Package Info */}
              <div className="grid grid-cols-2 gap-4">
                {task.weight_kg && (
                  <div className="flex items-center space-x-2">
                    <Weight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{task.weight_kg} kg</span>
                  </div>
                )}
                {task.dimensions && (
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{task.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              {task.is_fragile && (
                <div className="flex items-center space-x-2 p-3 bg-error/10 rounded-lg border border-error/20">
                  <AlertTriangle className="w-5 h-5 text-error" />
                  <span className="font-medium text-error">{t('rider.fragile')}</span>
                </div>
              )}

              {/* Notes */}
              {task.notes && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm mb-1">{t('rider.notes')}:</p>
                      <p className="text-sm text-muted-foreground">"{task.notes}"</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {task.special_instructions && (
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm mb-1">{t('rider.specialInstructions')}:</p>
                      <p className="text-sm text-warning">{task.special_instructions}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-2">
                {/* Problem Report Button */}
                <Button
                  onClick={handleReportProblem}
                  variant="outline"
                  className="col-span-1 bg-error/10 text-error border-error/20 hover:bg-error/20 py-6 flex flex-col items-center justify-center text-xs"
                >
                  <XCircle className="w-5 h-5 mb-1" />
                  {t('rider.problem')}
                </Button>

                {/* Main Action Button */}
                <Button
                  onClick={task.status === 'assigned' ? handleStartTask : handleCompleteTask}
                  disabled={updating || !['assigned', 'in_progress'].includes(task.status)}
                  className="col-span-3 py-6 text-lg font-bold shadow-lg"
                >
                  {updating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : task.status === 'assigned' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {task.type === 'delivery' ? t('rider.startDelivery') : t('rider.startPickup')}
                    </>
                  ) : task.status === 'in_progress' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {task.type === 'delivery' ? t('rider.confirmDelivery') : t('rider.confirmPickup')}
                    </>
                  ) : task.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {t('rider.completed')}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      {t('rider.failed')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task Timeline */}
        {(task.assigned_at || task.started_at || task.completed_at) && (
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gold-500" />
                  <span>{t('rider.timeline')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.assigned_at && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{t('rider.assigned')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(task.assigned_at).toLocaleString(language === 'my' ? 'my-MM' : 'en-MM')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {task.started_at && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{t('rider.started')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(task.started_at).toLocaleString(language === 'my' ? 'my-MM' : 'en-MM')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {task.completed_at && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{t('rider.completed')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(task.completed_at).toLocaleString(language === 'my' ? 'my-MM' : 'en-MM')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default JobDetailScreen;