import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Users,
  Bell,
  Clock,
  Info,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Mail,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const SendMessagePage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipientGroup: 'all',
    deliveryMethods: {
      push: true,
      sms: false,
      email: false,
    },
    schedule: 'immediate',
    scheduledTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error(t('common.error'), {
        description: 'Please fill in all required fields.'
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    toast.success(t('common.success'), {
      description: 'Broadcast message has been sent successfully.'
    });
    navigate(ROUTE_PATHS.BROADCAST_MESSAGE_HISTORY);
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 hover:bg-transparent text-gold-600"
              onClick={() => navigate(ROUTE_PATHS.BROADCAST_MESSAGES)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('common.back')}
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-gold-400 flex items-center gap-3">
            <Send className="w-8 h-8" />
            {t('broadcast.sendMessage')}
          </h1>
          <p className="text-muted-foreground">
            Compose and broadcast notifications to your network
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-navy-950/5">
            <CardHeader className="border-b border-border/40 bg-navy-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold-600" />
                {t('broadcast.messageContent')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('common.title') || 'Message Title'}</Label>
                <Input
                  id="title"
                  placeholder="e.g., Important System Update"
                  className="input-modern"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t('broadcast.messageContent')}</Label>
                <Textarea
                  id="content"
                  placeholder="Type your message here..."
                  className="min-h-[200px] input-modern"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Recommended message length: 10-500 characters.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="border-b border-border/40 bg-navy-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-600" />
                Scheduling Options
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Send Schedule</Label>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant={formData.schedule === 'immediate' ? 'default' : 'outline'}
                      className={formData.schedule === 'immediate' ? 'bg-navy-900 text-gold-400' : ''}
                      onClick={() => setFormData({ ...formData, schedule: 'immediate' })}
                    >
                      Send Immediately
                    </Button>
                    <Button
                      variant={formData.schedule === 'scheduled' ? 'default' : 'outline'}
                      className={formData.schedule === 'scheduled' ? 'bg-navy-900 text-gold-400' : ''}
                      onClick={() => setFormData({ ...formData, schedule: 'scheduled' })}
                    >
                      Schedule for Later
                    </Button>
                  </div>
                </div>

                {formData.schedule === 'scheduled' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="scheduledTime">Scheduled Date & Time</Label>
                    <Input
                      id="scheduledTime"
                      type="datetime-local"
                      className="input-modern"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="border-b border-border/40 bg-navy-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-600" />
                {t('broadcast.recipients')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>{t('common.select')} Group</Label>
                <Select 
                  value={formData.recipientGroup} 
                  onValueChange={(val) => setFormData({ ...formData, recipientGroup: val })}
                >
                  <SelectTrigger className="input-modern">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('broadcast.allUsers')}</SelectItem>
                    <SelectItem value="merchants">{t('broadcast.merchants')}</SelectItem>
                    <SelectItem value="deliverymen">{t('broadcast.deliverymen')}</SelectItem>
                    <SelectItem value="customers">{t('broadcast.customers')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <Label>Delivery Methods</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-navy-50/30 p-3 rounded-lg border border-border/20">
                    <Checkbox 
                      id="push" 
                      checked={formData.deliveryMethods.push}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        deliveryMethods: { ...formData.deliveryMethods, push: checked as boolean }
                      })}
                    />
                    <label htmlFor="push" className="flex flex-1 items-center gap-3 cursor-pointer">
                      <Smartphone className="w-4 h-4 text-navy-700" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Push Notification</span>
                        <span className="text-xs text-muted-foreground">In-app & Mobile OS</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 bg-navy-50/30 p-3 rounded-lg border border-border/20">
                    <Checkbox 
                      id="sms"
                      checked={formData.deliveryMethods.sms}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        deliveryMethods: { ...formData.deliveryMethods, sms: checked as boolean }
                      })}
                    />
                    <label htmlFor="sms" className="flex flex-1 items-center gap-3 cursor-pointer">
                      <MessageSquare className="w-4 h-4 text-navy-700" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">SMS Text Message</span>
                        <span className="text-xs text-muted-foreground">Carrier charges apply</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 bg-navy-50/30 p-3 rounded-lg border border-border/20">
                    <Checkbox 
                      id="email"
                      checked={formData.deliveryMethods.email}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        deliveryMethods: { ...formData.deliveryMethods, email: checked as boolean }
                      })}
                    />
                    <label htmlFor="email" className="flex flex-1 items-center gap-3 cursor-pointer">
                      <Mail className="w-4 h-4 text-navy-700" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Email Broadcast</span>
                        <span className="text-xs text-muted-foreground">Rich text support</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-gold-50/50">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gold-900">
                <AlertCircle className="w-4 h-4" />
                Final Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gold-800">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-success" />
                Targeting {formData.recipientGroup === 'all' ? 'All Active Users' : formData.recipientGroup}
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-success" />
                Sending via {Object.entries(formData.deliveryMethods).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(', ')}
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-success" />
                {formData.schedule === 'immediate' ? 'Immediate Delivery' : `Scheduled for ${formData.scheduledTime || 'unspecified'}`}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full luxury-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading') : t('broadcast.sendMessage')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground border-t border-border/40">
        © 2026 Britium Express Logistics System. All rights reserved.
      </div>
    </div>
  );
};

export default SendMessagePage;