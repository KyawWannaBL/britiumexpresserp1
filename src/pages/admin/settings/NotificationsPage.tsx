import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Bell,
  FileCode,
  Save,
  AlertCircle,
  ShieldCheck,
  Settings2,
  Smartphone,
  History
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const NotificationsPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: language === 'my' ? 'အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ' : 'Settings Saved Successfully',
        description: language === 'my' ? 'အကြောင်းကြားချက် ဆက်တင်များကို အပ်ဒိတ်လုပ်ပြီးပါပြီ။' : 'Notification preferences have been updated.',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Bell className="h-8 w-8 text-accent" />
            {t('settings.notifications')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'my' ? 'စနစ်၏ အကြောင်းကြားချက်များနှင့် မက်ဆေ့ချ် ပုံစံများကို စီမံခန့်ခွဲပါ။' : 'Manage system-wide notification channels and message templates.'}
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="luxury-button min-w-[140px]"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>

      <Tabs defaultValue="email" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] bg-navy-50/50 p-1 border border-border/50">
          <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessageSquare className="mr-2 h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="push" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Smartphone className="mr-2 h-4 w-4" />
            Push
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileCode className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        {/* Email Settings Content */}
        <TabsContent value="email">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="lotus-card border-none">
                <CardHeader>
                  <CardTitle className="text-gold-400">SMTP Configuration</CardTitle>
                  <CardDescription className="text-navy-200">
                    {language === 'my' ? 'အီးမေးလ် ပေးပို့ရန် SMTP ဆာဗာ အသေးစိတ်များကို ထည့်သွင်းပါ။' : 'Configure SMTP server details for system-generated emails.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gold-200">SMTP Host</Label>
                      <Input placeholder="smtp.example.com" className="bg-navy-950/50 border-gold-400/20 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gold-200">SMTP Port</Label>
                      <Input placeholder="587" className="bg-navy-950/50 border-gold-400/20 text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gold-200">Sender Name</Label>
                      <Input placeholder="Britium Express" className="bg-navy-950/50 border-gold-400/20 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gold-200">Sender Email</Label>
                      <Input placeholder="noreply@britium.com" className="bg-navy-950/50 border-gold-400/20 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gold-200">Encryption</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger className="bg-navy-950/50 border-gold-400/20 text-white">
                        <SelectValue placeholder="Select Encryption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary">Email Triggers</CardTitle>
                  <CardDescription>
                    {language === 'my' ? 'မည်သည့် အခြေအနေများတွင် အီးမေးလ် ပို့မည်ကို ရွေးချယ်ပါ။' : 'Select events that should trigger email notifications.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="font-semibold">New Order Placement</Label>
                      <p className="text-xs text-muted-foreground">Notify merchants when a new order is received</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="font-semibold">Delivery Successful</Label>
                      <p className="text-xs text-muted-foreground">Notify customers when their parcel is delivered</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="font-semibold">Failed Attempt</Label>
                      <p className="text-xs text-muted-foreground">Notify customers of delivery failure</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-navy-900 to-navy-950 text-white border-gold-400/30">
                <CardHeader>
                  <CardTitle className="text-gold-500 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-200">System Status</span>
                      <span className="text-success font-bold">ONLINE</span>
                    </div>
                    <div className="h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full bg-success w-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-navy-300">Last Email Sent: 2 mins ago</p>
                    <p className="text-xs text-navy-300">Success Rate: 99.8%</p>
                    <p className="text-xs text-navy-300">Queue Status: Clear</p>
                  </div>
                  <Button variant="outline" className="w-full border-gold-400/30 text-gold-400 hover:bg-gold-400/10">
                    Send Test Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    Support Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {language === 'my' 
                    ? 'အီးမေးလ် ပြဿနာများရှိပါက အက်ဒမင်ထံ ဆက်သွယ်ပါ။'
                    : 'Contact the IT department if you encounter issues with SMTP connectivity or email delivery failures.'}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* SMS Settings Content */}
        <TabsContent value="sms">
          <Card className="lotus-card border-none">
            <CardHeader>
              <CardTitle className="text-gold-400">SMS Gateway Integration</CardTitle>
              <CardDescription className="text-navy-200">
                Connect your SMS provider API to send mobile alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gold-200">Gateway Provider</Label>
                    <Select defaultValue="twilio">
                      <SelectTrigger className="bg-navy-950/50 border-gold-400/20 text-white">
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                        <SelectItem value="custom">Custom API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gold-200">API Key / Account SID</Label>
                    <Input type="password" value="AC783XXXXXXXXXXXXXXXXXXXX" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gold-200">Auth Token / API Secret</Label>
                    <Input type="password" value="••••••••••••••••" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gold-200">Default Sender Number</Label>
                    <Input placeholder="+9590000000" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                  <div className="p-4 bg-navy-950/30 rounded-lg border border-gold-400/10">
                    <h4 className="text-gold-400 font-bold mb-2 flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      Global Rate Limits
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-navy-300 mb-1">Messages/Min</p>
                        <Input type="number" defaultValue="50" className="h-8 bg-navy-900 border-gold-400/20 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-navy-300 mb-1">Retry Attempts</p>
                        <Input type="number" defaultValue="3" className="h-8 bg-navy-900 border-gold-400/20 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gold-500/10 border border-gold-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-gold-500 shrink-0" />
                <p className="text-xs text-gold-200">
                  Note: International SMS rates may apply based on your provider agreement. SMS is currently restricted to verified numbers in Myanmar.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push Notifications Content */}
        <TabsContent value="push">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Firebase Cloud Messaging (FCM)</CardTitle>
                <CardDescription>Required for Android and iOS app push notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Server Key (Legacy)</Label>
                  <Input type="password" value="AAAA8XvS..." />
                </div>
                <div className="space-y-2">
                  <Label>Service Account JSON</Label>
                  <Textarea placeholder="Paste JSON content here..." className="font-mono text-xs h-[120px]" />
                </div>
                <Button variant="secondary" className="w-full">Upload JSON Key File</Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Push Behavior</CardTitle>
                <CardDescription>Configure how push notifications are delivered.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Silent Notifications</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Image Previews</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Rider Location Proximity Alerts</Label>
                  <Switch defaultChecked />
                </div>
                <div className="pt-4 border-t">
                  <Label className="text-xs text-muted-foreground uppercase tracking-widest">Recent Delivery Logs</Label>
                  <div className="mt-2 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="font-mono">#PUSH-9902{i}</span>
                        <span className="text-muted-foreground ml-auto">Success</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Content */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Message Templates</CardTitle>
                  <div className="relative">
                    <Input placeholder="Search templates..." className="pl-8" />
                    <div className="absolute left-2 top-2.5">
                      <History className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    {['Order Created', 'Out for Delivery', 'Delivered Success', 'Payment Received', 'Return Initiated'].map((template, idx) => (
                      <button 
                        key={idx} 
                        className={`px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-0 ${idx === 1 ? 'bg-navy-50 border-l-4 border-l-gold-500 font-bold' : ''}`}
                      >
                        <p className="text-sm">{template}</p>
                        <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8">
              <Card className="lotus-card border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-gold-400">Edit Template: Out for Delivery</CardTitle>
                    <CardDescription className="text-navy-200">Template for SMS and Push notifications.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">Preview</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gold-200">Message Title (Myanmar)</Label>
                    <Input defaultValue="ပါဆယ်လ် ပို့ဆောင်ရန် ထွက်ခွာလာပါပြီ" className="bg-navy-950/50 border-gold-400/20 text-white font-myanmar" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gold-200">Message Body (Myanmar)</Label>
                    <Textarea 
                      rows={5} 
                      defaultValue="မင်္ဂလာပါ {customer_name}၊ သင်၏ အော်ဒါအမှတ် {tracking_number} အား ပို့ဆောင်သူ {rider_name} ({rider_phone}) မှ ပို့ဆောင်ရန် ထွက်ခွာလာပါပြီ။"
                      className="bg-navy-950/50 border-gold-400/20 text-white font-myanmar"
                    />
                  </div>
                  <div className="p-4 bg-navy-900/50 rounded-lg">
                    <Label className="text-xs text-gold-400 mb-2 block uppercase">Available Placeholders</Label>
                    <div className="flex flex-wrap gap-2">
                      {['{customer_name}', '{tracking_number}', '{rider_name}', '{rider_phone}', '{estimated_time}'].map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-navy-950 text-gold-300 text-[10px] rounded border border-gold-400/20 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Global Bottom Save Action (Mobile Only or Secondary) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button 
          onClick={handleSave} 
          className="h-14 w-14 rounded-full shadow-2xl luxury-button p-0"
        >
          <Save className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPage;