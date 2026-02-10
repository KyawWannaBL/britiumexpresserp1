import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Package, 
  Truck, 
  ChevronLeft, 
  Save,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { ROUTE_PATHS } from '@/lib/index';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const pickupSchema = z.object({
  merchantId: z.string().min(1, 'Merchant selection is required'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(8, 'Valid phone number is required'),
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  packageWeight: z.string().min(1, 'Weight is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  notes: z.string().optional(),
});

type PickupFormValues = z.infer<typeof pickupSchema>;

const CreateDeliveryPickupPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PickupFormValues>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      merchantId: '',
      customerName: '',
      customerPhone: '',
      pickupAddress: '',
      deliveryAddress: '',
      packageWeight: '',
      serviceType: 'standard',
      notes: '',
    },
  });

  const onSubmit = async (data: PickupFormValues) => {
    if (!date) {
      toast.error('Please select a pickup date');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Pickup Scheduled:', { ...data, pickupDate: date });
    toast.success('Pickup request created successfully');
    setIsSubmitting(false);
    navigate(ROUTE_PATHS.WAY_MANAGEMENT);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 -ml-2 text-muted-foreground hover:text-primary"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-gold-400 font-display">
            {t('way.createDeliveryPickup')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule a new parcel pickup and delivery route
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            {t('common.cancel')}
          </Button>
          <Button 
            className="luxury-button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('common.confirm')}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-gold-400/20 shadow-xl">
              <CardHeader className="bg-navy-900 text-gold-400 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-500" />
                  {t('merchant.title')}
                </CardTitle>
                <CardDescription className="text-gold-200/70">
                  Select the originating merchant for this pickup
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="merchantId">{t('merchant.name')}</Label>
                    <Select onValueChange={(v) => form.setValue('merchantId', v)}>
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="Search Merchant..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m1">Golden Lotus Boutique</SelectItem>
                        <SelectItem value="m2">Yangon Tech Hub</SelectItem>
                        <SelectItem value="m3">Mandalay Silk House</SelectItem>
                        <SelectItem value="m4">Direct Walk-in Customer</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.merchantId && (
                      <p className="text-xs text-destructive">{form.formState.errors.merchantId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">{t('order.serviceType')}</Label>
                    <Select 
                      defaultValue="standard"
                      onValueChange={(v) => form.setValue('serviceType', v)}
                    >
                      <SelectTrigger className="input-modern">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Delivery</SelectItem>
                        <SelectItem value="express">Express (Same Day)</SelectItem>
                        <SelectItem value="nextday">Next Day Delivery</SelectItem>
                        <SelectItem value="economy">Economy Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-gold-400/20 shadow-xl">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <MapPin className="w-5 h-5 text-gold-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('order.pickupAddress')}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea 
                        placeholder="Detailed pickup location..."
                        className="pl-10 input-modern min-h-[80px]"
                        {...form.register('pickupAddress')}
                      />
                    </div>
                    {form.formState.errors.pickupAddress && (
                      <p className="text-xs text-destructive">{form.formState.errors.pickupAddress.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{t('order.deliveryAddress')}</Label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea 
                        placeholder="Recipient's full address..."
                        className="pl-10 input-modern min-h-[80px]"
                        {...form.register('deliveryAddress')}
                      />
                    </div>
                    {form.formState.errors.deliveryAddress && (
                      <p className="text-xs text-destructive">{form.formState.errors.deliveryAddress.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-gold-400/20 shadow-xl">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-navy-900">
                  <Package className="w-5 h-5 text-gold-600" />
                  {t('order.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('order.customer')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10 input-modern" 
                        placeholder="Customer Name"
                        {...form.register('customerName')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('order.amount')} (COD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Ks</span>
                      <Input 
                        className="pl-10 input-modern" 
                        type="number"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('order.weight')} (kg)</Label>
                    <Input 
                      className="input-modern" 
                      placeholder="e.g. 2.5"
                      {...form.register('packageWeight')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('order.priority')}</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="input-modern">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Standard</SelectItem>
                        <SelectItem value="low">Economy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('order.specialInstructions')}</Label>
                  <Textarea 
                    className="input-modern"
                    placeholder="Fragile items, call before arrival, etc."
                    {...form.register('notes')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar / Scheduling Area */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-gold-400/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-gold-500 text-navy-900">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Pickup Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal input-modern",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select defaultValue="slot1">
                    <SelectTrigger className="input-modern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slot1">Morning (09:00 - 12:00)</SelectItem>
                      <SelectItem value="slot2">Afternoon (13:00 - 17:00)</SelectItem>
                      <SelectItem value="slot3">Evening (18:00 - 21:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-navy-50 rounded-xl border border-navy-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-navy-700 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-navy-900">Pickup Confirmation</p>
                      <p className="text-xs text-muted-foreground">
                        Our rider will call the merchant 30 minutes before arrival at the pickup location.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-navy-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Weight</span>
                    <span className="font-semibold">{form.watch('packageWeight') || '0'} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Fee</span>
                    <span className="font-semibold">2,500 Ks</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Charge</span>
                    <span className="font-semibold">500 Ks</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-navy-900 font-bold">Total Fee</span>
                    <span className="text-gold-600 font-bold text-xl">3,000 Ks</span>
                  </div>
                  
                  <Button 
                    className="w-full luxury-button mt-4 h-12"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('common.loading') : t('way.createDeliveryPickup')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeliveryPickupPage;
