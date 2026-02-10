import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Printer,
  Save,
  Package,
  User,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  QrCode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { useTranslation } from '@/lib/translations';
import { useLanguageContext } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { springPresets, fadeInUp } from '@/lib/motion';

const InOfficeReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverCity: 'Yangon',
    serviceType: 'express',
    weight: '1',
    codAmount: '0',
    paymentMethod: 'cash',
    notes: '',
    dimensions: { l: '', w: '', h: '' }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const baseRate = formData.serviceType === 'express' ? 3500 : 2500;
    const weightCharge = Math.max(0, (parseFloat(formData.weight) || 1) - 1) * 1000;
    return baseRate + weightCharge;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      const trackingId = `BRT${Math.floor(Math.random() * 90000000 + 10000000)}`;
      const finalData = {
        ...formData,
        trackingId,
        totalFee: calculateTotal(),
        timestamp: new Date().toLocaleString(),
        branch: 'Yangon Main Office'
      };
      setReceiptData(finalData);
      setIsSubmitting(false);
      setShowReceipt(true);
      toast.success(t('common.success'));
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewReceive = () => {
    setShowReceipt(false);
    setFormData({
      senderName: '',
      senderPhone: '',
      senderAddress: '',
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      receiverCity: 'Yangon',
      serviceType: 'express',
      weight: '1',
      codAmount: '0',
      paymentMethod: 'cash',
      notes: '',
      dimensions: { l: '', w: '', h: '' }
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(ROUTE_PATHS.WAY_MANAGEMENT)}
            className="rounded-full hover:bg-navy-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-navy-950 tracking-tight myanmar-text">
              {t('way.inOfficeReceive')}
            </h1>
            <p className="text-muted-foreground myanmar-text">
              {language === 'en' ? 'Process walk-in customers and create new shipments instantly.' : 'လာရောက်အပ်နှံသော ပါဆယ်များကို လက်ခံပြီး အသစ်ဖန်တီးပါ။'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 border-gold-400 text-gold-600 bg-gold-50">
            Yangon Main Branch
          </Badge>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!showReceipt ? (
          <motion.div 
            key="form"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form Column */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              {/* Sender Details */}
              <Card className="lotus-card overflow-hidden">
                <CardHeader className="bg-navy-900/5">
                  <CardTitle className="flex items-center gap-2 text-navy-900 myanmar-text">
                    <User className="h-5 w-5 text-gold-500" />
                    {language === 'en' ? 'Sender Information' : 'ပေးပို့သူ အချက်အလက်'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label>{t('merchant.name')}</Label>
                    <Input 
                      name="senderName" 
                      required 
                      placeholder="John Doe" 
                      value={formData.senderName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('merchant.phone')}</Label>
                    <Input 
                      name="senderPhone" 
                      required 
                      placeholder="09123456789" 
                      value={formData.senderPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>{t('merchant.address')}</Label>
                    <Textarea 
                      name="senderAddress" 
                      required 
                      placeholder="No. 123, Street Name..." 
                      value={formData.senderAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Receiver Details */}
              <Card className="lotus-card overflow-hidden">
                <CardHeader className="bg-navy-900/5">
                  <CardTitle className="flex items-center gap-2 text-navy-900 myanmar-text">
                    <MapPin className="h-5 w-5 text-gold-500" />
                    {language === 'en' ? 'Receiver Information' : 'လက်ခံသူ အချက်အလက်'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label>{t('deliveryman.name')}</Label>
                    <Input 
                      name="receiverName" 
                      required 
                      placeholder="Jane Doe" 
                      value={formData.receiverName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('deliveryman.phone')}</Label>
                    <Input 
                      name="receiverPhone" 
                      required 
                      placeholder="09987654321" 
                      value={formData.receiverPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('tracking.location')} (City)</Label>
                    <Select 
                      value={formData.receiverCity} 
                      onValueChange={(v) => setFormData(p => ({...p, receiverCity: v}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yangon">Yangon</SelectItem>
                        <SelectItem value="Mandalay">Mandalay</SelectItem>
                        <SelectItem value="Naypyidaw">Naypyidaw</SelectItem>
                        <SelectItem value="Taunggyi">Taunggyi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>{t('order.deliveryAddress')}</Label>
                    <Textarea 
                      name="receiverAddress" 
                      required 
                      placeholder="House No, Block, Street..." 
                      value={formData.receiverAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Parcel Details */}
              <Card className="lotus-card overflow-hidden">
                <CardHeader className="bg-navy-900/5">
                  <CardTitle className="flex items-center gap-2 text-navy-900 myanmar-text">
                    <Package className="h-5 w-5 text-gold-500" />
                    {language === 'en' ? 'Parcel Information' : 'ပါဆယ် အချက်အလက်'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label>{t('order.serviceType')}</Label>
                    <Select 
                      value={formData.serviceType} 
                      onValueChange={(v) => setFormData(p => ({...p, serviceType: v}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="express">Express (Next Day)</SelectItem>
                        <SelectItem value="standard">Standard (2-3 Days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('order.weight')} (kg)</Label>
                    <Input 
                      name="weight" 
                      type="number" 
                      step="0.1" 
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('order.codAmount')} (MMK)</Label>
                    <Input 
                      name="codAmount" 
                      type="number" 
                      value={formData.codAmount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label>{t('order.specialInstructions')}</Label>
                    <Input 
                      name="notes" 
                      placeholder="Fragile, don't drop, etc."
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </form>

            {/* Summary Column */}
            <div className="space-y-6">
              <Card className="lotus-card sticky top-8">
                <CardHeader>
                  <CardTitle className="text-navy-900 myanmar-text">
                    {t('common.total')}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Pricing breakdown based on weight and service.' : 'အလေးချိန်နှင့် ဝန်ဆောင်မှုအပေါ် မူတည်၍ တွက်ချက်ထားသည်။'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('common.subtotal')}</span>
                    <span className="font-mono">{calculateTotal().toLocaleString()} MMK</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('common.tax')} (0%)</span>
                    <span className="font-mono">0 MMK</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-navy-900">{t('common.total')}</span>
                    <span className="text-2xl font-bold text-gold-600 font-mono">
                      {calculateTotal().toLocaleString()} MMK
                    </span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Label>{language === 'en' ? 'Payment Status' : 'ငွေပေးချေမှု အခြေအနေ'}</Label>
                    <Select 
                      value={formData.paymentMethod} 
                      onValueChange={(v) => setFormData(p => ({...p, paymentMethod: v}))}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash Paid</SelectItem>
                        <SelectItem value="kpay">KPay Paid</SelectItem>
                        <SelectItem value="receiver_pay">Receiver Pays (COD Fee)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    className="w-full luxury-button h-12 text-lg"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? t('common.loading') : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        {language === 'en' ? 'Process Shipment' : 'ပါဆယ်ပို့ဆောင်မှု အတည်ပြုရန်'}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleNewReceive}>
                    {t('common.reset')}
                  </Button>
                </CardFooter>
              </Card>

              <div className="p-6 rounded-2xl bg-navy-50 border border-navy-100 flex items-start gap-3">
                <FileText className="h-6 w-6 text-navy-400 mt-1" />
                <p className="text-xs text-navy-600 leading-relaxed">
                  {language === 'en' 
                    ? "By processing this shipment, you confirm that the parcel content complies with Britium Express safety policies. Digital receipt will be generated automatically."
                    : "ဤပါဆယ်ကို လက်ခံခြင်းဖြင့် Britium Express ၏ ဘေးကင်းလုံခြုံရေး မူဝါဒများကို လိုက်နာကြောင်း အတည်ပြုပါသည်။ ငွေလက်ခံဖြတ်ပိုင်းကို အလိုအလျောက် ထုတ်ပေးမည်ဖြစ်ပါသည်။"}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="receipt"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-navy-900 shadow-2xl relative overflow-hidden">
              {/* Receipt Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-navy-900 via-gold-500 to-navy-900" />
              
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-gold-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-navy-900 font-display uppercase tracking-widest">
                  Britium Express
                </CardTitle>
                <p className="text-sm text-muted-foreground">Official Digital Receipt</p>
              </CardHeader>

              <CardContent className="space-y-6 pt-4">
                <div className="flex justify-between items-start border-y border-dashed py-4 border-navy-200">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Tracking Number</p>
                    <p className="text-lg font-bold font-mono text-navy-950">{receiptData?.trackingId}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Date & Time</p>
                    <p className="text-sm font-medium">{receiptData?.timestamp}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-navy-400 uppercase">From</h4>
                    <div>
                      <p className="font-bold">{receiptData?.senderName}</p>
                      <p className="text-sm text-muted-foreground">{receiptData?.senderPhone}</p>
                      <p className="text-xs leading-tight mt-1">{receiptData?.senderAddress}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-navy-400 uppercase">To</h4>
                    <div>
                      <p className="font-bold">{receiptData?.receiverName}</p>
                      <p className="text-sm text-muted-foreground">{receiptData?.receiverPhone}</p>
                      <p className="text-xs leading-tight mt-1">{receiptData?.receiverAddress}, {receiptData?.receiverCity}</p>
                    </div>
                  </div>
                </div>

                <Separator className="border-navy-100" />

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-navy-400 uppercase">Shipment Details</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-navy-50 p-3 rounded-lg">
                      <p className="text-[10px] text-navy-400 uppercase">Weight</p>
                      <p className="text-sm font-bold">{receiptData?.weight} KG</p>
                    </div>
                    <div className="bg-navy-50 p-3 rounded-lg">
                      <p className="text-[10px] text-navy-400 uppercase">Service</p>
                      <p className="text-sm font-bold capitalize">{receiptData?.serviceType}</p>
                    </div>
                    <div className="bg-navy-50 p-3 rounded-lg">
                      <p className="text-[10px] text-navy-400 uppercase">COD</p>
                      <p className="text-sm font-bold">{parseInt(receiptData?.codAmount).toLocaleString()} MMK</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gold-500/10 p-4 rounded-xl border border-gold-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-navy-900 font-medium">Total Shipping Fee</span>
                    <span className="text-xl font-bold text-navy-900">{receiptData?.totalFee.toLocaleString()} MMK</span>
                  </div>
                  <p className="text-[10px] text-navy-500 mt-1 uppercase">
                    Payment: {receiptData?.paymentMethod.replace('_', ' ')} • Status: Confirmed
                  </p>
                </div>

                <div className="flex justify-center pt-4">
                  <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
                    <QrCode className="h-32 w-32 text-navy-900" />
                    <p className="text-[10px] text-center text-muted-foreground mt-2 font-mono">SCAN TO TRACK</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center gap-4 bg-navy-50 border-t border-navy-100 py-6">
                <Button variant="outline" className="flex-1" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
                <Button className="flex-1 luxury-button" onClick={handleNewReceive}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Customer
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .max-w-2xl, .max-w-2xl * {
            visibility: visible;
          }
          .max-w-2xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .flex-1 {
            display: none;
          }
        }
      ` }} />
    </div>
  );
};

export default InOfficeReceivePage;