import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Database,
  Globe,
  ShieldCheck,
  Webhook,
  MessageSquare,
  MapPin,
  Save,
  RefreshCcw,
  AlertTriangle,
  Server,
  Cpu
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const SystemConfigPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(language === 'en' ? 'System configurations updated successfully' : 'စနစ်ပြင်ဆင်မှုများကို အောင်မြင်စွာ အပ်ဒိတ်လုပ်ပြီးပါပြီ');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            {t('settings.systemConfig')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Manage global system parameters and technical integrations' : 'ကမ္ဘာလုံးဆိုင်ရာ စနစ် ကန့်သတ်ချက်များနှင့် နည်းပညာပိုင်းဆိုင်ရာ ပေါင်းစပ်မှုများကို စီမံခန့်ခွဲပါ'}
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t('common.reset')}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="luxury-button flex items-center gap-2"
          >
            {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t('common.save')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-muted/50">
          <TabsTrigger value="general" className="py-2.5">
            <Globe className="w-4 h-4 mr-2" />
            {t('settings.general')}
          </TabsTrigger>
          <TabsTrigger value="sms" className="py-2.5">
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS Gateway
          </TabsTrigger>
          <TabsTrigger value="maps" className="py-2.5">
            <MapPin className="w-4 h-4 mr-2" />
            Maps API
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="py-2.5">
            <Webhook className="w-4 h-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="performance" className="py-2.5">
            <Cpu className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="py-2.5">
            <ShieldCheck className="w-4 h-4 mr-2" />
            {t('settings.security')}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="lotus-card border-none">
              <CardHeader>
                <CardTitle className="text-primary-foreground">{language === 'en' ? 'Global Parameters' : 'ကမ္ဘာလုံးဆိုင်ရာ ကန့်သတ်ချက်များ'}</CardTitle>
                <CardDescription className="text-gold-100/70">{language === 'en' ? 'Basic system operational settings' : 'အခြေခံ စနစ် လည်ပတ်မှု ဆက်တင်များ'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-primary-foreground">{language === 'en' ? 'Default Currency' : 'မူလ ငွေကြေး'}</Label>
                  <Select defaultValue="MMK">
                    <SelectTrigger className="bg-navy-800/50 border-gold-400/30 text-primary-foreground">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MMK">MMK (Myanmar Kyat)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="THB">THB (Thai Baht)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-primary-foreground">{language === 'en' ? 'System Timezone' : 'စနစ် အချိန်ဇုန်'}</Label>
                  <Select defaultValue="Asia/Yangon">
                    <SelectTrigger className="bg-navy-800/50 border-gold-400/30 text-primary-foreground">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Yangon">Asia/Yangon (GMT+6:30)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7:00)</SelectItem>
                      <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="lotus-card border-none">
              <CardHeader>
                <CardTitle className="text-primary-foreground">{language === 'en' ? 'Operational Modes' : 'လည်ပတ်မှု မုဒ်များ'}</CardTitle>
                <CardDescription className="text-gold-100/70">{language === 'en' ? 'Control system availability' : 'စနစ် ရရှိနိုင်မှုကို ထိန်းချုပ်ပါ'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label className="text-primary-foreground">{language === 'en' ? 'Maintenance Mode' : 'ပြုပြင်ထိန်းသိမ်းမှု မုဒ်'}</Label>
                    <span className="text-xs text-gold-100/50">{language === 'en' ? 'Suspend all public operations' : 'အများပြည်သူ လုပ်ဆောင်ချက်များအားလုံးကို ရပ်ဆိုင်းရန်'}</span>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label className="text-primary-foreground">{language === 'en' ? 'Debug Logging' : 'ဒီးဘတ် လော့ဂ်ဂင်း'}</Label>
                    <span className="text-xs text-gold-100/50">{language === 'en' ? 'Detailed logs for technical troubleshooting' : 'နည်းပညာပိုင်းဆိုင်ရာ ပြဿနာဖြေရှင်းရန် အသေးစိတ်မှတ်တမ်းများ'}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SMS Gateway Settings */}
        <TabsContent value="sms" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                SMS Gateway Configuration
              </CardTitle>
              <CardDescription>Configure third-party SMS providers for notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Provider</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio Express</SelectItem>
                      <SelectItem value="messagebird">MessageBird Global</SelectItem>
                      <SelectItem value="local_gateway">Myanmar Local Gateway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account SID / API Key</Label>
                  <Input type="password" placeholder="SK_********************" />
                </div>
                <div className="space-y-2">
                  <Label>Auth Token</Label>
                  <Input type="password" placeholder="AT_********************" />
                </div>
                <div className="space-y-2">
                  <Label>Sender ID / Phone Number</Label>
                  <Input placeholder="BRITIUM_EXP" />
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Billing Warning</p>
                  <p>Incorrect configuration may result in failed notifications and unexpected carrier charges. Always perform a test broadcast before going live.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end gap-3">
              <Button variant="outline">Test Connection</Button>
              <Button className="luxury-button">Apply Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Maps API Settings */}
        <TabsContent value="maps" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Geospatial Services</CardTitle>
                <CardDescription>Configure Mapbox and Google Maps integration for tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Google Maps JavaScript API Key</Label>
                      <Input type="password" value="AIzaSyD_ExampleKey_2026_Britium" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Mapbox Access Token</Label>
                      <Input type="password" placeholder="pk.eyJ1IjoiaW5kZXgiLCJhIjoiY2p..." />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Default Zoom Level</Label>
                      <Input type="number" defaultValue="12" />
                    </div>
                    <div className="space-y-2">
                      <Label>Coordinate System</Label>
                      <Select defaultValue="wgs84">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wgs84">WGS 84 (GPS)</SelectItem>
                          <SelectItem value="gcj02">GCJ-02 (Amap/Baidu)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-gold-400">Map Preview</CardTitle>
                <CardDescription className="text-primary-foreground/70">Real-time rendering test</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gold-500/30 rounded-lg">
                <MapPin className="w-12 h-12 text-gold-500 mb-2 animate-bounce" />
                <p className="text-sm font-medium">Service Active</p>
                <p className="text-xs text-primary-foreground/60">Yangon, Myanmar Center</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Incoming & Outgoing Webhooks</CardTitle>
                <CardDescription>Sync logistics data with external CRM or ERP systems</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <Webhook className="w-4 h-4" />
                Add Endpoint
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left p-4">Endpoint Name</th>
                      <th className="text-left p-4">URL</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">Main ERP Sync</td>
                      <td className="p-4 text-muted-foreground">https://api.internal-erp.com/v1/sync</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium">Shopify Orders</td>
                      <td className="p-4 text-muted-foreground">https://hooks.shopify.com/services/...</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Warning
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Health Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="p-4 bg-muted/30 rounded-xl border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Database</p>
            <p className="text-sm font-semibold">Optimal Health</p>
          </div>
        </div>
        <div className="p-4 bg-muted/30 rounded-xl border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Server Latency</p>
            <p className="text-sm font-semibold">24ms (Yangon Node)</p>
          </div>
        </div>
        <div className="p-4 bg-muted/30 rounded-xl border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-gold-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">SSL / Security</p>
            <p className="text-sm font-semibold">Active & Secure</p>
          </div>
        </div>
        <div className="p-4 bg-muted/30 rounded-xl border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Core System</p>
            <p className="text-sm font-semibold">v4.2.0-stable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigPage;
