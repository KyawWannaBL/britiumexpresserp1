import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Bike, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Save, 
  Info,
  Truck,
  CreditCard,
  Phone,
  Mail,
  Lock,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

// Custom Zod resolver to fix TS2307 when @hook-form/resolvers is unavailable
const zodResolver = (schema: z.ZodSchema) => async (values: any) => {
  const result = await schema.safeParseAsync(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  const errors = result.error.issues.reduce((acc: any, issue) => {
    acc[issue.path.join('.')] = {
      message: issue.message,
      type: issue.code,
    };
    return acc;
  }, {});
  return { values: {}, errors };
};

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(9, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  nidNumber: z.string().min(5, 'NID/ID number is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehiclePlate: z.string().min(1, 'Plate number is required'),
  branch: z.string().min(1, 'Branch assignment is required'),
  zone: z.string().min(1, 'Zone assignment is required'),
  employmentStatus: z.string().default('full-time'),
  status: z.string().default('active'),
});

const AddNewDeliverymanPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      nidNumber: '',
      vehicleType: '',
      vehiclePlate: '',
      branch: '',
      zone: '',
      employmentStatus: 'full-time',
      status: 'active',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Registering deliveryman:', values);
    toast.success(language === 'my' ? 'ပို့ဆောင်သူအသစ်ကို အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ' : 'Deliveryman registered successfully');
    navigate(ROUTE_PATHS.DELIVERYMAN_LIST);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <motion.div 
        className="bg-navy-950 text-white py-12 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.smooth}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-600 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="ghost" 
            className="text-gold-400 hover:text-gold-300 hover:bg-white/10 mb-6"
            onClick={() => navigate(ROUTE_PATHS.DELIVERYMAN_LIST)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                <UserPlus className="h-10 w-10 text-gold-500" />
                <span className="font-myanmar">{t('deliveryman.addNew')}</span>
              </h1>
              <p className="text-navy-200 mt-2 max-w-2xl font-myanmar">
                {language === 'my' 
                  ? 'စနစ်အတွင်းသို့ ပို့ဆောင်သူအသစ်များကို အချက်အလက်အပြည့်အစုံဖြင့် မှတ်ပုံတင်ပါ'
                  : 'Register new delivery personnel with personal details, vehicle info, and zone assignments.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 -mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Column 1: Personal Details */}
              <motion.div variants={staggerItem}>
                <Card className="lotus-card border-none">
                  <CardHeader>
                    <CardTitle className="text-gold-500 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      {language === 'my' ? 'ကိုယ်ရေးအချက်အလက်' : 'Personal Details'}
                    </CardTitle>
                    <CardDescription className="text-navy-200">
                      {language === 'my' ? 'အခြေခံ အချက်အလက်များနှင့် လုံခြုံရေး' : 'Basic information and security settings'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t('deliveryman.name')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserPlus className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
                              <Input className="pl-10 bg-white/5 border-white/10 text-white" placeholder="John Doe" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t('deliveryman.phone')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
                              <Input className="pl-10 bg-white/5 border-white/10 text-white" placeholder="+95 9..." {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t('merchant.email')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
                              <Input className="pl-10 bg-white/5 border-white/10 text-white" placeholder="rider@britium.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{language === 'my' ? 'စကားဝှက်' : 'Password'}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
                              <Input type="password" className="pl-10 bg-white/5 border-white/10 text-white" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nidNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{language === 'my' ? 'မှတ်ပုံတင် နံပါတ်' : 'NID / National ID'}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
                              <Input className="pl-10 bg-white/5 border-white/10 text-white" placeholder="12/YGN(N)123456" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Column 2: Vehicle & Operational */}
              <motion.div variants={staggerItem}>
                <Card className="lotus-card border-none h-full">
                  <CardHeader>
                    <CardTitle className="text-gold-500 flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {language === 'my' ? 'ယာဉ်နှင့် လုပ်ငန်းဆိုင်ရာ' : 'Vehicle & Operations'}
                    </CardTitle>
                    <CardDescription className="text-navy-200">
                      {language === 'my' ? 'ယာဉ်အချက်အလက်နှင့် တာဝန်ကျနေရာများ' : 'Vehicle details and assignment settings'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="vehicleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t('deliveryman.vehicle')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-navy-900 border-gold-500/30 text-white">
                              <SelectItem value="motorcycle">{language === 'my' ? 'ဆိုင်ကယ်' : 'Motorcycle'}</SelectItem>
                              <SelectItem value="van">{language === 'my' ? 'ဗင်န်ကား' : 'Van'}</SelectItem>
                              <SelectItem value="truck">{language === 'my' ? 'ကုန်တင်ကား' : 'Truck'}</SelectItem>
                              <SelectItem value="bicycle">{language === 'my' ? 'စက်ဘီး' : 'Bicycle'}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehiclePlate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{language === 'my' ? 'ယာဉ်အမှတ်' : 'License Plate'}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Bike className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
                              <Input className="pl-10 bg-white/5 border-white/10 text-white" placeholder="YGN-1234" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator className="bg-white/10 my-4" />
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{language === 'my' ? 'ရုံးခွဲ' : 'Branch'}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Assign to branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-navy-900 border-gold-500/30 text-white">
                              <SelectItem value="ygn-main">Yangon Main Station</SelectItem>
                              <SelectItem value="mdy-main">Mandalay Main Station</SelectItem>
                              <SelectItem value="npt-main">Naypyidaw Station</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t('deliveryman.zone')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select primary zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-navy-900 border-gold-500/30 text-white">
                              <SelectItem value="dagon">Dagon</SelectItem>
                              <SelectItem value="bahan">Bahan</SelectItem>
                              <SelectItem value="latha">Latha</SelectItem>
                              <SelectItem value="kamayut">Kamayut</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Column 3: Summary & Submit */}
              <motion.div variants={staggerItem}>
                <div className="space-y-6">
                  <Card className="lotus-card border-none">
                    <CardHeader>
                      <CardTitle className="text-gold-500 flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {language === 'my' ? 'အလုပ်ခန့်ထားမှု' : 'Employment Status'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="employmentStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{language === 'my' ? 'အလုပ်အမျိုးအစား' : 'Employment Type'}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-navy-900 border-gold-500/30 text-white">
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contractor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t('deliveryman.status')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-navy-900 border-gold-500/30 text-white">
                                <SelectItem value="active">{t('common.active')}</SelectItem>
                                <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gold-500/10 border border-gold-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 text-gold-400 mb-6">
                        <Info className="h-5 w-5 shrink-0 mt-0.5" />
                        <p className="text-sm">
                          {language === 'my' 
                            ? 'အချက်အလက်အားလုံး မှန်ကန်ကြောင်း သေချာပါစေ။ အကောင့်ဖွင့်ပြီးပါက ပို့ဆောင်သူထံသို့ အကြောင်းကြားချက် ပေးပို့သွားမည် ဖြစ်ပါသည်။'
                            : 'Ensure all details are correct. Upon registration, the deliveryman will receive an automated notification with login credentials.'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
                          onClick={() => navigate(ROUTE_PATHS.DELIVERYMAN_LIST)}
                        >
                          {t('common.cancel')}
                        </Button>
                        <Button 
                          type="submit" 
                          className="luxury-button"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {t('common.save')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </div>

      <footer className="container mx-auto px-4 mt-20 text-center text-muted-foreground text-sm">
        <p>© 2026 Britium Express Logistics System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddNewDeliverymanPage;