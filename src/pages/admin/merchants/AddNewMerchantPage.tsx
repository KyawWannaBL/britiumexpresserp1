import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Save, 
  X, 
  ChevronRight,
  Globe,
  ShieldCheck,
  Truck,
  Briefcase
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { ROUTE_PATHS } from '@/lib/index';
import { useTranslation } from '@/lib/translations';
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { springPresets, fadeInUp, staggerContainer } from '@/lib/motion';

const AddNewMerchantPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('business');

  const handleCancel = () => {
    navigate(ROUTE_PATHS.MERCHANT_LIST);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'en' ? "Success" : "အောင်မြင်ပါသည်",
      description: language === 'en' ? "Merchant has been registered successfully." : "ကုန်သည်ကို အောင်မြင်စွာ မှတ်ပုံတင်ပြီးပါပြီ။",
    });
    navigate(ROUTE_PATHS.MERCHANT_LIST);
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 font-sans">
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={staggerContainer} 
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className={`text-3xl font-bold tracking-tight text-navy-900 ${language === 'my' ? 'font-myanmar' : ''}`}>
              {t('merchant.addNew')}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' ? 'Register a new business partner to our logistics network.' : 'ကျွန်ုပ်တို့၏ လော်ဂျစ်တစ် ကွန်ရက်သို့ စီးပွားရေးမိတ်ဖက်အသစ်ကို မှတ်ပုံတင်ပါ။'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancel} className="border-navy-200">
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button className="luxury-button" onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </Button>
          </div>
        </motion.div>

        <Separator className="bg-gold-500/20" />

        {/* Main Form Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-navy-50/50 p-1 border border-navy-100">
              <TabsTrigger value="business" className="data-[state=active]:bg-navy-900 data-[state=active]:text-gold-400">
                <Building2 className="mr-2 h-4 w-4" />
                <span className={language === 'my' ? 'font-myanmar' : ''}>
                  {language === 'en' ? 'Business Details' : 'လုပ်ငန်း အသေးစိတ်'}
                </span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-navy-900 data-[state=active]:text-gold-400">
                <User className="mr-2 h-4 w-4" />
                <span className={language === 'my' ? 'font-myanmar' : ''}>
                  {language === 'en' ? 'Contact Info' : 'ဆက်သွယ်ရန် အချက်အလက်'}
                </span>
              </TabsTrigger>
              <TabsTrigger value="banking" className="data-[state=active]:bg-navy-900 data-[state=active]:text-gold-400">
                <CreditCard className="mr-2 h-4 w-4" />
                <span className={language === 'my' ? 'font-myanmar' : ''}>
                  {language === 'en' ? 'Banking & Payments' : 'ဘဏ်လုပ်ငန်းနှင့် ငွေပေးချေမှု'}
                </span>
              </TabsTrigger>
              <TabsTrigger value="config" className="data-[state=active]:bg-navy-900 data-[state=active]:text-gold-400">
                <Briefcase className="mr-2 h-4 w-4" />
                <span className={language === 'my' ? 'font-myanmar' : ''}>
                  {language === 'en' ? 'Service Setup' : 'ဝန်ဆောင်မှု သတ်မှတ်ချက်'}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit}>
            <TabsContent value="business" className="mt-0">
              <motion.div variants={fadeInUp}>
                <Card className="lotus-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gold-400 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {language === 'en' ? 'General Business Information' : 'အထွေထွေ လုပ်ငန်းအချက်အလက်'}
                    </CardTitle>
                    <CardDescription className="text-navy-200">
                      {language === 'en' ? 'Basic identification and legal details for the merchant account.' : 'ကုန်သည်အကောင့်အတွက် အခြေခံအထောက်အထားနှင့် ဥပဒေဆိုင်ရာ အသေးစိတ်အချက်အလက်များ။'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="merchantName" className="text-gold-300">{t('merchant.name')} *</Label>
                      <Input id="merchantName" placeholder="e.g. Britium Global Store" className="bg-white/10 border-gold-400/30 text-white placeholder:text-white/30" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="merchantCode" className="text-gold-300">{language === 'en' ? 'Merchant Code' : 'ကုန်သည် ကုဒ်'}</Label>
                      <Input id="merchantCode" placeholder="e.g. MER-2026-001" className="bg-white/10 border-gold-400/30 text-white placeholder:text-white/30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-gold-300">{language === 'en' ? 'Business Type' : 'လုပ်ငန်းအမျိုးအစား'}</Label>
                      <Select defaultValue="retail">
                        <SelectTrigger className="bg-white/10 border-gold-400/30 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail / E-commerce</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regNo" className="text-gold-300">{language === 'en' ? 'Registration Number' : 'မှတ်ပုံတင်အမှတ်'}</Label>
                      <Input id="regNo" placeholder="DICA Registration No." className="bg-white/10 border-gold-400/30 text-white placeholder:text-white/30" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description" className="text-gold-300">{language === 'en' ? 'About Business' : 'လုပ်ငန်းအကြောင်း'}</Label>
                      <Textarea id="description" className="bg-white/10 border-gold-400/30 text-white placeholder:text-white/30 min-h-[100px]" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="button" onClick={() => setActiveTab('contact')} className="bg-gold-500 hover:bg-gold-600 text-navy-900">
                      {t('common.next')} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="contact" className="mt-0">
              <motion.div variants={fadeInUp}>
                <Card className="lotus-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gold-400 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {language === 'en' ? 'Contact Information' : 'ဆက်သွယ်ရန် အချက်အလက်များ'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-gold-300">{language === 'en' ? 'Contact Person' : 'ဆက်သွယ်ရန် ပုဂ္ဂိုလ်'} *</Label>
                      <Input id="contactName" className="bg-white/10 border-gold-400/30 text-white" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gold-300">{t('merchant.email')} *</Label>
                      <Input id="email" type="email" className="bg-white/10 border-gold-400/30 text-white" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gold-300">{t('merchant.phone')} *</Label>
                      <Input id="phone" className="bg-white/10 border-gold-400/30 text-white font-mono" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryPhone" className="text-gold-300">{language === 'en' ? 'Secondary Phone' : 'အခြားဖုန်းနံပါတ်'}</Label>
                      <Input id="secondaryPhone" className="bg-white/10 border-gold-400/30 text-white font-mono" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address" className="text-gold-300">{t('merchant.address')} *</Label>
                      <Textarea id="address" className="bg-white/10 border-gold-400/30 text-white" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gold-300">{language === 'en' ? 'City / State' : 'မြို့ / ပြည်နယ်'}</Label>
                      <Select defaultValue="yangon">
                        <SelectTrigger className="bg-white/10 border-gold-400/30 text-white">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yangon">Yangon</SelectItem>
                          <SelectItem value="mandalay">Mandalay</SelectItem>
                          <SelectItem value="naypyitaw">Naypyitaw</SelectItem>
                          <SelectItem value="taunggyi">Taunggyi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="township" className="text-gold-300">{language === 'en' ? 'Township' : 'မြို့နယ်'}</Label>
                      <Input id="township" className="bg-white/10 border-gold-400/30 text-white" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('business')} className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10">
                      {t('common.previous')}
                    </Button>
                    <Button type="button" onClick={() => setActiveTab('banking')} className="bg-gold-500 hover:bg-gold-600 text-navy-900">
                      {t('common.next')} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="banking" className="mt-0">
              <motion.div variants={fadeInUp}>
                <Card className="lotus-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gold-400 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {language === 'en' ? 'Financial & Settlement Info' : 'ငွေကြေးနှင့် အခြေချမှု အချက်အလက်'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="text-gold-300">{language === 'en' ? 'Bank Name' : 'ဘဏ်အမည်'}</Label>
                      <Select defaultValue="kbz">
                        <SelectTrigger className="bg-white/10 border-gold-400/30 text-white">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kbz">KBZ Bank</SelectItem>
                          <SelectItem value="aya">AYA Bank</SelectItem>
                          <SelectItem value="cb">CB Bank</SelectItem>
                          <SelectItem value="yoma">Yoma Bank</SelectItem>
                          <SelectItem value="kbzpay">KBZPay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountName" className="text-gold-300">{language === 'en' ? 'Account Holder Name' : 'အကောင့်ပိုင်ရှင်အမည်'}</Label>
                      <Input id="accountName" className="bg-white/10 border-gold-400/30 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-gold-300">{language === 'en' ? 'Account / Wallet Number' : 'အကောင့် / ဝေါလက် နံပါတ်'}</Label>
                      <Input id="accountNumber" className="bg-white/10 border-gold-400/30 text-white font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentFrequency" className="text-gold-300">{language === 'en' ? 'Payment Cycle' : 'ငွေပေးချေမှု သံသရာ'}</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="bg-white/10 border-gold-400/30 text-white">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 p-4 rounded-lg bg-gold-500/5 border border-gold-400/20">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-gold-400 mt-1" />
                        <p className="text-sm text-gold-200/80">
                          {language === 'en' 
                            ? 'Verified bank accounts ensure faster COD settlements and automatic invoicing.' 
                            : 'အတည်ပြုထားသော ဘဏ်အကောင့်များသည် COD အခြေချမှုများကို ပိုမိုမြန်ဆန်စေပြီး အလိုအလျောက် ငွေတောင်းခံလွှာထုတ်ခြင်းကို သေချာစေသည်။'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('contact')} className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10">
                      {t('common.previous')}
                    </Button>
                    <Button type="button" onClick={() => setActiveTab('config')} className="bg-gold-500 hover:bg-gold-600 text-navy-900">
                      {t('common.next')} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="config" className="mt-0">
              <motion.div variants={fadeInUp}>
                <Card className="lotus-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-gold-400 flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {language === 'en' ? 'Logistics Configuration' : 'လော်ဂျစ်တစ် သတ်မှတ်ချက်'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pricingPackage" className="text-gold-300">{language === 'en' ? 'Pricing Package' : 'စျေးနှုန်း အစီအစဉ်'}</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger className="bg-white/10 border-gold-400/30 text-white">
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Tier (Normal)</SelectItem>
                          <SelectItem value="premium">Premium Tier (Priority)</SelectItem>
                          <SelectItem value="enterprise">Enterprise Tier (Custom)</SelectItem>
                          <SelectItem value="startup">Startup Tier (Promotional)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commission" className="text-gold-300">{language === 'en' ? 'Commission Rate (%)' : 'ကော်မရှင်နှုန်း (%)'}</Label>
                      <Input id="commission" type="number" defaultValue="5" className="bg-white/10 border-gold-400/30 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch" className="text-gold-300">{language === 'en' ? 'Assign to Branch' : 'ဒါနခွဲ သတ်မှတ်ရန်'}</Label>
                      <Select defaultValue="yangon-hq">
                        <SelectTrigger className="bg-white/10 border-gold-400/30 text-white">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yangon-hq">Yangon HQ</SelectItem>
                          <SelectItem value="mandalay-hub">Mandalay Hub</SelectItem>
                          <SelectItem value="naypyitaw-station">Naypyitaw Station</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupType" className="text-gold-300">{language === 'en' ? 'Default Pickup Type' : 'ပုံသေကောက်ယူမှုအမျိုးအစား'}</Label>
                      <Select defaultValue="home">
                        <SelectTrigger className="bg-white/10 border-gold-400/30 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home/Warehouse Pickup</SelectItem>
                          <SelectItem value="dropoff">Station Drop-off</SelectItem>
                          <SelectItem value="scheduled">Scheduled Daily Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('banking')} className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10">
                      {t('common.previous')}
                    </Button>
                    <Button type="submit" className="luxury-button px-8">
                      <Save className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Finalize Registration' : 'မှတ်ပုံတင်ခြင်း အပြီးသတ်ရန်'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          </form>
        </Tabs>

        {/* Help Banner */}
        <motion.div 
          variants={fadeInUp}
          className="p-4 rounded-xl bg-navy-50 border border-navy-100 flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-full bg-gold-500/10 flex items-center justify-center">
            <Globe className="h-6 w-6 text-gold-600" />
          </div>
          <div>
            <h4 className="font-semibold text-navy-900">{language === 'en' ? 'Need Help?' : 'အကူအညီ လိုအပ်ပါသလား?'}</h4>
            <p className="text-sm text-navy-600">
              {language === 'en' 
                ? 'Contact our Merchant Relations team at +95 9 123 456 789 for onboarding support.' 
                : 'စတင်အသုံးပြုမှု အကူအညီအတွက် ကျွန်ုပ်တို့၏ ကုန်သည်ဆက်ဆံရေးအဖွဲ့ထံ +၉၅ ၉ ၁၂၃ ၄၅၆ ၇၈၉ သို့ ဆက်သွယ်ပါ။'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddNewMerchantPage;